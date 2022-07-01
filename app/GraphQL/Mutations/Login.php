<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use Exception;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

final class Login
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $user = User::where('email', $args["email"])->first();

        if (!$user || !Hash::check($args["password"], $user->password)) {
            throw ValidationException::withMessages(
                [
                    'email' => ['The provided credentials are incorrect.'],

                ]
            );
        }
        $token
            = $user->createToken($args["device"])->plainTextToken;
        $data = ["token" => $token, "user" => json_encode($user)];

        return $data;
    }
}
