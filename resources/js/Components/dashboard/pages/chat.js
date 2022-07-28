import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { user } from "../../../constants";
import Spinner from "../layouts/spinner";
import { chats } from "../scripts/Queries";
import { sendMessage } from "../scripts/Mutations";
import moment from "moment";
import axios from "axios";
import toastr from "toastr";
import Echo from "laravel-echo";
const Chat = (props) => {
    const params = useParams();
    const chatID = parseInt(params.id);
    const Chat = useQuery(chats, {
        variables: {
            id: chatID,
        },
    });
    let other = {};

    const [send_message, RsltMessage] = useMutation(sendMessage, {
        onCompleted: (res) => {
            console.log(res);
        },
        onError: (err) => {
            toastr.error("error");
            console.log(err);
        },
    });

    const [Message, setMessage] = useState({
        message: "",
        sender_id: user.id,
        chat_id: chatID,
    });
    let socketId;
    const [socket_id, setSocket] = useState();
    useEffect(() => {
        var pusher = new Pusher("fb9c2d24bdd07c3865e9", {
            cluster: "mt1",
        });

        var channel = pusher.subscribe(`chat-${chatID}`);
        
        channel.bind("typing", function (data) {
            console.log("typing is");
            console.log(data);
            let id = data.chat_id;
            $(`#typing${id}`).fadeIn();
            setTimeout(() => {
                $(`#typing${id}`).fadeOut();
            }, 700);
        });

        channel.bind("newMessage", function (data) {
            $(`#chatContainer${chatID}`).append(`
              <div class="d-flex justify-content-${user.id == data.sender_id ? "end" : "start"} mb-4">
              ${
                  user.id == data.sender_id
                      ? `  <div class="msg_cotainer_send w-50">
                              ${data.message}
                              <span class="msg_time_send color-3">${moment(data.result.created_at).format("MMM Do YY")}</span>
                          </div>
                          <div class="img_cont_msg">
                              <img src="/uploads/avatars/${data.result.sender.avatar}" class="rounded-circle user_img_msg" />
                          </div>
                      `
                      : ` <div class="img_cont_msg ">
                              <img src="/uploads/avatars/${data.result.sender.avatar}" class="rounded-circle user_img_msg" />
                          </div>
                          <div class="msg_cotainer w-50">
                              ${data.message}
                              <span class="msg_time color-3">${moment(data.result.created_at).format("MMM Do YY")}</span>
                          </div>`
              }
                                                   
                                                </div>
            `);
        });

        Pusher.logToConsole = true;
        channel.bind("pusher:subscription_succeeded", function (members) {
            socketId = pusher.connection.socket_id;
            setSocket(pusher.connection.socket_id);
            console.log(socketId);
        });
    }, []);
    function handeTyping() {
        axios
            .get(`/istyping/${chatID}`)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    function handleSubmit(e) {
        e.preventDefault();
        send_message({
            variables: {
                message: Message.message,
                chat_id: Message.chat_id,
                sender_id: Message.sender_id,
            },
            onCompleted: (res) => {
                e.target.value = "";
            },
            onError: (err) => {
                console.error("err" + err.message);
            },
        });
    }

    function handleMessageChange(e) {
        setMessage({ ...Message, message: e.target.value });
        console.log(Message);
    }

    // useEffect(() => {
    //     if (Chat.data != undefined) {
    //         if (Chat.data.owner1.id == user.id) {
    //             setOther(Chat.data.owner2);
    //         } else {
    //             setOther(Chat.data.owner1);
    //         }
    //     }
    // }, [Chat.data]);
    return (
        <div className="row justify-content-center h-100 message-center">
            <div className="col-md-12 col-xl-12 chat">
                <div className="card">
                    {Chat.loading ? (
                        <Spinner color="color-6" />
                    ) : (
                        Chat.data != undefined && (
                            <>
                                {(() => {
                                    if (Chat.data.chats.owner1.id == user.id) {
                                        other = Chat.data.chats.owner2;
                                    } else {
                                        other = Chat.data.chats.owner1;
                                    }
                                })()}

                                <div className="card-header msg_head">
                                    <div className="d-flex bd-highlight">
                                        <div className="img_cont">
                                            <img src={`/uploads/avatars/${other.avatar}`} className="rounded-circle user_img" />
                                            <span className="online_icon"></span>
                                        </div>
                                        <div className="user_info">
                                            <span>{other.name}</span>
                                            <p id={`typing${chatID}`} style={{ display: "none" }}>
                                                typing..
                                            </p>
                                        </div>
                                        <div className="video_cam">
                                            <span>
                                                <i className="fas fa-video"></i>
                                            </span>
                                            <span>
                                                <i className="fas fa-phone"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body msg_card_body" id={`chatContainer${chatID}`}>
                                    {Chat.data.chats.messages.length == 0 ? (
                                        <span className="text-center mx-auto d-flex justify-content-center color-6">You have no messages yet</span>
                                    ) : (
                                        Chat.data.chats.messages.map((msg) => {
                                            return (
                                                <div className={`d-flex justify-content-${user.id == msg.sender_id ? "end" : "start"} mb-4`}>
                                                    {user.id != msg.sender_id ? (
                                                        <>
                                                            <div className="img_cont_msg">
                                                                <img
                                                                    src={`/uploads/avatars/${msg.sender.avatar}`}
                                                                    className="rounded-circle user_img_msg"
                                                                />
                                                            </div>
                                                            <div className="msg_cotainer w-50">
                                                                {msg.content}
                                                                <span className="msg_time color-3">{moment(msg.created_at).format("LT")}</span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="msg_cotainer_send w-50">
                                                                {msg.content}
                                                                <span className="msg_time_send color-3">{moment(msg.created_at).format("LT")}</span>
                                                            </div>
                                                            <div className="img_cont_msg">
                                                                <img
                                                                    src={`/uploads/avatars/${msg.sender.avatar}`}
                                                                    className="rounded-circle user_img_msg"
                                                                />
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                    {/* <div className="d-flex justify-content-start mb-4">
                                        <div className="img_cont_msg">
                                            <img
                                                src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"
                                                className="rounded-circle user_img_msg"
                                            />
                                        </div>
                                        <div className="msg_cotainer">
                                            Hi, how are you samim?
                                            <span className="msg_time color-3">8:40 AM, Today</span>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end mb-4">
                                        <div className="msg_cotainer_send">
                                            Hi Khalid i am good tnx how about you?
                                            <span className="msg_time_send color-3">8:55 AM, Today</span>
                                        </div>
                                        <div className="img_cont_msg">
                                            <img
                                                src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"
                                                className="rounded-circle user_img_msg"
                                            />{" "}
                                        </div>
                                    </div> */}
                                </div>
                                <div className="card-footer">
                                    <div className="input-group d-flex align-items-center bg-light rounded-pill">
                                        <textarea
                                            name=""
                                            className="form-control shadow-none rounded-pill border-0 bg-transparent"
                                            rows={2}
                                            onKeyPress={(e) => {
                                                if (e.which == 13) {
                                                    handleSubmit(e);
                                                }
                                            }}
                                            onChange={(e) => {
                                                handleMessageChange(e);
                                                handeTyping(e);
                                            }}
                                            style={{ resize: "none" }}
                                            placeholder="Type your message..."
                                        ></textarea>
                                        <div className="">
                                            <span
                                                className="input-group-text btn  bg-transparent"
                                                onClick={(e) => {
                                                    handleSubmit(e);
                                                }}
                                            >
                                                <i className="fas fa-location-arrow"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
