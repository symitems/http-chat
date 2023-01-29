import '../App.css';
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from '../context/AuthContext';

const backend_baseurl = process.env.REACT_APP_BACKEND_BASEURL

export default function Chat() {
  const navigate = useNavigate();
  const logout = useAuth().logout;
  const [msgs, setMsgs] = useState([]);
  const [post, setPost] = useState({});
  const [timezone, setTimezone] = useState();
  const inputTextRef = useRef();
  const inputTimezoneRef = useRef();
  const tzlist = [
    { value: "UTC", label: "UTC" },
    { value: "JST", label: "JST" },
  ];

  axios.defaults.withCredentials = true;

  const logoutAndNavigateLogin = useCallback(() => {
    logout();
    setTimeout(() => {
      navigate("/login");
    }, 100)
  }, [logout, navigate]);


  const handleText = (event) => {
    setPost({ text: event.target.value });
  };

  const handleTimezone = (event) => {
    setTimezone(event.target.value);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get(backend_baseurl + "/messages/")
        .then((res) => {
          console.log(res);
          setMsgs(res.data);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            logoutAndNavigateLogin();
          }
        }
        );
    }, 3000);
    return () => clearInterval(interval);
  }, [logoutAndNavigateLogin]);

  const clickSubmit = () => {
    // messageが空欄でなければ送信
    console.log(post.text);
    console.log(post.username);
    if (post.text) {
      const text = post.text;
      const _post = { text: text };

      // POST処理
      axios
        .post(backend_baseurl + "/messages/", _post)
        .then((res) => {
          console.log(res);
          setMsgs(res.data);
        })
        .catch((error) => {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          console.log("Error", error.message);
        });

      // clear message textarea
      inputTextRef.current.value = "";
      setPost({ text: "" });
    }
  };

  const clickClear = () => {
    // DELETE処理
    axios
      .delete(backend_baseurl + "/messages/")
      .then((res) => {
        console.log(res);
        setMsgs(res.data);
      })
      .catch((error) => {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        console.log("Error", error.message);
      });
  };

  const changeTimezone = (strDate) => {
    switch (timezone) {
      case "JST":
        strDate = strDate + "Z"
        const parseDate = Date.parse(strDate.replace(/-/g, "/").replace(/T/, " "));
        const parsejstdate = parseDate;
        const jstdate = new Date(parsejstdate);
        return (
          [
            jstdate.getFullYear(),
            ("0" + (jstdate.getMonth() + 1)).slice(-2),
            ("0" + jstdate.getDate()).slice(-2),
          ].join("-") +
          " " +
          [
            ("0" + jstdate.getHours()).slice(-2),
            ("0" + jstdate.getMinutes()).slice(-2),
            ("0" + jstdate.getSeconds()).slice(-2),
          ].join(":")
        );
      default:
        return strDate;
    }
  };

  return (
    <div
      style={{
        margin: "auto",
        width: "90%",
      }}
    >
      <div
        style={{
          display: "flex",
          WebkitBoxPack: "justify",
          MozBoxPack: "justify",
          MsFlexPack: "justify",
          WebkitJustifyContent: "space-between",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1>
            HTTP CHAT{" "}
            <small>
              <small>by iwsh</small>
            </small>
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <select
            style={{ fontSize: "16px" }}
            name="timezone"
            defaultValue="UTC"
            ref={inputTimezoneRef}
            onChange={handleTimezone}
          >
            {tzlist.map((tz) => (
              <option value={tz.value}>{tz.label}</option>
            ))}
          </select>
          <button onClick={logoutAndNavigateLogin}>
            Logout
          </button>
        </div>
      </div>
      <hr></hr>
      <div>
        <table cellPadding={5}>
          <tbody>
            <tr>
              <td valign="middle">Message:</td>
              <td>
                <textarea
                  style={{ fontSize: "16px" }}
                  ref={inputTextRef}
                  cols="22"
                  rows="5"
                  onChange={handleText}
                  required
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit" onClick={clickSubmit}>
          <big>Submit</big>
        </button>
        <hr></hr>
      </div>
      <button type="submit" onClick={clickClear}>
        <big>Clear All</big>
      </button>
      {msgs.map((msg) => {
        return (
          <div>
            <div style={{
              marginTop: 15,
            }}>
              <b>
                <big>{msg.username}</big>
              </b>{" "}
              <small> - [ {changeTimezone(msg.created_at)} ]</small>
            </div>
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: 5,
                marginLeft: "1%",
                marginTop: 5,
                marginRight: "5%",
                // maxWidth: '50%',
                alignSelf: "flex-end",
                borderRadius: 15,
                display: "inline-block",
                border: "1.5px solid",
                borderColor: "#b0e0e6",
              }}
            >
              {msg.text}
            </div>
          </div>
        );
      })}
    </div>
  );
}
