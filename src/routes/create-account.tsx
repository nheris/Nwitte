import GithubButton from "../components/github-btn";
import { Form, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { FirebaseError } from "firebase/app";
import { Title, Wrapper, Error, Switcher, Symbol, Input, Divider } from "../components/auth-components";
import { addDoc, collection } from "firebase/firestore";

export default function CreateAccount() {
    
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);
    const errors: Record<string, string> = {
        "(auth/email-already-in-use).": "이미 가입이 되어있는 이메일입니다.",
        "(auth/invalid-email).": "올바르지 않은 이메일 형식입니다.",
        "(auth/weak-password)": "비밀번호를 최소 6글자 이상 입력해주세요.",
        "(auth/wrong-password).": "이메일이나 비밀번호가 틀립니다.",
        "(auth/too-many-requests)":
        "로그인 시도가 여러 번 실패하여 이 계정에 대한 액세스가 일시적으로 비활성화되었습니다. 비밀번호를 재설정하여 즉시 복원하거나 나중에 다시 시도할 수 있습니다.",
        "(auth/user-not-found)": "가입된 아이디를 찾을 수 없습니다.",
        "(auth/invalid-credential)":"유효하지 않은 인증 정보 입니다."
    };

    const onChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const {target : {name, value}} = e;

        if (name === "name") {
            setName(value);
        } else if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };

    const onSubmit = async (e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        setError("");
        if(email === "" || password === "") return;

        try {
            setLoading(true);
            const credentials = await createUserWithEmailAndPassword(auth, email, password);
            //name설정
            await updateProfile(credentials.user,{
                displayName: name,
            });

            //user 추가 정보 저장
            const user = auth.currentUser;

            await addDoc(collection(db,"users"),{
                profileURL: null,
                backgroundURL: null,
                userId:user?.uid,
                userName:name,
            });

            navigate("/");
        } catch (e:any) {
            if(e instanceof FirebaseError){
                const errorKey = Object.keys(errors).find((key)=>
                    e.message.includes(key)
                )
                const errorMessage = errorKey? errors[errorKey]:e.message;
                setError(errorMessage);
            }else{
                setError("알 수 없는 오류가 발생했습니다.");
            }

        }finally{
            setLoading(false);
        }
    };
    return(
        <Wrapper>
            <Symbol>𝕏</Symbol>
            <Title>X 가입하기</Title>
                <Form onSubmit={onSubmit}>
                    <Input onChange={onChange} name="name" value={name} placeholder="Name" type="text" required />
                    <Input onChange={onChange} name="email" value={email} placeholder="Email" type="email" required />
                    <Input onChange={onChange} name="password"  value={password} placeholder="Password" type="password" required />
                    <Input type="submit" value={isLoading ? "Loading..." : "Create Account"}/>
                </Form>
                {error !== "" ? <Error>{error}</Error> : null}
            <Switcher>
                이미 트위터에 가입하셨나요?
                <Link to= "/login">로그인 &rarr;</Link>
            </Switcher>
            <Divider>또는</Divider>
            <GithubButton />
        </Wrapper>

    );
};