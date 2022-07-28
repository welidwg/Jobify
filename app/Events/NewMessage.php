<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewMessage implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public $chat_id;
    public $sender_id;
    public $message;
    public $result;

    public function __construct($message, $chat_id, $sender_id,$result)
    {
        //
        $this->message = $message;
        $this->chat_id = $chat_id;
        $this->sender_id = $sender_id;
        $this->result = $result;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return [
            new Channel('chat-' . $this->chat_id)
        ];
    }
    public function broadcastAs()
    {
        return 'newMessage';
    }
}
