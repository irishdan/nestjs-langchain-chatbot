import { Prisma, PrismaClient } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';
import { ChatModel } from '../../../domain/model/ChatModel';
import { ChatRepositoryInterface } from '../../../domain/model/ChatRepositoryInterface';
import { randomUUID } from 'crypto';
import { ChatMessageModel } from '../../../domain/model/ChatMessageModel';

type ChatWithMessages = Prisma.ChatGetPayload<{
    include: { messages: true };
}>;

@Injectable()
export class ChatRepositoryPrisma
    extends PrismaClient
    implements ChatRepositoryInterface
{
    constructor(config: ConfigService) {
        super({
            datasources: {
                db: {
                    url: config.get('DATABASE_URL'),
                },
            },
        });
    }

    protected modelFromPrisma(prismaChat: ChatWithMessages): ChatModel {
        const chat = new ChatModel();

        chat.internalId = prismaChat.internalId;
        chat.id = prismaChat.id;
        chat.createdAt = dayjs(prismaChat.createdAt);
        chat.messages = prismaChat.messages.map((message) => {
            return new ChatMessageModel(
                message.id,
                message.message,
                message.type as 'system' | 'human' | 'ai',
                dayjs(message.createdAt),
                message.internalId,
            );
        });

        return chat;
    }

    async persist(chat: ChatModel): Promise<ChatModel> {
        // update
        const newMessages = [];
        for (let i = 0; i < chat.messages.length; i++) {
            if (!chat.messages[i].internalId) {
                newMessages.push({
                    id: randomUUID(),
                    message: chat.messages[i].message,
                    type: chat.messages[i].type,
                    createdAt: chat.messages[i].createdAt.toDate(),
                });
            }
        }

        if (chat.internalId) {
            const data = {
                messages: {
                    create: newMessages,
                },
            };

            await this.chat.update({
                where: { id: chat.id },
                data,
                include: {
                    messages: true,
                },
            });
        }
        // create
        else {
            const prismaChat = await this.chat.create({
                data: {
                    id: chat.id,
                    createdAt: chat.createdAt.toDate(),
                    messages: {
                        create: chat.messages.map((message) => {
                            return {
                                id: randomUUID(),
                                message: message.message,
                                type: message.type,
                                createdAt: chat.createdAt.toDate(),
                            };
                        }),
                    },
                },
                include: {
                    messages: true,
                },
            });

            chat.internalId = prismaChat.internalId;
        }

        return chat;
    }

    async findById(id: string): Promise<ChatModel> {
        const chat = await this.chat.findUnique({
            include: { messages: true },
            where: { id },
        });

        if (!chat) {
            throw new NotFoundException('Chat not found');
        }

        return this.modelFromPrisma(chat);
    }

    async list(page: number, perPage: number): Promise<ChatModel[]> {
        const chats = await this.chat.findMany({
            include: { messages: true },
            skip: (page - 1) * perPage,
            take: perPage,
        });

        return chats.map((chat) => {
            return this.modelFromPrisma(chat);
        });
    }

    async count(): Promise<number> {
        return this.chat.count();
    }

    async delete(id: string): Promise<void> {
        await this.chat.delete({ where: { id } });
    }
}
