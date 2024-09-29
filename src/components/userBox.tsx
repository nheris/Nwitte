import styled from "styled-components";
import { UserBoxProps } from "./userSearch";

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 15%;
  margin: 10px;
`;
const Profile= styled.div`
  height: 50px;
  width: 50px;
  border-radius: 100%;

`;
const AvatarImg = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 100%;
`;
const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

export default function UserBox({profileURL, userName}: UserBoxProps){

    

    return(
        
        <Header>
            <Profile>
                {profileURL ? <AvatarImg src={profileURL} /> : (
                  <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                </svg>
                )}
            </Profile>
            <Username>{userName}</Username>
            
        </Header>
        
    );
}