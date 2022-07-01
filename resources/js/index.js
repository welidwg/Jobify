import React from "react";
import ReactDOM from "react-dom";
import HomePage from "./Components/HomePage";
import Home from "./Components/dashboard/pages/home";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import { ApolloProvider, InMemoryCache } from "@apollo/react-hooks";
import { ApolloClient, HttpLink, ApolloLink } from "@apollo/client";
import $ from "jquery";
import { useQuery } from "@apollo/react-hooks";
import { AUTH_TOKEN, AUTH_USER } from "./constants";
import ContainerDash from "./Components/dashboard/layouts/container";
import Jobs from "./Components/dashboard/pages/jobs";
import Profile from "./Components/dashboard/pages/profile";
import Contacts from "./Components/dashboard/pages/contacts";
import alertify from "alertifyjs";

alertify.defaults.transition = "slide";
alertify.defaults.theme.ok = "btn bg-color-6 color-2";
alertify.defaults.theme.cancel = "btn btn-light";
alertify.defaults.theme.input = "form-control shadow-none";
const token = localStorage.getItem(AUTH_TOKEN);
const link = new HttpLink({
    uri: "/graphql",
    headers: {
        authorization: token ? `Bearer ${token}` : "",
    },
});
const user = JSON.parse(JSON.parse(localStorage.getItem(AUTH_USER)));
const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
});

// const root = ReactDOM.createRoot();

ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            {token != undefined ? (
                <ContainerDash token={token} authed={user}>
                    <Routes>
                        <Route
                            path="/dash"
                            element={
                                user.type == 1 ? (
                                    <Home />
                                ) : (
                                    <>Employer Main Page</>
                                )
                            }
                        />
                        <Route path="/Jobs" element={<Jobs />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/Contacts" element={<Contacts />} />
                        <Route
                            path="/"
                            element={
                                user.type == 1 ? (
                                    <Home />
                                ) : (
                                    <>Employer Main Page</>
                                )
                            }
                        />
                    </Routes>
                </ContainerDash>
            ) : (
                <Routes>
                    <Route path="/" element={<HomePage token={token} />} />
                    <Route path="/home" element={<HomePage token={token} />} />
                </Routes>
            )}
        </ApolloProvider>
    </BrowserRouter>,
    document.getElementById("body")
);
