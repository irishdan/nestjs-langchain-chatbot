import { Inject, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { ChatRepositoryInterface } from '../model/ChatRepositoryInterface';
import { randomUUID } from 'crypto';
import { AIMessage, HumanMessage, SystemMessage } from 'langchain/schema';
import { BufferMemory, ChatMessageHistory } from 'langchain/memory';
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder,
} from 'langchain/prompts';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConversationChain } from 'langchain/chains';

@Injectable()
export class LangChainService {
    constructor(
        private configService: ConfigService,
        private eventEmitter: EventEmitter2,
        @Inject('ChatRepositoryInterface')
        private repository: ChatRepositoryInterface,
    ) {}

    async invoke(chatId: string): Promise<void> {
        const chatModel = await this.repository.findById(chatId);

        let input = '';

        const messages = chatModel.messages
            .map((message, index) => {
                if (index === chatModel.messages.length - 1) {
                    input = message.message;
                    return;
                }

                switch (message.type) {
                    case 'system':
                        return new SystemMessage(message.message);
                    case 'human':
                        return new HumanMessage(message.message);
                    case 'ai':
                        return new AIMessage(message.message);
                }
            })
            .filter(Boolean);

        const chatHistory = new ChatMessageHistory(messages);

        const chatPrompt = ChatPromptTemplate.fromPromptMessages([
            new MessagesPlaceholder('history'),
            HumanMessagePromptTemplate.fromTemplate('{input}'),
        ]);

        const eventEmitter = this.eventEmitter;
        const chatAi = new ChatOpenAI({
            openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
            streaming: true,
            callbacks: [
                {
                    handleLLMNewToken(token) {
                        eventEmitter.emit(`chat.message.${chatId}`, {
                            token,
                        });
                    },
                },
            ],
        });
        if (this.configService.get<string>('OPENAI_CHAT_MODEL')) {
            chatAi.modelName =
                this.configService.get<string>('OPENAI_CHAT_MODEL');
        }

        const chain = new ConversationChain({
            memory: new BufferMemory({
                returnMessages: true,
                memoryKey: 'history',
                chatHistory,
            }),
            prompt: chatPrompt,
            llm: chatAi,
        });

        chain
            .call({
                input,
            })
            .then(async (output) => {
                chatModel.addMessage(
                    randomUUID(),
                    'ai',
                    output.response,
                    dayjs(),
                );

                await this.repository.persist(chatModel);
            });
    }
}
