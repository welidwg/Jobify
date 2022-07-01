import { useEffect, useState } from "react";
import { useQuery, gql, useLazyQuery } from "@apollo/react-hooks";
import Contact from "../layouts/contact";

const Contacts = (props) => {
    const Users = gql`
        query {
            users {
                name
                type
            }
        }
    `;
    const Search = gql`
        query Search($filter: String!) {
            search(filter: $filter) {
                name
                type
            }
        }
    `;
    const rslt = useQuery(Users);
    const [search, searchRslt] = useLazyQuery(Search);

    function HandleSearch(e) {
        setTimeout(() => {
            search({
                variables: {
                    filter: e.target.value,
                },
            });
        }, 2000);
    }
    // setInterval(() => {
    //     console.log(searchRslt.data);
    // }, 1500);
    useEffect(() => {
        document.title = "JobiFy | Contacts";
        if (!searchRslt.loading) {
        }
    }, []);
    return (
        <div
            className="col"
            data-aos="fade-up-left"
            data-aos-duration="500"
            data-aos-once="false"
        >
            <div
                id="main-content"
                className=" bg-white d-flex flex-row flex-wrap align-items-center justify-content-around"
            >
                <div
                    className="input-group border-1 rounded-pill mb-2 p-2 shadow-sm"
                    style={{ border: "1px solid #ccc" }}
                >
                    <input
                        className="form-control border-0"
                        placeholder="Search"
                        onInput={(e) => HandleSearch(e)}
                    />
                    <button className="btn  text-success">
                        {searchRslt.loading ? (
                            <>
                                <div
                                    class="spinner-border spinner-border-sm text-success fade show"
                                    role="status"
                                >
                                    <span class="visually-hidden">
                                        Loading...
                                    </span>
                                </div>
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
                                    return <Contact user={usr} />;
                                })}
                            </>
                        ) : (
                            <> No data found</>
                        )}
                    </>
                ) : (
                    <>
                        {" "}
                        {rslt.loading && "loading"}
                        {rslt.error && rslt.error.message}
                        {rslt.data &&
                            rslt.data.users.map((e) => {
                                return <Contact no={e.id} user={e} />;
                            })}
                    </>
                )}
            </div>
        </div>
    );
};

export default Contacts;
