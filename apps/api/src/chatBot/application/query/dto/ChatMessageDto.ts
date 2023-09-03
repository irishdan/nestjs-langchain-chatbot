export class ChatMessageDto {
    id: string;
    message: string;
    type: 'system' | 'human' | 'ai';
    createdAt: Date;
}
