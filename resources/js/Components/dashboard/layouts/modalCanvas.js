import { MeQuery } from "../scripts/Queries";
import { useQuery, useMutation, gql } from "@apollo/client";
import Spinner from "./spinner";
import { mynotif } from "../scripts/Queries";
import { AUTH_USER } from "../../../constants";
import NotFound from "./not Found";
import { NavLink } from "react-router-dom";
import moment from "moment";

const CanvasModal = (props) => {
    const user = JSON.parse(JSON.parse(localStorage.getItem(AUTH_USER)));

    const Notifs = useQuery(mynotif, {
        pollInterval: 2000,
        variables: {
            user_id: user.id,
        },
    });

    return (
        <div className="offcanvas offcanvas-end" tabIndex="0" id={props.id}>
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasExampleLabel">
                    {props.header == "Notifications" && (
                        <div className="color-6">
                            <i className="fal fa-bell"></i> {props.header}
                        </div>
                    )}
                </h5>
                <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                {props.id == "notifModal" && (
                    <>
                        {Notifs.loading ? (
                            <Spinner color="color-6" />
                        ) : (
                            <>
                                {Notifs.data.mynotif.length == 0 ? (
                                    <NotFound text="You have no notifications" />
                                ) : (
                                    Notifs.data.mynotif.map((e) => {
                                        return (
                                            <div
                                                className="card mt-5 p-3 w-100 bg-color-7 shadow-sm"
                                                style={{
                                                    border: "none",
                                                    borderRadius: "20px",
                                                    backgroundColor: "#597AFD",
                                                }}
                                                key={e.sender.id}
                                            >
                                                <NavLink to={`profile/${e.sender.id}`}>
                                                    <div className=" row">
                                                        <div className="col-md-3 d-flex align-items-center">
                                                            <img
                                                                src={`/uploads/avatars/${e.sender.avatar}`}
                                                                width="100px"
                                                                className=" mx-3 rounded-circle mr-3 img-fluid "
                                                            />
                                                        </div>
                                                        <div className="col media-body">
                                                            <h6 className="mt-2 mb-2 fw-bold color-3">{e.title}</h6>

                                                            <small className="text-dark">{e.content}</small>
                                                            <br />
                                                            <small className="text-muted fw-bold">{moment(e.created_at).fromNow()}</small>
                                                        </div>
                                                    </div>
                                                </NavLink>
                                            </div>
                                        );
                                    })
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
export default CanvasModal;
