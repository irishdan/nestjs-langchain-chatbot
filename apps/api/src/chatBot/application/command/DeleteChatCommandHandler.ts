import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteChatCommand } from './DeleteChatCommand';
import { DeleteChatService } from '../../domain/service/DeleteChatService';

@CommandHandler(DeleteChatCommand)
export class DeleteChatCommandHandler
    implements ICommandHandler<DeleteChatCommand>
{
    constructor(private service: DeleteChatService) {}

    async execute(command: DeleteChatCommand): Promise<void> {
        await this.service.invoke(command);
    }
}
