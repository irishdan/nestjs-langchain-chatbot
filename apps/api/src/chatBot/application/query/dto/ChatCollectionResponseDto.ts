import { PaginationDtoInterface } from '../../../../common/application/query/dto/PaginationDtoInterface';
import { ChatDto } from './ChatDto';

export interface ChatCollectionResponseDto {
    items: ChatDto[];
    meta: {
        pagination: PaginationDtoInterface;
    };
}
