import { useEffect } from "react";
import { useQuery, gql } from "@apollo/react-hooks";
import Post from "../layouts/Post";
import { AUTH_USER } from "../../../constants";

const Jobs = (props) => {
    const user = JSON.parse(JSON.parse(localStorage.getItem(AUTH_USER)));
    console.log(user);
    const PostsQuery = gql`
        query GetPosts($type: Int!, $user_id: ID!) {
            posts(type: $type, user_id: $user_id) {
                id
                content
                user_id
                likes
                applies
                type
                created_at
                likers {
                    liker {
                        name
                        type
                    }
                }
                author {
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
        variables: {
            type: 2,
            user_id: user.id,
        },

        onError: (err) => {
            console.log(err.graphQLErrors);
        },
    });
    if (ResltPost.error) {
        console.log(ResltPost.error.graphQLErrors);
    }

    useEffect(() => {
        document.title = "JobiFy | Home";
        if (ResltPost.error) {
            console.log(ResltPost.error);
        }
    }, [ResltPost.error]);
    useEffect(() => {
        document.title = "JobiFy | Jobs";
    }, []);

    return (
        <>
            <div
                className="col my-lg-0 my-1"
                style={{ zoom: "0.9" }}
                data-aos="fade-right"
                data-aos-duration="500"
                data-aos-once="false"
            >
                <div id="main-content" className="bg-white border">
                    {user.type == 2 ? (
                        <AddPost
                            query={PostsQuery}
                            holder="Add new job offer"
                        />
                    ) : (
                        <div
                            className="input-group border-1 rounded-pill mb-2 p-2 shadow-sm"
                            style={{ border: "1px solid #ccc" }}
                        >
                            <input
                                className="form-control border-0"
                                placeholder="Search"
                            />
                            <button className="btn  text-success">
                                <i className="fas fa-search"></i>
                            </button>
                        </div>
                    )}

                    <div className="d-flex flex-row justify-content-center align-items-center mt-2">
                        <div
                            className=" col"
                            style={{ borderTop: "1px solid #ccc" }}
                        ></div>
                        <div className="col" style={{ textAlign: "center" }}>
                            Latest Offers
                        </div>
                        <div
                            className=" col"
                            style={{ borderTop: "1px solid #ccc" }}
                        ></div>
                    </div>
                    <div className="d-flex flex-wrap my-4 justify-content-center">
                        <div className=" mb-5" style={{ minWidth: "50vw" }}>
                            <div>
                                {ResltPost.loading ? (
                                    <>Loading ... </>
                                ) : ResltPost.data.posts.length == 0 ? (
                                    "No offers yet"
                                ) : (
                                    ResltPost.data.posts.map((post, index) => {
                                        console.log(ResltPost.data.posts);

                                        if (post.type == 2) {
                                            return (
                                                <Post
                                                    key={index}
                                                    type="Job"
                                                    typeNo={2}
                                                    details={post}
                                                    query={PostsQuery}
                                                />
                                            );
                                        }
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Jobs;
