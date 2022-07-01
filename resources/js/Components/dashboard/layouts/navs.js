import { NavLink } from "react-router-dom";
import { AUTH_TOKEN } from "../../../constants";
import { AUTH_USER } from "../../../constants";
import { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/react-hooks";
import $ from "jquery";
import CanvasModal from "./modalCanvas";
import Logo from "../../../assets/img/logos/logo2.png";
import Icon from "../../../assets/img/logos/icon3.png";

const Navs = (props) => {
    // useEffect(() => {
    //     window.onscroll = function (e) {
    //         if (this.oldScroll > this.scrollY) {
    //             document.getElementById("bottomnav").classList.remove("hide");
    //         } else {
    //             setTimeout(() => {
    //                 document.getElementById("bottomnav").classList.add("hide");
    //             }, 500);
    //         }

    //         this.oldScroll = this.scrollY;
    //     };
    // }, []);

    function Logout(e) {
        localStorage.removeItem(AUTH_TOKEN);
        localStorage.removeItem(AUTH_USER);
        window.location.href = "/home";
    }
    return (
        <>
            <nav
                className="navbar navbar-expand-lg d-lg-flex p-2 bg-white shadow-sm sticky-top"
                id="topnav"
                style={{ transition: "0.2s linear all" }}
            >
                <div className="container">
                    <a className="navbar-brand col" href="#">
                        <img
                            src={Logo}
                            className="d-none d-lg-block"
                            id="logo"
                            width="140"
                            alt=""
                        />
                        <img
                            src={Icon}
                            className="d-block d-lg-none"
                            id="logo"
                            width="45"
                            alt=""
                        />
                    </a>

                    <div
                        className="justify-content-center col d-flex"
                        id="mainNav"
                    >
                        <ul className="nav justify-content-center"></ul>
                        <form action="" className="w-100">
                            <div
                                className="input-group rounded-pill"
                                style={{ border: " 1px solid #ccc" }}
                            >
                                <input
                                    type="text"
                                    className="form-control rounded-pill shadow-none border-0"
                                    placeholder="Search for a job"
                                />
                                <button className="btn">
                                    <i className="fas fa-search"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="col align-items-end" id="">
                        <ul className="nav justify-content-end">
                            <li
                                className="nav-item"
                                onClick={(e) => {
                                    Logout(e);
                                }}
                            >
                                <a className="nav-link color-1 fw-bold fs-4">
                                    <i className="fal fa-sign-out-alt"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            {/* phones bottom nav */}
            {/* <div
                className="container-fluid bg-light d-block d-lg-none text-dark  animated pulse"
                id="bottomnav"
            >
                <div className="row nav d-flex p-2 justify-content-center align-items-center">
                    <div className="col  p-0">
                        <li className="nav-item">
                            <NavLink className={"nav-link"} to={"/Dash"}>
                                <i className="fal fa-home"></i>
                                <br />
                                <span>Home</span>
                            </NavLink>
                        </li>
                    </div>

                    <div className="col ">
                        <li className="nav-item">
                            <NavLink to={"/Jobs"} className={"nav-link"}>
                                <i className="fal fa-search"></i>
                                <br />
                                <span>Jobs</span>
                            </NavLink>
                        </li>
                    </div>
                    <div className="col ">
                        <li className="nav-item ">
                            <NavLink to={"/Contacts"} className={"nav-link"}>
                                <i className="fal fa-address-book "></i>
                                <br /> <span>Contacts</span>
                            </NavLink>
                        </li>
                    </div>

                    <div className="col ">
                        <li className="nav-item dropdown">
                            <NavLink
                                className={"nav-link"}
                                to={"/Profile"}
                                aria-expanded="false"
                            >
                                <i className=" fal fa-user-circle"></i>
                                <br />
                                <span>Profile</span>
                            </NavLink>
                        </li>
                    </div>
                </div>
            </div> */}
        </>
    );
};
export default Navs;
