import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { ChatBotModule } from './chatBot/ChatBotModule';

@Module({
    imports: [
        ChatBotModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        EventEmitterModule.forRoot(),
    ],
})
export class AppModule {}
