import { Question, QuestionSet } from 'nest-commander';

@QuestionSet({ name: 'empty-prompt' })
export class EmptyPrompt {
    @Question({
        message: ' ',
        name: 'query',
    })
    parseFirstName(val: string): string {
        return val;
    }
}
