import { QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
    PAGINATION_DEFAULT_PAGE,
    PAGINATION_DEFAULT_PER_PAGE,
} from '../../../common/application/query/dto/PaginationDtoInterface';
import { ListChatsQuery } from './ListChatsQuery';
import { ChatRepositoryInterface } from '../../domain/model/ChatRepositoryInterface';
import { CollectionResponseDtoInterface } from '../../../common/application/query/dto/CollectionResponseDtoInterface';
import { ChatDto } from './dto/ChatDto';

@QueryHandler(ListChatsQuery)
export class ListChatsQueryHandler {
    constructor(
        @Inject('ChatRepositoryInterface')
        private repository: ChatRepositoryInterface,
    ) {}

    async execute(
        query: ListChatsQuery,
    ): Promise<CollectionResponseDtoInterface<ChatDto>> {
        const page = query.page || PAGINATION_DEFAULT_PAGE;
        const take = query.perPage || PAGINATION_DEFAULT_PER_PAGE;

        const images = await this.repository.list(page, take);
        const count = await this.repository.count();

        const meta = {
            pagination: {
                page,
                perPage: take,
                totalItems: count,
            },
        };

        return {
            items: images.map((image) => image.dto),
            meta,
        };
    }
}
