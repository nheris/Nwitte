import { Unsubscribe, collection, limit, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import LoadingScreen from "./loading-screen";
import UesrBox from "./userBox";


const Wrapper = styled.div``;
const SearchWrapper = styled.div`
    position: relative;
    width: 100%;
    margin-bottom: 20px;
`;
const SearchInput = styled.input`
    border: none;
    border-radius: 30px;
    width: 100%;
    height: 45px;
    font-size: medium;
    color: white;
    background-color: #212327;
    padding-left: 40px;
    &:focus{
        opacity: 0.8;
        background: #191a1a;
        outline: none;
        border: 1.5px solid #1d9bf0;
    }
`;
const Magnifier = styled.div`
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    pointer-events: none;
    svg {
        width: 20px;
        height: 20px;
    }
`;
const UserWrapper = styled.div`
    display: flex;
    flex-direction: column;
    border: 3px solid solid black;
    height: auto;
    border-radius: 10px;
    border: 1px solid #2f3336;
`;

export interface UserBoxProps {
    profileURL: string;
    userName: string;
    userId: string;
  };
export default function UserSearch () {

    //사용자 검색
    const [search,setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [users,setUsers] = useState<UserBoxProps[]>([]);

    const onChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        setSearch(e.target.value);
    }

    useEffect(()=>{

        let unsubscribe : Unsubscribe | null = null;

        setLoading(true);
        //유저검색
        const userSearch = async()=>{
            const userQuery = query(
                collection(db,"users"),
                limit(5)
            )

            unsubscribe = onSnapshot(userQuery, (snapshot) =>{
                const result = snapshot.docs.map((doc)=>{
                    const {profileURL, userId, userName} = doc.data();
                    return{
                        profileURL, userId, userName
                    };
                })
                const filteredResult = result.filter((user) => 
                    user.userName.toLowerCase().includes(search.toLowerCase())
                );
                setUsers(filteredResult);

            })
        };
        userSearch();
        setLoading(false);

        return ()=>{
            unsubscribe && unsubscribe();
        }

    },[search])
    
    return(
        <Wrapper>


            <SearchWrapper>
                <Magnifier>
                    <svg fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </Magnifier>
                <SearchInput value={search} onChange={onChange} placeholder="유저 검색" />
            </SearchWrapper>



            <UserWrapper>
                {loading? <LoadingScreen /> : 
                
                    users.map((user)=>(
                        <UesrBox key={user.userId} {...user}/>
                    ))
                }
            </UserWrapper>
        </Wrapper>



    )
}