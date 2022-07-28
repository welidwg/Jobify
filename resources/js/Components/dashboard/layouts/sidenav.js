import { useQuery, gql } from "@apollo/react-hooks";
import { NavLink, useLocation } from "react-router-dom";
import Photo1 from "../../../assets/img/photos/testimonials-1.jpg";
import { AUTH_USER } from "../../../constants";
import toastr from "toastr";
import CanvasModal from "./modalCanvas";
import { MeQuery } from "../scripts/Queries";
import Spinner from "./spinner";
import { useEffect } from "react";
import Placeholders from "./placeholders";
const Sidenav = (props) => {
    const user = JSON.parse(JSON.parse(localStorage.getItem(AUTH_USER)));
    let location = useLocation();
    const me = useQuery(MeQuery, {
        pollInterval: 2000,
        variables: {
            id: user.id,
        },
        onCompleted: (res) => {},
    });

    // if (location.pathname != `/profile/${user.id}`) {
    //     $("#userCard").fadeIn();
    // } else {
    //     $("#userCard").fadeOut();
    // }

    return (
        <>
            <div
                className="card w-75 m-2 p-2 border-0 shadow-sm"
                style={{ borderRadius: "12px", zoom: "0.8" }}
                data-aos="fade-up"
                data-aos-duration="700"
                id="userCard"
            >
                {me.loading ? (
                    <Placeholders />
                ) : me.error ? (
                    <>{me.error.message}</>
                ) : (
                    <div className="card-body d-flex flex-row justify-content-evenly align-items-center">
                        <div className="avatar">
                            <img src={`/uploads/avatars/${me.data.user.avatar}`} className="rounded shadow-sm" width="45" alt="" />
                        </div>
                        <div className="name">
                            {me.data.user.name} <br />
                            <small>{me.data.user.type == 1 ? "Candidate" : "Employer"}</small>
                        </div>
                    </div>
                )}
            </div>

            <div
                className="sidenav card w-75 m-2 p-0 border-0 shadow-sm d-none d-lg-flex "
                style={{ borderRadius: "12px" }}
                id="leftside"
                data-aos="fade-up"
                data-aos-duration="700"
            >
                <ul className="nav border-0 p-1" style={{ zoom: "0.9" }}>
                    <li className="nav-item">
                        <NavLink to={"/dash"} className={"d-flex align-items-center"}>
                            <i className="fas fa-home" style={{ width: "20px" }}></i> &nbsp;Home
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink to={`/profile/${user.id}`} className={"d-flex align-items-center"}>
                            <i className="fas fa-user" style={{ width: "20px" }}></i> &nbsp; My Profile
                        </NavLink>
                    </li>
                    {user.type == 1 && (
                        <li className="nav-item">
                            <NavLink to={`/myapps`} className={"d-flex align-items-center"}>
                                <i className="fas fa-check" style={{ width: "20px" }}></i> &nbsp; My job applications
                            </NavLink>
                        </li>
                    )}

                    <li className="nav-item">
                        <NavLink to={`/contacts`} className={"d-flex align-items-center"}>
                            <i className="fas fa-address-book" style={{ width: "20px" }}></i>
                            &nbsp;My Contacts
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to={`/messages`} className="d-flex align-items-center">
                            <i className="fab fa-facebook-messenger" style={{ width: "20px" }}></i>
                            &nbsp;Messages center
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/FindPeoples/1" className="d-flex align-items-center">
                            <i className="fas fa-users" style={{ width: "20px" }}></i> &nbsp;Find peoples
                        </NavLink>
                    </li>
                </ul>
            </div>
        </>
    );
};
export default Sidenav;
