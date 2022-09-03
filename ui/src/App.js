import React,{useEffect, useRef, useState}  from 'react';
import axios from 'axios'

function App() {
  // const [count, setCount] = useState(0);

  // useEffect(()=>{
  //   const interval = setInterval(() => {
  //     setCount(count => count + 1);
  //   }, 5000);
  //   return () => clearInterval(interval);
  // },[])

  const [msgs, setMsgs] = useState([])
  const [post, setpost] = useState({})
  const [apiRootUrl, setApiRootUrl] = useState()
  const [inApiRootUrl, setInApiRootUrl] = useState()
  const inputNameRef = useRef()
  const inputTextRef = useRef()
  const inputInApiRootUrlRef = useRef()

  const handleName = event => {
    setpost({username:event.target.value, text: post.text})
  }

  const handleText = event => {
    setpost({username: post.username, text: event.target.value})
  }

  const handleInApiRootUrl = event => {
    setInApiRootUrl(event.target.value)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (apiRootUrl) {
        axios.get(apiRootUrl + "/messages/")
        .then(res => {
          console.log(res)
          setMsgs(res.data)
        })
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [apiRootUrl])

  const clickSubmit = (e) => {
    // POST処理
    axios.post(apiRootUrl + "/messages/", post)
    .then(res => {
      console.log(res)
      setMsgs(res.data)
    })
    .catch((error) => {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      console.log('Error', error.message);
    })
    inputNameRef.current.value = "";
    inputTextRef.current.value = "";
  }
  
  const clickStart = (e) => {
    setApiRootUrl(inApiRootUrl)
    setMsgs([{"created_at": "loading"}])
    inputInApiRootUrlRef.current.value = "";
  }

  const clickClear = (e) => {
    // DELETE処理
    axios.delete("http://127.0.0.1:8000/messages/")
    .then(res => {
      console.log(res)
      setMsgs(res.data)
    })
    .catch((error) => {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      console.log('Error', error.message);
    })
    inputNameRef.current.value = "";
    inputTextRef.current.value = "";
  }

  return (
    <div style={{
      margin:'auto',
      width:'50%'
    }}>
      <h1>HTTP CHAT <small><small>by iwsh</small></small></h1>
      <div>
        Enter API Server URL : <input ref={inputInApiRootUrlRef} type="text" onChange={handleInApiRootUrl} required/>
        <button type="submit" onClick={clickStart}><big>Start</big></button>
      </div>
      {(apiRootUrl)?
        <div>
          <table cellPadding={5}>
            <tr>
              <td>Name:</td>
              <td><input ref={inputNameRef} type="text" onChange={handleName} required/></td>
            </tr>
            <tr>
              <td valign="middle">Message:</td>
              <td><textarea ref={inputTextRef} cols="40" rows="5" onChange={handleText} required/></td>
            </tr>
            <button type="submit" onClick={clickSubmit}><big>Submit</big></button>
          </table>
        </div>
      :<div></div>}
      <hr></hr>
      <button type="submit" onClick={clickClear}><big>Clear All</big></button>
      {msgs.map(msg => {
        return (
          <p>
            <div>
              <b><big>{msg.username}</big></b> <small>@ {msg.created_at}</small>
            </div>
            <div>
              <big>{msg.text}</big>
            </div>
          </p>
        );
      })}
    </div>
  );
}

export default App;
