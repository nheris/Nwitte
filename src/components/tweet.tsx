import { styled } from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useEffect, useState } from "react";

const Wrapper = styled.div`
  display: grid;
  //grid-template-columns: 1fr 3fr;
  grid-template-rows: auto 1fr;
  padding: 20px;
  //border: 1px solid #2f3336;
  border-bottom: 1px solid #2f3336;
  padding-bottom: 10px;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const Column = styled.div`
  //grid-row: 1;
  //display: flex;
  //flex-direction: column;
`;
const Profile= styled.div`
  height: 30px;
  width: 30px;
  border-radius: 100%;

`;
const AvatarImg = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 100%;
`;
const BarWrapper = styled.div`
    //grid-column: 1 / span 2;
    //grid-row: 2;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content:space-around;
`;
const Ele = styled.span<{isBookmark: boolean; isHeart: boolean}>`
    padding: 10px 0px;
    color: white;
    text-align: center;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    svg {
      width: 20px;           
      height: 20px;
    }
    &.bookmark{
      color: ${({isBookmark}) => (isBookmark ? '#1d9bf0' : 'white')};
      &:hover{
          opacity: 0.8;
          color: #1d9bf0;
          background: #191a1a;
      }

    }
    &.heart{
      color: ${({isHeart}) => (isHeart ? '#f91980' : 'white')};
      &:hover {
          opacity: 0.8;
          background: #191a1a;
          color: #f91980;
        }
    }
    &:hover{
        opacity: 0.8;
        background: #191a1a;
    }

`;
const CountSpan = styled.span<{ bookAnimate: boolean; heartAnimate: boolean }>`
  display: inline-block;
  margin-left: 8px;
  animation: ${({ bookAnimate, heartAnimate }) => {
    if (bookAnimate) return "bounce 0.5s";
    if (heartAnimate) return "pulse 0.5s";
    return "none";
  }};
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.7);
    }
    100% {
      transform: scale(1);
    }
}
`;
const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;
const Payload = styled.p`
  margin: 10px 40px;
  font-size: 18px;
`;
const Photo = styled.img`
    width: 300px;
    height: 300px;
    margin: 10px 40px;
    border-radius: 15px;
    object-fit: cover;
`;


export default function Tweet({username, photo, tweet, userId, id, bookmarks, hearts}: ITweet) {
    const user = auth.currentUser;


    //삭제
    const onDelete = async() =>{
        const ok = confirm("이 트윗을 삭제하시겠습니까?");
        if(!ok || user?.uid !== userId) return;
        try {
            await deleteDoc(doc(db,"tweets",id));
            if(photo){
                const photoRef = ref(storage,`tweets/${user.uid}/${id}`);
                await deleteObject(photoRef);
            }
        } catch (error) {
        }
    }

    //사용자들의 프로필
    const [profile,setProfile] = useState();
    const userProfile = async() =>{
      const usersQuery = query(
        collection(db, "users"),
        where("userId", "==", userId),
      );
      const snapshot = await getDocs(usersQuery);
      snapshot.forEach((doc) => {
        // 해당 문서의 데이터 가져오기
        const data = doc.data();
        setProfile(data.profileURL); // profileURL을 상태로 설정
      });
    }
    useEffect(()=>{
      userProfile();
    },[])
    
    //북마크
    const [isBookmark, setBookmark] = useState(() => {
      return user?.uid && bookmarks?.length > 0 ? bookmarks.includes(user.uid) : false;
    });
    const [bookmarkCount, setBookmarkCount] = useState(bookmarks?.length ||0);
    const onBookmark = async () =>{
      if (!user?.uid) return;
      //해제
      if(isBookmark){
        setBookmark(false);
        //setBookmarkCount((prev) => prev - 1);
        await updateDoc(doc(db,"tweets",id),{
          bookmarks : arrayRemove(user?.uid),
        });
      }//등록
      else {
        setBookmark(true);
        //setBookmarkCount((prev) => prev + 1);
        await updateDoc(doc(db,"tweets",id),{
          bookmarks : arrayUnion(user?.uid),
        });
      }

      const tweetDoc = await getDoc(doc(db, "tweets", id));
      if (tweetDoc.exists()) {
        const updatedData = tweetDoc.data();
        const updatedBookmarks = updatedData.bookmarks || [];
        setBookmarkCount(updatedBookmarks.length); // 최신 북마크 개수로 업데이트
      }

      
    }
    //하트
    const [isHeart,setHeart] = useState(()=>{
      return user?.uid && hearts?.length>0 ? hearts.includes(user?.uid):false;
    });
    const [heartCount,setHeartCount] = useState(hearts?.length || 0);
    const onHeart = async() => {
      if (!user?.uid) return;
      if(isHeart) {
        setHeart(false);
        setHeartCount((current)=>current -1);
        await updateDoc(doc(db,"tweets", id),{
          hearts : arrayRemove(user?.uid)
        })
      }else{
        setHeart(true);
        setHeartCount((current)=>current + 1);
        await updateDoc(doc(db,"tweets", id),{
          hearts : arrayUnion(user?.uid)
        });
      }
    }
    
    const [bookAnimate, setBookAnimate] = useState(false);
    const [heartAnimate, setHeartAnimate] = useState(false);
    useEffect(() => {
      if (bookmarkCount > 0) {
        setBookAnimate(true);
        const timeout = setTimeout(() => setBookAnimate(false), 500); //5초후 실행
        return () => clearTimeout(timeout);
      }
    }, [bookmarkCount]);
    useEffect(() => {
      if (heartCount > 0) {
        setHeartAnimate(true);
        const timeout = setTimeout(() => setHeartAnimate(false), 500); //5초후 실행
        return () => clearTimeout(timeout);
      }
    }, [heartCount]);


    return(
        <Wrapper>
            <Column>
              <Header>
                <Profile>
                  {profile ? <AvatarImg src={profile} /> : (
                    <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                    </svg>
                  )}
                </Profile>
                <Username>{username}</Username>
              </Header>
              <Payload>{tweet}</Payload>
              {photo ? ( <Photo src={photo} />) : null}
            </Column>
            
            <BarWrapper>
              {/* <Ele>
                <svg fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                </svg>
              </Ele> */}
              <Ele className="heart" onClick={onHeart} isBookmark={false} isHeart={isHeart}>
                <svg fill={isHeart ? "#f91980" : "none"} strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
                {heartCount?<CountSpan heartAnimate={heartAnimate} bookAnimate={false}>
                  {heartCount === 0 ? null : heartCount}
                </CountSpan>:null}
              </Ele>

              <Ele className="bookmark" onClick={onBookmark} isBookmark={isBookmark} isHeart={false}>
                <svg fill={isBookmark ? "#1d9bf0" : "none"} strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                </svg>
                {/* shouldAnimate 애니메이션을 실행할지(true) 말지(false)를 결정 */}
                {bookmarkCount?<CountSpan bookAnimate={bookAnimate} heartAnimate={false}>
                  {bookmarkCount === 0 ? null : bookmarkCount}
                </CountSpan>:null}
              </Ele>

              
              {/* 사용자만 */}
              {user?.uid === userId?
                <Ele onClick={onDelete} isBookmark={false} isHeart={false}>
                  <svg fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </Ele>:null
              }
            </BarWrapper>
            
     
        </Wrapper>
    );
}