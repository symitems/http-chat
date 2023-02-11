import React from 'react';

import { Route, Navigate, Routes, BrowserRouter } from 'react-router-dom';
import { is_authenticated } from './context/AuthContext';

const Login = React.lazy(() => import('./components/Login'));
const Chat = React.lazy(() => import('./components/Chat'));

export default function App() {

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={
          <PrivateRoute children={<Navigate to='/chat' />} />
        } />
        <Route path='/chat' element={
          <PrivateRoute children={<Chat />} />
        } />
      </Routes>
    </BrowserRouter>
  );
}

function PrivateRoute(props) {
  return is_authenticated() ? props.children : <Navigate to="/login" />;
}
