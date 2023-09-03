import { Inject, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { ChatRepositoryInterface } from '../model/ChatRepositoryInterface';
import { CreateChatCommand } from '../../application/command/CreateChatCommand';
import { ChatModel } from '../model/ChatModel';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateChatService {
    constructor(
        @Inject('ChatRepositoryInterface')
        private repository: ChatRepositoryInterface,
    ) {}

    async invoke(command: CreateChatCommand): Promise<void> {
        const dateNow = dayjs();
        const chatModel = ChatModel.create(command.id, command.userId, dateNow);

        command.messages.map((message) => {
            chatModel.addMessage(
                randomUUID(),
                message.type,
                message.message,
                dateNow,
            );
        });

        await this.repository.persist(chatModel);
    }
}
