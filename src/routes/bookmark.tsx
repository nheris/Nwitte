import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { Unsubscribe } from "firebase/auth";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";
import { styled } from "styled-components";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
`;

export default function Bookmark() {
    const user = auth.currentUser;
    const [tweets,setTweet] = useState<ITweet[]>([]);

    useEffect(()=>{
        let unsubscribe : Unsubscribe | null = null;
        
        const fetchTweets = async () => {
            const tweetQuery = query(
                collection(db, "tweets"),
                orderBy("createdAt","desc"),
                where("bookmarks","array-contains",user?.uid)
            );

            unsubscribe = await onSnapshot(tweetQuery, (snapshot)=>{
                const tweets = snapshot.docs.map((doc)=>{
                    const { tweet, createdAt, userId, username, photo, bookmarks, hearts }= doc.data();
                    return {
                        tweet, createdAt, userId, username, photo, bookmarks, hearts,id: doc.id,
                    };
                });
                setTweet(tweets);
            });
        }
        fetchTweets();

        return()=>{
            unsubscribe && unsubscribe();
        }
    },[])
    
    return (
        <Wrapper>
            {tweets.map((tweet) => (
                <Tweet key={tweet.id} {...tweet} />
            ))} 
        </Wrapper>
    );
}