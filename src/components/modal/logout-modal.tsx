import React from 'react';
import styled from 'styled-components';

const ModalBackdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #242424;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
`;

const ModalContainer = styled.div`
    width: 350px;
    padding: 40px;
    background: black;
    border-radius: 10px;
    text-align: center;
`;

const Text = styled.div`
    color: white;
    font-size: 50px;
    margin-bottom: 20px;
`;
const LogoutBtn = styled.input`
    background-color: white;
    color: black;
    font-weight: bold;
    border: none;
    padding: 10px 0px;
    border-radius: 20px;
    font-size: 16px;
    width: 90%;
    text-align: center;
    margin-bottom: 10px;
    cursor: pointer;
    &:hover,
    &:active {
        opacity: 0.8;
    }
`;
const CancleBtn = styled.input`
    background-color: black;
    color: white;
    font-weight: bold;
    border: 1px solid gray;
    padding: 10px 0px;
    border-radius: 20px;
    font-size: 16px;
    width: 90%;
    text-align: center;
    cursor: pointer;
    &:hover,
    &:active {
        opacity: 0.8;
    }
`;

interface ModalProps {
    onClose: () => void;
    onConfirm: () => void;
}
//React.FC : "Function Component"의 약자,이 컴포넌트가 함수형임 정의
//ModalProps : 이 컴포넌트가 받을 props의 타입을 정의
//props로 받은 객체에서 onClose와 onConfirm를 추출하여 사용할 수 있게 해줌
const LogoutModal: React.FC<ModalProps> = ({ onClose, onConfirm }) => {
    return (
        <ModalBackdrop onClick={onClose}>
            {/* e.stopPropagation(): 이벤트가 부모 요소로 전파되는 것을 방지,모달 내부 클릭 시 이벤트 전파 중단 */}
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <Text>𝕏</Text>
                <p style={{ fontSize:20, fontWeight:'bold', marginBottom:20}}>X에서 로그아웃할까요?</p>
                <p style={{ fontSize:14, color:'gray', textAlign:'left', marginBottom:20,}}>언제든지 다시 로그인할 수 있습니다. 계정을 전환하려는 경우 이미 존재하는 계정을 추가하면 전환할 수 있습니다. </p>
                <LogoutBtn onClick={onConfirm} value={"로그아웃"} />
                <CancleBtn onClick={onClose} value={"취소"} />
            </ModalContainer>
        </ModalBackdrop>
    );
};

export default LogoutModal;
