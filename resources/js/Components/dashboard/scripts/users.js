import toastr from "toastr";
import { useMutation, gql, useQuery } from "@apollo/client";

export const UpdateUser = (props) => {
    const UpdateUsr = gql`
        mutation update(
            $id: ID!
            $name: String
            $birthdate: String
            $email: String
            $phone: Int
        ) {
            updateUser(
                id: $id
                name: $name
                email: $email
                birthdate: $birthdate
                phone: $phone
            )
        }
    `;
    const [update_user, Rsltupdate] = useMutation(UpdateUsr, {
        onCompleted: (res) => {
            toastr.success("updated");
        },
        onError: (err) => {
            console.log(err);
            toastr.error("error updating");
        },
    });
    update_user({
        variables: props.data,
    });
};
