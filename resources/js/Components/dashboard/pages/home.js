import { useEffect } from "react";
import Post from "../layouts/Post";
import { useQuery, gql } from "@apollo/react-hooks";
import { AUTH_USER } from "../../../constants";
import $ from "jquery";
import img from "../../../assets/img/search.png";
import NotFound from "../layouts/not Found";
import Spinner from "../layouts/spinner";
import { PostsQuery } from "../scripts/Queries";

const Home = (props) => {
    const user = JSON.parse(JSON.parse(localStorage.getItem(AUTH_USER)));

    const ResltPost = useQuery(PostsQuery, {
        pollInterval: 2000,

        onError: (err) => {
            console.log(err.graphQLErrors);
        },
    });

    useEffect(() => {
        document.title = "JobiFy | Home";
    }, []);
    return (
        <div className=" mx-auto">
            <div className="d-flex align-items-center justify-content-center mt-2 mb-4 ">
                <span className="border-1 w-100 color-1" style={{ borderBottom: "2px solid red" }}></span>
                <span className="mx-2 text-muted">Latests</span>
                <span className="border-1 w-100" style={{ border: "1px solid #eee" }}></span>
            </div>
            {ResltPost.loading ? (
                <Spinner color="color-6" />
            ) : ResltPost.data != undefined && ResltPost.data.posts.length == 0 ? (
                <>
                    <NotFound text="Sorry , there is no offers yet" />
                </>
            ) : (
                ResltPost.data.posts.map((post, index) => {
                    return <Post key={post.id} details={{ posts: post }} query={PostsQuery} />;
                })
            )}
        </div>
    );
};
export default Home;
