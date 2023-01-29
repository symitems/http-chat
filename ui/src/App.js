import React from 'react';

import { Route, Navigate, Routes, BrowserRouter } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const Login = React.lazy(() => import('./components/Login'));
const Chat = React.lazy(() => import('./components/Chat'));

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/http-chat/login' element={<Login />} />
        <Route path='/http-chat/' element={
          <PrivateRoute children={<Navigate to='/http-chat/chat' />} />
        } />
        <Route path='/http-chat/chat' element={
          <PrivateRoute children={<Chat />} />
        } />
      </Routes>
    </BrowserRouter>
  );
}

function PrivateRoute(props) {
  const { is_authenticated } = useAuth();

  return is_authenticated() ? props.children : <Navigate to="/login" />;
}
