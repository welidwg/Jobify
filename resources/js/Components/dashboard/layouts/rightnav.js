import { useLocation } from "react-router";
import Photo1 from "../../../assets/img/photos/testimonials-3.jpg";
import { AUTH_USER } from "../../../constants";
import Modals from "../../../layouts/modals";
import editPng from "../../../assets/img/edit.png";
import Forms from "../../../layouts/Forms";
import { Suggestions } from "../scripts/Queries";

import { useQuery } from "@apollo/client";
import Spinner from "./spinner";
import { NavLink } from "react-router-dom";
import Placeholders from "./placeholders";
const RightNav = (props) => {
    let location = useLocation();
    const user = JSON.parse(JSON.parse(localStorage.getItem(AUTH_USER)));

    const Suggest = useQuery(Suggestions, {
        variables: {
            id: user.id,
            type: user.type,
        },
    });

    return (
        <div style={{ zoom: "0.9" }} id="rightside">
            <div data-aos="fade-down" data-aos-duration="700">
                {user.type == 2 && (
                    <>
                        <span>
                            {" "}
                            <i className="fas fa-gears"></i> Tools{" "}
                        </span>
                        <a
                            className="card w-100 m-2 p-2 border-0 shadow-sm color-5"
                            style={{ borderRadius: "12px" }}
                            data-bs-toggle="modal"
                            href="#"
                            data-bs-target="#addoffer"
                        >
                            <div className="card-body d-flex flex-row justify-content-start align-items-center">
                                <div className="avatar">
                                    <i className="fas fa-plus color-6"></i>
                                </div>
                                <div className="name">
                                    Create a job offer
                                    <br />
                                </div>
                            </div>
                        </a>
                    </>
                )}
                {location.pathname == `/profile/${user.id}` && user.type == 1 && (
                    <>
                        <span>
                            {" "}
                            <i className="fas fa-gears"></i> Tools{" "}
                        </span>
                        <div className="mb-2">
                            <a
                                className="card w-100 m-2 p-2 border-0 shadow-sm color-5"
                                style={{ borderRadius: "12px" }}
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#AddExpModal"
                            >
                                <div className="card-body d-flex flex-row justify-content-start align-items-center">
                                    <div className="avatar">
                                        <i className="fas fa-plus color-6"></i>
                                    </div>
                                    <div className="name">
                                        Add Experience
                                        <br />
                                    </div>
                                </div>
                            </a>
                            <a
                                className="card w-100 m-2 p-2 border-0 shadow-sm color-5"
                                style={{ borderRadius: "12px" }}
                                href="#!"
                                data-bs-toggle="modal"
                                data-bs-target="#AddEducationModal"
                            >
                                <div className="card-body d-flex flex-row justify-content-start align-items-center">
                                    <div className="avatar">
                                        <i className="fas fa-plus color-6"></i>
                                    </div>
                                    <div className="name">
                                        Add Education
                                        <br />
                                    </div>
                                </div>
                            </a>
                            <a
                                className="card w-100 m-2 p-2 border-0 shadow-sm color-5"
                                style={{ borderRadius: "12px" }}
                                href="#!"
                                data-bs-toggle="modal"
                                data-bs-target="#addSkillsModal"
                            >
                                <div className="card-body d-flex flex-row justify-content-start align-items-center">
                                    <div className="avatar">
                                        <i className="fas fa-plus color-6"></i>
                                    </div>
                                    <div className="name">
                                        Add Skills
                                        <br />
                                    </div>
                                </div>
                            </a>
                        </div>
                    </>
                )}
            </div>
            <span>Suggested for you</span>
            <div className="sugg">
                {Suggest.loading ? (
                    <Placeholders />
                ) : (
                    Suggest.data.sugg.map((e) => {
                        return (
                            <div className="card w-100 m-2 p-2 border-0 shadow-sm  " key={e.id} style={{ borderRadius: "12px" }}>
                                <NavLink to={`/profile/${e.id}`} className="text-dark">
                                    <div className="card-body d-flex flex-row justify-content-evenly align-items-center">
                                        <div className="avatar">
                                            <img src={`/uploads/avatars/${e.avatar}`} className="rounded border-1" width="45" alt="" />
                                        </div>
                                        <div className="name">
                                            <h6 className="fw-bold" style={{ maxWidth: "130px", width: "130px", textTransform: "capitalize" }}>
                                                {e.name}
                                            </h6>
                                            <small>{e.type == 1 ? "Candidate" : "Employer"}</small>
                                        </div>
                                        {/* <div>
                                        <a
                                            className="btn bg-color-3 color-2"
                                            href={`profile/${e.id}`}
                                        >
                                            Profile
                                        </a>
                                    </div> */}
                                    </div>
                                </NavLink>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
export default RightNav;
