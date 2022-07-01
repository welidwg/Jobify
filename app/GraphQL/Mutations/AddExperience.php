<?php

namespace App\GraphQL\Mutations;

use App\Models\Experience;

final class AddExperience
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        // TODO implement the resolver
        $exp = new Experience;
        if ($args["current"] == 1) {
            $old = Experience::where("user_id", $args["user_id"])->get();
            foreach ($old as $ex) {
                $ex->current = 0;
                $ex->save();
            }
            $exp->to = NULL;
        } else {
            $exp->to = date("Y-m-d", strtotime($args["to"]));
        }
        $exp->title = $args["title"];
        $exp->company = $args["company"];
        $exp->description = $args["description"];
        $exp->from = date("Y-m-d", strtotime($args["from"]));
        $exp->current = $args["current"];
        $exp->user_id = $args["user_id"];
        $exp->save();
        return "done";
    }
}
