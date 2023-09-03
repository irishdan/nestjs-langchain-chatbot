import { initContract } from '@ts-rest/core';

type CreateTokenRequest = {
    email: string;
    password: string;
}

type Token = {
    access_token: string;
    expires_at: string;
    refresh_token: string;
}

export type MessageType = 'system' | 'human' | 'ai';

export type ChatMessage = {
    id: string;
    type: MessageType;
    message: string;
    createdAt: string;
}

export type Chat = {
    item: {
        id: string;
        userId: string;
        messages: Array<ChatMessage>;
        createdAt: string;
    }
}

type CreateChatRequest = {
    userId: string;
    messages: {
        type: MessageType;
        message: string;
    }[];
}

type UpdateChatRequest = Omit<CreateChatRequest, 'userId'>

type ErrorResponse = {
    statusCode: number;
    message: string | string[];
    error: string;
}

const c = initContract();

export const contract = c.router({
    createToken: {
        method: 'POST',
        path: '/auth/token',
        responses: {
            201: c.type<Token>(),
            400: c.type<ErrorResponse>(),
            403: c.type<ErrorResponse>(),
        },
        body: c.type<CreateTokenRequest>(),
        summary: 'Create an Auth Token',
    },
    createChat: {
        method: 'POST',
        path: '/chats',
        responses: {
            201: c.type<Chat>(),
            400: c.type<ErrorResponse>(),
            403: c.type<ErrorResponse>(),
        },
        body: c.type<CreateChatRequest>(),
        summary: 'Create a Chat',
    },
    updateChat: {
        method: 'PATCH',
        path: '/chats/:id',
        responses: {
            200: c.type<Chat>(),
            400: c.type<ErrorResponse>(),
            403: c.type<ErrorResponse>(),
        },
        body: c.type<UpdateChatRequest>(),
        summary: 'Update a Chat',
    }
});