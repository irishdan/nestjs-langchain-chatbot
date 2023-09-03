import { ChatModel } from './ChatModel';

export interface ChatRepositoryInterface {
    persist(User: ChatModel): Promise<ChatModel>;

    list(page: number, perPage: number): Promise<ChatModel[]>;

    count(): Promise<number>;

    findById(id: string): Promise<ChatModel>;

    delete(id: string): Promise<void>;
}
