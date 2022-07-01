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
const Profile = (props) => {
    const user = JSON.parse(JSON.parse(localStorage.getItem(AUTH_USER)));
    const MeqQuery = gql`
        query {
            me {
                id
                name
                email
                type
                about
                experiences {
                    id
                    title
                    company
                    from
                    to
                    current
                    description
                }
                birthDate
                posts {
                    title
                }
                comments {
                    content
                }
            }
        }
    `;
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
            toastr.success("Bio updated");
        },
    });
    const [userData, setUserData] = useState({
        email: "",
        name: "",
        birthday: "",
        about: "",
        phone: "",
        address: "",
        city: "",
        state: "",
    });
    const { loading, error, data } = useQuery(MeqQuery, {
        onError(err) {
            toastr.error(err.message);
            console.log(err.graphQLErrors);
        },
        onCompleted: (data) => {
            setUserData({
                email: data.me.email,
                name: data.me.name,
                birthday: data.me.birthDate,
                about: data.me.about,
            });
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
                                <img
                                    src={editPng}
                                    className="img-fluid"
                                    alt="Phone image"
                                    width={"200"}
                                />
                                <h5 className="text-center color-3 mb-3 fs-4 ">
                                    Edit your informations{" "}
                                    <i className="fas fa-cogs"></i>
                                </h5>
                                <Forms formAct="editPersonal" user={userData} />
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
                                <img
                                    src={edit2}
                                    className="img-fluid"
                                    alt="Phone image"
                                    width={"200"}
                                />
                                <h5 className="text-center color-3 mb-3 fs-4 mt-2 ">
                                    Add experience{" "}
                                    <i className="fas fa-cogs"></i>
                                </h5>
                                <Forms formAct="AddExp" query={MeqQuery} />
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
                                <img
                                    src={edit2}
                                    className="img-fluid"
                                    alt="Phone image"
                                    width={"200"}
                                />
                                <h5 className="text-center color-3 mb-3 fs-4 mt-2 ">
                                    Edit Experience{" "}
                                    <i className="fas fa-cogs"></i>
                                </h5>
                                <Forms
                                    formAct="EditExp"
                                    exp={exp}
                                    query={MeqQuery}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </Modals>
            <div
                className="card shadow-lg border-0 p-2 mb-5 profile"
                style={{ borderRadius: "20px" }}
                data-aos="fade-down"
                data-aos-duration="700"
            >
                <div className="row justify-content-center align-items-center p-3">
                    <div className="col-md-6 col-sm-12 d-flex flex-column align-items-center justify-content-center">
                        <img
                            src={Photo1}
                            className="rounded-pill"
                            width="75"
                            alt=""
                        />

                        <span className="color-3 text-center">
                            {loading ? "Fetching .. " : data.me.name}
                        </span>
                        <small className="color-3 fw-bold">
                            {loading
                                ? "Fetching .. "
                                : data.me.type == 1
                                ? "Candidate"
                                : "Employer"}
                        </small>
                    </div>
                    <div className="col-md-6 col-sm-12 d-flex justify-content-center">
                        <button
                            className="btn rounded-pill bg-color-6 color-2 px-2 started "
                            data-bs-toggle="modal"
                            href="#"
                            data-bs-target="#editModal"
                        >
                            <i className="fas fa-pen"></i> Edit info
                        </button>
                    </div>
                </div>
                <div className="d-flex justify-content-around text-center bg-light p-2 rounded-pill border-top-1 align-items-center mb-3">
                    <div className="col">
                        <strong>250</strong> Followers
                    </div>
                    <div className="col">
                        <strong>90</strong> Following
                    </div>
                </div>

                {loading ? (
                    <div
                        className="spinner-border color-6 text-center mx-auto"
                        role="status"
                    >
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
                                        {user.type == 1
                                            ? "About Me"
                                            : "About Us"}
                                    </button>
                                </h2>
                                <div
                                    id="about"
                                    className="accordion-collapse collapse "
                                    aria-labelledby=""
                                    data-bs-parent="#abt"
                                >
                                    <div className="accordion-body mb-5 d-flex flex-column">
                                        <textarea
                                            className="text-muted form-control shadow-none border-0 "
                                            disabled={true}
                                            style={{ resize: "none" }}
                                            rows={5}
                                            id="aboutMeArea"
                                            placeholder="Tell people something about you"
                                            defaultValue={
                                                !loading && data.me.about != ""
                                                    ? data.me.about
                                                    : ""
                                            }
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
                                        <button
                                            className="btn w-25 align-self-end rounded-pill  bg-color-6 color-2"
                                            id="editBio"
                                            onClick={(e) => {
                                                $("#aboutMeArea").attr(
                                                    "disabled",
                                                    false
                                                );
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
                                                if (
                                                    $("#aboutMeArea").val() ==
                                                    ""
                                                ) {
                                                    toastr.error(
                                                        "You can't leave the field empty !"
                                                    );
                                                } else {
                                                    $("#aboutMeArea").attr(
                                                        "disabled",
                                                        true
                                                    );
                                                    $("#aboutMeArea").focus();
                                                    $(
                                                        "#" + e.target.id
                                                    ).fadeOut();
                                                    setTimeout(() => {
                                                        $("#editBio").fadeIn();
                                                    }, 700);

                                                    if (
                                                        data.me.about ==
                                                        $("#aboutMeArea").val()
                                                    ) {
                                                        toastr.info(
                                                            "There is no changes to apply"
                                                        );
                                                    } else {
                                                        update_about({
                                                            variables: {
                                                                id: data.me.id,
                                                                about: $(
                                                                    "#aboutMeArea"
                                                                ).val(),
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
                                    </div>
                                </div>
                            </div>
                        </div>
                        {user.type == 1 && (
                            <>
                                <div
                                    className="accordion accordion-flush"
                                    id="accordionExample"
                                >
                                    <div className="accordion-item">
                                        <h2
                                            className="accordion-header"
                                            id="headingOne"
                                        >
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
                                                <i className="fas fa-user-chart"></i>{" "}
                                                &nbsp;My Experiences
                                            </button>
                                        </h2>
                                        <div
                                            id="collapseOne"
                                            className="accordion-collapse collapse"
                                            aria-labelledby="headingOne"
                                            data-bs-parent="#abt"
                                        >
                                            <div className="accordion-body mb-5">
                                                <div className="col-lg-12 m-15px-tb bg-transparent">
                                                    <div className="resume-box d-flex flex-column-reverse">
                                                        <ul>
                                                            {data.me.experiences
                                                                .length > 0
                                                                ? data.me.experiences.map(
                                                                      (e) => {
                                                                          return (
                                                                              <li
                                                                                  key={
                                                                                      e.id
                                                                                  }
                                                                              >
                                                                                  <div className="icon">
                                                                                      <i className="fas fa-user-graduate"></i>
                                                                                  </div>

                                                                                  <span className="time">
                                                                                      {moment(
                                                                                          e.from
                                                                                      ).format(
                                                                                          "MMM YYYY"
                                                                                      )}

                                                                                      -{" "}
                                                                                      {e.current ==
                                                                                      1
                                                                                          ? "present"
                                                                                          : moment(
                                                                                                e.to
                                                                                            ).format(
                                                                                                "MMM YYYY"
                                                                                            )}
                                                                                  </span>
                                                                                  <h5>
                                                                                      {
                                                                                          e.title
                                                                                      }{" "}
                                                                                      -{" "}
                                                                                      {
                                                                                          e.company
                                                                                      }
                                                                                      <a
                                                                                          className="btn"
                                                                                          data-bs-toggle="modal"
                                                                                          href="#"
                                                                                          data-bs-target="#EditExp"
                                                                                          onClick={async (
                                                                                              event
                                                                                          ) => {
                                                                                              await setExp(
                                                                                                  {
                                                                                                      id: e.id,
                                                                                                      title: e.title,
                                                                                                      company:
                                                                                                          e.company,
                                                                                                      from: e.from,
                                                                                                      to: e.to,
                                                                                                      current:
                                                                                                          e.current,
                                                                                                      description:
                                                                                                          e.description,
                                                                                                  }
                                                                                              );
                                                                                          }}
                                                                                      >
                                                                                          {" "}
                                                                                          <i className="fas fa-pen text-dark"></i>
                                                                                      </a>
                                                                                      <a
                                                                                          className="btn"
                                                                                          href="#"
                                                                                          onClick={async (
                                                                                              event
                                                                                          ) => {
                                                                                              DeleteExperiencehandler(
                                                                                                  e.id
                                                                                              );
                                                                                          }}
                                                                                      >
                                                                                          {" "}
                                                                                          <i className="fas fa-trash text-dark"></i>
                                                                                      </a>
                                                                                  </h5>
                                                                                  <p>
                                                                                      {
                                                                                          e.description
                                                                                      }
                                                                                  </p>
                                                                              </li>
                                                                          );
                                                                      }
                                                                  )
                                                                : "Add experiences and they will be shown here"}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="accordion accordion-flush"
                                    id="educationCont"
                                >
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
                                                <i className="fas fa-graduation-cap"></i>{" "}
                                                My Education
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
                                                    <button className="btn   rounded-pill  bg-color-6 color-2">
                                                        <i className="fas fa-plus"></i>
                                                        &nbsp;Add Education
                                                    </button>
                                                    <div className="resume-box">
                                                        <ul>
                                                            <li>
                                                                <div className="icon">
                                                                    <i className="fas fa-user-graduate"></i>
                                                                </div>
                                                                <span className="time">
                                                                    2019 -
                                                                    Present
                                                                </span>
                                                                <h5>
                                                                    Art Director
                                                                    - Facebook
                                                                    Inc
                                                                    <a className="btn">
                                                                        {" "}
                                                                        <i className="fas fa-pen text-dark"></i>
                                                                    </a>
                                                                </h5>
                                                                <p>
                                                                    Lorem ipsum
                                                                    dolor sit
                                                                    amet,
                                                                    consectetur
                                                                    adipisicing
                                                                    elit, sed do
                                                                    eiusmod
                                                                    tempor
                                                                    incididunt
                                                                    ut labore et
                                                                    dolore magna
                                                                    aliqua.
                                                                </p>
                                                            </li>
                                                            <li>
                                                                <div className="icon">
                                                                    <i className="fas fa-user-graduate"></i>
                                                                </div>
                                                                <span className="time">
                                                                    2019 -
                                                                    Present
                                                                </span>
                                                                <h5>
                                                                    Art Director
                                                                    - Facebook
                                                                    Inc
                                                                </h5>
                                                                <p>
                                                                    Lorem ipsum
                                                                    dolor sit
                                                                    amet,
                                                                    consectetur
                                                                    adipisicing
                                                                    elit, sed do
                                                                    eiusmod
                                                                    tempor
                                                                    incididunt
                                                                    ut labore et
                                                                    dolore magna
                                                                    aliqua.
                                                                </p>
                                                            </li>
                                                            <li>
                                                                <div className="icon">
                                                                    <i className="fas fa-user-graduate"></i>
                                                                </div>
                                                                <span className="time">
                                                                    2019 -
                                                                    Present
                                                                </span>
                                                                <h5>
                                                                    Art Director
                                                                    - Facebook
                                                                    Inc
                                                                </h5>
                                                                <p>
                                                                    Lorem ipsum
                                                                    dolor sit
                                                                    amet,
                                                                    consectetur
                                                                    adipisicing
                                                                    elit, sed do
                                                                    eiusmod
                                                                    tempor
                                                                    incididunt
                                                                    ut labore et
                                                                    dolore magna
                                                                    aliqua.
                                                                </p>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="accordion accordion-flush"
                                    id="skillsCont"
                                >
                                    <div className="accordion-item">
                                        <h2
                                            className="accordion-header"
                                            id="headingOne"
                                        >
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
                                                    <div className="resume-box">
                                                        <ul>
                                                            <li>
                                                                <div className="icon">
                                                                    <i className="fas fa-user-graduate"></i>
                                                                </div>
                                                                <span className="time">
                                                                    2019 -
                                                                    Present
                                                                </span>
                                                                <h5>
                                                                    Art Director
                                                                    - Facebook
                                                                    Inc
                                                                </h5>
                                                                <p>
                                                                    Lorem ipsum
                                                                    dolor sit
                                                                    amet,
                                                                    consectetur
                                                                    adipisicing
                                                                    elit, sed do
                                                                    eiusmod
                                                                    tempor
                                                                    incididunt
                                                                    ut labore et
                                                                    dolore magna
                                                                    aliqua.
                                                                </p>
                                                            </li>
                                                            <li>
                                                                <div className="icon">
                                                                    <i className="fas fa-user-graduate"></i>
                                                                </div>
                                                                <span className="time">
                                                                    2019 -
                                                                    Present
                                                                </span>
                                                                <h5>
                                                                    Art Director
                                                                    - Facebook
                                                                    Inc
                                                                </h5>
                                                                <p>
                                                                    Lorem ipsum
                                                                    dolor sit
                                                                    amet,
                                                                    consectetur
                                                                    adipisicing
                                                                    elit, sed do
                                                                    eiusmod
                                                                    tempor
                                                                    incididunt
                                                                    ut labore et
                                                                    dolore magna
                                                                    aliqua.
                                                                </p>
                                                            </li>
                                                            <li>
                                                                <div className="icon">
                                                                    <i className="fas fa-user-graduate"></i>
                                                                </div>
                                                                <span className="time">
                                                                    2019 -
                                                                    Present
                                                                </span>
                                                                <h5>
                                                                    Art Director
                                                                    - Facebook
                                                                    Inc
                                                                </h5>
                                                                <p>
                                                                    Lorem ipsum
                                                                    dolor sit
                                                                    amet,
                                                                    consectetur
                                                                    adipisicing
                                                                    elit, sed do
                                                                    eiusmod
                                                                    tempor
                                                                    incididunt
                                                                    ut labore et
                                                                    dolore magna
                                                                    aliqua.
                                                                </p>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="accordion accordion-flush"
                                    id="accordionExample"
                                >
                                    <div className="accordion-item">
                                        <h2
                                            className="accordion-header"
                                            id="headingOne"
                                        >
                                            <button
                                                className="accordion-button collapsed rounded-pill  color-3 shadow-sm  mb-3"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                style={{
                                                    border: "1px solid #eee",
                                                    background: "transparent",
                                                }}
                                                data-bs-target="#interests"
                                                aria-expanded="true"
                                                aria-controls="interests"
                                            >
                                                <i className="fas fa-search"></i>
                                                &nbsp;My Intersets
                                            </button>
                                        </h2>
                                        <div
                                            id="interests"
                                            className="accordion-collapse collapse"
                                            aria-labelledby="headingOne"
                                            data-bs-parent="#skillsCont"
                                        >
                                            <div className="accordion-body mb-5">
                                                <div className="d-flex flex-row flex-wrap justify-content-start">
                                                    <span className="badge rounded-pill bg-color-5 mx-2">
                                                        Web development
                                                    </span>
                                                    <span className="badge rounded-pill bg-color-5 mx-2">
                                                        Primary
                                                    </span>
                                                    <span className="badge rounded-pill bg-color-5 mx-2">
                                                        Primary
                                                    </span>
                                                    <span className="badge rounded-pill bg-color-5 mx-2">
                                                        Primary
                                                    </span>
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
        </div>
    );
};
export default Profile;
