import { useLocation } from "react-router";
import Photo1 from "../../../assets/img/photos/testimonials-3.jpg";
import { AUTH_USER } from "../../../constants";
import Modals from "../../../layouts/modals";
import editPng from "../../../assets/img/edit.png";
import Forms from "../../../layouts/Forms";

const RightNav = (props) => {
    let location = useLocation();
    const user = JSON.parse(JSON.parse(localStorage.getItem(AUTH_USER)));

    return (
        <div style={{ zoom: "0.9" }} id="rightside">
          
            <div data-aos="fade-down" data-aos-duration="700">
                <span>
                    {" "}
                    <i className="fas fa-gears"></i> Tools{" "}
                </span>
                {user.type == 2 && (
                    <>
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
                {location.pathname == "/profile" && user.type == 1 && (
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
                            href="#"
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
                            href="#"
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
                )}
            </div>
            <span>Suggested for you</span>
            <div className="sugg">
                <div
                    className="card w-100 m-2 p-2 border-0 shadow-sm  "
                    style={{ borderRadius: "12px" }}
                >
                    <div className="card-body d-flex flex-row justify-content-evenly align-items-center">
                        <div className="avatar">
                            <img
                                src={Photo1}
                                className="rounded shadow"
                                width="45"
                                alt=""
                            />
                        </div>
                        <div className="name">
                            ali ben ali <br />
                            <small>Employee</small>
                        </div>
                        <div>
                            <button className="btn bg-color-3 color-2">
                                follow
                            </button>
                        </div>
                    </div>
                </div>
                <div
                    className="card w-100 m-2 p-2 border-0 shadow-sm"
                    style={{ borderRadius: "12px" }}
                >
                    <div className="card-body d-flex flex-row justify-content-evenly align-items-center">
                        <div className="avatar">
                            <img
                                src={Photo1}
                                className="rounded shadow"
                                width="45"
                                alt=""
                            />
                        </div>
                        <div className="name">
                            ali ben ali <br />
                            <small>Employee</small>
                        </div>
                        <div>
                            <button className="btn bg-color-3 color-2">
                                follow
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default RightNav;
