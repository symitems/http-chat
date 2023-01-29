import '../App.css';
import logo from '../logo.svg';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from '../context/AuthContext';

axios.defaults.withCredentials = true;

export default function Login() {
  const navigate = useNavigate();
  const login = useAuth().login;
  const [error, setError] = useState("");

  const params = window.location.search;
  const backend_baseurl = process.env.REACT_APP_BACKEND_BASEURL
  const [message, setMessage] = useState("")
  const github_client_id = process.env.REACT_APP_GITHUB_CLIENT_ID
  const github_oauth_url = `https://github.com/login/oauth/authorize?client_id=${github_client_id}&scope=user:read`

  const code = params.startsWith('?code=') ? params.split('=')[1] : undefined;

  useEffect(() => {
    if (code) {
      setMessage("Verifying account...")
      axios.post(backend_baseurl + '/login/oauth/github', {
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
          login();
          // session storageに値が格納されるのを待つため100msスリープ
          setTimeout(() => {
            navigate("/chat");
          }, 100)
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
  }, [])


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