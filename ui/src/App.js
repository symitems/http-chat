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
  const inputNameRef = useRef()
  const inputTextRef = useRef()

  const handleName = event => {
    setpost({username:event.target.value, text: post.text})
  }

  const handleText = event => {
    setpost({username: post.username, text: event.target.value})
  }

  useEffect(() => {
    const interval = setInterval(() => {      
      axios.get("http://127.0.0.1:8000/messages/")
      .then(res => {
        console.log(res)
        setMsgs(res.data)
      })
    }, 1000);
    return () => clearInterval(interval);
  }, [])

  const clickSubmit = (e) => {
    // POST処理
    axios.post("http://127.0.0.1:8000/messages/", post)
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
      <hr></hr>
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
