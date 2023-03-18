import React from "react";

export default function MessageList(props) {
    return (
        <div>
            <div style={{
                marginTop: 15,
            }}>
                <b>
                    <big>{props.msg.username}</big>
                </b>{" "}
                <small> - [ {props.changeTimezone(props.msg.created_at)} ]</small>
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
                {props.msg.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                        {line}
                        <br />
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}