import moment from "moment";
import { useEffect, useState } from "react";
import { useQuery, useLazyQuery, useMutation, gql } from "@apollo/react-hooks";
import { AUTH_USER } from "../../../constants";
import $ from "jquery";
import Photo1 from "../../../assets/img/photos/testimonials-5.jpg";

const Post = (props) => {
    const user = JSON.parse(JSON.parse(localStorage.getItem(AUTH_USER)));
    //etat de likes
    const [liked, setLiked] = useState(false);
    //etat de contenu de commentaire
    const [applies, setApplied] = useState(false);
    const [commentContent, setCommentContent] = useState("");
    //check if current user liked the post
    const CheckLikes = gql`
        query {
            checkLikes(post_id:${props.details.id}, user_id: ${user.id}) {
                user_id
            }
        }
    `;
    //add comment on post
    const AddComment = gql`
        mutation Comm($content: String!, $user_id: ID!, $post_id: ID!) {
            add_comment(
                content: $content
                user_id: $user_id
                post_id: $post_id
            ) {
                id
            }
        }
    `;

    const [add_comment, CmntLoad] = useMutation(AddComment);

    //like or dislike a post
    const Like = gql`
        mutation AddLike($post_id: ID!, $user_id: ID!) {
            addLike(post_id: $post_id, user_id: $user_id)
        }
    `;
    const [add_like, load] = useMutation(Like, {
        onCompleted: (data) => {
            if (data.addLike == "Like") {
                setLiked(true);
            } else {
                setLiked(false);
            }
        },
    });
    if (load.loading) {
        $("#likeButton").attr("disabled", true);
    } else {
        $("#likeButton").attr("disabled", false);
    }

    const RsltCheck = useQuery(CheckLikes, {
        onCompleted: (data) => {},
        fetchPolicy: "cache-and-network",
    });
    window.addEventListener("load", () => {
        if (RsltCheck.error) {
            console.log(RsltCheck.error);
        }
    });

    const AddApply = gql`
        mutation AddApply($user_id: ID!, $post_id: ID!, $CompanyID: ID!) {
            MutationApply(
                user_id: $user_id
                post_id: $post_id
                CompanyID: $CompanyID
            )
        }
    `;
    const [add_apply, RsltApply] = useMutation(AddApply, {
        onCompleted: (data) => {
            if (data.MutationApply == "Apply") {
                setApplied(true);
            } else {
                setApplied(false);
            }
        },
        onError: (err) => {
            console.log(err.graphQLErrors);
        },
    });

    function like(e) {
        e.preventDefault();
        add_like({
            variables: {
                user_id: user.id,
                post_id: props.details.id,
            },
            // update: (cache, { data: add_like }) => {
            //     console.log(cache);
            //     cache.writeQuery()
            // },

            refetchQueries: [
                {
                    query: props.query,
                    variables: { user_id: user.id, type: props.typeNo },
                },
            ],
        });
    }

    function handleKeyUp(e) {
        setCommentContent(e.target.value);
        if (e.which == 13) {
            add_comment({
                variables: {
                    content: commentContent,
                    user_id: user.id,
                    post_id: props.details.id,
                },
                refetchQueries: [
                    {
                        query: props.query,
                        variables: { user_id: user.id, type: props.typeNo },
                    },
                ],
            });
            $(`#CommentInput${props.details.id}`).val("");
        }
    }
    function FocusComment(e) {
        $(`#CommentInput${props.details.id}`).focus();
    }
    function Apply(e) {
        add_apply({
            variables: {
                user_id: user.id,
                post_id: props.details.id,
                CompanyID: props.details.author.id,
            },
        });
    }
    useEffect(() => {
        if (RsltCheck.data != undefined) {
            if (RsltCheck.data.checkLikes != null) {
                setLiked(true);
            }
        }
    }, [RsltCheck.loading]);
    $(`#showComment${props.details.id}`).on("click", (e) => {});
    function ShowComment(e) {
        if ($(`#commentSection${props.details.id}`).is(":visible")) {
            console.log("hide");
            $(`#commentSection${props.details.id}`).fadeOut();
        } else {
            console.log("show");
            $(`#commentSection${props.details.id}`).fadeIn();
        }
    }

    return (
        <div
            className="col-lg-10 col-sm-12 mx-auto card rounded border-0 shadow p-0 mb-3"
            data-aos="fade-up"
            data-aos-duration="700"
        >
            <div className="data d-flex flex-row align-items -center justify-content-start p-3">
                <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img (31).webp"
                    width="50"
                    className="rounded"
                    alt=""
                />

                <span className="mx-2">
                    <small className="fw-bold color-3">abs</small>
                    <br />
                    <small className="text-muted" style={{ fontSize: "12px" }}>
                        10h ago
                    </small>
                </span>
            </div>
            <div className="content mt-2 mb-2 px-2 mb-2">
                <h6 className="title  mb-2 fs-5 color-3 fw-bold">
                    Back-End Developer
                </h6>
                <div className=" row location fw-light   mb-3 mt-1  justify-content-left">
                    <div className="col-md-3 color-3 ">
                        <i className="fal fa-map-marker-alt "></i> Sousse , TN
                    </div>
                    <div className="col-md-3 color-3 ">
                        <i class="fal fa-suitcase"></i> Full time
                    </div>
                    <div className="col-md-3 color-3">
                        <i class="fal fa-envelope-open-dollar"></i>15k/month
                    </div>
                </div>

                <span className="post text-muted">
                    Pour renforcer son Département Communication et Marketing,
                    Tunisie didact cherche un (e) : « Stagiaire Graphic designer
                    & Community manager»
                    <br />
                </span>
                <br />
                <div
                    className="accordion accordion-flush"
                    id={`req${props.details.id}`}
                >
                    <div className="accordion-item ">
                        <h2
                            className="accordion-header"
                            id={`requirements${props.details.id + 1}`}
                        >
                            <button
                                className="accordion-button collapsed  rounded-pill color-1 fw-bold shadow-sm border-1"
                                type="button"
                                style={{
                                    background: "transparent",
                                    border: "1px solid #eee",
                                }}
                                data-bs-toggle="collapse"
                                data-bs-target={`#requirement${props.details.id}`}
                                aria-expanded="true"
                                aria-controls={`requirement${props.details.id}`}
                            >
                                <i class="fal fa-clipboard-list-check"></i>
                                &nbsp; Requirements
                            </button>
                        </h2>
                        <div
                            id={`requirement${props.details.id}`}
                            className="accordion-collapse collapse"
                            aria-labelledby="headingOne"
                            data-bs-parent={`#req${props.details.id}`}
                        >
                            <div className="accordion-body">
                                <ul className="list-bullets">
                                    <li className="mb-2">
                                        Lorem ipsum dolor sit amet.
                                    </li>
                                    <li className="mb-2">
                                        Consectetur adipisicing elit.
                                    </li>
                                    <li className="mb-2">
                                        Sed do eiusmod tempor incididunt.
                                    </li>
                                    <li className="mb-2">
                                        Ut labore et dolore magna aliqua.
                                    </li>
                                    <li className="mb-2">
                                        Exercitation ullamco laboris nisi.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="accordion accordion-flush mt-2"
                    id={`skl${props.details.id}`}
                >
                    <div className="accordion-item">
                        <h2
                            className="accordion-header"
                            id={`skils${props.details.id}`}
                        >
                            <button
                                className="accordion-button collapsed  fw-bold rounded-pill color-1 shadow-sm"
                                type="button"
                                data-bs-toggle="collapse"
                                style={{
                                    background: "transparent",
                                    border: "1px solid #eee",
                                }}
                                data-bs-target={`#skills${props.details.id}`}
                                aria-expanded="true"
                                aria-controls={`skills${props.details.id}`}
                            >
                                <i class="fal fa-stars"></i> &nbsp;Skills needed
                            </button>
                        </h2>
                        <div
                            id={`skills${props.details.id}`}
                            className="accordion-collapse collapse"
                            aria-labelledby="headingOne"
                            data-bs-parent={`#req${props.details.id}`}
                        >
                            <div className="accordion-body">
                                <ul className="list-bullets">
                                    <li className="mb-2">
                                        Lorem ipsum dolor sit amet.
                                    </li>
                                    <li className="mb-2">
                                        Consectetur adipisicing elit.
                                    </li>
                                    <li className="mb-2">
                                        Sed do eiusmod tempor incididunt.
                                    </li>
                                    <li className="mb-2">
                                        Ut labore et dolore magna aliqua.
                                    </li>
                                    <li className="mb-2">
                                        Exercitation ullamco laboris nisi.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="d-flex flex-row align-items-center flex-wrap"
                id="postImg"
            ></div>
            <div
                className="likes border-1 p-2 d-flex align-items-center justify-content-between fw-light"
                style={{ borderTop: "1px solid #eee" }}
            >
                <div className="col text-">
                    <i className="fal fa-user-check"></i> 3.5k
                </div>
                <div
                    className="col align-self-end text-right"
                    style={{ textAlign: "right" }}
                >
                    <a
                        onClick={(e) => {
                            ShowComment(e);
                        }}
                    >
                        55 Comments
                    </a>
                </div>
            </div>

            <div
                className="likes border-1 p-2 d-flex align-items-center justify-content-between text-center"
                style={{ borderTop: "1px solid #eee" }}
            >
                <div className="col">
                    <button
                        className="btn text-muted"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Tooltip on top"
                    >
                        <i className="fal fa-calendar-plus"></i> Apply
                    </button>
                </div>
                <div className="col">
                    <button
                        className="btn text-muted align-self-end"
                        onClick={(e) => {
                            ShowComment(e);
                        }}
                    >
                        <i className="fal fa-comments-alt fs-5"></i>&nbsp;
                        Comments
                    </button>
                </div>
            </div>
            <div
                className="comments p-2"
                style={{ display: "none" }}
                id={`commentSection${props.details.id}`}
                data-aos="fade-left"
                data-aos-duration="1000"
            >
                <div className="card rounded shadow-sm border-1 mb-2">
                    <div className="card-body">
                        <div className="d-flex flex-row align-items-center justify-content-center">
                            <div className="avatar d-none d-lg-block">
                                <img
                                    src={Photo1}
                                    width="35"
                                    className="rounded-circle shadow-sm m-1"
                                    alt=""
                                />
                            </div>
                            <textarea
                                name=""
                                className="form-control border-0 shadow-none text-muted"
                                placeholder="Leave a comment"
                                style={{ resize: "none" }}
                                id="commentInput"
                                rows="1"
                            ></textarea>
                            <div className="menu d-flex align-items-center justify-content-evenly w-25 my-auto">
                                <i className="fas fa-photo-video color-1"></i>
                            </div>
                            <button className="btn color-3 fs-5 rounded">
                                <i className="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-column">
                    <div className="card border-0">
                        <div className="card-body p-0 m-2">
                            <div className="d-flex flex-row align-items-start justify-content-start w-100">
                                <div className="avatar d-flex flex-column">
                                    <img
                                        src={Photo1}
                                        width="45"
                                        className="rounded-circle shadow-sm m-1"
                                        alt=""
                                    />
                                    <small
                                        className="color-3 text-right"
                                        style={{
                                            fontSize: "11px",
                                            textAlign: "center",
                                        }}
                                    >
                                        1 day
                                    </small>
                                </div>
                                <div className="mx-2 border-0 w-75">
                                    <span
                                        name=""
                                        className="text-muted p-2 shadow-sm d-flex flex-column justify-content-start"
                                        style={{
                                            fontSize: "13px",
                                            borderRadius: "15px",
                                            border: "2px solid #eee",
                                        }}
                                        id=""
                                    >
                                        <span
                                            className="color-3 fw-bold d-flex justify-content-between mb-1"
                                            style={{
                                                fontSize: "13px",
                                            }}
                                        >
                                            Welid wg
                                        </span>
                                        Nice work
                                        <br />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Post;
