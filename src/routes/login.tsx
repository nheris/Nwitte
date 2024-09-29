import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Form, Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import React, { useState } from "react";
import GithubButton from "../components/github-btn";
import { Divider, Input, Switcher, Title, Wrapper, Symbol, Error } from "../components/auth-components";
import LoadingScreen from "../components/loading-screen";


export default function Login() {

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();
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
        
        // target 객체(<Input>)에서 name과 value 속성을 추출해 변수만듦
        const {target : {name, value}} = e;

        if(name == "email"){
            setEmail(value);
        }else if(name == "password"){
            setPassword(value);
        }
    };

    const onSubmit = async (e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        setError("");
        if(email === "" || password === "") return;

        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (error:any) {
            // if(e instanceof FirebaseError){
            //     setError(e.message);
            // }
            // error가 FirebaseError 타입인지 확인
            if (error instanceof FirebaseError) {
                // error.message가 errors 객체에 있는지 확인
                //Object.keys(errors) : errors 객체의 모든 키를 배열로 반환
                //["(auth/email-already-in-use).", "(auth/invalid-email).", ...]
                const errorKey = Object.keys(errors).find((key) =>
                    error.message.includes(key)
                );

                // errors에 해당하는 메시지가 있으면 그걸로, 없으면 기본 메시지 사용
                const errorMessage = errorKey ? errors[errorKey] : error.message;
                setError(errorMessage);
            } else {
                // FirebaseError가 아닌 경우 기본 오류 처리
                setError("알 수 없는 오류가 발생했습니다.");
            }
        }finally{
            setLoading(false);
        }
    };

    return(
        <>
        
        {isLoading ? <LoadingScreen /> :(
        <Wrapper>
            
            <Symbol>𝕏</Symbol>
            <Title>지금 일어나고 있는 일</Title>
            <p style={{fontSize: 25, fontWeight: 'bold', marginBottom:30 }}>지금 로그인하세요.</p>

            <Form onSubmit={onSubmit}>
                <Input value={email} onChange={onChange} type="email" name="email" placeholder="email" required></Input>
                <Input value={password} onChange={onChange} type="password" name="password" placeholder="Password" required></Input>
                <Input type="submit" value={isLoading ? "Loading..." : "Login"}/>
            </Form>
                
            {error !== "" ? <Error>{error}</Error> : null}

            <Switcher>
                계정이 없으신가요?{" "}
                <Link to= "/create-account">가입하기 &rarr;</Link>
            </Switcher>
            <Divider>또는</Divider>
            <GithubButton />
        </Wrapper>
        )}
        </>
    );
};