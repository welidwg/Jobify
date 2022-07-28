import Navs from "./navs";
import Sidenav from "./sidenav";
import { AUTH_TOKEN, AUTH_USER } from "../../../constants";
import { Navigate } from "react-router";
import CanvasModal from "./modalCanvas";
import { useQuery, gql } from "@apollo/react-hooks";
import RightNav from "./rightnav";
import Aos from "aos";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import Modals from "../../../layouts/modals";
import Forms from "../../../layouts/Forms";
import { useLocation } from "react-router";
const Container = (props) => {
    Aos.init({ once: true });
    let location = useLocation();
    const user = JSON.parse(localStorage.getItem(AUTH_USER));
    const auth_user = JSON.parse(user);
    window.addEventListener("scroll", (e) => {
        if (window.scrollY >= 19) {
            document.getElementById("leftside").classList.add("stickyside");
            document.getElementById("rightside").classList.add("stickyright");
        } else {
            document.getElementById("leftside").classList.add("stickyside");
            document
                .getElementById("rightside")
                .classList.remove("stickyright");
        }
    });
    useEffect(() => {
        function showMenu() {
            button.setAttribute("hidden", "");
            menu.removeAttribute("hidden");
            overlay.removeAttribute("hidden");
        }
        function hideMenu() {
            menu.setAttribute("hidden", "");
            overlay.setAttribute("hidden", "");
            button.removeAttribute("hidden");
        }
        const button = document.getElementById("menu__button");
        const menu = document.querySelector(".menu__body");
        const close = document.querySelector(".menu__header button");
        const overlay = document.querySelector(".menu__overlay");
        button.addEventListener("click", showMenu);

        close.addEventListener("click", hideMenu);
        overlay.addEventListener("click", hideMenu);
    }, []);

    return (
        <div id="dash">
            <CanvasModal id="notifModal" header="Notifications" user={user} />

            <Modals modalID="addoffer" size="modal-lg">
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
                                    New job offer{" "}
                                    <i className="fas fa-suitcase"></i>
                                </h5>
                                <Forms formAct="addOffer" />
                            </div>
                        </div>
                    </div>
                </section>
            </Modals>
       
            <Navs token={props.token} user={auth_user} />
            <div className="container-fluid bg-color-7" id="">
                <div className="row">
                    <div className="col-md-3 flex-column align-items-center mt-3  d-none d-lg-flex">
                        <Sidenav user={auth_user} />
                    </div>
                    <div
                        className="col-md-6 col-sm-12 row flex-column align-items-stretch mx-auto mt-3 "
                        style={{ minHeight: "100vh" }}
                    >
                        {props.children}
                    </div>
                    <div
                        className="col-lg-3 flex-column align-items-center mt-3 d-none d-lg-flex"
                        style={{ transition: "0.4s linear all" }}
                    >
                        <RightNav />
                    </div>
                </div>
            </div>
            <button className="menu__button d-flex d-lg-none" id="menu__button">
                <div>
                    <div></div>
                </div>
                Menu
            </button>
            <section className="menu__body d-block d-lg-none" hidden="hidden">
                <div className="menu__header">
                    <label>
                        <i className="fas fa-search"></i>
                    </label>
                    <p>Navigation</p>
                    <button title="Close">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="menu__links">
                    <NavLink to={"/dash"} className="">
                        <i className="fal fa-home"></i> Home
                    </NavLink>
                    <NavLink to={`/profile/${auth_user.id}`}>
                        <i className="fal fa-user"></i> Profile
                    </NavLink>{" "}
                    {auth_user.type == 1 && (
                        <NavLink to={"/myapps"} className="">
                            <i className="fal fa-check"></i> My applications
                        </NavLink>
                    )}
                    <a href="#0">Blog</a>
                    <a href="#0">Contact</a>
                </div>
                <div className="menu__contact">
                    {auth_user.type == 1 &&
                        location.pathname == `/profile/${auth_user.id}` && (
                            <>
                                <a
                                    href="#0"
                                    className="d-flex flex-column justify-content-center "
                                    data-bs-toggle="modal"
                                    data-bs-target="#AddExpModal"
                                >
                                    <i className="fas fa-plus"></i>
                                    <span>Add Experience</span>
                                </a>
                                <a
                                    href="#0"
                                    className="d-flex flex-column justify-content-center "
                                    data-bs-toggle="modal"
                                    data-bs-target="#AddExpModal"
                                >
                                    <i className="fas fa-plus"></i>
                                    <span>Add Education</span>
                                </a>
                            </>
                        )}

                    {auth_user.type == 2 && (
                        <>
                            <a
                                href="#0"
                                className="d-flex flex-column justify-content-center "
                                data-bs-toggle="modal"
                                data-bs-target="#addoffer"
                            >
                                <i className="fas fa-plus"></i>
                                <span>Create job offer</span>
                            </a>
                        </>
                    )}

                    {/* <a href="#0" className="text-center">
                        <i className="fas fa-directions"></i>

                        <span>Directions</span>
                    </a> */}
                </div>
            </section>
            <div className="menu__overlay" hidden="hidden"></div>
            {/* <CanvasModal id="notif" /> */}
        </div>
    );
};
export default Container;
