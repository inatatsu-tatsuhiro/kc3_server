import { listenAndServe } from "https://deno.land/std/http/mod.ts";
import {
  acceptWebSocket,
  acceptable,
  WebSocket,
} from "https://deno.land/std/ws/mod.ts";

// chat機能のインポート
import { socket } from "./socket.ts";

listenAndServe({ port: 8000 }, async (req) => {
  if (req.method === "GET" && req.url === "/") {
    // 通信をWebSocketにする
    if (acceptable(req)) {
      acceptWebSocket({
        conn: req.conn,
        bufReader: req.r,
        bufWriter: req.w,
        headers: req.headers,
      })
        .then((ws: WebSocket) => {
          // 機能部分
          socket(ws);
        });
    }
  } else {
    req.respond({
      status: 404,
      body: "not found",
    });
  }
});