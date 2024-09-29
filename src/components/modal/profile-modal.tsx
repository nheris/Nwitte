import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { auth, db, storage } from '../../firebase';
import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import LoadingScreen from '../loading-screen';

const ModalBackdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(36, 36, 36, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
`;
const ModalContainer = styled.div`
    width: 590px;
    height: 500px;
    padding: 1px;
    background: black;
    border-radius: 10px;
    text-align: center;
`;
const TopBar = styled.div`
    display: flex;
    flex-direction: row;
    margin: 6px 12px;
    align-items: center;
    justify-content: space-between;
`;
const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: white;

`;
const Text = styled.div`
    color: white;
    font-size: 20px;
    font-weight: 600;
    margin-left: -350px; /* 중앙 정렬을 위한 미세한 조정 (필요시) */
`;
const SaveButton = styled.button`
    background-color: white;
    color: black;
    border: none;
    border-radius: 20px;
    font-size: 15px;
    text-align: center;
    font-weight: 700;
    padding: 8px 16px;
    cursor: pointer;
    &:hover,
    &:active {
        opacity: 0.8;
    }
`;
const ProfileContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 200px 80px 50px 40px;
    position: relative;
    width: 100%;
`;
const BackgroundImage = styled.div<{src:string}>`
    grid-row: 1;
    height: 200px;
    background-color: #2f3336;
    background-image: url(${(props) => props.src});
    background-size: cover;
    background-position: center;
`;
const ProfileImg = styled.img`
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border:none;
    position: absolute;
    top: 130px;
    left: 10%;
    object-fit: cover;
    background-image: url(${(props) => props.src});
    background-size: cover;
    background-position: center;
`;
const ProfileNone = styled.div`
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
const Info = styled.h2`
    grid-row: 3;
    justify-self: left;
    align-self: center;
    font-size: 24px;
    font-weight: bold;
    margin-left: 10%;
`;
const Username = styled.input`
    border: 1px solid #2f3336;
    border-radius: 5px;
    background-color: black;
    color: white;
    width: 500px;
    height: 45px;
    font-size: medium;
    &:focus {
        outline: none;
        border: 2px solid #1d9bf0;
        //border-color: #1d9bf0;
    }
`;
const BackFileLabel = styled.label`
    position: absolute;
    top: 27%;   
    left: 52%;
    transform: translate(-50%, -50%);


    padding: 10px 0px;
    color: #1d9bf0;
    text-align: center;
    border-radius: 50%;
    width: 40px;           
    height: 40px;
    cursor: pointer;
    svg {
            width: 23px;           
            height: 23px;
    }
    &:hover{
        opacity: 0.8;
        background: #1c1e20;
    }
`;
const BackFileInput = styled.input`
    display: none;
`;
const ProfileFileLabel = styled.label`
    position: absolute;
    top: 55%;   
    left: 23%;
    transform: translate(-50%, -50%);
    padding: 10px 0px;
    color: #1d9bf0;
    text-align: center;
    border-radius: 50%;
    width: 40px;           
    height: 40px;
    cursor: pointer;
    svg {
            width: 23px;           
            height: 23px;
    }
    &:hover{
        opacity: 0.8;
        background: #2f3336;
    }
`;
const ProfileFileInput = styled.input`
    display: none;
`;

interface ModalProps {
    onClose : () => void;
    // onSave : () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {

    const user = auth.currentUser;
    const [backgroud, setBackgroud] = useState<string | null>(null);
    const [profile, setProfile] = useState<string | null>(null);
    //임시파일
    const [backFile,setBackFile] = useState<File | null>(null);
    const [profileFile,setProfileFile] = useState<File | null>(null);

    const [name,setName] = useState(user?.displayName);

    const [loading,setLoading] = useState(false);
    //사용자 아바타
    const getAvatar = async() =>{
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
    }

    useEffect(()=>{
        getAvatar();
    },[]);

    

    const onNameChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }
    const onBackFileChange = async (e:React.ChangeEvent<HTMLInputElement>) =>{
        const {files} =e.target;
        if(files && files?.length === 1) {
            const file = files[0];
            setBackFile(file);
            const fileURL = URL.createObjectURL(file);
            setBackgroud(fileURL);
        }
    }
    const onProfileFileChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const {files} =e.target;
        if(files && files?.length === 1) {
            const file = files[0];
            setProfileFile(file);
            const fileURL = URL.createObjectURL(file);
            setProfile(fileURL);
        }
    }
    
    const onSave = async () =>{
        //사진 저장
        setLoading(true);

        if (backFile) {
            try {
                const locationRef = ref(storage, `avatars/${user?.uid}/back`);
                const result = await uploadBytes(locationRef,backFile);
                const dbBackURL = await getDownloadURL(result.ref);
    
                const userQuery = query(
                    collection(db,"users"),
                    where("userId", "==", user?.uid),
                );
                const snapshot = await getDocs(userQuery);
        
                snapshot.forEach(async (doc) => {
                    //const data = doc.data();
        
                    await updateDoc(doc.ref,{
                        backgroundURL : dbBackURL,
                    });
                })
            } catch (error) {
                
            }
        };

        if(profileFile){
            try {
                const locationRef2 = ref(storage, `avatars/${user?.uid}/profile`);
                const result2 = await uploadBytes(locationRef2,profileFile);
                const dbProfileURL = await getDownloadURL(result2.ref);
    
                const userQuery = query(
                    collection(db,"users"),
                    where("userId", "==", user?.uid),
                );
                const snapshot = await getDocs(userQuery);
        
                snapshot.forEach(async (doc) => {
                    //const data = doc.data();
        
                    await updateDoc(doc.ref,{
                        profileURL : dbProfileURL,
                    });
                })
            } catch (error) {
                
            }
        }

        //이름저장
        if (user&&name) {
            try {
                const userQuery = query(
                    collection(db,"users"),
                    where("userId", "==", user?.uid),
                );
                const snapshot = await getDocs(userQuery);
                snapshot.forEach(async (doc) => {
                    console.log("######"+doc.ref)
                    await updateDoc(doc.ref,{
                        userName : name,
                    });
                })
                await updateProfile(user, {
                    displayName: name,
                });
            } catch (error) {
               //console.error(error);
            }
        }

        setLoading(false);

        onClose();
        window.location.href = "/profile";
    };


    return (
        
        <ModalBackdrop onClick={onClose}>
            {loading ? <LoadingScreen /> : 
            /* e.stopPropagation(): 이벤트가 부모 요소로 전파되는 것을 방지,모달 내부 클릭 시 이벤트 전파 중단 */
            <ModalContainer onClick={(e)=> e.stopPropagation()}>
                <TopBar>
                    <CloseButton onClick={onClose}>x</CloseButton>
                    <Text>프로필 수정</Text>
                    <SaveButton onClick={onSave}>저장</SaveButton>

                </TopBar>
                <ProfileContainer>
                    {backgroud?
                    <BackgroundImage src={backgroud}/>:<BackgroundImage src=""/>}
                    <BackFileLabel htmlFor="backFile">
                        <svg fill="none" strokeWidth={2.1} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                        </svg>
                    </BackFileLabel>
                    <BackFileInput id="backFile" onChange={onBackFileChange} type="file" accept="image/*"/>

                    {profile ?
                        <ProfileImg src={profile}/>
                        : (
                            <ProfileNone>
                            <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" >
                                <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                            </svg>
                        </ProfileNone>)
                    }
                    <ProfileFileLabel htmlFor="profileFile">
                        <svg fill="none" strokeWidth={2.4} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                        </svg>
                    </ProfileFileLabel>
                    <ProfileFileInput id="profileFile" onChange={onProfileFileChange} type="file" accept="image/*"/>
                     
                    <Info>
                        <p style={{ fontSize:16, color:'gray', textAlign:'left', marginTop:100, marginBottom:20}}>이름 </p>
                        <Username value={name??""} onChange={onNameChange}/>
                    </Info>


                </ProfileContainer>
            </ModalContainer>
            }
        </ModalBackdrop>
        
    );
};

export default Modal;
