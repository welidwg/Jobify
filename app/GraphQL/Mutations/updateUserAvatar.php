<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use Illuminate\Support\Facades\Storage;

final class updateUserAvatar
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        // TODO implement the resolver
        $file = $args["image"];
        $name = time() . "." . $file->getClientOriginalExtension();
        $user = User::where("id", $args["id"])->first();
        if ($user->avatar != "" && $user->avatar != "default.webp") {
            unlink("uploads/avatars/$user->avatar");
        }
        $user->avatar = $name;

        if ($user->save()) {
            $file->move("uploads/avatars", $name);
        }

        return json_encode($user);
    }
}
