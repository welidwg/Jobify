import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import { AUTH_TOKEN } from "../constants";
import Logo from "../assets/img/logos/logo1.png";

export default function Navbar(props) {
    $(window).on("scroll", (e) => {
        if (window.scrollY > 150) {
            $("#mainNav").addClass("navbar-shrink");
        } else {
            $("#mainNav").removeClass("navbar-shrink");
        }
    });
    function Logout(e) {
        localStorage.removeItem(AUTH_TOKEN);
        window.location.href = "/home";
    }

    return (
        <nav
            className="navbar navbar-expand-lg d-lg-flex p-2 bg-transparent fixed-top"
            id="topnav"
            style={{ transition: "transition: 0.2s linear all" }}
        >
            <div className="container">
                <a className="navbar-brand col" href="#">
                    <img src={Logo} id="logo" width="160" alt="" />
                </a>

                <div
                    className="justify-content-center col d-none d-lg-flex"
                    id="mainNav"
                >
                    <ul className="nav justify-content-center">
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                aria-current="page"
                                href="#start"
                            >
                                Getting Started
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#services">
                                Services
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#contact">
                                Contact Us
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="col align-items-end" id="">
                    <ul className="nav justify-content-end">
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                aria-current="page"
                                data-bs-toggle="modal"
                                href="#"
                                data-bs-target="#loginModal"
                            >
                                Login
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
