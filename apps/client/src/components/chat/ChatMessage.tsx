import React from "react";
import styled from "styled-components";
import { MessageType } from "../../api/contract.ts";

interface Props {
    message: { message: string, type: MessageType };
}

const ChatMessage: React.FC<Props> = ({ message }) => {

    if (message.message.length === 0) {
        return null;
    }

    return (
        <Container  type={ message.type }>
            <p className={'text-white m-3 px-5'} >{ message.message }</p>
        </Container>
    );
};

const Container = styled.div<{type: MessageType}>`
    margin: ${p => p.type === 'human' ? '0 0 18px 24px' : '0 24px 18px 0'};
    border-radius: 23px;
    border-bottom-left-radius: ${p => p.type === 'human' ? 23 : 1}px;
    border-bottom-right-radius: ${p => p.type === 'human' ? 1 : 23}px;
    border: solid 1px ${p => p.type === 'human' ? 'rgba(170, 255, 170, 0.3)' : 'rgba(170, 170, 255, 0.3)'};
    white-space: pre-line;
    white-space: pre-wrap;
`;

export default ChatMessage;