import '../App.css';
import logo from '../logo.svg';
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { login } from '../context/AuthContext';
import { backend_api } from "../helper/ApiHelper";


export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [message, setMessage] = useState("")
  const github_client_id = process.env.REACT_APP_GITHUB_CLIENT_ID
  const github_oauth_url = `https://github.com/login/oauth/authorize?client_id=${github_client_id}&scope=user:read`

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
      setMessage("Verifying account...")
      backend_api.post('/login/oauth/github', {
        code: code
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
        .then(response => {
          console.log(response.data);
          setError("");
          setMessage(response.data.message);
          loginAndNavigate();
        })
        .catch(error => {
          // useEffectが2回実行され、片方が401となるのでエラーの表示を遅らせる
          setTimeout(() => {
            setError("Cannot login. Try again.");
            setMessage("");
            console.log(error);
          }, 1000)
        });
    }
  }, [loginAndNavigate])


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
        {
          error ?
            <div style={{ color: "lightsalmon" }}>
              {error}
            </div>
            : null
        }
      </header>
    </div>
  );
}
