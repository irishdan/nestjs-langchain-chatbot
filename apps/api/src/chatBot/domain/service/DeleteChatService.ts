import { Inject, Injectable } from '@nestjs/common';
import { ChatRepositoryInterface } from '../model/ChatRepositoryInterface';
import { DeleteChatCommand } from '../../application/command/DeleteChatCommand';

@Injectable()
export class DeleteChatService {
    constructor(
        @Inject('ChatRepositoryInterface')
        private repository: ChatRepositoryInterface,
    ) {}

    async invoke(command: DeleteChatCommand): Promise<void> {
        await this.repository.delete(command.id);
    }
}
