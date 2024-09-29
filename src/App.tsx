import { useEffect, useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import LoadingScreen from './components/loading-screen';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { auth } from './firebase';
import Layout from './components/layout';
import ProdectedRoute from './components/prodected-route';
import Home from './routes/home';
import Profile from './routes/profile';
import Login from './routes/login';
import CreateAccount from './routes/create-account';
import Search from './routes/search';
import Bookmark from './routes/bookmark';


const GlobalStyles = createGlobalStyle`
  ${reset};
  
  * {
    box-sizing: border-box;
  }
  body {
    background-color: black;
    color:white;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  ::-webkit-scrollbar {
    display:none;
  }
  
`;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`;

const router = createBrowserRouter([
  {
    path : "/",
    element : (
      <ProdectedRoute>
        <Layout />
      </ProdectedRoute>
    ),
    children : [
      { path: "", element: <Home /> },
      { path: "profile", element: <Profile /> },
      { path: "search", element: <Search />},
      { path: "bookmark", element: <Bookmark />}
    ],
  },
  //로그인 안한 사람 따로
  {
    path: "/login",
    element: <Login />,
  }
  ,{
    path: "/create-account",
    element: <CreateAccount />,
  }
]);

function App() {
  const [isLoading, setLoading] = useState(true);
  
  const init = async () => {
    await auth.authStateReady(); // 인증 상태가 준비될 때까지 대기
    setLoading(false);
  };

  useEffect(()=>{
    init();
  },[]);

  return (
    <Wrapper>
      <GlobalStyles />
      {isLoading?<LoadingScreen />: <RouterProvider router={router} />}
    </Wrapper>
  )
}

export default App
