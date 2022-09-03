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
  const [timezone, setTimezone] = useState({})
  const inputNameRef = useRef()
  const inputTextRef = useRef()
  const inputTimezoneRef = useRef()
  const tzlist = [
    {value: 'UTC', label: 'UTC'},
    {value: 'JST', label: 'JST'},
  ]

  const handleName = event => {
    setpost({username:event.target.value, text: post.text})
  }

  const handleText = event => {
    setpost({username: post.username, text: event.target.value})
  }

  const handleTimezone = event => {
    setTimezone({timezone: event.target.value})
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

  const changeTimezone = (strDate) => {
    date = Date.parse(strDate)
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
      <div style={{
        display:'flex',
        justifyContent:'space-between'
      }}>
        <div><h1>HTTP CHAT <small><small>by iwsh</small></small></h1></div>
        <div style={{display:'flex', alignItems:'center'}}>
          <select name="timezone" defaultValue="UTC" ref={inputTimezoneRef} onChange={handleTimezone}>
            {tzlist.map( tz => <option value={tz.value}>{tz.label}</option>)}
          </select>
        </div>
      </div>
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
