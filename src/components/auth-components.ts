import { styled } from "styled-components";

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0px;
`;

export const Symbol= styled.div`
    font-size: 100px;
    margin-bottom: 20px;

    /* 화면이 넓을 때 */
    @media (min-width: 968px) {
        font-size: 400px;
        position: absolute; //절대 위치 지정
        left: 10%;
        top: 50%;
        transform: translateY(-50%); //중앙 정렬
    }

    /* 화면이 좁을 때 */
    @media (max-width: 968px) {
        font-size: 50px;
        position: relative; //일반 위치
        margin-bottom: 10;
    }
    
`;

export const Title = styled.h1`
  font-size: 55px;
  font-weight: bolder;
  margin-bottom: 40px;
`;

export const Form = styled.form`
    margin-top: 40px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
`;

export const Input = styled.input`
   padding: 10px 20px;
   margin: 5px 0px;
   border-radius: 50px;
   border: none;
   width: 100%;
   font-size: 16px;
   &[type="submit"] { 
     cursor: pointer; 
     &:hover {
       opacity: 0.8;
     }
   }
`;

export const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

export const Switcher = styled.span`
    margin-top: 20px;
    a {
        color: #1d9bf0;
    }
`;

export const Divider = styled.div`
    display: flex;
    align-items: center;
    text-align: center;
    width: 100%;
    margin: 20px 0;

    &::before,
    &::after {
        content: "";
        flex: 1;
        border-bottom : 1px solid gray;
    }

    &::before {
        margin-right: 10px;
    }

    &::after {
        margin-left: 10px;
    }
`;