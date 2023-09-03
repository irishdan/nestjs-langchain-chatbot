import React from 'react';
import styled from "styled-components";

interface Props {
    loggedIn?: boolean;
}

const Navbar: React.FC<Props>  = () => {
    return (
        <Container className='flex justify-between items-center h-24 px-24 text-white'>
            <h1 className='w-full text-3xl text-[#00df9a] font-heading font-extralight'>NEST<span className={'text-[#ccc]'}>/</span><span className={'text-[#df009a]'}>AI</span></h1>
        </Container>
    );
};

const Container = styled.div<{transparent?: boolean}>`
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    background: ${p => p.transparent ? 'transparent' : '#111111'};
    position: relative;
    z-index: 10;
    width: 100%;
    padding: 0 48px;
`;

export default Navbar;
