<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use GraphQL\Error\Error;
use GraphQL\Error\FormattedError;
use GraphQL\Error\Warning;

final class UpdateUser
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        // TODO implement the resolver
        try {
            $user = User::where("id", $args["id"])->first();
            $validate = Validator::make($args, [
                "phone" => 'bail|digits:8|numeric|unique:users,phone,' . $args["id"] . ',id',
                "email" => 'unique:users,email,' . $args["id"] . ',id'
            ]);
            if ($validate->fails()) {
                return Error::createLocatedError($validate->errors()->first());
            }
            if ($user) {
                if (array_key_exists("password", $args)) {
                    if ($args["password"] != "") {
                        $newpass = Hash::make($args["password"]);
                        $user->password = $newpass;
                    }
                }
                if (array_key_exists("name", $args)) {
                    $user->name = $args["name"];
                }
                if (array_key_exists("phone", $args)) {
                    $user->phone = $args["phone"];
                }
                if (array_key_exists("birthdate", $args)) {
                    $user->birthDate = $args["birthdate"];
                }
                if (array_key_exists("email", $args)) {
                    $user->email = $args["email"];
                }
                $user->save();
                return "done";
            } else {
            }
            return "user not found";
        } catch (\Throwable $th) {
            return $th->getMessage();
        }
    }
}
