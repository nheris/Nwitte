import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { auth, db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

const Button = styled.span`
    margin-top: 10px;
    background-color: white;
    font-weight: 500;
    width: 100%;
    color: black;
    padding: 10px 20px;
    border-radius: 50px;
    border: 0;
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
        opacity: 0.8;
    }
`;
const Logo = styled.img`
  height: 25px;
`;

export default function GithubButton() {
    const navigate = useNavigate();

    const onClick = async () => {
        try {
            const provider = new GithubAuthProvider;
            await signInWithPopup(auth, provider);

            const user = auth.currentUser;

            await addDoc(collection(db,"users"),{
                profileURL: user?.photoURL,
                backgroundURL: user?.photoURL,
                userId:user?.uid,
                userName:user?.displayName,
            });

            navigate("/");
        } catch (error) {
            //console.error(error);
        }

    };

    return(
        <Button onClick={onClick}>
            <Logo src="/github-logo.svg"/>
            Github로 로그인
        </Button>
    );
};