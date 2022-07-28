import { useEffect, useState } from "react";
import { useQuery, gql, useLazyQuery } from "@apollo/react-hooks";
import Contact from "../layouts/contact";
import { AUTH_USER } from "../../../constants";
import NotFound from "../layouts/not Found";
import Spinner from "../layouts/spinner";

const Contacts = (props) => {
    const user = JSON.parse(JSON.parse(localStorage.getItem(AUTH_USER)));
    const Me = gql`
        {
            user(id: ${user.id}) {
                id
             
                 following {
                  user {
                         id
                         name
                         type
                         avatar
                            }
                     }
            }
        }
    `;

    const Search = gql`
        query Search($filter: String!, $type: String, $id: ID) {
            search(filter: $filter, type: $type, id: $id) {
                name
                type
                avatar
            }
        }
    `;
    const rslt = useQuery(Me, {
        pollInterval: 2000,
    });
    const [search, searchRslt] = useLazyQuery(Search, {
        onError(err) {
            console.log(err.graphQLErrors);
        },
        onCompleted(data) {
            console.log(data);
        },
    });

    function HandleSearch(e) {
        setTimeout(() => {
            search({
                variables: {
                    filter: e.target.value,
                    type: "mycontact",
                    id: user.id,
                },
            });
        }, 2000);
    }
    // setInterval(() => {
    //     console.log(searchRslt.data);
    // }, 1500);
    useEffect(() => {
        document.title = "JobiFy | Contacts";
      
    }, []);
    return (
        <>
            <div className="d-flex align-items-center justify-content-center mt-2 mb-4 ">
                <span className="border-1 w-100 color-1" style={{ borderBottom: "2px solid red" }}></span>
                <span className="mx-2 text-muted">Contacts</span>
                <span className="border-1 w-100" style={{ border: "1px solid #eee" }}></span>
            </div>
            <div className="col" data-aos="fade-up-left" data-aos-duration="500" data-aos-once="false">
                <div id="main-content" className=" bg-transparent d-flex flex-row flex-wrap align-items-center justify-content-around">
                    <div className="input-group  bg-white border-1 rounded-pill mb-2 p-2 shadow-sm" style={{ border: "1px solid #ccc" }}>
                        <input className="form-control border-0 shadow-none bg-transparent" placeholder="Search" onInput={(e) => HandleSearch(e)} />
                        <button className="btn  text-success">
                            {searchRslt.loading ? (
                                <>
                                    <Spinner color="color-3" size="spinner-border-sm" />
                                </>
                            ) : (
                                <i className="fas fa-search"></i>
                            )}
                        </button>
                    </div>

                    {searchRslt.data != null ? (
                        <>
                            {searchRslt.data.search.length > 0 ? (
                                <>
                                    {searchRslt.data.search.map((usr) => {
                                        return <Contact user={{ user: usr }} />;
                                    })}
                                </>
                            ) : (
                                <NotFound text="No user found" />
                            )}
                        </>
                    ) : (
                        <>
                            {" "}
                            {rslt.error && rslt.error.message}
                            {rslt.loading ? (
                                <Spinner color="color-3" />
                            ) : rslt.data.user.following.length == 0 ? (
                                <NotFound text="You have no contacts yet" />
                            ) : (
                                rslt.data.user.following.map((e) => {
                                    return <Contact no={e.id} user={e} />;
                                })
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Contacts;
