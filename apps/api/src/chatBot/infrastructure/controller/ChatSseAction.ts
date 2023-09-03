import { Controller, MessageEvent, Param, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { LangChainService } from '../../domain/service/LangChainService';

@Controller('chats')
export class ChatSseAction {
    constructor(
        private langChainService: LangChainService,
        private eventEmitter: EventEmitter2,
    ) {}

    @Sse(':id/stream')
    async invoke(@Param('id') id): Promise<Observable<MessageEvent>> {
        this.langChainService.invoke(id);

        return fromEvent(this.eventEmitter, `chat.message.${id}`).pipe(
            map((data) => {
                return new MessageEvent('chat.message', {
                    data: JSON.stringify(data),
                });
            }),
        );
    }
}
