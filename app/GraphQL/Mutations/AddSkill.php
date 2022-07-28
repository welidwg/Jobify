<?php

namespace App\GraphQL\Mutations;

use App\Models\Skill;

final class AddSkill
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        // TODO implement the resolver
        $label = $args["label"];
        $user_id = $args["user_id"];
        $check = Skill::where("user_id", $user_id)->where("label", $label)->first();
        if ($check) {
            return "exists";
        } else {
            $new = new Skill;
            $new->label = $label;
            $new->user_id = $user_id;
            $new->save();
            return "done";
        }
    }
}
