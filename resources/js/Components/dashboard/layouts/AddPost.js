import { useMutation, gql } from "@apollo/react-hooks";
import { AUTH_USER } from "../../../constants";
import { useState } from "react";
import $ from "jquery";

const AddPost = (props) => {
    const user = JSON.parse(JSON.parse(localStorage.getItem(AUTH_USER)));
    const Add_Post = gql`
        mutation AddPost($content: String!, $user_id: ID!, $type: Int) {
            createPost(content: $content, user_id: $user_id, type: $type) {
                id
            }
        }
    `;
    $("#form143").css("border", "none");
    let type = 1;
    if (user.type == 2) {
        type = 2;
    }
    const [content, setContent] = useState("");
    const [add_post, data] = useMutation(Add_Post, {
        onCompleted: () => {
            document.getElementById("form143").value = "";
        },
    });
    function handleChange(e) {
        setContent(e.target.value);
    }
    function AddPost(e) {
        if ($("#form143").val() != "") {
            $("#form143").css("border", "none");

            add_post({
                variables: {
                    content: content,
                    user_id: user.id,
                    type: type,
                },
                refetchQueries: [{ query: props.query }],
            });
        } else {
            document.getElementById("form143").style.border = "1px solid red";
            $("#form143").css("border", "1px solid red");
        }
    }
    return (
        <>
            <div className="card mx-auto" style={{ maxWidth: "42rem" }}>
                <div className="" style={{ boxShadow: "none !important" }}>
                    <div className="card-body border-bottom pb-2">
                        <div className="d-flex">
                            <img
                                src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img (31).webp"
                                className="rounded-circle"
                                height="50"
                                alt="Avatar"
                                loading="lazy"
                            />
                            <div className="d-flex align-items-center w-100 ps-3">
                                <div className="w-100">
                                    <textarea
                                        type="text"
                                        id="form143"
                                        className="form-control form-status py-1 px-0"
                                        placeholder={props.holder}
                                        onChange={(e) => {
                                            handleChange(e);
                                        }}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between">
                            <ul
                                className="list-unstyled d-flex flex-row ps-3 pt-3"
                                style={{ marginLeft: "50px" }}
                                id="postopt"
                            >
                                <li>
                                    <a href="">
                                        <i className="far fa-image pe-2"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        <i className="fas fa-photo-video px-2"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        <i className="fas fa-chart-bar px-2"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        <i className="far fa-smile px-2"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        <i className="far fa-calendar-check px-2"></i>
                                    </a>
                                </li>
                            </ul>
                            <div className="d-flex align-items-center">
                                <button
                                    type="button"
                                    className="btn bg-orange text-light btn-rounded"
                                    onClick={(e) => AddPost(e)}
                                >
                                    {data.loading ? (
                                        <>
                                            {" "}
                                            <div
                                                class="spinner-border spinner-border-sm text-success fade show"
                                                role="status"
                                            >
                                                <span class="visually-hidden">
                                                    Loading...
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <>Post</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default AddPost;
