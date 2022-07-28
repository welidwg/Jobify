import { useMutation, gql, useQuery } from "@apollo/client";
export const AddNotification = (props) => {
    const AddNotif = gql`
        mutation addNotif(
            $user_id: ID
            $to: String
            $title: String
            $content: String
            $from: ID
        ) {
            Add_notif(
                user_id: $user_id
                to: $to
                title: $title
                content: $content
                from: $from
            ) {
                id
                sender {
                    name
                }
            }
        }
    `;
    const [add_notif, RsltNotif] = useMutation(AddNotif, {
        onCompleted: (res) => {
            console.log("done");
        },
        onError: (err) => {
            console.log(err);
        },
    });
    function test() {
        console.log(props);
    }
    console.log(props);

    return add_notif({
        variables: {
            user_id: props.user_id,
            to: props.to,
            title: props.title,
            content: props.content,
            from: props.from,
        },
    });
};
