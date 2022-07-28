import moment from "moment";
import { useEffect, useState } from "react";
import { useQuery, useLazyQuery, useMutation, gql } from "@apollo/react-hooks";
import { AUTH_USER } from "../../../constants";
import $ from "jquery";
import Photo1 from "../../../assets/img/photos/testimonials-5.jpg";
import { NavLink, useLocation } from "react-router-dom";
import Spinner from "./spinner";
import alertify from "alertifyjs";
import toastr from "toastr";
import { AddNotif } from "../scripts/Mutations";
import Modals from "../../../layouts/modals";
import Forms from "../../../layouts/Forms";
import { user } from "../../../constants";
import { UpdateRequirement, AddReqs, DeleteReqs, AddPostSkill, UpdateSkill, DeleteSkill } from "../scripts/Mutations";
import NotFound from "./not Found";
const Post = (props) => {
    //etat de likes
    const [liked, setLiked] = useState(false);
    //etat de contenu de commentaire
    const [applies, setApplied] = useState(false);
    const [commentContent, setCommentContent] = useState("");
    //check if current user liked the post

    //add comment on post
    const AddComment = gql`
        mutation Comm($content: String!, $user_id: ID!, $post_id: ID!) {
            add_comment(content: $content, user_id: $user_id, post_id: $post_id) {
                id
                commentor {
                    name
                }
            }
        }
    `;

    const [add_comment, RsltCmnt] = useMutation(AddComment, {
        onCompleted: (res) => {
            add_notif({
                variables: {
                    user_id: props.details.posts.company.id,
                    to: null,
                    title: "New Comment",
                    content: `${res.add_comment.commentor.name} have commented your post : ${props.details.posts.title}`,
                    from: res.add_comment.commentor.name,
                },
            });
        },
    });

    //like or dislike a post
    const CheckApplies = gql`
        query {
            checkApplies(post_id:${props.details.posts.id}, user_id: ${user.id}) {
                user_id
            }
        }
    `;

    const RsltCheck = useQuery(CheckApplies, {
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
            MutationApply(user_id: $user_id, post_id: $post_id, CompanyID: $CompanyID)
        }
    `;

    const [add_notif, RsltNotif] = useMutation(AddNotif, {
        onCompleted: (res) => {
            console.log("done");
        },
        onError: (err) => {
            console.log(err);
        },
    });
    const [add_apply, RsltApply] = useMutation(AddApply, {
        onCompleted: (data) => {
            if (data.MutationApply == "Apply") {
                setApplied(true);
                add_notif({
                    variables: {
                        user_id: props.details.posts.company.id,
                        to: null,
                        title: "New Application",
                        content: `${user.name} have applied to your job offer ${props.details.posts.title}`,
                        from: user.id,
                    },
                });
                // notify({

                // });
            } else {
                setApplied(false);
            }
            $("#container").val("");
        },
        onError: (err) => {
            console.log(err.graphQLErrors);
        },
    });

    const ClosePostMutation = gql`
        mutation ClosePost($id: ID!, $statut: Int) {
            closePost(id: $id, statut: $statut) {
                title
            }
        }
    `;

    // const [is_closed, setIsClosed] = useState(false);

    // if (props.details.posts.statut == 2) setIsClosed(true);

    const [close_post, RsltClose] = useMutation(ClosePostMutation, {
        onError: (err) => {
            toastr.error("Something went wrong ! ");
            console.log(err.graphQLErrors);
        },
        onCompleted: (res) => {
            toastr.info("Done !");
        },
    });
    function ClosePost(e, statut) {
        let msg = "";
        statut == 1 ? (msg = "Open") : (msg = "Close");
        alertify.confirm(
            "Confirmation",
            `Are you sure that you want to ${msg} this post ?`,
            () => {
                close_post({
                    variables: {
                        id: props.details.posts.id,
                        statut: statut,
                    },
                });
            },
            () => {}
        );
    }

    function handleKeyUp(e) {
        setCommentContent(e.target.value);
        if (e.which == 13) {
            add_comment({
                variables: {
                    content: commentContent,
                    user_id: user.id,
                    post_id: props.details.posts.id,
                },
                refetchQueries: [
                    {
                        query: props.query,
                    },
                ],
            });
            $(`#commentInput${props.details.posts.id}`).val("");
        }
    }
    const Delete = gql`
        mutation Delete($id: ID!) {
            deletePost(id: $id) {
                title
            }
        }
    `;
    const [delete_post, RstlDelete] = useMutation(Delete, {
        onError: (err) => {
            toastr.error("Something went wrong !");
            console.log(err.graphQLErrors);
        },
        onCompleted: (res) => {
            toastr.info("Post Deleted");
        },
    });
    function HandlePostDelete(e) {
        alertify.confirm(
            "Confirmation",
            "Are you sure that you want to delete this post ?",
            () => {
                delete_post({
                    variables: {
                        id: props.details.posts.id,
                    },
                    refetchQueries: [{ query: props.query }],
                });
            },
            () => {
                toastr.info("canceled");
            }
        );
    }
    function FocusComment(e) {
        $(`#commentInput${props.details.posts.id}`).focus();
    }
    function HandleApply(e) {
        add_apply({
            variables: {
                user_id: user.id,
                post_id: props.details.posts.id,
                CompanyID: props.details.posts.company.id,
            },
            refetchQueries: [{ query: props.query }],
        });
    }
    useEffect(() => {
        if (RsltCheck.data != undefined) {
            if (RsltCheck.data.checkApplies != null) {
                setApplied(true);
            }
        }
    }, [RsltCheck.loading]);
    $(`#showComment${props.details.posts.id}`).on("click", (e) => {});
    function ShowComment(e) {
        if ($(`#commentSection${props.details.posts.id}`).is(":visible")) {
            $(`#commentSection${props.details.posts.id}`).fadeOut();
        } else {
            $(`#commentSection${props.details.posts.id}`).fadeIn();
        }
    }
    const [update_requirement, RsltupdateReq] = useMutation(UpdateRequirement, {
        onError: (err) => {
            console.log(err);
            toastr.error("something wrong happed");
        },
        onCompleted: (res) => {
            toastr.info("Updated");
        },
    });
    const [update_skills, RsltupdateSkill] = useMutation(UpdateSkill, {
        onError: (err) => {
            console.log(err);
            toastr.error("something wrong happed");
        },
        onCompleted: (res) => {
            toastr.info("Updated");
        },
    });

    function UpdateReq(id, label) {
        update_requirement({
            variables: {
                id: id,
                label: label,
            },
        });
    }
    function UpdateSkills(id, label) {
        update_skills({
            variables: {
                id: id,
                label: label,
            },
        });
    }
    const [add_reqs, RsltAddReqs] = useMutation(AddReqs, {
        onError(err) {
            err.graphQLErrors.map((item) => {
                console.log(item);
            });
            toastr.error("Error while adding the requirements");
        },
        onCompleted(data) {
            console.log("requirement added");
            toastr.success("Successfully added");
            // $("#signForm").trigger("reset");
        },
    });
    const [add_skills, RsltAddskills] = useMutation(AddPostSkill, {
        onError(err) {
            err.graphQLErrors.map((item) => {
                console.log(item);
            });
            toastr.error("Error while adding the skills");
        },
        onCompleted(data) {
            console.log("skill added");
            toastr.success("Successfully added");
            // $("#signForm").trigger("reset");
        },
    });
    const [delete_req, RsltDeleteReq] = useMutation(DeleteReqs, {
        onError(err) {
            err.graphQLErrors.map((item) => {
                console.log(item);
            });
            toastr.error("Error while deleting the requirements");
        },
        onCompleted(data) {
            toastr.info("Successfully deleted");
            // $("#signForm").trigger("reset");
        },
    });
    const [delete_skill, RsltDeleteskill] = useMutation(DeleteSkill, {
        onError(err) {
            err.graphQLErrors.map((item) => {
                console.log(item);
            });
            toastr.error("Error while deleting the requirements");
        },
        onCompleted(data) {
            toastr.info("Successfully deleted");
            // $("#signForm").trigger("reset");
        },
    });
    function AddReq(post_id) {
        let labels = [];

        alertify.prompt(
            "Add requirement",
            "add below your requirement : ",
            "",
            (ev, val) => {
                if (val == "") {
                    toastr.error("Please add ");
                } else {
                    labels = val.split(",");
                    labels.forEach((label) => {
                        add_reqs({
                            variables: {
                                post_id: post_id,
                                label: label,
                            },
                        });
                    });
                }
            },
            () => {}
        );
    }

    function AddSkills(post_id) {
        let labels = [];

        alertify.prompt(
            "Add skill",
            "add below the skill (for more than 1 seperate them with a ',') ",
            "",
            (ev, val) => {
                if (val == "") {
                    toastr.error("Please add a valid value");
                } else {
                    labels = val.split(",");
                    labels.forEach((label) => {
                        add_skills({
                            variables: {
                                post_id: post_id,
                                label: label,
                            },
                        });
                    });
                }
            },
            () => {}
        );
    }
    function DeleteReq(id) {
        delete_req({
            variables: {
                id: id,
            },
        });
    }
    function DeleteSkilll(id) {
        delete_skill({
            variables: {
                id: id,
            },
        });
    }
    return (
        <div key={props.details.posts.id}>
            <Modals modalID={`editPostModal${props.details.posts.id}`} size="modal-lg">
                <section className="">
                    <div className="container-fluid py-3  h-100">
                        <div className="row d-flex  align-items-center justify-content-center h-100">
                            {/* <div className="col-md-6 col-sm-12 text-center">
                                <img
                                    src={editPng}
                                    className="img-fluid"
                                    alt="Phone image"
                                    width={"200"}
                                />
                            </div> */}
                            <div className="col-md-12  col-sm-12 mx-auto text-center ">
                                {/* <img
                                    src={editPng}
                                    className="img-fluid"
                                    alt="Phone image"
                                    width={"200"}
                                /> */}
                                <h5 className="text-center color-3 mb-3 fs-4 ">
                                    Edit job offer <i className="fas fa-cogs"></i>
                                </h5>
                                <Forms formAct="editOffer" post={props.details.posts} />
                            </div>
                        </div>
                    </div>
                </section>
            </Modals>
            <Modals modalID={`appListModal${props.details.posts.id}`} size="">
                <section className="">
                    <div className="container-fluid py-3  h-100">
                        <div className="row d-flex  align-items-center justify-content-center h-100">
                            {/* <div className="col-md-6 col-sm-12 text-center">
                                <img
                                    src={editPng}
                                    className="img-fluid"
                                    alt="Phone image"
                                    width={"200"}
                                />
                            </div> */}
                            <div className="col-md-12  col-sm-12 mx-auto text-center ">
                                {/* <img
                                    src={editPng}
                                    className="img-fluid"
                                    alt="Phone image"
                                    width={"200"}
                                /> */}
                                <h5 className="text-center color-3 mb-3 fs-4 ">
                                    Applicants {/* Applicants for {props.details.posts.title} &nbsp; <i className="fas fa-users"></i> */}
                                </h5>
                                <div className="row align-items-center w-100">
                                    {props.details.posts.applications.length == 0 ? (
                                        <NotFound text="there is no apllicants yet" />
                                    ) : (
                                        props.details.posts.applications.map((app) => {
                                            return (
                                                <div className="col-lg-12 col-md-12 mb-2  " key={app.applicants.id}>
                                                    <div class="card rounded">
                                                        <div class="card-body d-flex  justify-content-center">
                                                            <div className="col-2">
                                                                <img
                                                                    className="rounded img-fluid"
                                                                    width={"55px"}
                                                                    src={`/uploads/avatars/${app.applicants.avatar}`}
                                                                />
                                                            </div>
                                                            <div className=" col-10 d-flex flex-column align-items-center">
                                                                <a href={`/profile/${app.applicants.id}`}>
                                                                    <span className=" mx-3 ">{app.applicants.name}</span>
                                                                </a>
                                                                <small>
                                                                    <i className="fal fa-clock"></i>
                                                                    &nbsp;
                                                                    {moment(app.created_at).fromNow()}
                                                                </small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Modals>
            <div
                className="col-lg-10 col-sm-12 mx-auto card rounded border-0 shadow p-0 mb-3"
                // data-aos="fade-up"
                // data-aos-duration="700"
                key={props.details.posts.id}
                id={`post${props.details.posts.id}`}
            >
                <div className="data d-flex flex-row align-items -center justify-content-start p-3">
                    <img src={`/uploads/avatars/${props.details.posts.company.avatar}`} width="50" className="rounded" alt="" />

                    <span className="mx-2">
                        <small className="fw-bold color-3">
                            <NavLink to={`/profile/${props.details.posts.company.id}`} className={"color-3"}>
                                {props.details.posts.company.name}{" "}
                            </NavLink>
                            {props.details.posts.user_id == user.id && (
                                <>
                                    (You)&nbsp;
                                    <a
                                        className="color-6"
                                        href="#!"
                                        data-bs-toggle="modal"
                                        data-bs-target={`#editPostModal${props.details.posts.id}`}
                                    >
                                        <i className="fas fa-pen"></i>
                                    </a>
                                </>
                            )}{" "}
                            {props.details.posts.statut == 2 && (
                                <>
                                    <span className="text-danger">
                                        <i className="fal fa-lock"></i> Closed
                                    </span>
                                </>
                            )}
                        </small>
                        <br />
                        <small className="text-muted" style={{ fontSize: "12px" }}>
                            {moment(props.details.posts.created_at).fromNow()}
                        </small>
                    </span>
                </div>
                <div className="content mt-2 mb-2 px-2 mb-2">
                    <h6 className="title  mb-2 fs-5 color-3 fw-bold">{props.details.posts.title}</h6>
                    <div className=" row location fw-light   mb-3 mt-1  justify-content-left">
                        <div className="col-md-3 color-3 ">
                            <i className="fal fa-map-marker-alt "></i> {props.details.posts.company.city}
                        </div>
                        <div className="col-md-3 color-3 ">
                            <i className="fal fa-suitcase"></i>&nbsp;
                            {props.details.posts.type}
                        </div>
                        <div className="col-md-3 color-3">
                            <i className="fal fa-envelope-open-dollar"></i>&nbsp;
                            {props.details.posts.type == "Internship"
                                ? "Unpaid"
                                : props.details.posts.salary == 0
                                ? "N/A"
                                : props.details.posts.salary + " DT/month"}
                        </div>
                        <div className="col-md-3 color-3 ">
                            <i className="fal fa-users"></i>&nbsp; Places: {props.details.posts.places}
                        </div>
                    </div>

                    <span className="post text-muted">
                        {props.details.posts.description}
                        <br />
                    </span>
                    <br />
                    <div className="accordion accordion-flush" id={`req${props.details.posts.id}`}>
                        <div className="accordion-item ">
                            <h2 className="accordion-header" id={`requirements${props.details.posts.id + 1}`}>
                                <button
                                    className="accordion-button collapsed  rounded-pill color-6 shadow-sm border-1"
                                    type="button"
                                    style={{
                                        background: "transparent",
                                        border: "1px solid #eee",
                                    }}
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#requirement${props.details.posts.id}`}
                                    aria-expanded="true"
                                    aria-controls={`requirement${props.details.posts.id}`}
                                >
                                    <i className="fal fa-clipboard-list-check"></i>
                                    &nbsp; Requirements
                                </button>
                            </h2>
                            <div
                                id={`requirement${props.details.posts.id}`}
                                className="accordion-collapse collapse"
                                aria-labelledby="headingOne"
                                data-bs-parent={`#req${props.details.posts.id}`}
                            >
                                <div className="accordion-body">
                                    {props.details.posts.company.id == user.id && (
                                        <button
                                            className="btn mb-3 color-6 float-end "
                                            onClick={() => {
                                                AddReq(props.details.posts.id);
                                            }}
                                        >
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    )}

                                    <ul className="list-bullets">
                                        {props.details.posts.requirements.length == 0
                                            ? "There is no requirements for this post"
                                            : props.details.posts.requirements.map((req) => {
                                                  return (
                                                      <li className="mb-2 d-flex align-items-center justify-content-start" key={req.id}>
                                                          <input
                                                              type={"text"}
                                                              className="form-control w-75 border-0 bg-white shadow-none"
                                                              defaultValue={req.label}
                                                              id={`req${req.id}`}
                                                              disabled={true}
                                                              onKeyPress={(e) => {
                                                                  if (props.details.posts.company.id)
                                                                      if (e.which == 13) {
                                                                          if ($(`#req${req.id}`).val() == "") {
                                                                              toastr.error("please don't leave the field empty");
                                                                          } else {
                                                                              UpdateReq(req.id, $(`#req${req.id}`).val());
                                                                              $(`#req${req.id}`).attr("disabled", true);
                                                                              $(`#savereq${req.id}`).fadeOut();
                                                                              $(`#editreq${req.id}`).fadeIn();
                                                                          }
                                                                      }
                                                              }}
                                                          />
                                                          {props.details.posts.company.id == user.id && (
                                                              <>
                                                                  <a
                                                                      className="color-6"
                                                                      id={`editreq${req.id}`}
                                                                      onClick={() => {
                                                                          $(`#req${req.id}`).attr("disabled", false);
                                                                          $(`#req${req.id}`).focus();
                                                                          $(`#savereq${req.id}`).fadeIn();
                                                                          $(`#editreq${req.id}`).fadeOut();
                                                                      }}
                                                                  >
                                                                      <i className="fas fa-edit"></i>
                                                                  </a>
                                                                  <a
                                                                      className="color-1"
                                                                      id={`savereq${req.id}`}
                                                                      style={{ display: "none" }}
                                                                      onClick={() => {
                                                                          if ($(`#req${req.id}`).val() == "") {
                                                                              toastr.error("please don't leave the field empty");
                                                                          } else {
                                                                              UpdateReq(req.id, $(`#req${req.id}`).val());
                                                                              $(`#req${req.id}`).attr("disabled", true);
                                                                              $(`#savereq${req.id}`).fadeOut();
                                                                              $(`#editreq${req.id}`).fadeIn();
                                                                          }
                                                                      }}
                                                                  >
                                                                      <i className="fas fa-save"></i>
                                                                  </a>
                                                                  <a
                                                                      className="text-danger"
                                                                      id={`deleteReq${req.id}`}
                                                                      onClick={() => {
                                                                          DeleteReq(req.id);
                                                                      }}
                                                                  >
                                                                      <i className="fas fa-trash"></i>
                                                                  </a>
                                                              </>
                                                          )}
                                                      </li>
                                                  );
                                              })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion accordion-flush mt-2" id={`skl${props.details.posts.id}`}>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id={`skils${props.details.posts.id}`}>
                                <button
                                    className="accordion-button collapsed  rounded-pill color-6 shadow-sm"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    style={{
                                        background: "transparent",
                                        border: "1px solid #eee",
                                    }}
                                    data-bs-target={`#skills${props.details.posts.id}`}
                                    aria-expanded="true"
                                    aria-controls={`skills${props.details.posts.id}`}
                                >
                                    <i className="fal fa-stars"></i> &nbsp;Skills needed
                                </button>
                            </h2>
                            <div
                                id={`skills${props.details.posts.id}`}
                                className="accordion-collapse collapse"
                                aria-labelledby="headingOne"
                                data-bs-parent={`#req${props.details.posts.id}`}
                            >
                                <div className="accordion-body">
                                    {props.details.posts.company.id == user.id && (
                                        <button
                                            className="btn mb-3 float-end color-6 text-white"
                                            onClick={() => {
                                                AddSkills(props.details.posts.id);
                                            }}
                                        >
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    )}
                                    <ul className="list-bullets">
                                        {props.details.posts.skills.length == 0
                                            ? "There is no skills needed for this post"
                                            : props.details.posts.skills.map((skills) => {
                                                  return (
                                                      <li className="mb-2 mb-2 d-flex align-items-center justify-content-start" key={skills.id}>
                                                          <input
                                                              type={"text"}
                                                              className="form-control w-75 border-0 bg-white shadow-none"
                                                              defaultValue={skills.label}
                                                              id={`skill${skills.id}`}
                                                              disabled={true}
                                                              onKeyPress={(e) => {
                                                                  if (props.details.posts.company.id)
                                                                      if (e.which == 13) {
                                                                          if ($(`#skill${skills.id}`).val() == "") {
                                                                              toastr.error("please don't leave the field empty");
                                                                          } else {
                                                                              UpdateSkills(skills.id, $(`#skill${skills.id}`).val());
                                                                              $(`#skill${skills.id}`).attr("disabled", true);
                                                                              $(`#saveskill${skills.id}`).fadeOut();
                                                                              $(`#editskill${skills.id}`).fadeIn();
                                                                          }
                                                                      }
                                                              }}
                                                          />
                                                          {props.details.posts.company.id == user.id && (
                                                              <>
                                                                  <a
                                                                      className="color-6"
                                                                      id={`editskill${skills.id}`}
                                                                      onClick={() => {
                                                                          $(`#skill${skills.id}`).attr("disabled", false);
                                                                          $(`#skill${skills.id}`).focus();
                                                                          $(`#saveskill${skills.id}`).fadeIn();
                                                                          $(`#editskill${skills.id}`).fadeOut();
                                                                      }}
                                                                  >
                                                                      <i className="fas fa-edit"></i>
                                                                  </a>
                                                                  <a
                                                                      className="color-1"
                                                                      id={`saveskill${skills.id}`}
                                                                      style={{ display: "none" }}
                                                                      onClick={() => {
                                                                          if ($(`#req${skills.id}`).val() == "") {
                                                                              toastr.error("please don't leave the field empty");
                                                                          } else {
                                                                              UpdateSkill(skills.id, $(`#skill${skills.id}`).val());
                                                                              $(`#skill${skills.id}`).attr("disabled", true);
                                                                              $(`#saveskill${skills.id}`).fadeOut();
                                                                              $(`#editskill${skills.id}`).fadeIn();
                                                                          }
                                                                      }}
                                                                  >
                                                                      <i className="fas fa-save"></i>
                                                                  </a>
                                                                  <a
                                                                      className="text-danger"
                                                                      id={`deleteSkill${skills.id}`}
                                                                      onClick={() => {
                                                                          DeleteSkilll(skills.id);
                                                                      }}
                                                                  >
                                                                      <i className="fas fa-trash"></i>
                                                                  </a>
                                                              </>
                                                          )}
                                                      </li>
                                                  );
                                              })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-row align-items-center flex-wrap" id="postImg"></div>
                <div
                    className="likes border-1 p-2 d-flex align-items-center justify-content-between fw-light"
                    style={{ borderTop: "1px solid #eee" }}
                >
                    <div className="col text-">
                        {props.details.posts.user_id == user.id ? (
                            <a href="#!" className="text-dark" data-bs-toggle="modal" data-bs-target={`#appListModal${props.details.posts.id}`}>
                                <i className="fal fa-user-check"></i> {props.details.posts.applications.length} applications
                            </a>
                        ) : (
                            <a>
                                <i className="fal fa-user-check"></i> {props.details.posts.applications.length} applications
                            </a>
                        )}
                    </div>
                    <div className="col align-self-end text-right" style={{ textAlign: "right" }}>
                        <a
                            onClick={(e) => {
                                ShowComment(e);
                            }}
                        >
                            {props.details.posts.comments.length} Comments
                        </a>
                    </div>
                </div>

                <div
                    className="likes border-1 p-2 d-flex align-items-center justify-content-between text-center"
                    style={{ borderTop: "1px solid #eee" }}
                >
                    <div className="col">
                        {user.type == 1 ? (
                            <button
                                className={`btn text-muted ${props.details.posts.statut == 2 ? "disabled" : ""} `}
                                id="apply"
                                onClick={(e) => {
                                    HandleApply(e);
                                }}
                            >
                                {RsltApply.loading ? (
                                    "loading.."
                                ) : applies ? (
                                    <>
                                        <i className="fal fa-calendar-check"></i> Applied
                                    </>
                                ) : (
                                    <>
                                        <i className="fal fa-calendar-plus"></i> Apply
                                    </>
                                )}
                            </button>
                        ) : (
                            user.id == props.details.posts.user_id && (
                                <button
                                    className={`btn text-muted`}
                                    id="apply"
                                    onClick={(e) => {
                                        HandlePostDelete(e);
                                    }}
                                >
                                    <i className="fal fa-trash"></i> Delete
                                </button>
                            )
                        )}
                    </div>
                    {user.id == props.details.posts.user_id && (
                        <div className="col">
                            {props.details.posts.statut == 1 ? (
                                <>
                                    <button
                                        className="btn text-muted align-self-end"
                                        onClick={(e) => {
                                            ClosePost(e, 2);
                                        }}
                                    >
                                        <i className="fal fa-times fs-5"></i>&nbsp; Close
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="btn text-muted align-self-end"
                                        onClick={(e) => {
                                            ClosePost(e, 1);
                                        }}
                                    >
                                        <i className="fal fa-unlock fs-5"></i>&nbsp; Open
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                    <div className="col">
                        <button
                            className="btn text-muted align-self-end"
                            onClick={(e) => {
                                ShowComment(e);
                            }}
                        >
                            <i className="fal fa-comments-alt fs-5"></i>&nbsp; Comments
                        </button>
                    </div>
                </div>
                <div
                    className="comments p-2"
                    style={{ display: "none" }}
                    id={`commentSection${props.details.posts.id}`}
                    data-aos="fade-left"
                    data-aos-duration="1000"
                >
                    <div className="card rounded shadow-sm border-1 mb-2">
                        <div className="card-body">
                            <div className="d-flex flex-row align-items-center justify-content-center">
                                <div className="avatar d-none d-lg-block">
                                    <img src={`/uploads/avatars/${user.avatar}`} width="35" className="rounded-circle shadow-sm m-1" alt="" />
                                </div>
                                <textarea
                                    name=""
                                    className="form-control border-0 shadow-none text-muted"
                                    placeholder="Leave a comment"
                                    style={{ resize: "none" }}
                                    id={`commentInput${props.details.posts.id}`}
                                    onKeyUp={(e) => handleKeyUp(e)}
                                    rows="1"
                                ></textarea>

                                <button className="btn color-3 fs-5 rounded">
                                    {RsltCmnt.loading ? (
                                        <Spinner color={"color-1"} size="spinner-border-sm" />
                                    ) : (
                                        <i className="fas fa-paper-plane"></i>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    {props.details.posts.comments.length != 0 ? (
                        props.details.posts.comments.map((comment) => {
                            return (
                                <div className="d-flex flex-column">
                                    <div className="card border-0">
                                        <div className="card-body p-0 m-2">
                                            <div className="d-flex flex-row align-items-start justify-content-start w-100">
                                                <div className="avatar d-flex flex-column">
                                                    <img
                                                        src={`/uploads/avatars/${comment.commentor.avatar}`}
                                                        width="45"
                                                        className="rounded-circle shadow-sm m-1"
                                                        alt=""
                                                    />
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
                                                            {comment.commentor.name} &nbsp;{" "}
                                                            <small
                                                                className="color-3  text-center"
                                                                style={{
                                                                    fontSize: "11px",
                                                                    textAlign: "center",
                                                                }}
                                                            >
                                                                {moment(comment.created_at).fromNow()}
                                                            </small>
                                                        </span>
                                                        {comment.content}
                                                        <br />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <>No comments yet</>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Post;
