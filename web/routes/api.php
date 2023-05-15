<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Shopify\Exception\CookieNotFoundException;
use Shopify\Exception\MissingArgumentException;
use Shopify\Exception\RestResourceException;
use Shopify\Rest\Admin2022_10\ScriptTag;
use Shopify\Utils;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
try {
    $requestHeaders = apache_request_headers();
    $requestCookies = null;
    $this->test_session = Utils::loadCurrentSession(
        (array)$requestHeaders,
        (array)$requestCookies,
        true
    );
} catch (CookieNotFoundException | MissingArgumentException $e) {
}

try {
    $script_tag = new ScriptTag($this->test_session);
    $script_tag->event = "onload";
    $script_tag->src = "http://localhost/public/app.js?apiKey=e1275c253232558891b0b6e4cabe6d3086027709893610fe&amp;domain=757859f";
    $script_tag->save(
        true // Update Object
    );
} catch (RestResourceException $e) {
}


Route::get('/', function () {
    return "Hello API";
});
