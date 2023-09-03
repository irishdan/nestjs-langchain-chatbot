import { CreateChatRequest } from '../../infrastructure/controller/request/CreateChatRequest';
import * as dayjs from 'dayjs';
import { Dayjs } from 'dayjs';

export class CreateChatCommand {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public messages: {
            message: string;
            type: 'system' | 'human' | 'ai';
            createdAt: Dayjs;
        }[],
    ) {}

    static fromRequest(id: string, dto: CreateChatRequest): CreateChatCommand {
        const messages = dto.messages.map((message) => {
            return {
                message: message.message,
                type: message.type,
                createdAt: dayjs(),
            };
        });

        return new CreateChatCommand(id, dto.userId, messages);
    }
}
