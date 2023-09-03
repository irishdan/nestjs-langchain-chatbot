import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ChatBotModule } from './chatBot/ChatBotModule';
import { ChatCommand } from './chatBot/infrastructure/command/ChatCommand';
import { EmptyPrompt } from './chatBot/infrastructure/command/QuestionSet/EmptyPrompt';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
    providers: [ChatCommand, EmptyPrompt],
    imports: [
        CqrsModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ChatBotModule,
        EventEmitterModule.forRoot(),
    ],
})
export class CliModule {}
