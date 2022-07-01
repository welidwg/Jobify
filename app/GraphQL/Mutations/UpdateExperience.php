<?php

namespace App\GraphQL\Mutations;

use App\Models\Experience;

final class UpdateExperience
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {

        $exp = Experience::where("id", $args["id"])->first();
        if ($exp) {
            if ($args["current"] == 1) {
                $olds = Experience::where("user_id", $args["user_id"])->where("id", "!=", $args["id"])->get();
                foreach ($olds as $old) {
                    $old->current = 0;
                    $old->save();
                }
                $exp->current = NULL;
            } else {
                $exp->current =  date("Y-m-d", strtotime($args["to"]));
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
}
