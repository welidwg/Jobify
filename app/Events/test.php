<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class test implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public $sender_id;
    public $rec_id;
    public $message;

    public function __construct($message, $sender_id, $rec_id)
    {
        //
        $this->message = $message;
        $this->rec_id = $rec_id;
        $this->sender_id = $sender_id;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        // return [
        //     // new PrivateChannel('chat-' . $this->sender_id),
        //     // new PrivateChannel('chat-' . $this->rec_id)
        //     new PrivateChannel("messages")
        // ];
        return ["messages"];
    }
    public function broadcastAs()
    {
        return 'event-pusher';
    }
}
