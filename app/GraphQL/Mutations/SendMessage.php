<?php

namespace App\GraphQL\Mutations;

use App\Events\NewMessage;
use App\Models\Message;
use GraphQL\Error\Error;

final class SendMessage
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        try {
            $new = new Message;
            $new->sender_id = $args["sender_id"];
            $new->content = $args["message"];
            $new->chat_id = $args["chat_id"];
            if ($new->save()) {
                $id = $new->id;
                $result = Message::where("id", $id)->with("sender")->first();
                event(new NewMessage($args["message"], $args["chat_id"], $args["sender_id"], $result));
            }
            return $new;
        } catch (\Throwable $th) {
            return new Error($th->getMessage());
        }
    }
}
