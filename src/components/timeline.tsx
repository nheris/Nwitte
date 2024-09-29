import { Unsubscribe } from "firebase/auth";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";

export interface ITweet {
    tweet: string;
    createdAt: number;
    userId: string;
    username: string;
    id: string;
    photo: string;
    bookmarks: string;
    hearts: string;
};
const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
`;

export default function Timeline() {
    const [tweets,setTweet] = useState<ITweet[]>([]);

    useEffect(()=>{
        let unsubscribe : Unsubscribe | null = null;

        const fetchTweets = async() => {
            const tweetQuery = query(
                collection(db, "tweets"),
                orderBy("createdAt","desc"),
                limit(25)
            );

            unsubscribe = await onSnapshot(tweetQuery, (snapshot) => {
                const tweets = snapshot.docs.map((doc)=>{
                    const { tweet, createdAt, userId, username, photo, bookmarks, hearts } = doc.data();
                    return {
                        tweet,
                        createdAt,
                        userId,
                        username,
                        id: doc.id,
                        photo,
                        bookmarks,
                        hearts,
                    };
                });
                setTweet(tweets);
            });
        }

        fetchTweets();

        return ()=>{
            unsubscribe && unsubscribe();
        }
    },[])
    return(
        <Wrapper>
            {tweets.map((tweet) => (
                <Tweet key={tweet.id} {...tweet} />
            ))} 
        </Wrapper>
    );
}