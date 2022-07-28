import { useQuery } from "@apollo/client";
import { getMyChat } from "../scripts/Queries";
import { user } from "../../../constants";
import NotFound from "../layouts/not Found";
import Spinner from "../layouts/spinner";
import Chat from "./chat";
import { NavLink, useLocation } from "react-router-dom";
const MessagesCenter = (props) => {
    const Chats = useQuery(getMyChat, {
        variables: {
            user_id: user.id,
        },
        onCompleted(res) {
            console.log(res);
        },
        onError: (err) => {
            console.error(err.extraInfo);
            console.error(err.clientErrors);
            console.error(err.stack);
        },
    });

    return (
        <div className="row justify-content-center h-100 message-center" data-aos="fade-down" data-aos-duration="700">
            <div className="d-flex align-items-center justify-content-center mt-2 mb-4 ">
                <span className="border-1 w-100 color-1" style={{ borderBottom: "2px solid red" }}></span>
                <span className="mx-2 text-muted">Messages</span>
                <span className="border-1 w-100" style={{ border: "1px solid #eee" }}></span>
            </div>
            <div className="col-md-12 col-xl-12 chat">
                <div className="card mb-sm-3 mb-md-0 contacts_card">
                    {Chats.loading ? (
                        <Spinner color="color-6" />
                    ) : Chats.data == undefined ? (
                        <>
                            {Chats.error.message}
                            {console.log(Chats.error.stack)}
                        </>
                    ) : Chats.data.getMyChats.length == 0 ? (
                        <NotFound text="You have no chats yet" />
                    ) : (
                        <>
                            <div className="card-header">
                                <div className="input-group d-flex align-items-center rounded-pill bg-color-2 shadow-sm ">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        name=""
                                        className="form-control search bg-transparent border-0 rounded-pill"
                                    />
                                    <div className="">
                                        <span className="input-group-text rounded-pill bg-transparent btn search_btn">
                                            <i className="fas fa-search"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body contacts_body">
                                <ui className="contacts">
                                    {Chats.data.getMyChats.map((chat) => {
                                        let name = chat.user1 == user.id ? chat.owner2.name : chat.owner1.name;
                                        let avatar = chat.user1 == user.id ? chat.owner2.avatar : chat.owner1.avatar;
                                        let id = chat.user1 == user.id ? chat.user2 : chat.user1;
                                        return (
                                            <li className="">
                                                <div className="d-flex bd-highlight">
                                                    <div className="img_cont">
                                                        <img src={`/uploads/avatars/${avatar}`} className="rounded-circle user_img" />
                                                        <span className="online_icon"></span>
                                                    </div>

                                                    <div className="user_info">
                                                        <NavLink
                                                            to={`/messages/${chat.id}`}
                                                            className="img_cont p-0 m-0 mx-0 my-0"
                                                            style={{ padding: "0px", margin: "0px" }}
                                                        >
                                                            <span style={{ textTransform: "capitalize" }}>{name}</span>
                                                        </NavLink>

                                                        <p>Kalid is online</p>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ui>
                            </div>
                        </>
                    )}
                    <div className="card-footer"></div>
                </div>
            </div>
        </div>
    );
};

export default MessagesCenter;
