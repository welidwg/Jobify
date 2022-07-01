<?php

namespace App\GraphQL\Mutations;

use App\Models\Apply;

final class MutationApply
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        // TODO implement the resolver
        $user_id = $args['user_id'];
        $post_id = $args["post_id"];
        $companyid = $args["CompanyID"];

        $apply = Apply::where("user_id", $user_id)->where("post_id", $post_id)->where("CompanyID", $companyid)->first();
        if ($apply) {
            $apply->delete();
            $msg = "UnApply";
        } else {
            $newApp = new Apply;
            $newApp->user_id = $user_id;
            $newApp->post_id = $post_id;
            $newApp->CompanyID = $companyid;
            $newApp->save();
            $msg = "Apply";
        }


        return $msg;
    }
}
