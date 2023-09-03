import { Dayjs } from 'dayjs';
import { ChatMessageDto } from '../../application/query/dto/ChatMessageDto';

export class ChatMessageModel {
    constructor(
        public id: string,
        public message: string,
        public type: 'system' | 'human' | 'ai',
        public createdAt: Dayjs,
        public internalId?: number,
    ) {}

    public get dto(): ChatMessageDto {
        return {
            id: this.id,
            message: this.message,
            type: this.type,
            createdAt: this.createdAt.toDate(),
        };
    }
}
