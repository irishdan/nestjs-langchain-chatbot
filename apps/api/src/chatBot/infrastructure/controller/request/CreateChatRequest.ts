import {
    ArrayMaxSize,
    ArrayMinSize,
    IsNotEmpty,
    IsString,
} from 'class-validator';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import CreateChatMessageRequest from './CreateChatMessageRequest';

export class CreateChatRequest {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ValidateNested({ each: true })
    @Type(() => CreateChatMessageRequest)
    @ArrayMinSize(1)
    @ArrayMaxSize(2)
    messages: CreateChatMessageRequest[];
}
