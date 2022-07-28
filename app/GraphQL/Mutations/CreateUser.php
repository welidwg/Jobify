<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use GraphQL\Error\Error;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

final class CreateUser
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        // TODO implement the resolver
        // $credentials=Arr::only($args,['email','password']);
        // if(Auth::once($credentials)){

        // }
        try {
            $password = $args["password"];
            $hashed = Hash::make($password);
            $user = new User;
            $user->email = $args["email"];
            $user->password = $hashed;
            $user->name = $args["name"];
            $user->phone
                = $args["phone"];
            if ($args["birthday"] != "") {
                $user->birthdate = date("Y-m-d", strtotime($args["birthday"]));
            }
            if ($args["city"] != "") {
                $user->city = $args["city"];
            }
            if ($args["address"] != "") {
                $user->address = $args["address"];
            }
            $user->avatar = "default.webp";
            $user->state = "Tunisia";
            $user->type = $args["type"];
            $user->save();
            return "success";
        } catch (\Throwable $th) {
            return Error::createLocatedError($th->getMessage());
        }
    }
}
