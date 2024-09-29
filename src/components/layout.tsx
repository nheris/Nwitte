import { Link, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../firebase";
import { useState } from "react";
import UserSearch from "./userSearch";
import LogoutModal from "./modal/logout-modal";
import PostModal from "./modal/post-modal";

const Wrapper = styled.div`
    display: grid;
    //grid-template-columns: 2fr 6fr 2fr;
    grid-template-columns: 20% 60% 20%;
    width: 100%;
    height: 100%;
    padding: 50px 0px;
    max-width: 1200px;

    //grid-template-rows: auto 1fr;
    margin: 0 auto; //가운데정렬
    @media (max-width: 1100px) {
        grid-template-columns: 15% 85%; // 창 크기가 작아지면 RightBar 숨김
    }
`;
const LeftBar = styled.div`
  grid-column: 1 / 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: black;
  padding: 20px;
  border-radius: 10px;
  border-right: 1px solid #2f3336;
`;
const Main = styled.div`
  grid-column: 2 / 3;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: black;
  padding: 0px;
  `;
const MenuItem = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 50px;
    width: auto;
    color: white;
    font-size: 20px;
    flex-direction: row;
    svg {
        width: 30px;
        fill: white;
    }
    span {
        @media (max-width: 1100px) {
            display: none;
        }
    }
    &.post {
        background-color: #1d9bf0;
        border-radius: 50%;
        height: 50px;
        width: 50px;
        fill: #1d9bf0;
        display: flex;         
        justify-content: center;
        align-items: center;
        svg {
            width: 30px;           
            height: 30px;
        }
        &:hover {
            opacity: 0.9; 
        }
        @media (min-width: 1100px) {
            width: 190px;
            border-radius: 50px;
            border: none;
            font-size: 17px;
            font-weight: bolder;
            padding: 0px 20px;
            span {
                display: inline; /* span을 보이게 설정 */
            }
            svg {
                display: none;
            }
        }
    }
`;
const Text = styled.div`
    color: white;
    font-size: 50px;
`;
const RightBar = styled.div`
    grid-column: 3 / 4;
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: black;
    padding: 20px;
    border-radius: 10px;
    border-left: 1px solid #2f3336;
    padding-top: 0px;
    @media (max-width: 1100px) {
        display: none;
    }
`;

export default function Layout() {

    const navigate = useNavigate();

    //로그아웃
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const openLogoutModal = () => {
        setLogoutModalOpen(true);
    };
    const closeLogoutModal = () => {
        setLogoutModalOpen(false);
    };
    const handleLogoutConfirm = () => {
        onLogOut();
        closeLogoutModal();
    };
    const onLogOut = async () =>{
        await auth.signOut();
        navigate("/login");
    }

    //게시
    const [postModalOpen,setPostModalOpen] = useState(false);
    const openPostModal = ()=> {
        setPostModalOpen(true);
    }
    const closePostModal = () => {
        setPostModalOpen(false);
    }

    return(
        <Wrapper>
            <LeftBar>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <MenuItem>
                        <Text>𝕏</Text>
                    </MenuItem>
                </Link>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <MenuItem>
                        <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path clipRule="evenodd" fillRule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" />
                        </svg>
                        <span>&nbsp;홈</span>
                    </MenuItem>
                </Link>
                <Link to="/profile" style={{ textDecoration: 'none' }}>
                    <MenuItem>
                        <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
                        </svg>
                        <span>&nbsp;프로필</span>
                    </MenuItem>
                </Link>
                <Link to="/search" style={{ textDecoration: 'none' }}>
                    <MenuItem>
                        <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path clipRule="evenodd" fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" />
                        </svg>
                        <span>&nbsp;탐색하기</span>
                    </MenuItem>
                </Link>
                <Link to="/bookmark" style={{ textDecoration: 'none' }}>
                    <MenuItem>
                        <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path clipRule="evenodd" fillRule="evenodd" d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 0 0 1.075.676L10 15.082l5.925 2.844A.75.75 0 0 0 17 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0 0 10 2Z" />
                        </svg>
                        <span>&nbsp;북마크</span>
                    </MenuItem>
                </Link>

                <MenuItem onClick={openLogoutModal} className="log-out">
                    <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path clipRule="evenodd" fillRule="evenodd" d="M17 4.25A2.25 2.25 0 0 0 14.75 2h-5.5A2.25 2.25 0 0 0 7 4.25v2a.75.75 0 0 0 1.5 0v-2a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-.75.75h-5.5a.75.75 0 0 1-.75-.75v-2a.75.75 0 0 0-1.5 0v2A2.25 2.25 0 0 0 9.25 18h5.5A2.25 2.25 0 0 0 17 15.75V4.25Z" />
                        <path clipRule="evenodd" fillRule="evenodd" d="M14 10a.75.75 0 0 0-.75-.75H3.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 14 10Z" />
                    </svg>
                    <span>&nbsp;로그아웃</span>
                </MenuItem>

                <MenuItem onClick={openPostModal} className="post">
                    <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                    </svg>
                    <span>&nbsp;게시하기</span>
                </MenuItem>

                {/* 모달을 조건부로 렌더링 */}
                {logoutModalOpen && <LogoutModal onClose={closeLogoutModal} onConfirm={handleLogoutConfirm}/>}
                {postModalOpen && <PostModal onClose={closePostModal}/>}
            </LeftBar>

            <Main>
                <Outlet />
            </Main>

            
            <RightBar>
                <UserSearch />
            </RightBar>
        </Wrapper>
    );
};