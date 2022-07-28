import React from "react";
import ReactDOM from "react-dom";
import HomePage from "./Components/HomePage";
import Home from "./Components/dashboard/pages/home";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import { ApolloProvider, InMemoryCache } from "@apollo/react-hooks";
import { ApolloClient, HttpLink, ApolloLink } from "@apollo/client";
import { AUTH_TOKEN, AUTH_USER } from "./constants";
import ContainerDash from "./Components/dashboard/layouts/container";
import Jobs from "./Components/dashboard/pages/jobs";
import Profile from "./Components/dashboard/pages/profile";
import Contacts from "./Components/dashboard/pages/contacts";
import MyApps from "./Components/dashboard/pages/myapps";
import alertify from "alertifyjs";
import { createUploadLink } from "apollo-upload-client";
import MessagesCenter from "./Components/dashboard/pages/messagesCenter";
import Chat from "./Components/dashboard/pages/chat";
import FindPeople from "./Components/dashboard/pages/findpeople";

alertify.defaults.transition = "slide";
alertify.defaults.theme.ok = "btn bg-color-6 color-2";
alertify.defaults.theme.cancel = "btn btn-light";
alertify.defaults.theme.input = "form-control shadow-none";

const token = localStorage.getItem(AUTH_TOKEN);
const user = JSON.parse(JSON.parse(localStorage.getItem(AUTH_USER)));


const link = new createUploadLink({
    uri: "/graphql",
    headers: {
        authorization: token ? `Bearer ${token}` : "",
        ContentType: "multipart/form-data",
    },
});

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
                        <Route path="/dash" element={<Home />} />
                        <Route path="/Jobs" element={<Jobs />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/profile/:id" element={<Profile />} />
                        <Route path="/contacts" element={<Contacts />} />
                        <Route path="/myapps" element={<MyApps />} />
                        <Route path="/FindPeoples/:page" element={<FindPeople />} />
                        <Route path="/messages" element={<MessagesCenter />} />
                        <Route path="/messages/:id" element={<Chat />} />
                        <Route path="/" element={<Home />} />
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
