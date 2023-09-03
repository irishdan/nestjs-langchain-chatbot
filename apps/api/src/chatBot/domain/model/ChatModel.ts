import { Dayjs } from 'dayjs';
import { ChatDto } from '../../application/query/dto/ChatDto';
import { ChatMessageModel } from './ChatMessageModel';

export class ChatModel {
    public internalId = 0;

    public id: string;
    public userId: string;
    public messages: ChatMessageModel[];
    public createdAt: Dayjs;

    static create(id: string, userId: string, createdAt: Dayjs): ChatModel {
        const chat = new ChatModel();

        chat.id = id;
        chat.userId = userId;
        chat.createdAt = createdAt;

        return chat;
    }

    addMessage(
        id: string,
        type: 'system' | 'human' | 'ai',
        message: string,
        createdAt: Dayjs,
    ): void {
        if (!this.messages) {
            this.messages = [];
        }
        this.messages.push(new ChatMessageModel(id, message, type, createdAt));
    }

    public get dto(): ChatDto {
        return {
            id: this.id,
            userId: this.userId,
            messages: this.messages.map((message) => message.dto),
            createdAt: this.createdAt.toDate(),
        };
    }
}
