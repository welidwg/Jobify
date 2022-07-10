import { useEffect } from "react";
import Post from "../layouts/Post";
import { useQuery, gql } from "@apollo/react-hooks";
import { AUTH_USER } from "../../../constants";
import $ from "jquery";
import img from "../../../assets/img/search.png";
import NotFound from "../layouts/not Found";

const Home = (props) => {
    const user = JSON.parse(JSON.parse(localStorage.getItem(AUTH_USER)));
    const PostsQuery = gql`
        {
            posts {
                id
                title
                user_id
                salary
                description
                type
                places
                requirements {
                    id
                    label
                }
                skills {
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
                }
                comments {
                    content
                    created_at
                    commentor {
                        name
                    }
                }
            }
        }
    `;
    const ResltPost = useQuery(PostsQuery, {
        onError: (err) => {
            console.log(err);
        },
    });

    useEffect(() => {
        document.title = "JobiFy | Home";
    }, []);
    return (
        <div className=" mx-auto">
            <div className="d-flex align-items-center justify-content-center mt-2 mb-4 ">
                <span
                    className="border-1 w-100 color-1"
                    style={{ borderBottom: "2px solid red" }}
                ></span>
                <span className="mx-2 text-muted">Latests</span>
                <span
                    className="border-1 w-100"
                    style={{ border: "1px solid #eee" }}
                ></span>
            </div>
            {ResltPost.loading ? (
                <div className="text-center">
                    <div className="spinner-border color-1" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : ResltPost.data.posts.length == 0 ? (
                <>
                    <NotFound text="Sorry , there is no offers yet" />
                </>
            ) : (
                ResltPost.data.posts.map((post, index) => {
                    console.log(post.title);
                    return (
                        <>
                            <Post
                                key={post.id}
                                details={{ posts: post }}
                                query={PostsQuery}
                            />
                        </>
                    );
                })
            )}
        </div>
    );
};
export default Home;
