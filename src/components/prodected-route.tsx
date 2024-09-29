import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

//TS : children 프로퍼티(이 컴포넌트가 감싸고 있는 자식 컴포넌트들)가 React.ReactNode 타입임을 명시
export default function prodectedRoute({ children }:{ children: React.ReactNode }) {
    //로그인 여부 확인
    const user = auth.currentUser;
    if(user === null) {
        return <Navigate to="/login" />
    }
    return children;
}