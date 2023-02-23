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
  const google_client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID
  const google_oauth_url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${google_client_id}&redirect_uri=http%3A//localhost%3A3000/login&response_type=code&access_type=offline&scope=openid%20https%3A//www.googleapis.com/auth/userinfo.email%20https%3A//www.googleapis.com/auth/userinfo.profile`

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
    const google = 'google'
    if (code && params.indexOf(google) === -1) {
      setMessage("Verifying github account...")
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
    } else if (code && params.indexOf(google) !== -1) {
      setMessage("Verifying google account...")
      backend_api.post('/login/oauth/google', {
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
        <a
          className='App-link'
          href={google_oauth_url}
        >
          LOGIN with Google
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
