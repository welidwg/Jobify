<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
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
        $password = $args["password"];
        $hashed = Hash::make($password);
        $user = new User;
        $user->email = $args["email"];
        $user->password = $hashed;
        $user->name = $args["name"];
        $user->birthdate = date("Y-m-d", strtotime($args["birthday"]));
        $user->type = $args["type"];
        $user->save();
        return "success";
    }
}
