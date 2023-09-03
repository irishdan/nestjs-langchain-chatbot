import React from "react";
import { MessageType } from "../../lib/api/contract.ts";
import ChatMessage from "./ChatMessage.tsx";
import styled from "styled-components";

interface Props {
    messages: {message: string, type: MessageType}[];
}

const History: React.FC<Props> = ({messages}) => {
    return (
        <Container>
            {messages.map((item, index) => (
                <ChatMessage key={index} message={item} />
            ))}
        </Container>
    );
};

const Container = styled.div`
    // overflow: auto;
`;

export default History;