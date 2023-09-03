export class ChatDto {
    id: string;
    userId: string;
    createdAt: Date;
    messages: {
        message: string;
        type: 'system' | 'human' | 'ai';
        createdAt: Date;
    }[];
}
