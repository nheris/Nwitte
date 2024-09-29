import { styled } from "styled-components";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";
import Modal from "../components/modal/profile-modal";
import LoadingScreen from "../components/loading-screen";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
`;
const ProfileContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 200px 80px 50px 40px;
    position: relative;
    width: 100%;
    border-bottom: 1px solid #2f3336;
`;
const BackgroundImage = styled.img`
    grid-row: 1;
    height: 200px;
    background-color: #2f3336;
    width: 100%;
    object-fit: cover; // 이미지를 잘라도 꽉 채워서 보여줌 */
`;
const AvatarImg = styled.img`
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border:none;
    position: absolute;
    top: 130px;
    left: 10%;
    object-fit: cover;
`;
const AvatarNone = styled.div`
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border:none;
    position: absolute;
    top: 130px;
    left: 10%;
    object-fit: cover;
    background-color: black;
    svg{
        width: 150px;
        height: 180px;
    }
`;
const Edit = styled.div`
    grid-row: 2;
    background-color: black;
`;
const EditButton = styled.button`
  //justify-self: center;
  //align-self: center;

  background-color: black;
  color: white;
  border: 1px solid #2f3336;
  padding: 8px 19px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 5%;
  margin-left: 80%;
  &:hover {
    opacity: 0.8;
  }
`;
const Username = styled.h2`
    grid-row: 3;
    justify-self: left;
    align-self: center;
    font-size: 24px;
    font-weight: bold;
    margin-left: 10%;
`;
const JoinDate = styled.div`
    grid-row: 4;
    color: #71767a;
    margin-left: 10%;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
`;
const Tweets = styled.div`
`;



export default function Profile() {

    const user = auth.currentUser;
    const [tweets, setTweets] = useState<ITweet[]>([]);
    
    const [profile, setProfile] = useState();
    const [backgroud, setBackgroud] = useState();
    
    const [loading,setLoading] = useState(false);

    //사용자 아바타
    const getAvatar = async() =>{
        setLoading(true);
        const avatarQuery = query(
            collection(db, "users"),
            where("userId","==",user?.uid),
        )
        const snapshot = await getDocs(avatarQuery);
        snapshot.forEach((doc)=>{
            const data = doc.data();
            setProfile(data.profileURL);
            setBackgroud(data.backgroundURL);
        })
        setLoading(false);
    }

    useEffect( ()=>{
        getAvatar();
    },[]);

    //가입날짜
    const creationTime = new Date(user?.metadata?.creationTime || "비공개");
    
    const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        timeZone: 'Asia/Seoul' 
    };
    const joinDate = creationTime.toLocaleDateString('ko-KR', options); 
    
    //사용자 트윗
    const userTweets = async () =>{
        setLoading(true);
        const tweetQuery = query(
            collection(db,"tweets"),
            where("userId", "==", user?.uid),
            orderBy("createdAt", "desc"),
            limit(25)
        );
        const snapshot = await getDocs(tweetQuery);
        const tweets = snapshot.docs.map((doc)=>{
            const { tweet, createdAt, userId, username, photo, bookmarks, hearts } = doc.data();

            return {
                tweet, createdAt, userId, username, photo, id: doc.id, bookmarks, hearts
            };
        });
        setTweets(tweets);
        setLoading(false);
    }
    
    useEffect(() => {
        userTweets();
    }, []);

    //수정 모달
    const [modal, setModal] = useState(false);
    const onOpen = () => {
        setModal(true);
    }
    const onClose = () => {
        setModal(false);
    }

    return(
        <>
            {loading?<LoadingScreen />:
            <Wrapper>
                <ProfileContainer>
                    {backgroud?<BackgroundImage src={backgroud} />:
                        <div style={{backgroundColor:'#2f3336'}}></div>
                    }
                    
                    {profile ?
                        <AvatarImg src={profile}/> : (
                        <AvatarNone>
                            <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" >
                                <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                            </svg>
                        </AvatarNone>)
                    }
                    <Edit>
                        <EditButton onClick={onOpen}>프로필 수정</EditButton>
                        {modal && <Modal onClose={onClose}/>}
                    </Edit>
                    <Username>{user?.displayName ?? "Anonymous"}</Username>
                    <JoinDate>
                        <svg style={{width : 20, height :20}} fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                        </svg>
                        &nbsp; 가입일 : {joinDate}
                    </JoinDate>
                </ProfileContainer>


                <Tweets>
                    {tweets.map((tweet)=>(
                        <Tweet key={tweet.id} {...tweet} />
                    ))}
                </Tweets>
            </Wrapper>
            }
        </>

    );
};