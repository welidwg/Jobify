<?php

use App\Events\typing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;

if (App::environment('production')) {
    URL::forceScheme('https');
}
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get("/istyping/{id}", function (Request $req, $id) {
    try {

        broadcast(new typing($id))->toOthers();
        return $req->header("X-socket-id");
    } catch (\Throwable $th) {
        return $th->getMessage();
    }
});

Route::view('/{path?}', 'welcome')->where('path', '.*');
