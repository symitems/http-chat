import React from 'react';

import { Route, Navigate, Routes, BrowserRouter } from 'react-router-dom';
import NotificationModal from './components/Modal';
import { is_authenticated } from './contexts/AuthContext';
import ModalContext from './contexts/ModalContext';

const Login = React.lazy(() => import('./pages/Login'));
const Chat = React.lazy(() => import('./pages/Chat'));

export default function App() {
  const isModalShown = React.useState(false);
  const modalTitle = React.useState("initial title");
  const modalMessage = React.useState("initial message");

  return (
    <ModalContext.Provider value={{ isModalShown, modalTitle, modalMessage }}>
      <NotificationModal />
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
    </ModalContext.Provider>
  );
}

function PrivateRoute(props) {
  return is_authenticated() ? props.children : <Navigate to="/login" />;
}
