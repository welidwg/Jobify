import { useQuery, useMutation, gql } from "@apollo/client";
import { AUTH_USER } from "../../../constants";
let user = JSON.parse(JSON.parse(localStorage.getItem(AUTH_USER)));

export const MeQuery = gql`
    query ME($id: ID) {
        user(id: $id) {
            id
            name
            email
            type
            phone
            avatar
            about
            skills {
                id
                label
            }

            followers {
                followed_by {
                    id
                    name
                }
            }

            following {
                user {
                    name
                }
            }

            experiences {
                id
                title
                company
                from
                to
                current
                description
            }
            educations {
                id
                title
                location
                from
                to
                current
            }
            birthDate

            posts {
                id
                title
                user_id
                salary
                description
                type
                statut
                places
                skills {
                    id
                    label
                }
                requirements {
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
            comments {
                content
            }
        }
    }
`;

export const mynotif = gql`
    query notifs($user_id: ID) {
        mynotif(user_id: $user_id) {
            id
            title
            content
            sender {
                id
                name
                avatar
            }
            created_at
            seen
        }
    }
`;

export const Suggestions = gql`
    query suggest($id: ID, $type: Int) {
        sugg(id: $id, type: $type) {
            id
            name
            avatar
            type
        }
    }
`;

export const PostsQuery = gql`
    {
        posts {
            id
            title
            user_id
            salary
            description
            type
            statut
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
                created_at
                applicants {
                    id
                    avatar
                    name
                }
            }
            created_at
            company {
                id
                name
                city
                address
                avatar
                state
            }
            comments {
                content
                created_at
                commentor {
                    name
                    avatar
                    id
                }
            }
        }
    }
`;

export const getMyChat = gql`
    query getchats($user_id: ID) {
        getMyChats(user_id: $user_id) {
            id
            messages {
                content
            }
            user1
            user2
            owner1 {
                name
                avatar
            }
            owner2 {
                name
                avatar
            }
        }
    }
`;
export const chats = gql`
    query chats($id: ID) {
        chats(id: $id) {
            id
            owner1 {
                id
                name
                avatar
            }
            owner2 {
                id
                name
                avatar
            }
            messages {
                id
                content
                created_at
                sender_id
                sender {
                    name
                    avatar
                }
            }
        }
    }
`;

export const allusers = gql`
    query ($id: ID, $first: Int!, $page: Int!) {
        allusers(id: $id, first: $first, page: $page) {
            data {
                id
                name
                avatar
                type
            }
            paginatorInfo {
                total
                count
                currentPage
                perPage
                lastItem
                lastPage
                hasMorePages
            }
        }
    }
`;
