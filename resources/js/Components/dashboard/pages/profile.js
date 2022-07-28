import { useEffect, useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/react-hooks";
import Photo1 from "../../../assets/img/photos/testimonials-1.jpg";
import editPng from "../../../assets/img/edit.png";
import edit2 from "../../../assets/img/editall.png";
import Modals from "../../../layouts/modals";
import Forms from "../../../layouts/Forms";
import toastr from "toastr";
import moment from "moment";
import alertify from "alertifyjs";
import { AUTH_USER } from "../../../constants";
import { useParams } from "react-router";
import Spinner from "../layouts/spinner";
import NotFound from "../layouts/not Found";
import Post from "../layouts/Post";
import { UpdateUser } from "../scripts/users";
import { AddNotif, UpdatePhoto } from "../scripts/Mutations";
import { set } from "lodash";
import { UpdateUserMutation } from "../scripts/Mutations";
import Placeholders from "../layouts/placeholders";
const Profile = (props) => {
    const user = JSON.parse(JSON.parse(localStorage.getItem(AUTH_USER)));
    const params = useParams();
    const idUser = parseInt(params.id);
    const [followed, setFollowed] = useState(false);
    const Follow = gql`
        mutation Follow($user_id: ID, $followed_by: ID) {
            follow(user_id: $user_id, followed_by: $followed_by)
        }
    `;
    const MeqQuery = gql`
        {
            user(id: ${idUser}) {
                id
                name
                email
                type
                avatar
                phone
                about
                skills{
                    id
                    label
                }
                 
                followers{
                    followed_by{
                        id
                        name
                    }
                }

                 following {
      user {
        name
      }
    }
               
                experiences {
                    id
                    title
                    company
                    from
                    to
                    current
                    description
                }
                 educations {
                    id
                    title
                    location
                    from
                    to
                    current
                    
                }
                birthDate
                
              
                posts {
                     id
                title
                user_id
                salary
                description
                type
                statut
            
                places
                skills{
                    id
                    label
                }
                requirements {
                    id
                    label
                }
               
               
                applications {
                    applicants {
                        name
                    }
                }
              
                created_at
                company {
                    id
                    name
                    avatar
                    address
                    city
                    state
                }
                comments {
                    content
                    created_at
                    commentor {
                        name
                        avatar
                        id
                    }
                }
                }
                comments {
                    content
                }
            }
        }
    `;

    const [add_notif, RsltNotif] = useMutation(AddNotif, {
        onCompleted: (res) => {
            console.log("done");
        },
        onError: (err) => {
            console.log(err);
        },
    });

    const [follow, RsltFollow] = useMutation(Follow, {
        onCompleted(data) {
            if (data.follow == "follow") {
                setFollowed(true);
                add_notif({
                    variables: {
                        user_id: idUser,
                        to: "",
                        title: "New Follow",
                        content: `${user.name} have followed you `,
                        from: user.id,
                    },
                });
            } else {
                setFollowed(false);
            }
        },
    });

    const [userData, setUserData] = useState({
        email: "",
        name: "",
        birthDate: "",
        about: "",
        phone: "",
        address: "",
        city: "",
        state: "",
    });

    const [update_user, Rsltupdate] = useMutation(UpdateUserMutation, {
        onError: (err) => {
            console.error(err.message);
            toastr.error(err.message);
        },
        onCompleted: (res) => {
            toastr.success("updated");
        },
    });
    const { loading, error, data } = useQuery(MeqQuery, {
        // variables: {
        //     id: parseInt(idUser),
        // },
        pollInterval: 1000,
        onError(err) {
            toastr.error(err.message);
            console.log(err.graphQLErrors);
        },
        onCompleted: (data) => {
            setUserData({
                email: data.user.email,
                name: data.user.name,
                birthDate: data.user.birthDate,
                about: data.user.about,
                phone: data.user.phone,
            });
            if (data.user != null) {
                data.user.followers.map((follower) => {
                    if (follower.followed_by.id == user.id) {
                        setFollowed(true);
                    }
                });
            }
        },
    });
    const About = gql`
        mutation UpdateAbout($id: ID!, $about: String!) {
            updateAbout(id: $id, about: $about) {
                about
            }
        }
    `;
    const DeleteExp = gql`
        mutation DeleteExp($id: ID!) {
            deleteExperience(id: $id) {
                title
            }
        }
    `;
    const [delete_exp, RsltDeleteExp] = useMutation(DeleteExp, {
        onError(err) {
            toastr.error(err.message);
            console.log(err.graphQLErrors);
        },
        onCompleted(data) {
            toastr.success(`${data.deleteExperience.title} is deleted!`);
        },
    });
    function DeleteExperiencehandler(id) {
        alertify
            .confirm(
                "Confirmation",
                "Are you sure you want to delete this experience ?",
                () => {
                    delete_exp({
                        variables: { id: id },
                        refetchQueries: [{ query: MeqQuery }],
                    });
                },
                () => {}
            )
            .set("labels", { ok: "Yes", cancel: "Cancel" });
    }

    const [update_about, RsltAbout] = useMutation(About, {
        onError(err) {
            toastr.error("Server error");
            console.log("about error : ", err.graphQLErrors);
        },
        onCompleted(data) {
            toastr.info("Updated successfully");
        },
    });

    const [exp, setExp] = useState({
        id: 0,
        title: "",
        company: "",
        from: "",
        to: "",
        current: 0,
        description: "",
    });

    const DeleteSkills = gql`
        mutation DeleteSkill($id: ID!) {
            delete_skill(id: $id) {
                label
            }
        }
    `;
    const [delete_skill, RsltDeleteSkill] = useMutation(DeleteSkills, {
        onCompleted: (res) => {
            toastr.info("Skill deleted !");
        },
        onError: (err) => {
            toastr.error("Somthing went wrong ! ");
            console.log(err);
        },
    });
    function DeleteSkill(id) {
        alertify.confirm(
            "Confirmation",
            "Are you sure ?",
            () => {
                delete_skill({
                    variables: {
                        id: id,
                    },
                });
            },
            () => {}
        );
    }
    function UpdatePhone(e) {
        let val = $("#phoneInput").val();
        let old = data.user.phone;
        if (val == old && old != "") {
            toastr.info("Nothing to change !");
            $("#savePhone").fadeOut();
            $("#btnEditPhone").fadeIn();
            $("#phoneInput").attr("disabled", true);
        } else {
            update_user({
                variables: {
                    id: user.id,
                    phone: parseInt(val),
                },
                onCompleted: (res) => {
                    $("#savePhone").fadeOut();
                    $("#btnEditPhone").fadeIn();
                    $("#phoneInput").attr("disabled", true);
                },
            });
        }
    }
    const [avatar, setAvatar] = useState({
        image: [],
    });
    const [change_photo, RsltAvatar] = useMutation(UpdatePhoto, {
        onError: (err) => {
            toastr.error("error");
            console.log(err);
        },
        onCompleted: (res) => {
            toastr.info("Photo updated");
            console.log(res.updateUserAvatar);
        },
    });
    // const onChange = ({
    //     target: {
    //         validity,
    //         files: [file],
    //     },
    // }) => validity.valid && change_photo({ variables: { id: user.id, image: file } });
    function SubmitForm() {
        const data = new FormData();
        data.append("image", avatar.image);
        data.append("id", user.id);
        change_photo({
            variables: {
                id: data.get("id"),
                image: data.get("image"),
            },
        });
    }

    useEffect(() => {
        document.title = "JobiFy | Profile";
    }, []);

    return (
        <div className="mt-3 col-md-12 col-sm-12 col-lg-10 align-items-stretch justify-content-center flex-column   mx-auto ">
            <Modals modalID="editModal" size="">
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
                                <img src={editPng} className="img-fluid" alt="Phone image" width={"200"} />
                                <h5 className="text-center color-3 mb-3 fs-4 ">
                                    Edit your informations <i className="fas fa-cogs"></i>
                                </h5>
                                <Forms formAct="editPersonal" user={userData} />
                            </div>
                        </div>
                    </div>
                </section>
            </Modals>
            <Modals modalID="addSkillsModal" size="">
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
                                <h5 className="text-center color-3 mb-3 fs-4 ">
                                    Add a skill <i className="fas fa-cogs"></i>
                                </h5>
                                <Forms formAct="addSkills" />
                            </div>
                        </div>
                    </div>
                </section>
            </Modals>
            <Modals modalID="AddExpModal" size="">
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
                                <img src={edit2} className="img-fluid" alt="Phone image" width={"200"} />
                                <h5 className="text-center color-3 mb-3 fs-4 mt-2 ">
                                    Add experience <i className="fas fa-cogs"></i>
                                </h5>
                                <Forms formAct="AddExp" query={MeqQuery} />
                            </div>
                        </div>
                    </div>
                </section>
            </Modals>
            <Modals modalID={`AddEducationModal`} size="">
                <section className="">
                    <div className="container-fluid py-3  h-100">
                        <div className="row d-flex  align-items-center justify-content-center h-100">
                            <div className="col-md-12  col-sm-12 mx-auto text-center ">
                                <img src={edit2} className="img-fluid" alt="Phone image" width={"200"} />
                                <h5 className="text-center color-3 mb-3 fs-4 mt-2 ">
                                    Add Education <i className="fas fa-cogs"></i>
                                </h5>
                                <Forms formAct="addEducation" query={MeqQuery} />
                            </div>
                        </div>
                    </div>
                </section>
            </Modals>
            <Modals modalID={`EditExp`} size="">
                <section className="">
                    <div className="container-fluid py-3  h-100">
                        <div className="row d-flex  align-items-center justify-content-center h-100">
                            <div className="col-md-12  col-sm-12 mx-auto text-center ">
                                <img src={edit2} className="img-fluid" alt="Phone image" width={"200"} />
                                <h5 className="text-center color-3 mb-3 fs-4 mt-2 ">
                                    Edit Experience <i className="fas fa-cogs"></i>
                                </h5>
                                <Forms formAct="EditExp" exp={exp} query={MeqQuery} />
                            </div>
                        </div>
                    </div>
                </section>
            </Modals>
            {loading ? (
                <>
                    <Placeholders />
                </>
            ) : (
                <div className="card shadow border-0 p-2 mb-5 " style={{ borderRadius: "20px" }} data-aos="fade-down" data-aos-duration="700">
                    <div className="row justify-content-center align-items-center p-3">
                        <div className="col-md-6 col-sm-12 d-flex flex-column align-items-center justify-content-center">
                            {!loading && (
                                <label className="btn" htmlFor="avatar">
                                    <img
                                        src={`/uploads/avatars/${data.user.avatar}`}
                                        id="profilePic"
                                        className="rounded-pill"
                                        width="75"
                                        alt="picture"
                                    />
                                </label>
                            )}

                            {data.user.id == user.id && (
                                <form
                                    encType="multipart/form-data"
                                    className="d-flex flex-column justify-content-center"
                                    id="changePhotoForm"
                                    onSubmit={(e) => {
                                        e.preventDefault();

                                        SubmitForm();
                                        $("#submitchangeavatar").fadeOut();
                                    }}
                                >
                                    <input
                                        type={"file"}
                                        hidden
                                        id="avatar"
                                        accept="image/*"
                                        onChange={(e) => {
                                            setAvatar({
                                                image: e.target.files[0],
                                            });
                                            //  var file = $("#avatar")[0].files[0].name;
                                            var reader = new FileReader();
                                            reader.onload = function (e) {
                                                $("#profilePic").attr("src", e.target.result);
                                            };
                                            reader.readAsDataURL($("#avatar")[0].files[0]);

                                            $("#submitchangeavatar").fadeIn();
                                            e.preventDefault();
                                        }}
                                    />
                                    <button
                                        className="btn bg-color-6 text-white rounded"
                                        style={{ display: "none" }}
                                        id="submitchangeavatar"
                                        type="submit"
                                    >
                                        {" "}
                                        save
                                    </button>
                                </form>
                            )}

                            <span className="color-3 text-center">{loading ? "Fetching .. " : error ? error.message : data.user.name}</span>
                            <small className="color-3 fw-bold">
                                {loading ? "Fetching .. " : error ? error.message : data.user.type == 1 ? "Candidate" : "Employer"}
                            </small>
                        </div>
                        <div className="col-md-6 col-sm-12 d-flex justify-content-center">
                            {loading ? (
                                "..."
                            ) : data.user.id == user.id ? (
                                <button
                                    className="btn rounded-pill bg-color-6 color-2 px-2 started "
                                    data-bs-toggle="modal"
                                    href="#"
                                    data-bs-target="#editModal"
                                >
                                    <i className="fas fa-pen"></i> Edit info
                                </button>
                            ) : (
                                <button
                                    className="btn rounded-pill bg-color-6 color-2 px-2 started "
                                    onClick={(e) => {
                                        follow({
                                            variables: {
                                                user_id: data.user.id,
                                                followed_by: user.id,
                                            },
                                            refetchQueries: [{ query: MeqQuery }],
                                        });
                                    }}
                                >
                                    {" "}
                                    {followed ? (
                                        <>
                                            {RsltFollow.loading ? (
                                                <Spinner color="color-3" size={"spinner-border-sm"} />
                                            ) : (
                                                <>
                                                    {" "}
                                                    <i className="fas fa-user-minus"></i>{" "}
                                                </>
                                            )}
                                            Unfollow
                                        </>
                                    ) : (
                                        <>
                                            {RsltFollow.loading ? (
                                                <Spinner color="color-3" size={"spinner-border-sm"} />
                                            ) : (
                                                <>
                                                    {" "}
                                                    <i className="fas fa-user-plus"></i>{" "}
                                                </>
                                            )}
                                            Follow
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="d-flex justify-content-around text-center bg-light p-2 rounded-pill border-top-1 align-items-center mb-3">
                        {loading ? (
                            <Spinner color="color-6" />
                        ) : (
                            data.user != null && (
                                <>
                                    <div className="col">
                                        <strong>{data.user.followers.length}</strong> Followers
                                    </div>
                                    <div className="col">
                                        <strong>{data.user.following.length}</strong> Following
                                    </div>
                                </>
                            )
                        )}
                    </div>

                    {loading ? (
                        <div className="spinner-border color-6 text-center mx-auto" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    ) : (
                        <div className="">
                            <div className="accordion accordion-flush" id="abt">
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="">
                                        <button
                                            className="accordion-button collapsed rounded-pill  color-3 shadow-sm  mb-3"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            style={{
                                                border: "1px solid #eee",
                                                background: "transparent",
                                            }}
                                            data-bs-target="#about"
                                            aria-expanded="true"
                                            aria-controls="about"
                                        >
                                            <i className="fas fa-question"></i>
                                            &nbsp;
                                            {data.user.type == 1 ? "About Me" : "About Us"}
                                        </button>
                                    </h2>
                                    <div id="about" className="accordion-collapse collapse " aria-labelledby="" data-bs-parent="#abt">
                                        <div className="accordion-body mb-5 d-flex flex-column">
                                            <textarea
                                                className="text-muted form-control shadow-none border-0 "
                                                disabled={true}
                                                style={{ resize: "none" }}
                                                rows={5}
                                                id="aboutMeArea"
                                                placeholder="Tell people something about you"
                                                defaultValue={!loading && error ? error.message : data.user.about != "" ? data.user.about : ""}
                                            >
                                                {/* Diplômé avec un diplôme fondamental en
informatique de gestion et un étudiant
en ingénierie informatique. Mes
antécédents pédagogiques et mes efforts
personnels m'ont permis d'acquérir des
connaissances et des compétences
approfondies dans le domaine du
développement Web. */}
                                            </textarea>
                                            {data.user.id == user.id && (
                                                <>
                                                    <button
                                                        className="btn w-25 align-self-end rounded-pill  bg-color-6 color-2"
                                                        id="editBio"
                                                        onClick={(e) => {
                                                            $("#aboutMeArea").attr("disabled", false);
                                                            $("#aboutMeArea").focus();
                                                            $("#" + e.target.id).fadeOut();
                                                            setTimeout(() => {
                                                                $("#SaveBio").fadeIn();
                                                            }, 700);
                                                        }}
                                                    >
                                                        <i className="fas fa-pen"></i>
                                                        &nbsp;Edit
                                                    </button>
                                                    <button
                                                        className="btn w-25 align-self-end rounded-pill  bg-color-6 color-2"
                                                        id="SaveBio"
                                                        style={{ display: "none" }}
                                                        onClick={(e) => {
                                                            if ($("#aboutMeArea").val() == "") {
                                                                toastr.error("You can't leave the field empty !");
                                                            } else {
                                                                $("#aboutMeArea").attr("disabled", true);
                                                                $("#aboutMeArea").focus();
                                                                $("#" + e.target.id).fadeOut();
                                                                setTimeout(() => {
                                                                    $("#editBio").fadeIn();
                                                                }, 700);

                                                                if (data.user.about === $("#aboutMeArea").val()) {
                                                                    toastr.info("There is no changes to apply");
                                                                } else {
                                                                    update_about({
                                                                        variables: {
                                                                            id: data.user.id,
                                                                            about: $("#aboutMeArea").val(),
                                                                        },
                                                                        refetchQueries: [
                                                                            {
                                                                                query: MeqQuery,
                                                                            },
                                                                        ],
                                                                    });
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        Save
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="accordion accordion-flush" id="contactsCont">
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingOne">
                                        <button
                                            className="accordion-button collapsed rounded-pill  color-3 shadow-sm  mb-3"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            style={{
                                                border: "1px solid #eee",
                                                background: "transparent",
                                            }}
                                            data-bs-target="#contacts"
                                            aria-expanded="true"
                                            aria-controls="contacts"
                                        >
                                            <i className="fas fa-phone"></i>
                                            &nbsp;
                                            {data.user.type == 1 ? "My Contacts" : "Our Contacts"}
                                        </button>
                                    </h2>
                                    <div id="contacts" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#abt">
                                        <div className="accordion-body mb-5">
                                            <div className="d-flex flex-column flex-wrap align-items-center justify-content-center">
                                                <div className="col">
                                                    <i className="fas fa-at"></i> Email : <span>{data.user.email}</span>
                                                </div>
                                                {data.user.phone != "" && (
                                                    <div className="col d-flex align-items-center">
                                                        <span>
                                                            <i className="fas fa-phone"></i> Phone :{" "}
                                                        </span>
                                                        {data.user.phone != null ? (
                                                            <>
                                                                <input
                                                                    type={"number"}
                                                                    defaultValue={data.user.phone}
                                                                    id="phoneInput"
                                                                    className="form-control shadow-none text-center  bg-white border-0 w-50 "
                                                                    disabled={true}
                                                                    onKeyPress={(e) => {
                                                                        if (data.user.id == user.id) {
                                                                            if (e.which == 13) {
                                                                                UpdatePhone(e);
                                                                            }
                                                                        }
                                                                    }}
                                                                />{" "}
                                                                &nbsp;
                                                                {data.user.id == user.id && (
                                                                    <>
                                                                        <a
                                                                            className="color-6 text-center fw-bold"
                                                                            id="btnEditPhone"
                                                                            href="#!"
                                                                            onClick={() => {
                                                                                $("#phoneInput").attr("disabled", false);
                                                                                $("#phoneInput").focus();
                                                                                $("#btnEditPhone").fadeOut();
                                                                                $("#savePhone").fadeIn();
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-pen"></i>
                                                                        </a>
                                                                        <a
                                                                            id="savePhone"
                                                                            className="color-6 text-center fw-bold"
                                                                            href="#!"
                                                                            style={{
                                                                                display: "none",
                                                                            }}
                                                                            onClick={(e) => {
                                                                                UpdatePhone(e);
                                                                            }}
                                                                        >
                                                                            {Rsltupdate.loading ? (
                                                                                <Spinner color="color-6" size="spinner-border-sm" />
                                                                            ) : (
                                                                                <i className="fas fa-save"></i>
                                                                            )}
                                                                        </a>
                                                                    </>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <a
                                                                    className="color-6 text-center fw-bold"
                                                                    onClick={() => {
                                                                        alertify.prompt(
                                                                            "Add phone number",
                                                                            "Please insert below your phone number",
                                                                            "",
                                                                            (ev, val) => {
                                                                                if (val == "") {
                                                                                    toastr.error("Pleae don't leave this field empty !");
                                                                                } else {
                                                                                    update_user({
                                                                                        variables: {
                                                                                            id: user.id,
                                                                                            phone: parseInt(val),
                                                                                        },
                                                                                    });
                                                                                }
                                                                            },
                                                                            () => {}
                                                                        );
                                                                    }}
                                                                >
                                                                    Add phone number
                                                                </a>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {data.user.type == 1 && (
                                <>
                                    <div className="accordion accordion-flush" id="accordionExample">
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingOne">
                                                <button
                                                    className="accordion-button collapsed   rounded-pill color-3 shadow-sm mb-3"
                                                    type="button"
                                                    style={{
                                                        border: "1px solid #eee",
                                                        background: "transparent",
                                                    }}
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#collapseOne"
                                                    aria-expanded="true"
                                                    aria-controls="collapseOne"
                                                >
                                                    <i className="fas fa-user-chart"></i> &nbsp;My Experiences
                                                </button>
                                            </h2>
                                            <div
                                                id="collapseOne"
                                                className="accordion-collapse collapse"
                                                aria-labelledby="headingOne"
                                                data-bs-parent="#contactsCont"
                                            >
                                                <div className="accordion-body mb-5">
                                                    <div className="col-lg-12 m-15px-tb bg-transparent">
                                                        <div className="resume-box d-flex flex-column-reverse">
                                                            <ul>
                                                                {!error && data.user.experiences.length > 0
                                                                    ? data.user.experiences.map((e) => {
                                                                          return (
                                                                              <li key={e.id}>
                                                                                  <div className="icon">
                                                                                      <i className="fas fa-user-graduate"></i>
                                                                                  </div>

                                                                                  <span className="time">
                                                                                      {moment(e.from).format("MMM YYYY")}-{" "}
                                                                                      {e.current == 1 ? "present" : moment(e.to).format("MMM YYYY")}
                                                                                  </span>
                                                                                  <h5>
                                                                                      {e.title} - {e.company}
                                                                                      <a
                                                                                          className="btn"
                                                                                          data-bs-toggle="modal"
                                                                                          href="#"
                                                                                          data-bs-target="#EditExp"
                                                                                          onClick={async (event) => {
                                                                                              await setExp({
                                                                                                  id: e.id,
                                                                                                  title: e.title,
                                                                                                  company: e.company,
                                                                                                  from: e.from,
                                                                                                  to: e.to,
                                                                                                  current: e.current,
                                                                                                  description: e.description,
                                                                                              });
                                                                                          }}
                                                                                      >
                                                                                          {" "}
                                                                                          <i className="fas fa-pen text-dark"></i>
                                                                                      </a>
                                                                                      <a
                                                                                          className="btn"
                                                                                          href="#"
                                                                                          onClick={async (event) => {
                                                                                              DeleteExperiencehandler(e.id);
                                                                                          }}
                                                                                      >
                                                                                          {" "}
                                                                                          <i className="fas fa-trash text-dark"></i>
                                                                                      </a>
                                                                                  </h5>
                                                                                  <p>{e.description}</p>
                                                                              </li>
                                                                          );
                                                                      })
                                                                    : "Add experiences and they will be shown here"}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion accordion-flush" id="educationCont">
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="">
                                                <button
                                                    className="accordion-button collapsed  rounded-pill color-3 shadow-sm  mb-3"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#education"
                                                    aria-expanded="true"
                                                    aria-controls="education"
                                                    style={{
                                                        border: "1px solid #eee",
                                                        background: "transparent",
                                                    }}
                                                >
                                                    <i className="fas fa-graduation-cap"></i> My Education
                                                </button>
                                            </h2>
                                            <div
                                                id="education"
                                                className="accordion-collapse collapse"
                                                aria-labelledby=""
                                                data-bs-parent="#accordionExample"
                                            >
                                                <div className="accordion-body mb-5">
                                                    <div className="col-lg-12 m-15px-tb bg-transparent">
                                                        <div className="resume-box">
                                                            <ul>
                                                                {data.user.educations.length > 0 ? (
                                                                    data.user.educations.map((e) => {
                                                                        return (
                                                                            <li key={e.id}>
                                                                                <div className="icon">
                                                                                    <i className="fas fa-user-graduate"></i>
                                                                                </div>
                                                                                <span className="time">
                                                                                    {moment(e.from).format("MMM YYYY")}-
                                                                                    {e.current == 1 ? "Present" : moment(e.to).format("MMM YYYY")}
                                                                                </span>
                                                                                <h5>
                                                                                    {e.title}
                                                                                    &nbsp; at &nbsp;
                                                                                    {e.location}
                                                                                    <a className="btn">
                                                                                        {" "}
                                                                                        <i className="fas fa-pen text-dark"></i>
                                                                                    </a>
                                                                                </h5>
                                                                            </li>
                                                                        );
                                                                    })
                                                                ) : (
                                                                    <>NO education added yet</>
                                                                )}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion accordion-flush" id="skillsCont">
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingOne">
                                                <button
                                                    className="accordion-button collapsed  rounded-pill color-3 shadow-sm  mb-3"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#skills"
                                                    aria-expanded="true"
                                                    style={{
                                                        border: "1px solid #eee",
                                                        background: "transparent",
                                                    }}
                                                    aria-controls="skills"
                                                >
                                                    <i className="fas fa-user-cog"></i>
                                                    &nbsp;My Skills
                                                </button>
                                            </h2>
                                            <div
                                                id="skills"
                                                className="accordion-collapse collapse"
                                                aria-labelledby="headingOne"
                                                data-bs-parent="#educationCont"
                                            >
                                                <div className="accordion-body mb-5">
                                                    <div className="col-lg-12 m-15px-tb bg-transparent">
                                                        <div className="d-flex flex-row flex-wrap justify-content-start">
                                                            {data.user.skills.length > 0
                                                                ? data.user.skills.map((e) => {
                                                                      return (
                                                                          <span
                                                                              key={e.id}
                                                                              className="badge rounded-pill bg-color-6 mx-2 my-2"
                                                                              style={{
                                                                                  fontSize: "16px",
                                                                              }}
                                                                          >
                                                                              {e.label}
                                                                              {"  "}
                                                                              {data.user.id == user.id && (
                                                                                  <a
                                                                                      style={{
                                                                                          fontSize: "13px",
                                                                                      }}
                                                                                      onClick={(ev) => {
                                                                                          DeleteSkill(e.id);
                                                                                      }}
                                                                                  >
                                                                                      <i className="fas fa-trash text-light"></i>
                                                                                  </a>
                                                                              )}
                                                                          </span>
                                                                      );
                                                                  })
                                                                : "No skills added yet"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
            {loading ? (
                <Placeholders />
            ) : (
                data.user.type == 2 && (
                    <>
                        {" "}
                        <div className="d-flex align-items-center justify-content-center mt-2 mb-4 ">
                            <span className="border-1 w-50 color-1" style={{ borderBottom: "2px solid red" }}></span>
                            <span className="mx-2 text-center w-100 text-muted">Our job offers</span>
                            <span className="border-1 w-50" style={{ border: "1px solid #eee" }}></span>
                        </div>
                        {data.user.posts.length == 0 ? (
                            <NotFound text="We have not posted an offer yet" />
                        ) : (
                            data.user.posts.map((post) => {
                                return <Post key={post.id} details={{ posts: post }} query={MeqQuery} />;
                            })
                        )}
                    </>
                )
            )}
        </div>
    );
};
export default Profile;
