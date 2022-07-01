import { useEffect } from "react";
import Post from "../layouts/Post";
import { useQuery, gql } from "@apollo/react-hooks";
import { AUTH_USER } from "../../../constants";
import $ from "jquery";
import img from "../../../assets/img/search.png";

const Home = (props) => {
    const user = JSON.parse(JSON.parse(localStorage.getItem(AUTH_USER)));
    const PostsQuery = gql`
        {
            posts {
                id
                title
                user_id

                type
                requirements {
                    label
                }
                skills {
                    label
                }
                created_at
                company {
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
                    <div
                        className="row flew-column align-items-center justify-content-center"
                        data-aos="fade-up"
                        data-aos-duration="700"
                    >
                        <span className="text-center color-3 mb-3">
                            {" "}
                            Sorry , there is no offers yet
                        </span>
                        <img src={img} className={"img-fluid w-50 image"} />
                    </div>
                </>
            ) : (
                ResltPost.data.posts.map((post, index) => {
                    return (
                        <>
                            <Post
                                key={index}
                                type="Job"
                                typeNo={2}
                                details={post}
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
