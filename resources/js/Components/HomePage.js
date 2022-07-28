import React, { useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
import Background from "../assets/video/header.mp4";
import { gql, useQuery } from "@apollo/client";
import Forms from "../layouts/Forms";
import Navbar from "./navbar";

import Logo1 from "../assets/img/logos/logo1.png";
import Logo2 from "../assets/img/logos/logo2.png";
import Logo3 from "../assets/img/logos/logo3.png";
import letsStart from "../assets/img/search1.png";
import layer0 from "../assets/img/faceRec.png";
import Aos from "aos";
import Modals from "../layouts/modals";
import loginpng from "../assets/img/login.png";
import whypng from "../assets/img/target.png";
import icon from "../assets/img/logos/icon1.png";

const HomePage = (props) => {
    Aos.init({ once: true });
    window.addEventListener("scroll", (e) => {
        if (window.scrollY > 50) {
            document.getElementById("topnav").classList.add("fixedtop");
            document.getElementById("topnav").classList.add("shadow");
            document.getElementById("logo").src = Logo2;
        } else {
            document.getElementById("topnav").classList.remove("fixedtop");
            document.getElementById("topnav").classList.remove("shadow");
            document.getElementById("logo").src = Logo1;
        }
    });
    // const { loading, error, data } = useQuery(test);
    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error : {error.message}</p>;
    const token = props.token;
    useEffect(() => {
        document.title = "JobiFy | Home";
    }, []);
    return (
        <>
            <Navbar token={props.token} />

            {/* modals  */}
            <Modals modalID="loginModal" size="modal-lg">
                <section className="">
                    <div className="container py-5 h-100">
                        <div className="row d-flex align-items-center justify-content-center h-100">
                            <div className="col-md-8 col-lg-7 col-xl-6 d-none d-lg-block text-center">
                                <img src={loginpng} className="img-fluid w-75" alt="Phone image" />
                            </div>
                            <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
                                <h5 className="text-center color-3 mb-3 fs-2">
                                    Login <i className="fas fa-sign-in-alt"></i>
                                </h5>
                                <Forms formAct="Login" />
                            </div>
                        </div>
                    </div>
                </section>
            </Modals>
            <Modals modalID="registerModal" size="modal-lg">
                <section className="">
                    <div className="container py-5 h-100">
                        <div className="row d-flex align-items-center justify-content-center h-100">
                            <div className="col-md-6 col-lg-6 col-xl-6 text-center d-none d-lg-block">
                                <img src={layer0} className="img-fluid mb-3" alt="Phone image" width={"250"} />
                            </div>
                            <div className="col-md-12 col-lg-6 col-xl-6 ">
                                <h5 className="text-center color-3 mb-3 fs-2 fw-bold">
                                    Register <i className="fas fa-user-plus"></i>
                                </h5>
                                <Forms formAct="Signup" />
                            </div>
                        </div>
                    </div>
                </section>
            </Modals>

            <header>
                <div className="overlay"></div>

                <video playsInline="playsinline" autoPlay="autoplay" muted="muted" loop="loop">
                    <source src={Background} type="video/mp4" />
                </video>

                {/* <!-- The header content --> */}
                <div className="container h-100 justify-content-center">
                    <div className="d-flex h-100 text-center align-items-center">
                        <div className="mx-auto">
                            <h2 className="display-1 typewriter color-2">JOBIFY</h2>
                            <p className="lead mb-0 color-2 fw-bold mt-2" data-aos="fade-up" data-aos-delay="1000" data-aos-duration="1500">
                                THE BEST , FOR THE BEST
                            </p>

                            <p
                                className="color-2 mb-4 mt-5 fs-3"
                                data-aos="fade-up"
                                data-aos-duration="1400"
                                data-aos-delay="1500"
                                style={{ textTransform: "uppercase" }}
                            >
                                Start chasing your&nbsp;
                                <strong className="color-6 fw-bold">DREAM</strong> job
                            </p>
                            <a
                                data-aos="fade-left"
                                data-aos-duration="1400"
                                className="btn w-50 rounded-pill bg-color-6 color-2 started"
                                data-aos-delay="2000"
                                href="#start"
                            >
                                <span>GET STARTED</span>
                            </a>
                        </div>
                    </div>
                </div>
            </header>
            <div data-bs-spy="scroll" data-bs-target="#topnav" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true" id="start">
                <section className="section services-section bg-color-2 p-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 align-items-center justify-content-center my-auto" data-aos="fade-up" data-aos-duration="1000">
                                <div className="section-title d-flex flex-column color-3 justify-content-center  mx-auto">
                                    <div className="section-title">
                                        <h2 className="color-3">Let's get stared !</h2>
                                        <p className="text-left">
                                            The first step into our plateform is creating your pesonal account , neither you are a candidate or an
                                            employer, this will let you interact with other users and see the latest offers !
                                            <br />
                                        </p>
                                    </div>

                                    <button
                                        className="btn d-flex rounded-pill bg-color-3  shadow mt-2 color-2 mx-auto"
                                        style={{
                                            fontSize: "20px",
                                        }}
                                        data-bs-toggle="modal"
                                        href="#"
                                        data-bs-target="#registerModal"
                                    >
                                        Create your account &nbsp;
                                        <i className="fad fa-angle-double-right mt-2"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="col-lg-6 justify-content-center my-auto text-center" data-aos="fade-right" data-aos-duration="1000">
                                <img src={letsStart} className="image img-fluid rounded" width="350" alt="" />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="section services-section bg-color-2" id="services">
                    <div className="container">
                        <div className="row" data-aos="fade-up" data-aos-duration="1000">
                            <div className="col-lg-7">
                                <div className="section-title">
                                    <h2 className="color-3">Why JOBIFY ?</h2>
                                    <p className="text-left">
                                        Jobify is a plateform where you can find , as an emolyee , your dream job .And if you are a company , here you
                                        will find a bunch of talented employees , motivated and ready for working.
                                        <br />
                                    </p>
                                </div>
                            </div>
                            <div className="col-lg-5 text-center">
                                <img className="img-fluid image" width={"250px"} src={whypng} />
                            </div>
                        </div>
                        <div className="row" data-aos="fade-down" data-aos-duration="1000">
                            <div className="col-sm-6 col-lg-4">
                                <div className="feature-box-1">
                                    <div className="icon">
                                        <i className="fa fa-desktop"></i>
                                    </div>
                                    <div className="feature-content">
                                        <h5>Unique design</h5>
                                        <p>
                                            I design and develop services for customers of all sizes, specializing in creating stylish, modern
                                            websites.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm-6 col-lg-4">
                                <div className="feature-box-1">
                                    <div className="icon">
                                        <i className="fa fa-user"></i>
                                    </div>
                                    <div className="feature-content">
                                        <h5>Different Layout</h5>
                                        <p>
                                            I design and develop services for customers of all sizes, specializing in creating stylish, modern
                                            websites.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm-6 col-lg-4">
                                <div className="feature-box-1">
                                    <div className="icon">
                                        <i className="fa fa-comment"></i>
                                    </div>
                                    <div className="feature-content">
                                        <h5>Make it Simple</h5>
                                        <p>
                                            I design and develop services for customers of all sizes, specializing in creating stylish, modern
                                            websites.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <footer
                    className="page-footer font-small blue pt-4 services-section bg-color-2 shadow-lg"
                    style={{ zIndex: "1", position: "relative" }}
                    id="contact"
                >
                    <div className="container-fluid text-center text-md-left" data-aos="fade-up" data-aos-duration="1000">
                        <div className="row">
                            <div className="col-md-4 mt-md-0 mt-3">
                                <h5 className="text-uppercase">
                                    <img src={Logo3} alt="" />
                                </h5>
                                <p className="color-5 fw-bold">THE BEST , FOR THE BEST</p>
                            </div>

                            <hr className="clearfix w-100 d-lg-none pb-3" />

                            <div className="col-md-3 mb-md-0 mb-3">
                                <h5 className="text-uppercase color-6 fw-bold">Contact Us</h5>

                                <ul className="list-unstyled">
                                    <li>
                                        <a href="#!" className="color-3">
                                            <i className="fas fa-phone-alt"></i> +216 73477***
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#!" className="color-3">
                                            <i className="fas fa-at"></i> contact@jobify.io
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#!" className="color-3">
                                            <i className="far fa-globe-africa"></i> Monastir , Tunisia
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="col-md-3 mb-md-0 mb-3">
                                <h5 className="text-uppercase color-6 fw-bold">find us on</h5>

                                <ul className="list-unstyled">
                                    <li>
                                        <a href="#!" className="color-3">
                                            <i className="fab fa-facebook"></i> Facebook
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#!" className="color-3">
                                            <i className="fab fa-twitter"></i> Twitter
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#!" className="color-3">
                                            <i className="fab fa-github"></i> Github
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#!" className="color-3">
                                            <i className="fab fa-instagram"></i> Instagram
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="footer-copyright color-2 text-center shadow-lg py-3 bg-color-3">
                        © 2022 Copyright:
                        <a href="/" className="color-5">
                            <img src={Logo1} width="100" alt="" />
                        </a>
                    </div>
                    {/* <!-- Copyright --> */}
                </footer>
            </div>
        </>
    );
};
export default HomePage;
