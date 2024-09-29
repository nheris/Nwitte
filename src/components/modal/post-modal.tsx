import React from 'react';
import styled from 'styled-components';
import PostTweetForm from '../post-tweet-form';

const ModalBackdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(36, 36, 36, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
`;
const ModalContainer = styled.div`
    width: 60%;
    padding: 20px;
    background: black;
    border-radius: 10px;
    text-align: center;
`;
const TopBar = styled.div`
    display: flex;
    flex-direction: row;
    margin: 6px 12px;
    align-items: center;
    justify-content: space-between;
`;
const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: white;

`;


interface ModalProps {
    onClose: () => void;
}

const PostModal: React.FC<ModalProps> = ({ onClose }) => {
    // const handleSubmit = () => {
    //     onClose();
    // };

    return (
        <ModalBackdrop onClick={onClose}>

            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <TopBar>
                    <CloseButton onClick={onClose}>x</CloseButton>
                </TopBar>
                <PostTweetForm onSubmit={onClose}/>
            </ModalContainer>
        </ModalBackdrop>
    );
};

export default PostModal;