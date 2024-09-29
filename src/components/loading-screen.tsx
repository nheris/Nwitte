import styled, { keyframes } from "styled-components";

const Wrapper = styled.div`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    //background-color: black;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #1d9bf0;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
  margin: 50px auto; /* 가운데 정렬을 위한 여백 */
`;

export default function LoadingScreen() {
    return (
        <Wrapper>
            <Spinner />
        </Wrapper>
    );
}