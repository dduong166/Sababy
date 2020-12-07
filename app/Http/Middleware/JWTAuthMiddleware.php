<?php
namespace App\Http\Middleware;
use Closure;
use JWTAuth;
use Exception;
class JWTAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        try {
            $user = JWTAuth::toUser($request->input('token'));
        } catch (Exception $e) {
            if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException){
                return $next($request);
                return response()->json(['error'=>'Invalid_Token']);
            }else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException){
                return $next($request);
                return response()->json(['error'=>'Token_Expried']);
            }else{
                return $next($request);
                return response()->json(['error'=>'Unknown_Error']);
            }
        }
        return $next($request);
    }
}