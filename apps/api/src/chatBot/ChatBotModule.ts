import { Module } from '@nestjs/common';
import { ChatRepositoryPrisma } from './infrastructure/persistence/prisma/ChatRepositoryPrisma';
import { CreateChatAction } from './infrastructure/controller/CreateChatAction';
import { CreateChatCommandHandler } from './application/command/CreateChatCommandHandler';
import { GetChatQueryHandler } from './application/query/GetChatQueryHandler';
import { CreateChatService } from './domain/service/CreateChatService';
import { CqrsModule } from '@nestjs/cqrs';
import { ChatSseAction } from './infrastructure/controller/ChatSseAction';
import { UpdateChatAction } from './infrastructure/controller/UpdateChatAction';
import { GetChatAction } from './infrastructure/controller/GetChatAction';
import { UpdateChatCommandHandler } from './application/command/UpdateChatCommandHandler';
import { UpdateChatService } from './domain/service/UpdateChatService';
import { ListChatsQueryHandler } from './application/query/ListChatsQueryHandler';
import { ListChatsAction } from './infrastructure/controller/ListChatsAction';
import { DeleteChatAction } from './infrastructure/controller/DeleteChatAction';
import { DeleteChatCommandHandler } from './application/command/DeleteChatCommandHandler';
import { DeleteChatService } from './domain/service/DeleteChatService';
import { LangChainService } from './domain/service/LangChainService';

@Module({
    controllers: [
        GetChatAction,
        CreateChatAction,
        DeleteChatAction,
        ChatSseAction,
        UpdateChatAction,
        ListChatsAction,
    ],
    providers: [
        CreateChatCommandHandler,
        DeleteChatCommandHandler,
        UpdateChatCommandHandler,
        GetChatQueryHandler,
        ListChatsQueryHandler,
        CreateChatService,
        DeleteChatService,
        UpdateChatService,
        LangChainService,
        {
            provide: 'ChatRepositoryInterface',
            useClass: ChatRepositoryPrisma,
        },
    ],
    imports: [CqrsModule],
})
export class ChatBotModule {}
