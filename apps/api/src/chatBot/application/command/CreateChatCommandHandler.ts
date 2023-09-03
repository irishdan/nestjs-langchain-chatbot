import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateChatCommand } from './CreateChatCommand';
import { CreateChatService } from '../../domain/service/CreateChatService';

@CommandHandler(CreateChatCommand)
export class CreateChatCommandHandler
    implements ICommandHandler<CreateChatCommand>
{
    constructor(private service: CreateChatService) {}

    async execute(command: CreateChatCommand): Promise<void> {
        await this.service.invoke(command);
    }
}
