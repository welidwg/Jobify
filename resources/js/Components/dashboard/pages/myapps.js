import Photo1 from "../../../assets/img/photos/testimonials-1.jpg";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import Spinner from "../layouts/spinner";
import moment from "moment";
import { NavLink } from "react-router-dom";
import alertify from "alertifyjs";
import NotFound from "../layouts/not Found";
const MyApps = (props) => {
    const Me = gql`
        query {
            me {
                applications {
                    id
                    created_at
                    post {
                        statut
                        id
                        title
                        company {
                            id
                            name
                            avatar
                        }
                        created_at
                    }
                }
            }
        }
    `;
    const CancelApply = gql`
        mutation CancelApply($id: ID!) {
            cancelApply(id: $id) {
                user_id
            }
        }
    `;
    const [cancel_apply, RsltCancel] = useMutation(CancelApply);
    const RsltMe = useQuery(Me, {
        pollInterval: 2000,
    });
    useEffect(() => {
        document.title = "JobiFy | My applications";
    }, []);
    return (
        <>
            {" "}
            <div className="d-flex align-items-center justify-content-center mt-2 mb-4 ">
                <span className="border-1 w-100 color-1" style={{ borderBottom: "2px solid red" }}></span>
                <span className="mx-2 text-muted">Applications</span>
                <span className="border-1 w-100" style={{ border: "1px solid #eee" }}></span>
            </div>
            <div class="container mt-2 mb-3">
                <div class="row align-items-center justify-content-between text-center">
                    {RsltMe.loading ? (
                        <Spinner />
                    ) : RsltMe.data == undefined ? (
                        <>{RsltMe.error.message}</>
                    ) : RsltMe.data.me.applications.length == 0 ? (
                        <NotFound text="You have not applied to any job yet" />
                    ) : (
                        RsltMe.data.me.applications.map((app) => {
                            return (
                                <div class="col-md-12">
                                    <div class="card p-3 mb-2" style={{ borderRadius: "10px" }}>
                                        <div class="d-flex justify-content-between">
                                            <div class="d-flex flex-row align-items-center">
                                                <div class="icon">
                                                    {" "}
                                                    <i class="bx bxl-mailchimp"></i>{" "}
                                                    <img src={`/uploads/avatars/${app.post.company.avatar}`} className="w-100 rounded" />
                                                </div>
                                                <div class="ms-2 c-details">
                                                    <h6 class="mb-0">
                                                        {app.post.company.name}{" "}
                                                        <span className="fw-thin text-muted" style={{ fontSize: "12px" }}>
                                                            {moment(app.post.created_at).endOf("hour").fromNow()}
                                                        </span>
                                                    </h6>
                                                </div>
                                            </div>
                                            <div class="badge">
                                                {" "}
                                                <a
                                                    className="color-1"
                                                    onClick={(e) => {
                                                        alertify.confirm(
                                                            "Confirmation",
                                                            "Are you sure that you want to cancel this application ?",
                                                            () => {
                                                                cancel_apply({
                                                                    variables: {
                                                                        id: app.id,
                                                                    },
                                                                    refetchQueries: [
                                                                        {
                                                                            query: Me,
                                                                        },
                                                                    ],
                                                                });
                                                            },
                                                            () => {}
                                                        );
                                                    }}
                                                >
                                                    {RsltCancel.loading ? <Spinner color="color-1" /> : "Cancel"}
                                                </a>{" "}
                                            </div>
                                        </div>
                                        <div class="mt-5">
                                            <h3 class="heading">{app.post.title}</h3>
                                            <NavLink className={"color-6"} to={`/profile/${app.post.company.id}#post${app.post.id}`}>
                                                See details
                                            </NavLink>
                                            <div class="mt-2">
                                                <div class="mt-3">
                                                    {" "}
                                                    <span class="text1">
                                                        Application date : <span class="text2">{moment(app.created_at).fromNow()} </span>
                                                    </span>{" "}
                                                </div>
                                                <div class="mt-3">
                                                    {" "}
                                                    <span class="text1">
                                                        Job statut :{" "}
                                                        <span class="text2">
                                                            {app.post.statut == 1 ? (
                                                                <>
                                                                    <span className="text-success">
                                                                        <i class="fal fa-lock-open-alt"></i> Open
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span className="text-danger">
                                                                        <i class="fal fa-lock-alt"></i> Closed
                                                                    </span>
                                                                </>
                                                            )}
                                                        </span>
                                                    </span>{" "}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </>
    );
};

export default MyApps;
