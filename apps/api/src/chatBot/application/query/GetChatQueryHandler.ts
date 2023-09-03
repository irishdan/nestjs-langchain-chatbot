import { QueryHandler } from '@nestjs/cqrs';
import { GetChatQuery } from './GetChatQuery';
import { Inject } from '@nestjs/common';
import { ChatRepositoryInterface } from '../../domain/model/ChatRepositoryInterface';
import { ChatResponseDto } from './dto/ChatResponseDto';

@QueryHandler(GetChatQuery)
export class GetChatQueryHandler {
    constructor(
        @Inject('ChatRepositoryInterface')
        private repository: ChatRepositoryInterface,
    ) {}

    async execute(query: GetChatQuery): Promise<ChatResponseDto> {
        const { id } = query;
        const chat = await this.repository.findById(id);

        return { item: chat.dto };
    }
}
