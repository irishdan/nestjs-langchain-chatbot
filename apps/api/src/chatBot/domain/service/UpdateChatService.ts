import { Inject, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { ChatRepositoryInterface } from '../model/ChatRepositoryInterface';
import { randomUUID } from 'crypto';
import { UpdateChatCommand } from '../../application/command/UpdateChatCommand';
import { LangChainService } from './LangChainService';

@Injectable()
export class UpdateChatService {
    constructor(
        @Inject('ChatRepositoryInterface')
        private repository: ChatRepositoryInterface,
        private langChainService: LangChainService,
    ) {}

    async invoke(command: UpdateChatCommand): Promise<void> {
        const dateNow = dayjs();
        const chatModel = await this.repository.findById(command.id);

        command.messages.map((message) => {
            chatModel.addMessage(
                randomUUID(),
                message.type,
                message.message,
                dateNow,
            );
        });

        await this.repository.persist(chatModel);

        this.langChainService.invoke(command.id);
    }
}
