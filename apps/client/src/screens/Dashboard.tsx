import Navbar from "../components/Navbar.tsx";
import {SyntheticEvent, useEffect, useRef, useState} from "react";
import styled from "styled-components";
import History from "../components/chat/History.tsx";
import { apiClient } from "../api/client.ts";
import { MessageType } from "../api/contract.ts";

const AiPersonas = [
    {
        value: 'You are called Brian, an assistant that responds in a really boring way',
        name: 'Boring Brian'
    },
    {
        value: 'You are called Harry, an assistant that responds in an overly helpful manner',
        name: 'Helpful Harry'
    },
    {
        value: 'You are called Simon, an assistant that responds in an extremely sarcastic manner',
        name: 'Sarcastic Simon'
    }
];

const Dashboard = () => {
    const pRef = useRef<HTMLParagraphElement>(null);
    const cRef = useRef<HTMLDivElement>(null);

    const [ userPrompt, setUserPrompt ] = useState<string>('');
    const [ persona, setPersona ] = useState<string>(AiPersonas[1].value);
    const [ messages, setMessages ] = useState<{message: string, type: MessageType}[]>([]);
    const [ currentChatId, setCurrentChatId ] = useState<string | undefined>(undefined);

    const addMessage = (message: string, type: MessageType): void => {
        if (message !== '') {
            setMessages(n => [...n, {message, type}]);
            scrollToBottom();
        }
    }

    const scrollToBottom = (): void => {
        if (cRef.current) {
            const height = cRef.current.scrollHeight;
            cRef.current.scrollTop = height;
        }
    }

    const onSelectPersona = (e: SyntheticEvent<HTMLSelectElement>): void => {
        setPersona(e.currentTarget.value);
    }

    useEffect(() => {
        if (currentChatId) {
            // @ts-ignore
            const streamUrl = `${import.meta.env.VITE_API_URL ?? ''}/chats/${currentChatId}/stream`;

            // Subscribe to the stream...
            const source = new EventSource(streamUrl);
            let message = '';

            source.addEventListener("chat.message", function (e) {
                const dataObj = JSON.parse(e.data);

                if (dataObj.token === '') {
                    addMessage(message, 'ai');
                    message = '';
                } else {
                    message = message + dataObj.token
                }

                if (pRef.current) {
                    pRef.current.innerHTML = message;
                }
                scrollToBottom();
            });
        }
    }, [currentChatId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const onChat = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        addMessage(userPrompt, 'human');
        setUserPrompt('');

            if (currentChatId) {
                // patch the existing chat
                await apiClient.updateChat({
                    params: { id: currentChatId },
                    body: {
                        messages: [
                            {
                                type: 'human',
                                message: userPrompt
                            },
                        ]
                    }
                });
            } else {
                // Create the chat...
                const {body, status} = await apiClient.createChat({
                    body: {
                        messages: [
                            {
                                type: 'system',
                                message: persona
                            },
                            {
                                type: 'human',
                                message: userPrompt
                            },
                        ]
                    }
                });

                if (status === 201) {
                    setCurrentChatId(body.item.id)
                }
            }
    }

    return (
        <div>
            <Navbar loggedIn={true} />
            <ChatForm className={'px-12'} onSubmit={onChat}>
                <ChatMessagesContainer>
                    <Container ref={cRef}>
                        <History messages={messages} />
                        <StreamedText ref={pRef} className={'text-white p-3 px-5'}></StreamedText>
                    </Container>
                </ChatMessagesContainer>

                <Footer>
                    <PersonaSelector>
                        <h3>Chat with </h3>
                        <Select disabled={!!currentChatId} onChange={onSelectPersona}>
                            {AiPersonas.map(p => (
                                <option value={p.value} selected={p.value === persona}>{p.name}</option>
                            ))}
                        </Select>
                    </PersonaSelector>
                    <Input
                        placeholder={'Whats up?'}
                        className={''}
                        value={userPrompt}
                        onChange={(e) => {
                            e.preventDefault();
                            setUserPrompt(e.target.value)
                        }}
                    />
                </Footer>
            </ChatForm>
        </div>
    );
}

const Select = styled.select`
    background: transparent;
`;

const Footer = styled.div`
    color: #888;
    padding-bottom: 18px;
`;

const PersonaSelector = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0 4px;
    font-size: 14px;
`;

const StreamedText = styled.p`
    &:empty {
        display: none;
    }
    border-radius: 23px;
    border-bottom-left-radius: 1px;
    border: solid 1px rgba(170, 170, 255, 0.3);
    margin-right: 24px;
    padding-left: 2rem;
    padding-right: 2rem;
    white-space: pre-line;
    white-space: pre-wrap;
`

const ChatForm = styled.form`
    max-width: 700px;
    margin: 0 auto;
`;

const Container = styled.div`
    overflow: auto;
`;

const ChatMessagesContainer = styled.div`
    height: calc(100vh - 234px);
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
`;

const Input = styled.input`
    background-color: black;
    color: white;
    border: 1px solid #555;
    border-radius: 17px;
    display: block;
    padding: 1rem;
    width: 100%;
`;

export default Dashboard;