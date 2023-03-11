import '../App.css';
import React, { useEffect, useRef, useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router";
import { logout } from '../contexts/AuthContext';
import { backend_api } from "../helper/ApiHelper";
import ModalContext from '../contexts/ModalContext';
import MessageForm from '../components/MessageForm';
import MessageList from '../components/MessageList';

export default function Chat() {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [isErr, setIsErr] = useState(false);
  const [post, setPost] = useState({});
  const [timezone, setTimezone] = useState();
  const inputTextRef = useRef();
  const inputTimezoneRef = useRef();
  const setModalIsShown = useContext(ModalContext).isModalShown[1];
  const setmodalTitle = useContext(ModalContext).modalTitle[1];
  const setModalMessage = useContext(ModalContext).modalMessage[1];
  const tzlist = [
    { value: "UTC", label: "UTC" },
    { value: "JST", label: "JST" },
  ];

  const logoutAndNavigateLogin = useCallback(() => {
    logout();
    setTimeout(() => {
      navigate("/login");
    }, 100)
  }, [navigate]);

  const handleText = (event) => {
    setPost({ text: event.target.value });
  };

  const handleTimezone = (event) => {
    setTimezone(event.target.value);
  };

  const getMessage = useCallback(() => {
    backend_api.get("/messages/")
      .then((res) => {
        console.log(res);
        setMsgs(res.data);
        setIsAuthorized(true);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          setModalIsShown(true);
          setmodalTitle("Logout");
          setModalMessage("Authentication expired. Login again.");
          logoutAndNavigateLogin();
          isErr || setIsErr(true);
        } else if (error.response.status === 403) {
          setModalIsShown(true);
          setmodalTitle("Account is NOT active");
          setModalMessage("Please ask the administrator to activate your account");
          isErr || setIsErr(true);
        } else {
          setModalIsShown(true);
          setmodalTitle("Sorry!!");
          setModalMessage("An error occurred in the application. Please contact the administrator to resolve the issue.");
          isErr || setIsErr(true);
        }
      }
      );
  }, [logoutAndNavigateLogin, setModalIsShown, setmodalTitle, setModalMessage, isErr, setIsErr])

  useEffect(() => {
    getMessage()
    const interval = setInterval((isErr) => {
      if (isErr) {
        clearInterval(interval);
        return
      }
      getMessage()
    }, 3000, [isErr]);
  }, [getMessage, isErr]);

  const clickSubmit = () => {
    // messageが空欄でなければ送信
    console.log(post.text);
    console.log(post.username);
    if (post.text) {
      const text = post.text;
      const _post = { text: text };

      // POST処理
      backend_api.post("/messages/", _post)
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
    backend_api.delete("/messages/")
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
        const jstdate = new Date(Date.parse(strDate));
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

  const handleKeyDown = (e) => {
    // cmd + Enter もしくは ctrl + Enter
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      clickSubmit()
    }
  }

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
      {
        isAuthorized && (
          <MessageForm
            ref={inputTextRef}
            onChange={handleText}
            onKeyDown={handleKeyDown}
            onClickSubmit={clickSubmit}
            onClickClearAll={clickClear}
          />
        )
      }
      {msgs.map((msg, index) => {
        return (
          <MessageList msg={msg} changeTimezone={changeTimezone} key={index} />
        );
      })}
    </div>
  );
}
