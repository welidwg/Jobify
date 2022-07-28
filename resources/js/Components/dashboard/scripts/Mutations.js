import { gql } from "apollo-boost";
export const AddNotif = gql`
    mutation addNotif($user_id: ID, $to: String, $title: String, $content: String, $from: ID) {
        Add_notif(user_id: $user_id, to: $to, title: $title, content: $content, from: $from) {
            id
            sender {
                name
            }
        }
    }
`;

export const UpdatePost = gql`
    mutation Update($id: ID!, $title: String, $description: String, $type: String, $salary: Float, $places: Int) {
        updatePost(id: $id, title: $title, description: $description, type: $type, salary: $salary, places: $places) {
            title
        }
    }
`;
export const UpdateRequirement = gql`
    mutation UpdateRequirement($id: ID!, $label: String) {
        updateRequirement(id: $id, label: $label) {
            label
        }
    }
`;
export const UpdateSkill = gql`
    mutation UpdateSkill($id: ID!, $label: String) {
        updateSkill(id: $id, label: $label) {
            label
        }
    }
`;

export const AddReqs = gql`
    mutation AddReqs($label: String, $post_id: ID) {
        addRequirement(label: $label, post_id: $post_id) {
            label
        }
    }
`;
export const AddPostSkill = gql`
    mutation AddSkill($label: String, $post_id: ID!) {
        addSkillPostt(label: $label, post_id: $post_id) {
            label
        }
    }
`;
export const Add_skill = gql`
    mutation Add_skill($label: String, $user_id: ID) {
        Add_skill(label: $label, user_id: $user_id)
    }
`;

export const DeleteReqs = gql`
    mutation delete($id: ID!) {
        DeleteRequirement(id: $id) {
            label
        }
    }
`;

export const DeleteSkill = gql`
    mutation DeleteSkill($id: ID!) {
        DeleteSkillPost(id: $id) {
            label
        }
    }
`;

export const UpdateUserMutation = gql`
    mutation update($id: ID!, $name: String, $birthdate: String, $email: String, $phone: Int, $password: String) {
        updateUser(id: $id, name: $name, email: $email, birthdate: $birthdate, phone: $phone, password: $password)
    }
`;

export const UpdatePhoto = gql`
    mutation UpdateImg($id: ID, $image: Upload!) {
        updateUserAvatar(id: $id, image: $image)
    }
`;
export const createChat = gql`
    mutation createchat($user1: ID, $user2: ID) {
        create_chat(user1: $user1, user2: $user2) {
            id
        }
    }
`;

export const sendMessage = gql`
    mutation Send($message: String, $chat_id: ID, $sender_id: ID) {
        send_message(message: $message, chat_id: $chat_id, sender_id: $sender_id) {
            id
            created_at
            sender_id
            sender {
                id
                name
                avatar
            }
            chat {
                id
            }
        }
    }
`;
