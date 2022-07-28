<?php

namespace App\GraphQL\Mutations;

use App\Models\Education;

final class AddEducation
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $education = new Education;
        $education->title = $args["title"];
        $education->location = $args["location"];
        $education->from = date("Y-m-d", strtotime($args["from"]));
        $education->to = date("Y-m-d", strtotime($args["to"]));
        $education->current = $args["current"];
        $education->user_id = $args["user_id"];
        $education->save();
        return "done";
    }
}
