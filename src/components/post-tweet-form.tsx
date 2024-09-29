import { useState } from "react";
import { styled } from "styled-components";
import { auth, db, storage } from "../firebase";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


const Wrapper = styled.div`
    border-bottom: 1px solid #2f3336;
`;
const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 10px 30px 0px 30px;
`;
const TextArea = styled.textarea`
    border: none;
    padding: 20px;
    border-bottom: 1px solid #2f3336;
    font-size: 16px;
    color: white;
    background-color: black;
    width: 100%;
    resize: none;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    &::placeholder {
        font-size: 23px;
    }
    &:focus {
        outline: none;
        border-color: #1d9bf0;
    }
`;
const Column = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom:10px;
    align-items: center;
`;

const AttachFileLabel = styled.label`
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
const AttachFileInput = styled.input`
    display: none;
`;
const SubmitBtn = styled.input`
    background-color: #1d9bf0;
    color: white;
    border: none;
    padding: 10px 30px;
    border-radius: 20px;
    font-size: 16px;
    font-weight: bolder;
    margin-left: auto;
    cursor: pointer;
    &:hover,
    &:active {
        opacity: 0.8;
    }
`;


//export default function PostTweetForm() {
const PostTweetForm: React.FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
    const [tweet,setTweet] = useState("");
    const [file,setFile] = useState<File | null>(null);
    const [isLoading, setLoading] = useState(false);
    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>)=>{
        setTweet(e.target.value);
    }
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const {files} = e.target;
        if(files && files.length === 1 ){
            setFile(files[0]);
        }
    }
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const user = auth.currentUser;
        if(!user || isLoading || tweet === "" || tweet.length > 180) return;

        try {
            setLoading(true);
            const doc = await addDoc(collection(db,"tweets"),{
                tweet,
                createdAt: Date.now(),
                userId:user.uid,
                username:user.displayName || "Anonymous",
                bookmarks: null,
                hearts: null,
            });

            if(file){
                const locationRef = ref(storage,`tweets/${user.uid}/${doc.id}`);
                const result = await uploadBytes(locationRef, file);
                const url = await getDownloadURL(result.ref);
                await updateDoc(doc, {
                    photo: url,
                });
            }
        } catch (error) {
            
        }finally{
            setLoading(false);
            onSubmit()
        }
    };

    return(
        <Wrapper>
            <Form onSubmit={handleSubmit}>
                <TextArea value={tweet} onChange={onChange} rows={5} maxLength={180} placeholder="무슨 일이 일어나고 있나요?" required/>
                <Column>
                    <AttachFileLabel htmlFor="file">{file?"✅" : 
                            <svg fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                        }
                    </AttachFileLabel>
                    <AttachFileInput onChange={onFileChange} id="file" type="file" accept="image/*"/>
                    <SubmitBtn type="submit" value={isLoading ? "Posting..." : "게시하기"} />
                   
                </Column>

            </Form>
        </Wrapper>
    );
}

export default PostTweetForm;