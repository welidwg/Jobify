const Contact = (props) => {
    console.log(props.user.following);
    return (
        <>
            <div class="col-12 col-lg-3 col-sm-12 mb-5 m-1  text-center ">
                <div class="bg-white rounded shadow py-5 px-4">
                    <img
                        src="https://bootstrapious.com/i/snippets/sn-team/teacher-4.jpg"
                        alt=""
                        width="100"
                        class="img-fluid rounded-circle mb-3 img-thumbnail shadow-sm"
                    />
                    <h5 class="mb-0"> {props.user.user.name}</h5>
                    <span class="small text-uppercase text-muted">
                        {props.user.user.type == 1 ? "Candidate" : "Employer"}
                    </span>
                    <div className="d-flex pt-1">
                        <button
                            type="button"
                            className="btn btn-outline-secondary  me-1 flex-grow-1"
                        >
                            Chat
                        </button>
                        <button
                            type="button"
                            className="btn bg-orange text-light flex-grow-1"
                        >
                            Unfollow
                        </button>
                    </div>
                </div>
            </div>
            {/* <section className=" d-flex">
                <div className="container py-5">
                    <div className="row d-flex  ">
                        <div className="col col-md-4 col-lg-4 col-xl-5">
                            <div
                                className="card"
                                style={{ borderRadius: "15px" }}
                            >
                                <div className="card-body p-4">
                                    <div className="d-flex text-black">
                                        <div className="flex-shrink-0">
                                            <img
                                                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                                                alt="Generic placeholder image"
                                                className="img-fluid"
                                                style={{
                                                    width: "100px",
                                                    borderRadius: "10px",
                                                }}
                                            />
                                        </div>
                                        <div className="flex-grow-1 ms-3">
                                            <h5 className="mb-1">
                                                Danny McLoan
                                            </h5>
                                            <p
                                                className="mb-2 pb-1"
                                                style={{ color: "#2b2a2a" }}
                                            >
                                                Senior Journalist
                                            </p>
                                            <div
                                                className="d-flex justify-content-start rounded-3 p-2 mb-2"
                                                style={{
                                                    backgroundColor: "efefef",
                                                }}
                                            >
                                                <div>
                                                    <p className="small text-muted mb-1">
                                                        Articles
                                                    </p>
                                                    <p className="mb-0">41</p>
                                                </div>
                                                <div className="px-3">
                                                    <p className="small text-muted mb-1">
                                                        Followers
                                                    </p>
                                                    <p className="mb-0">976</p>
                                                </div>
                                                <div>
                                                    <p className="small text-muted mb-1">
                                                        Rating
                                                    </p>
                                                    <p className="mb-0">8.5</p>
                                                </div>
                                            </div>
                                            <div className="d-flex pt-1">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary me-1 flex-grow-1"
                                                >
                                                    Chat
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary flex-grow-1"
                                                >
                                                    Follow
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}
        </>
    );
};
export default Contact;
