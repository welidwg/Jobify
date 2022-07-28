import React from "react";
import { useEffect, useState } from "react";
import $ from "jquery";
import toastr from "toastr";
import { gql, useMutation } from "@apollo/client";
import { AUTH_TOKEN } from "../constants";
import { AUTH_USER } from "../constants";
import Spinner from "../Components/dashboard/layouts/spinner";
import { AddNotif, AddSkill, Add_skill } from "../Components/dashboard/scripts/Mutations";
// import alertify from "alertifyjs";
import { UpdatePost, AddReqs, UpdateUserMutation } from "../Components/dashboard/scripts/Mutations";
const Forms = (props) => {
    const authToken = localStorage.getItem(AUTH_TOKEN);
    const user = JSON.parse(JSON.parse(localStorage.getItem(AUTH_USER)));
    const [add_notif, RsltNotif] = useMutation(AddNotif, {
        onCompleted: (res) => {
            console.log("done");
        },
        onError: (err) => {
            console.log(err);
        },
    });
    const AuthUser = gql`
        mutation UserLogin($email: String!, $password: String!, $device: String!) {
            login(email: $email, password: $password, device: $device)
        }
    `;
    const CreateUser = gql`
        mutation createUsr(
            $email: String!
            $name: String!
            $password: String!
            $type: Int!
            $birthday: String!
            $phone: Int!
            $city: String
            $address: String
        ) {
            createUser(
                email: $email
                name: $name
                password: $password
                type: $type
                birthday: $birthday
                phone: $phone
                city: $city
                address: $address
            )
        }
    `;
    const CreateExp = gql`
        mutation createExp($title: String, $company: String, $description: String, $from: String, $to: String, $current: Int, $user_id: ID) {
            addExperience(title: $title, company: $company, description: $description, from: $from, to: $to, current: $current, user_id: $user_id)
        }
    `;
    const CreateEducation = gql`
        mutation createExp($title: String, $location: String, $from: String, $to: String, $current: Int, $user_id: ID) {
            addEducation(title: $title, location: $location, from: $from, to: $to, current: $current, user_id: $user_id)
        }
    `;
    const UpdateExp = gql`
        mutation createExp(
            $id: ID!
            $title: String
            $company: String
            $description: String
            $from: String
            $to: String
            $current: Int
            $user_id: ID
        ) {
            updateExperience(
                id: $id
                title: $title
                company: $company
                description: $description
                from: $from
                to: $to
                current: $current
                user_id: $user_id
            )
        }
    `;
    const AddPost = gql`
        mutation creatPost($title: String, $description: String, $salary: Float, $places: Int, $type: String, $user_id: ID, $statut: Int) {
            createPost(title: $title, description: $description, salary: $salary, user_id: $user_id, type: $type, places: $places, statut: $statut) {
                id
                company {
                    id
                    name
                }
            }
        }
    `;

    const AddPostSkills = gql`
        mutation AddPostSkills($label: String, $post_id: ID!) {
            addSkillPostt(label: $label, post_id: $post_id) {
                label
            }
        }
    `;
    const [add_reqs, RsltAddReqs] = useMutation(AddReqs, {
        onError(err) {
            err.graphQLErrors.map((item) => {
                console.log(item);
            });
            toastr.error("Error while adding the requirements");
        },
        onCompleted(data) {
            console.log("requirement added");
            // $("#signForm").trigger("reset");
        },
    });
    const [add_postskills, RsltAddPostSkills] = useMutation(AddPostSkills, {
        onError(err) {
            err.graphQLErrors.map((item) => {
                console.log(item);
            });
            toastr.error("Error while adding the skills");
        },
        onCompleted(data) {
            console.log("skills added");
            // $("#signForm").trigger("reset");
        },
    });
    const [create_post, RsltCreatePost] = useMutation(AddPost, {
        onError(err) {
            err.graphQLErrors.map((item) => {
                console.log(item);
            });
            toastr.error("error");

            // console.log(err.graphQLErrors);
        },
        onCompleted(data) {
            requirements.label.map((req) => {
                if (req != "") {
                    add_reqs({
                        variables: { label: req, post_id: data.createPost.id },
                    });
                }
            });
            skillsPost.label.map((skill) => {
                if (skill != "") {
                    add_postskills({
                        variables: { label: skill, post_id: data.createPost.id },
                    });
                }
            });
            if (!RsltAddPostSkills.loading && !RsltAddReqs.loading && !RsltCreatePost.loading) {
                toastr.success("Job offer successfully created !");
                add_notif({
                    variables: {
                        user_id: null,
                        to: "1",
                        title: "New job offer",
                        content: `${data.createPost.company.name} have posted a new job offer`,
                        from: data.createPost.company.id,
                    },
                });
            } else {
                toastr.warning("Proceeding ..");
            }
            //console.log(data);
            // $("#signForm").trigger("reset");
        },
    });

    const [create_user, load] = useMutation(CreateUser, {
        onError: (err) => {
            err.graphQLErrors.map((item) => {
                // item.extensions.validation.map((elmt) => {
                //     console.log(elmt);
                // });
                console.log(item);
                if (item.extensions.validation != undefined) {
                    for (const k in item.extensions.validation) {
                        toastr.error(item.extensions.validation[k]);
                    }
                    //     if (item.extensions.validation.password != undefined) {
                    //         toastr.error(
                    //             item.extensions.validation.password[0]
                    //         );
                    //     }
                    // if (item.extensions.validation.email != undefined) {
                    //     toastr.error(item.extensions.validation.email[0]);
                    // }
                    // if (item.extensions.validation.email != undefined) {
                    //     toastr.error(item.extensions.validation.email[0]);
                    // }
                }
            });
            console.log(err);
            // console.log(err.graphQLErrors);
        },
        onCompleted(data) {
            toastr.success("Account Successfully created");
            $("#signForm").trigger("reset");
        },
    });

    const [create_experience, RsltExp] = useMutation(CreateExp, {
        onError(err) {
            console.log(err.graphQLErrors);
            toastr.error("something went wworng");
        },
        onCompleted(data) {
            toastr.success("Experience added successfully ! ");
            $("#addExpForm").trigger("reset");
        },
    });
    const [create_education, RsltEducation] = useMutation(CreateEducation, {
        onError(err) {
            console.log(err.graphQLErrors);
            toastr.error("something went wworng");
        },
        onCompleted(data) {
            toastr.success("Education added successfully ! ");
            $("#addEducationForm").trigger("reset");
        },
    });
    const [update_exp, RsltUpdateExp] = useMutation(UpdateExp, {
        onError(err) {
            console.log(err.graphQLErrors);
            toastr.error("something went wworng");
        },
        onCompleted(data) {
            toastr.success("Experience updated successfully ! ");
            $("#editExpForm").trigger("reset");
        },
    });

    const [auth_user, { data1, loading, error }] = useMutation(AuthUser, {
        onError(err) {
            console.log(err.graphQLErrors);
            toastr.error(err.message);
        },
        onCompleted(data) {
            toastr.success("Logged In");
            // console.log(data);
            let token = data.login[0];
            let user = JSON.stringify(data.login[1]);
            localStorage.setItem(AUTH_TOKEN, token);
            localStorage.setItem(AUTH_USER, user);
            setTimeout(() => {
                window.location.href = "/dash";
            }, 700);
        },
    });

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const [registerData, setRegisterData] = useState({
        email: "",
        name: "",
        password: "",
        type: 1,
        birthday: "",
        phone: 0,
        address: "",
        city: "",
        state: "Tunisia",
    });
    useEffect(() => {
        if (registerData.type == 2) {
            $("#birthday").fadeOut();
            $("#cityCont").fadeIn();
            $("#addressCont").fadeIn();
        } else {
            $("#birthday").fadeIn();
            $("#cityCont").fadeOut();
            $("#addressCont").fadeOut();
        }
    }, [registerData.type]);
    let user_id = user != undefined ? user.id : 0;

    const [experienceData, setExpexperienceData] = useState({
        id: 0,
        title: "",
        company: "",
        user_id: user_id,
        current: 0,
        description: "",
        from: "",
        to: "",
    });
    const [postData, setPostData] = useState({
        title: "",
        description: "",
        salary: 0,
        type: "",
        places: 0,
        user_id: user_id,
        statut: 1,
    });
    const [requirements, setReqs] = useState({
        label: [""],
    });
    const [skillsPost, setSkillsPost] = useState({
        label: [""],
    });
    function handleAddPost(e) {
        if (e.target.name == "places") {
            setPostData({ ...postData, places: parseInt(e.target.value) });
        } else if (e.target.name == "salary") {
            setPostData({ ...postData, salary: parseFloat(e.target.value) });
        } else {
            setPostData({ ...postData, [e.target.name]: e.target.value });
        }
    }
    function handleReqs(e) {
        var values = $("input[name='reqs[]'")
            .map(function () {
                return $(this).val();
            })
            .get();
        setReqs({ ...requirements, label: values });
    }
    function handlePostSkills(e) {
        var values = $("input[name='skills[]'")
            .map(function () {
                return $(this).val();
            })
            .get();
        setSkillsPost({ ...skillsPost, label: values });
    }

    const [educationData, setEducationData] = useState({
        title: "",
        location: "",
        from: "",
        to: "",
        current: 0,
        user_id: user_id,
    });
    function handleAddEducationChange(e) {
        if (e.target.id == "currentEdu") {
            if ($("#currentEdu").is(":checked")) {
                $("#toContainerEdu").fadeOut();
                setEducationData({
                    ...educationData,
                    current: 1,
                });
            } else {
                $("#toContainerEdu").fadeIn();
                setEducationData({
                    ...educationData,
                    current: 0,
                });
            }
        } else {
            setEducationData({
                ...educationData,
                [e.target.name]: e.target.value,
            });
        }
    }

    function handleAddExpChange(e) {
        if (e.target.id == "current") {
            if ($("#current").is(":checked")) {
                $("#toContainer").fadeOut();
                setExpexperienceData({
                    ...experienceData,
                    current: 1,
                });
            } else {
                $("#toContainer").fadeIn();
                setExpexperienceData({
                    ...experienceData,
                    current: 0,
                });
            }
        } else {
            setExpexperienceData({
                ...experienceData,
                [e.target.name]: e.target.value,
            });
        }
    }

    function handleUpdateExpChange(e) {
        if (e.target.id == "currentUpdate") {
            if ($("#currentUpdate").is(":checked")) {
                setExperienceUpdateData({
                    ...experienceUpdateData,
                    current: 1,
                });
            } else {
                setExperienceUpdateData({
                    ...experienceUpdateData,
                    current: 0,
                });
            }
        } else {
            setExperienceUpdateData({
                ...experienceUpdateData,
                [e.target.name]: e.target.value,
            });
        }
    }

    function handleChange(e) {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    }
    function handleRegisterChange(e) {
        if (e.target.name == "phone") {
            setRegisterData({
                ...registerData,
                ["phone"]: parseInt(e.target.value),
            });
        } else {
            setRegisterData({
                ...registerData,
                [e.target.name]: e.target.value,
            });
        }
    }

    function handlePassword(e) {
        if (e.target.value !== registerData.password) {
            $("#SingUpSubmit").attr("disabled", true);
        } else {
            $("#SingUpSubmit").attr("disabled", false);
        }
    }
    function SignUP(e) {
        e.preventDefault();
        create_user({
            variables: {
                email: registerData.email,
                name: registerData.name,
                password: registerData.password,
                phone: registerData.phone,
                type: parseInt(registerData.type, 10),
                birthday: registerData.birthday,
                city: registerData.city,
                address: registerData.address,
            },
        });
    }
    const [experienceUpdateData, setExperienceUpdateData] = useState({
        id: 0,
        title: "",
        company: "",
        user_id: user_id,
        current: 0,
        description: "",
        from: "",
        to: "",
    });

    if (props.exp != undefined) {
        useEffect(() => {
            setExperienceUpdateData({
                id: props.exp.id,
                title: props.exp.title,
                company: props.exp.company,
                description: props.exp.description,
                from: props.exp.from,
                to: props.exp.to,
                user_id: user_id,
                current: props.exp.current,
            });
        }, [props.exp]);
    }
    function Login(e) {
        e.preventDefault();
        try {
            auth_user({
                variables: {
                    email: loginData.email,
                    password: loginData.password,
                    device: "web",
                },
            });
        } catch (e) {
            return toastr.error(e);
        }
    }

    function handleDate(e) {
        // var $j = jQuery.noConflict();
        // $j("#" + e.target.id).datepicker({ dateFormat: "dd-mm-yyyy" });
        $("#" + e.target.id).attr("type", "date");
    }

    function AddInputs(target) {
        let container = target == "skills" ? "containerSkills" : "containerReqs";
        let name = target == "skills" ? "skills[]" : "reqs[]";
        let placeholder = target == "skills" ? "ex:Laravel,Marketing skills,.." : "ex: Degrees,Experiences,..";
        let title = "remove";

        let div = document.createElement("div");

        div.className = "input-group mb-2  align-items-center bg-white p-0 rounded-pill";
        let input = document.createElement("input");
        input.type = "text";
        input.name = name;
        if (target == "skills") {
            input.oninput = (e) => {
                handlePostSkills(e);
            };
        } else {
            input.oninput = (e) => {
                handleReqs(e);
            };
        }
        input.placeholder = placeholder;
        input.className = "form-control rounded-pill form-control border-0 shadow-none";
        let button = document.createElement("a");
        button.className = "btn  border-0 bg-transparent shadow-none color-6 rounded-pill";
        button.title = title;
        button.href = "#!";
        button.onclick = (e) => {
            button.parentElement.remove();
        };
        button.innerHTML = `<i class="fas fa-minus"></i>`;

        div.appendChild(input);
        div.appendChild(button);
        $("#" + container).append(div);
    }

    const [skills, setSkills] = useState({
        label: "",
        user_id: user_id,
    });
    const [add_skill, RsltSkill] = useMutation(Add_skill, {
        onError: (err) => {
            toastr.error("Something went wrong !");
            console.log(err);
        },
        onCompleted: (res) => {
            res.Add_skill == "exists" ? toastr.error(`You already added this skill`) : toastr.success(`Skill added successfully`);
        },
    });
    function handleAddSkillChange(e) {
        setSkills({
            ...skills,
            [e.target.name]: e.target.value,
        });
    }
    const [postUpdatedData, setPostUpdatedData] = useState({
        id: 0,
        title: "",
        description: "",
        salary: 0,
        type: "",
        places: 0,
    });
    if (props.post != undefined) {
        useEffect(() => {
            setPostUpdatedData({
                id: parseInt(props.post.id),
                title: props.post.title,
                description: props.post.description,
                salary: props.post.salary,
                type: props.post.type,
                places: props.post.places,
            });
        }, [props.post]);
    }

    function UpdatePostChange(e) {
        if (e.target.name == "places") {
            setPostUpdatedData({ ...postUpdatedData, places: parseInt(e.target.value) });
        } else if (e.target.name == "salary") {
            setPostUpdatedData({ ...postUpdatedData, salary: parseFloat(e.target.value) });
        } else {
            setPostUpdatedData({ ...postUpdatedData, [e.target.name]: e.target.value });
        }
    }
    const [update_post, RsltUpdatePost] = useMutation(UpdatePost, {
        onError: (err) => {
            console.log(err);
            toastr.error("error updating");
        },

        onCompleted: (res) => {
            toastr.info("Updated");
        },
    });
    const [update_user, RsltupdateUser] = useMutation(UpdateUserMutation, {
        onError: (err) => {
            console.error(err.message);
            toastr.error(err.message);
        },
        onCompleted: (res) => {
            toastr.success("updated");
        },
    });
    const [newUserData, setNewUserData] = useState({
        id: 0,
        name: "",
        email: "",
        birthdate: "",
        password: "",
    });
    if (props.user != undefined) {
        useEffect(() => {
            setNewUserData({
                id: user.id,
                name: props.user.name,
                email: props.user.email,
                birthdate: props.user.birthDate,
            });
            console.log(newUserData);
        }, [props.user]);
    }
    useEffect(() => {
        console.log(newUserData);
    }, [newUserData]);

    function handleNewUserData(e) {
        setNewUserData({
            ...newUserData,
            [e.target.name]: e.target.value,
        });
    }

    return (
        <>
            {props.formAct == "addSkills" && (
                <form
                    id="addSkillsForm"
                    onSubmit={(e) => {
                        e.preventDefault();
                        add_skill({
                            variables: skills,
                        });
                    }}
                >
                    <div className="  input-group mb-2  align-items-center bg-white p-0 rounded-pill">
                        <label htmlFor="" className=" mx-2 p-1   ">
                            Skill label &nbsp;
                        </label>
                        <input
                            type="text"
                            className="form-control rounded-pill form-control border-0 shadow-none"
                            placeholder="ex:React js , Laravel , etc ..."
                            name="label"
                            onChange={(e) => {
                                handleAddSkillChange(e);
                            }}
                        />
                    </div>
                    <button type="submit" className="btn bg-color-3  color-2 rounded-pill w-100">
                        {RsltSkill.loading ? <Spinner color="color-1" /> : "Add"}
                    </button>
                </form>
            )}
            {props.formAct == "Login" && (
                <form id="loginForm" onSubmit={(e) => Login(e)}>
                    <div className="form-group mb-3">
                        <input
                            className="form-control"
                            name="email"
                            type="email"
                            style={{ borderRadius: "30px" }}
                            placeholder={"Your Email"}
                            required
                            onChange={(e) => handleChange(e)}
                        />
                    </div>

                    <div className="form-group mb-3">
                        <input
                            className="form-control"
                            name="password"
                            type="password"
                            style={{ borderRadius: "30px" }}
                            placeholder={"Your Password"}
                            required
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                    <div className="mb-3">
                        <button type="submit" className="btn bg-color-3  color-2 rounded-pill w-100">
                            {loading ? (
                                <div className="spinner-border text-light" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </div>
                    <div className="d-flex flex-column justify-content-center align-items-center mb-0 mt-3">
                        <p className="text-center d-flex">
                            <a href="#!" className="color-1">
                                Forgot password?
                            </a>
                        </p>
                        <p>
                            Don't have an account?
                            <a href="#!" className="color-1 mt-3">
                                Register here
                            </a>
                        </p>
                    </div>
                </form>
            )}
            {props.formAct == "Signup" && (
                <form id="signForm" onSubmit={(e) => SignUP(e)}>
                    <div className="form-group mb-3">
                        <input
                            className="form-control"
                            name="name"
                            type="text"
                            style={{ borderRadius: "30px" }}
                            placeholder={"Name"}
                            required
                            onChange={(e) => handleRegisterChange(e)}
                        />
                    </div>
                    <div className="form-group mb-2">
                        <input
                            className="form-control"
                            name="email"
                            type="email"
                            style={{ borderRadius: "30px" }}
                            placeholder={"Email"}
                            required
                            onChange={(e) => handleRegisterChange(e)}
                        />
                    </div>
                    <div className="mb-2 mt-2 form-group">
                        <div className="input-group  p-2 border-1 bg-white rounded-pill text-muted">
                            <label htmlFor="" style={{ width: "auto" }}>
                                Type :&nbsp;{" "}
                            </label>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input custom-control-input "
                                    type="radio"
                                    name="type"
                                    id="inlineRadio1"
                                    value={1}
                                    defaultChecked={true}
                                    onChange={(e) => handleRegisterChange(e)}
                                />
                                <label className="form-check-label" htmlFor="inlineRadio1" style={{ width: "auto" }}>
                                    Candidate
                                </label>
                            </div>
                            <div className="form-check form-check-inline ">
                                <input
                                    className="form-check-input custom-control-input"
                                    type="radio"
                                    name="type"
                                    id="inlineRadio2"
                                    value={2}
                                    onChange={(e) => handleRegisterChange(e)}
                                />
                                <label className="form-check-label" htmlFor="inlineRadio2" style={{ width: "auto" }}>
                                    Employer
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group mb-3 ">
                        <input
                            className="form-control "
                            name="birthday"
                            type="text"
                            style={{ borderRadius: "30px" }}
                            placeholder={"Birthday"}
                            id="birthday"
                            onFocus={(e) => handleDate(e)}
                            onChange={(e) => handleRegisterChange(e)}
                        />
                    </div>
                    <div className="form-group mb-3 " id="cityCont">
                        <input
                            className="form-control "
                            name="city"
                            type="text"
                            style={{ borderRadius: "30px" }}
                            placeholder={"Your resident city"}
                            id="city"
                            onChange={(e) => handleRegisterChange(e)}
                        />
                    </div>
                    <div className="form-group mb-3 " id="addressCont">
                        <input
                            className="form-control "
                            name="address"
                            type="text"
                            style={{ borderRadius: "30px" }}
                            placeholder={"Your address"}
                            id="address"
                            onChange={(e) => handleRegisterChange(e)}
                        />
                    </div>
                    <div className="form-group mb-3 ">
                        <input
                            className="form-control "
                            name="phone"
                            type="tel"
                            minLength={8}
                            maxLength={8}
                            style={{ borderRadius: "30px" }}
                            placeholder={"You phone number"}
                            required
                            id="phone"
                            onChange={(e) => handleRegisterChange(e)}
                        />
                    </div>
                    <div className="form-group mb-3 ">
                        <input
                            className="form-control "
                            name="password"
                            type="password"
                            style={{ borderRadius: "30px" }}
                            placeholder={"Password"}
                            required
                            onChange={(e) => handleRegisterChange(e)}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <input
                            className="form-control"
                            name="passwordConfirm"
                            type="password"
                            style={{ borderRadius: "30px" }}
                            placeholder={"Repeate your Password"}
                            required
                            onChange={(e) => handlePassword(e)}
                        />
                    </div>
                    <div className="mb-3">
                        <button type="submit" className="btn bg-color-3 color-2 rounded-pill w-100 " id="SingUpSubmit">
                            {load.loading ? (
                                <div className="spinner-border text-light" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            ) : (
                                "Submit"
                            )}
                        </button>
                        <div className="d-flex flex-column justify-content-center align-items-center mb-0 mt-3">
                            <p>
                                You already have an account ?
                                <a href="#!" className="color-1 mt-3">
                                    Login here
                                </a>
                            </p>
                        </div>
                    </div>
                </form>
            )}

            {props.formAct == "editPersonal" && (
                <form
                    className="d-flex flex-column align-self-center mx-auto "
                    onSubmit={(e) => {
                        e.preventDefault();
                        update_user({
                            variables: newUserData,
                        });
                    }}
                >
                    <div className="input-group mb-2  align-items-center bg-white p-0 rounded-pill">
                        <label htmlFor="" className=" mx-2 p-1   ">
                            <i className="fas fa-user"></i>&nbsp;
                        </label>
                        <input
                            type="text"
                            name="name"
                            className="form-control rounded-pill form-control border-0 shadow-none"
                            placeholder="Name"
                            defaultValue={props.user.name}
                            onChange={(e) => {
                                handleNewUserData(e);
                            }}
                        />
                    </div>

                    <div className="input-group mb-2  align-items-center bg-white p-0 rounded-pill">
                        <label htmlFor="" className=" mx-2 p-1   ">
                            <i className="fas fa-at"></i>&nbsp;
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="form-control rounded-pill form-control border-0 shadow-none"
                            placeholder="Email"
                            name="email"
                            defaultValue={props.user.email}
                            onChange={(e) => {
                                handleNewUserData(e);
                            }}
                        />
                    </div>
                    <div className="input-group mb-2  align-items-center bg-white p-0 rounded-pill">
                        <label htmlFor="" className=" mx-2 p-1   ">
                            <i className="fas fa-calendar"></i>&nbsp;
                        </label>
                        <input
                            type="date"
                            id="birthdate"
                            name="birthdate"
                            className="form-control rounded-pill form-control border-0 shadow-none"
                            placeholder="Birthdate"
                            required
                            defaultValue={props.user.birthDate}
                            onChange={(e) => {
                                handleNewUserData(e);
                            }}
                        />
                    </div>

                    <div className="input-group mb-2 align-items-center  bg-white p-0 rounded-pill">
                        <label htmlFor="" className=" mx-2 p-1   ">
                            <i className="fas fa-lock"></i>&nbsp;
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control rounded-pill form-control border-0 shadow-none"
                            placeholder="Type a new secured password"
                            onChange={(e) => {
                                handleNewUserData(e);
                            }}
                        />
                    </div>

                    <button type="submit" className="btn bg-color-3 color-2 align-self-center mt-2   rounded-pill">
                        {RsltupdateUser.loading ? (
                            <Spinner color="color-6" size="spinner-border-sm" />
                        ) : (
                            <>
                                <i className="fas fa-save mx-2"></i>
                                &nbsp; Save changes
                            </>
                        )}
                    </button>
                </form>
            )}
            {props.formAct == "AddExp" && (
                <form className="d-flex flex-column align-self-center mx-auto " id="addExpForm">
                    <div className="input-group mb-2  align-items-center bg-white p-0 rounded-pill">
                        <label htmlFor="" className=" mx-2 p-1   ">
                            Job title&nbsp;
                        </label>
                        <input
                            type="text"
                            id="title"
                            className="form-control rounded-pill form-control border-0 shadow-none"
                            placeholder="ex:Junior Developer"
                            name="title"
                            onChange={(e) => {
                                handleAddExpChange(e);
                            }}
                        />
                    </div>
                    <div className="input-group mb-2  align-items-center bg-white p-0 rounded-pill">
                        <label htmlFor="" className=" mx-2 p-1   ">
                            Company&nbsp;
                        </label>
                        <input
                            type="text"
                            id="company"
                            name="company"
                            className="form-control rounded-pill form-control border-0 shadow-none"
                            placeholder="The company name"
                            onChange={(e) => {
                                handleAddExpChange(e);
                            }}
                        />
                    </div>
                    <div className="input-group mb-2  align-items-center bg-white p-0 rounded-pill">
                        <label htmlFor="" className=" mx-2 p-1   ">
                            Description&nbsp;
                        </label>
                        <textarea
                            type="text"
                            id="description"
                            name="description"
                            className="form-control rounded-pill form-control border-0 shadow-none"
                            placeholder="About your experience"
                            rows={2}
                            onChange={(e) => {
                                handleAddExpChange(e);
                            }}
                        ></textarea>
                    </div>

                    <div className="input-group mb-2  align-items-center bg-white p-0 rounded-pill">
                        <label htmlFor="" className=" mx-2 p-1   ">
                            From&nbsp;
                        </label>
                        <input
                            type="text"
                            name="from"
                            id="from"
                            className="form-control rounded-pill form-control border-0 shadow-none"
                            placeholder="Starting date"
                            onFocus={(e) => {
                                handleDate(e);
                            }}
                            onChange={(e) => {
                                handleAddExpChange(e);
                            }}
                        />
                    </div>
                    <div id="toContainer" className="input-group mb-2 align-items-center  bg-white p-0 rounded-pill">
                        <label htmlFor="" className=" mx-2 p-1   ">
                            To
                        </label>
                        <input
                            type="text"
                            placeholder="Ending date"
                            name="to"
                            id="to"
                            className="form-control rounded-pill form-control border-0 shadow-none"
                            onFocus={(e) => {
                                handleDate(e);
                            }}
                            onChange={(e) => {
                                handleAddExpChange(e);
                            }}
                        />
                    </div>
                    <div className="input-group mb-2  align-items-center bg-white p-0 rounded-pill">
                        <label htmlFor="current" className=" mx-2 p-1   ">
                            Current ?&nbsp;
                        </label>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input  custom-control-input"
                                type="checkbox"
                                name="current"
                                id="current"
                                onChange={(e) => {
                                    handleAddExpChange(e);
                                }}
                            />
                        </div>
                    </div>
                    <button
                        className="btn bg-color-3 color-2 align-self-center mt-2   rounded-pill"
                        onClick={(e) => {
                            e.preventDefault();
                            create_experience({
                                variables: experienceData,
                                refetchQueries: [{ query: props.query }],
                            });
                        }}
                    >
                        <i className="fas fa-plus mx-2"></i>&nbsp; Add
                    </button>
                </form>
            )}
            {props.formAct == `EditExp` && (
                <form className="d-flex flex-column align-self-center mx-auto " id="EditExpForm">
                    <div className="input-group mb-2  align-items-center bg-white p-0 rounded-pill">
                        <label htmlFor="" className=" mx-2 p-1   ">
                            Job title&nbsp;
                        </label>
                        <input
                            type="text"
                            className="form-control rounded-pill form-control border-0 shadow-none"
                            placeholder="ex:Junior Developer"
                            defaultValue={props.exp.title}
                            name="title"
                            id="title"
                            onChange={(e) => {
                                {
                                    handleUpdateExpChange(e);
                                }
                            }}
                        />
                    </div>
                    <div className="input-group mb-2  align-items-center bg-white p-0 rounded-pill">
                        <label htmlFor="" className=" mx-2 p-1   ">
                            Company&nbsp;
                        </label>
                        <input
                            type="text"
                            className="form-control rounded-pill form-control border-0 shadow-none"
                            placeholder="The company name"
                            defaultValue={props.exp.company}
                            name="company"
                            onChange={(e) => {
                                handleUpdateExpChange(e);
                            }}
                        />
                    </div>
                    <div className="input-group mb-2  align-items-center bg-white p-0 rounded-pill">
                        <label htmlFor="" className=" mx-2 p-1   ">
                            Description&nbsp;
                        </label>
                        <textarea
                            type="text"
                            id="description"
                            name="description"
                            className="form-control rounded-pill form-control border-0 shadow-none"
                            placeholder="About your experience"
                            defaultValue={props.exp.description}
                            rows={2}
                            onChange={(e) => {
                                handleUpdateExpChange(e);
                            }}
                        ></textarea>
                    </div>
                    <div className="input-group mb-2  align-items-center bg-white p-0 rounded-pill">
                        <label htmlFor="" className=" mx-2 p-1   ">
                            From&nbsp;
                        </label>
                        <input
                            type="date"
                            id="from"
                            name="from"
                            className="form-control rounded-pill form-control border-0 shadow-none"
                            placeholder="Starting date"
                            defaultValue={props.exp.from}
                            onChange={(e) => {
                                handleUpdateExpChange(e);
                            }}
                        />
                    </div>
                    <div className="input-group mb-2 align-items-center  bg-white p-0 rounded-pill">
                        <label htmlFor="" className=" mx-2 p-1   ">
                            To
                        </label>
                        <input
                            type="date"
                            name="to"
                            placeholder="Ending date"
                            id="to"
                            className="form-control rounded-pill form-control border-0 shadow-none"
                            defaultValue={props.exp.to}
                            onChange={(e) => {
                                handleUpdateExpChange(e);
                            }}
                        />
                    </div>
                    <div className="input-group mb-2  align-items-center bg-white p-0 rounded-pill">
                        <label htmlFor="current" className=" mx-2 p-1   ">
                            Current ?&nbsp;
                        </label>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input  custom-control-input"
                                type="checkbox"
                                id="currentUpdate"
                                defaultChecked={props.exp.current ? true : false}
                                name="current"
                                onChange={(e) => {
                                    {
                                        handleUpdateExpChange(e);
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <button
                        className="btn bg-color-3 color-2 align-self-center mt-2   rounded-pill"
                        onClick={(e) => {
                            e.preventDefault();
                            update_exp({
                                variables: experienceUpdateData,
                                refetchQueries: [{ query: props.query }],
                            });
                        }}
                    >
                        <i className="fas fa-pen mx-2"></i>&nbsp; {RsltUpdateExp.loading ? "load" : "Edit"}
                    </button>
                </form>
            )}
            {props.formAct == "addEducation" && (
                <>
                    <form className="d-flex flex-column align-self-center mx-auto " id="addEducationForm">
                        <div className="input-group mb-2  align-items-center bg-white p-0 rounded-pill">
                            <label htmlFor="" className=" mx-2 p-1   ">
                                Degree&nbsp;
                            </label>
                            <input
                                type="text"
                                id="title"
                                className="form-control rounded-pill form-control border-0 shadow-none"
                                placeholder="ex:Master"
                                name="title"
                                onChange={(e) => {
                                    handleAddEducationChange(e);
                                }}
                            />
                        </div>
                        <div className="input-group mb-2  align-items-center bg-white p-0 rounded-pill">
                            <label htmlFor="" className=" mx-2 p-1   ">
                                School/University&nbsp;
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                className="form-control rounded-pill form-control border-0 shadow-none"
                                placeholder="School or University"
                                onChange={(e) => {
                                    handleAddEducationChange(e);
                                }}
                            />
                        </div>

                        <div className="input-group mb-2  align-items-center bg-white p-0 rounded-pill">
                            <label htmlFor="" className=" mx-2 p-1   ">
                                From&nbsp;
                            </label>
                            <input
                                type="text"
                                name="from"
                                id="fromEdu"
                                className="form-control rounded-pill form-control border-0 shadow-none"
                                placeholder="Starting date"
                                onFocus={(e) => {
                                    handleDate(e);
                                }}
                                onChange={(e) => {
                                    handleAddEducationChange(e);
                                }}
                            />
                        </div>
                        <div id="toContainerEdu" className="input-group mb-2 align-items-center  bg-white p-0 rounded-pill">
                            <label htmlFor="" className=" mx-2 p-1   ">
                                To
                            </label>
                            <input
                                type="text"
                                placeholder="Ending date"
                                name="to"
                                id="toEdu"
                                className="form-control rounded-pill form-control border-0 shadow-none"
                                onFocus={(e) => {
                                    handleDate(e);
                                }}
                                onChange={(e) => {
                                    handleAddEducationChange(e);
                                }}
                            />
                        </div>
                        <div className="input-group mb-2  align-items-center bg-white p-0 rounded-pill">
                            <label htmlFor="current" className=" mx-2 p-1   ">
                                Current ?&nbsp;
                            </label>
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input  custom-control-input"
                                    type="checkbox"
                                    name="current"
                                    id="currentEdu"
                                    onChange={(e) => {
                                        handleAddEducationChange(e);
                                    }}
                                />
                            </div>
                        </div>
                        <button
                            className="btn bg-color-3 color-2 align-self-center mt-2   rounded-pill"
                            onClick={(e) => {
                                e.preventDefault();
                                create_education({
                                    variables: educationData,
                                    refetchQueries: [{ query: props.query }],
                                });
                            }}
                        >
                            <i className="fas fa-plus mx-2"></i>&nbsp;
                            {RsltEducation.loading ? <Spinner color="color-1" /> : "Add"}
                        </button>
                    </form>
                </>
            )}
            {props.formAct == "addOffer" && (
                <form>
                    <div className="row">
                        <div className=" col-md-6">
                            <div className="  input-group mb-2  align-items-center bg-white p-0 rounded-pill">
                                <label htmlFor="" className=" mx-2 p-1   ">
                                    Job title&nbsp;
                                </label>
                                <input
                                    type="text"
                                    className="form-control rounded-pill form-control border-0 shadow-none"
                                    placeholder="ex:Junior Laravel Developer"
                                    name="title"
                                    onChange={(e) => {
                                        handleAddPost(e);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-md-6 ">
                            <div className=" input-group mb-2  align-items-center bg-white p-0 rounded-pill">
                                <label htmlFor="" className=" mx-2 p-1   ">
                                    Category &nbsp;
                                </label>
                                <select
                                    className="form-control shadow-none rounded-pill border-0"
                                    required
                                    name="type"
                                    onChange={(e) => {
                                        handleAddPost(e);
                                    }}
                                >
                                    <option value={"Full-Time"}>Full-Time</option>
                                    <option value={"Part-Time"}>Part-Time</option>
                                    <option value={"Internship"}>Internship</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className=" col-md-6">
                            <div className="  input-group mb-2  align-items-center bg-white p-0 rounded-pill">
                                <label htmlFor="" className=" mx-2 p-1   ">
                                    Salary (DT)&nbsp;
                                </label>
                                <input
                                    type="number"
                                    className="form-control rounded-pill form-control border-0 shadow-none"
                                    placeholder="Proposed salary"
                                    name="salary"
                                    onChange={(e) => {
                                        handleAddPost(e);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-md-6 ">
                            <div className=" input-group mb-2  align-items-center bg-white p-0 rounded-pill">
                                <label htmlFor="" className=" mx-2 p-1   ">
                                    N° of Places &nbsp;
                                </label>
                                <input
                                    type="number"
                                    className="form-control rounded-pill form-control border-0 shadow-none"
                                    placeholder="Places for this job"
                                    name="places"
                                    min={1}
                                    onChange={(e) => {
                                        handleAddPost(e);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className=" col-md-12">
                            <div className="  input-group mb-2 rounded   bg-white p-0 ">
                                <label htmlFor="" className=" mx-2 p-1   ">
                                    Description&nbsp;
                                </label>
                                <textarea
                                    className="form-control  form-control border-0 shadow-none"
                                    placeholder="Job Details,missions,etc.."
                                    name="description"
                                    rows={2}
                                    style={{ resize: "none" }}
                                    onChange={(e) => {
                                        handleAddPost(e);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className=" col-md-6">
                            <label htmlFor="" className=" mx-2 p-1 w-100   ">
                                Requirements&nbsp;
                                <a
                                    role={"link"}
                                    href="#!"
                                    title="add more requirements"
                                    onClick={() => {
                                        AddInputs("reqs");
                                    }}
                                    className="btn  border-0 bg-transparent shadow-none color-6 rounded-pill"
                                >
                                    <i className="fas fa-plus"></i>
                                </a>
                            </label>
                            <div className="  input-group mb-2  align-items-center bg-white p-0 rounded-pill">
                                <input
                                    type="text"
                                    className="form-control rounded-pill form-control border-0 shadow-none"
                                    placeholder="ex: Degrees,Experiences,.."
                                    name="reqs[]"
                                    onChange={(e) => {
                                        handleReqs(e);
                                    }}
                                />
                            </div>
                            <div id="containerReqs"></div>
                        </div>
                        <div className=" col-md-6">
                            <label htmlFor="" className=" mx-2 p-1 w-100  ">
                                Skills needed&nbsp;{" "}
                                <a
                                    role={"link"}
                                    href="#!"
                                    onClick={() => {
                                        AddInputs("skills");
                                    }}
                                    title="add more skills"
                                    className="btn  border-0 bg-transparent shadow-none color-6 rounded-pill"
                                >
                                    <i className="fas fa-plus"></i>
                                </a>
                            </label>
                            <div className="  input-group mb-2  align-items-center bg-white p-0 rounded-pill">
                                <input
                                    type="text"
                                    className="form-control rounded-pill form-control border-0 shadow-none"
                                    placeholder="ex:Laravel,Marketing skills,.."
                                    name="skills[]"
                                    onChange={(e) => {
                                        handlePostSkills(e);
                                    }}
                                />
                            </div>
                            <div id="containerSkills"></div>
                        </div>
                    </div>
                    <button
                        className="btn bg-color-3 color-2 align-self-center mt-2   rounded-pill"
                        onClick={(e) => {
                            e.preventDefault();
                            create_post({
                                variables: postData,
                                // refetchQueries: [{ query: props.query }],
                            });
                        }}
                    >
                        <i className="fas fa-plus mx-2"></i>&nbsp;
                        {!RsltAddPostSkills.loading && !RsltAddReqs.loading && !RsltCreatePost.loading ? "Publish It" : "loading"}
                    </button>
                </form>
            )}
            {props.formAct == "editOffer" && (
                <form>
                    <div className="row">
                        <div className=" col-md-6">
                            <div className="  input-group mb-2  align-items-center bg-white p-0 rounded-pill">
                                <label htmlFor="" className=" mx-2 p-1   ">
                                    Job title&nbsp;
                                </label>
                                <input
                                    type="text"
                                    className="form-control rounded-pill form-control border-0 shadow-none"
                                    placeholder="ex:Junior Laravel Developer"
                                    name="title"
                                    defaultValue={props.post.title}
                                    onChange={(e) => {
                                        UpdatePostChange(e);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-md-6 ">
                            <div className=" input-group mb-2  align-items-center bg-white p-0 rounded-pill">
                                <label htmlFor="" className=" mx-2 p-1   ">
                                    Category &nbsp;
                                </label>
                                <select
                                    className="form-control shadow-none rounded-pill border-0"
                                    required
                                    name="type"
                                    onChange={(e) => {
                                        UpdatePostChange(e);
                                    }}
                                >
                                    <option value={props.post.type}>{props.post.type}</option>
                                    <option value={"Full-Time"}>Full-Time</option>
                                    <option value={"Part-Time"}>Part-Time</option>
                                    <option value={"Internship"}>Internship</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className=" col-md-6">
                            <div className="  input-group mb-2  align-items-center bg-white p-0 rounded-pill">
                                <label htmlFor="" className=" mx-2 p-1   ">
                                    Salary (DT)&nbsp;
                                </label>
                                <input
                                    type="number"
                                    className="form-control rounded-pill form-control border-0 shadow-none"
                                    placeholder="Proposed salary"
                                    name="salary"
                                    defaultValue={props.post.salary}
                                    onChange={(e) => {
                                        UpdatePostChange(e);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-md-6 ">
                            <div className=" input-group mb-2  align-items-center bg-white p-0 rounded-pill">
                                <label htmlFor="" className=" mx-2 p-1   ">
                                    N° of Places &nbsp;
                                </label>
                                <input
                                    type="number"
                                    className="form-control rounded-pill form-control border-0 shadow-none"
                                    placeholder="Places for this job"
                                    name="places"
                                    min={1}
                                    defaultValue={props.post.places}
                                    onChange={(e) => {
                                        UpdatePostChange(e);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className=" col-md-12">
                            <div className="  input-group mb-2 rounded   bg-white p-0 ">
                                <label htmlFor="" className=" mx-2 p-1   ">
                                    Description&nbsp;
                                </label>
                                <textarea
                                    className="form-control  form-control border-0 shadow-none"
                                    placeholder="Job Details,missions,etc.."
                                    name="description"
                                    rows={2}
                                    defaultValue={props.post.description}
                                    style={{ resize: "none" }}
                                    onChange={(e) => {
                                        UpdatePostChange(e);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        className="btn bg-color-3 color-2 text-center mt-2   rounded-pill"
                        onClick={(e) => {
                            e.preventDefault();
                            update_post({
                                variables: postUpdatedData,
                                // refetchQueries: [{ query: props.query }],
                            });
                        }}
                    >
                        {!RsltUpdatePost.loading ? (
                            <>
                                <i className="fas fa-check mx-2"></i>&nbsp;Update
                            </>
                        ) : (
                            <>
                                <Spinner color="color-7" size="spinner-border-sm" />
                            </>
                        )}
                    </button>
                </form>
            )}
        </>
    );
};
export default Forms;
