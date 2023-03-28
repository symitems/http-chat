import React from "react";

export default function MessageList(props) {
    return (
        <div>
            <table style={{ marginTop: 15, borderCollapse: "collapse" }}>
                <tbody>
                    <tr>
                        <td rowSpan={2} valign="top">
                            <span style={{ fontSize: "10px" }}><img
                                src={props.msg.avatar_url}
                                alt="img"
                                style={{
                                    borderRadius: 50,
                                    marginTop: 15,
                                    width: "30px",
                                    height: "auto",
                                }}
                            /></span>
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                            <b style={{ marginLeft: "1%" }}>{props.msg.username}</b>
                            <small> - [ {props.changeTimezone(props.msg.created_at)} ]</small>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div
                                style={{
                                backgroundColor: "#ffffff",
                                padding: 5,
                                marginLeft: "1%",
                                marginTop: 10,
                                marginRight: "5%",
                                alignSelf: "flex-end",
                                borderRadius: 15,
                                display: "inline-block",
                                border: "1.5px solid",
                                borderColor: "#b0e0e6",
                                }}
                            >
                                {props.msg.text.split("\n").map((line, i) => (
                                <React.Fragment key={i}>
                                    {line}
                                    <br/>
                                </React.Fragment>
                                ))}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
