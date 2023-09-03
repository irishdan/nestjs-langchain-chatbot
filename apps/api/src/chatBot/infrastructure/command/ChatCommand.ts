import { Command, CommandRunner, InquirerService } from 'nest-commander';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder,
    SystemMessagePromptTemplate,
} from 'langchain/prompts';
import { ConversationChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';

@Command({
    name: 'chat',
    description: 'chat with open ai',
    options: { isDefault: true },
})
export class ChatCommand extends CommandRunner {
    constructor(
        private readonly inquirer: InquirerService,
        private configService: ConfigService,
    ) {
        super();
    }

    async run(): Promise<void> {
        let ask = true;
        const apiKey = this.configService.get<string>('OPENAI_API_KEY');

        console.log("Let's Chat With OpenAI!!");

        const chatPrompt = ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(
                this.configService.get<string>(
                    'DEFAULT_CHAT_PROMPT_SYSTEM_MESSAGE',
                ),
            ),
            new MessagesPlaceholder('history'),
            HumanMessagePromptTemplate.fromTemplate('{input}'),
        ]);

        const chat = new ChatOpenAI({
            openAIApiKey: apiKey,
        });

        const chain = new ConversationChain({
            memory: new BufferMemory({
                returnMessages: true,
                memoryKey: 'history',
            }),
            prompt: chatPrompt,
            llm: chat,
        });

        while (ask) {
            const q = await this.inquirer.ask<{
                query: string;
            }>('empty-prompt', undefined);

            if (!q.query || ['exit', 'quit'].includes(q.query.toLowerCase())) {
                ask = false;
            } else {
                try {
                    const result = await chain.call({
                        input: q.query,
                    });

                    console.log(result.response);
                } catch (e) {
                    console.log({ e });
                    ask = false;
                }
            }
        }

        console.log('Quiting Bye!');
    }
}
