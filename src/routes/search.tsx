import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { ITweet } from "../components/timeline";
import { Unsubscribe } from "firebase/auth";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import LoadingScreen from "../components/loading-screen";
import Tweet from "../components/tweet";

const SearchWrapper = styled.div`
    position: relative;
    //width: 100%;
    margin: 0px 25px;
    //margin-top: 20px;
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
const Wrapper = styled.div``;


export default function Search(){

    const [search,setSearch] = useState("");
    const [tweets,setTweets] = useState<ITweet[]>([]);
    const [loading, setLoading] = useState(false);
    
    const onChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        setSearch(e.target.value);
    }
    
    useEffect(()=>{
        setLoading(true);
        let unsubscribe : Unsubscribe | null = null;

        const fetchTweets = async() => {
            const searchQuery = query(
                collection(db,"tweets"),
                orderBy("createdAt","desc"),
                limit(25)
                //where("tweet","==",search),
            )
            
            unsubscribe  = await onSnapshot(searchQuery, (snapshot)=>{
                const tweets = snapshot.docs.map((doc)=>{
                    const { tweet, createdAt, userId, username, photo, bookmarks, hearts } = doc.data();
                    return {
                        tweet,
                        createdAt,
                        userId,
                        username,
                        id: doc.id,
                        photo, bookmarks, hearts
                    };
                });

                const filteredTweets = tweets.filter((tweet) =>
                    tweet.tweet.toLowerCase().includes(search.toLowerCase())
                );
                setTweets(filteredTweets);
            });
        };

        fetchTweets();
        setLoading(false);

        return ()=>{
            unsubscribe && unsubscribe();
        }

    },[search]);

    return(
        <Wrapper>
            <SearchWrapper>
                <Magnifier>
                    <svg fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </Magnifier>
                <SearchInput value={search} onChange={onChange} placeholder="검색" />
            </SearchWrapper>

            {loading?<LoadingScreen/>:tweets.map((tweet) => (
            <Tweet key={tweet.id} {...tweet} />
            ))}
        </Wrapper>

        
    );
}