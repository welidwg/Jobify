<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

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
            if ($user) {
                if ($args["password"]) {
                    $newpass = Hash::make($args["password"]);
                    $user->password = $newpass;
                }
                $user->name = $args["name"];
                $user->email = $args["email"];
                $user->birthDate = $args["birthdate"];
                $user->save();
                return "done";
            }
            return "user not found";
        } catch (\Throwable $th) {
            return $th->getMessage();
        }
    }
}
