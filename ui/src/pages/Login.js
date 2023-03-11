import '../App.css';
import logo from '../logo.svg';
import { useState, useEffect, useCallback, useContext, useRef } from "react";
import { useNavigate } from "react-router";
import { login } from '../contexts/AuthContext';
import { backend_api } from "../helper/ApiHelper";
import ModalContext from '../contexts/ModalContext';


export default function Login() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("")
  const github_client_id = process.env.REACT_APP_GITHUB_CLIENT_ID
  const github_oauth_url = `https://github.com/login/oauth/authorize?client_id=${github_client_id}&scope=user:read`
  const google_client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID
  const origin = window.location.origin
  const google_oauth_url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${google_client_id}&redirect_uri=${origin}/login&response_type=code&access_type=offline&scope=openid%20https%3A//www.googleapis.com/auth/userinfo.email%20https%3A//www.googleapis.com/auth/userinfo.profile`

  const setModalIsShown = useContext(ModalContext).isModalShown[1];
  const setmodalTitle = useContext(ModalContext).modalTitle[1];
  const setModalMessage = useContext(ModalContext).modalMessage[1];

  // For develop environment with strictmode
  const refFirstRef = useRef(true);

  const loginAndNavigate = useCallback(() => {
    login();
    // session storageに値が格納されるのを待つため100msスリープ
    setTimeout(() => {
      navigate("/chat");
    }, 100)
  }, [navigate])

  useEffect(() => {
    const params = window.location.search;
    const code = params.startsWith('?code=') ? params.split('=')[1] : undefined;
    if (code) {
      let service_name = 'github';
      if (params.indexOf('google') !== -1) {
        service_name = 'google';
      }
      setMessage(`Verifying ${service_name} account...`)
      backend_api.post(`/login/oauth/${service_name}`, {
        code: code
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
        .then(response => {
          console.log(response.data);
          setMessage(response.data.message);
          loginAndNavigate();
        })
        .catch(error => {
          console.error(error);
          // NOTE: When StrictMode is enabled, React intentionally performs
          //       operations twice in devlopment. Login request is also
          //       excuted twice though code is valid only once. We must ignore
          //       first login error because one of the two responces is always error.
          if (process.env.NODE_ENV === "development") {
            if (refFirstRef.current) {
              refFirstRef.current = false;
              return;
            }
          }
          setModalIsShown(true);
          setmodalTitle("Login Error");
          setModalMessage("Cannot login. Try again.");
          setMessage("");
        });
    }
  }, [loginAndNavigate, setModalIsShown, setmodalTitle, setModalMessage])


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {
          message ?
            <div>
              <p>{message}</p>
            </div>
            : null
        }
        <a
          className='App-link'
          href={github_oauth_url}
        >
          LOGIN with Github
        </a>
        <a
          className='App-link'
          href={google_oauth_url}
        >
          LOGIN with Google
        </a>
      </header>
    </div>
  );
}
