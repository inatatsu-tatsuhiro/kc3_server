import {
  WebSocket,
  isWebSocketCloseEvent,
} from "https://deno.land/std/ws/mod.ts";

const VISITOR_CHECK = "訪問者確認"
const USER_CHECK = "在宅確認"
const SIREN = "サイレン"
const OKIHAI_CHECK = "置き配確認"
const OKIHAI = "置き配"
const REPEL = "撃退"
const DOOR = "DOOR"
const BOTH = "BOTH"
const APP = "APP"
const OK = "OK"
const NG = "NG"

const FRIEND = "友人"
const NHK = "NHK"
const SERVICE = "勧誘"
const DELIVERY = "宅配"
const UBER = "ウーバー"

let sockets: WebSocket[] = new Array();

let status = 0

// これをserver.tsでインポートします
export const socket = async (ws: WebSocket): Promise<void> => {
  sockets.push(ws);
  broadcast("Someone is connected.");

  for await (const event of ws) {
    if (isWebSocketCloseEvent(event)) {
      sockets = sockets.filter((socket) => socket !== ws);
      broadcast("Someone is disconnected.");
      break;
    }
    console.log(event)
    if ((event as string).charAt(0) !== '{') return
    const json = JSON.parse(event as string)
    if (json.method === 'PROXY') {
      // const res = await fetch('https://pokeapi.co/api/v2/pokemon/1') // 音声処理サーバに投げる
      // const json = res.json()
      // const data = await json
      let result = {}

      if (json.from === DOOR) {
        if (status === -1) {
          status = parseInt(json.select)
        } else if (status === -2) {
          status = 10 + parseInt(json.select)
        }
        switch (status) {
          case 0:
            console.log('case 0')
            result = {
              "method": 'PROXY',
              "target": DOOR,
              "visitor": null,
              "message": VISITOR_CHECK,
            }
            status = -1
            break
          case 1:
            console.log('case 1')
            result = {
              "method": 'PROXY',
              "target": BOTH,
              "visitor": FRIEND,
              "message": USER_CHECK,
            }
            status = 0
            break
          case 2:
            result = {
              "method": 'PROXY',
              "target": DOOR,
              "visitor": DELIVERY,
              "message": OKIHAI_CHECK,
            }
            status = -2
            break
          case 11:
            result = {
              "method": 'PROXY',
              "target": DOOR,
              "visitor": DELIVERY,
              "message": OKIHAI,
            }
            status = 0
            break
          case 12:
            result = {
              "method": 'PROXY',
              "target": BOTH,
              "visitor": DELIVERY,
              "message": USER_CHECK,
            }
            status = 0
            break
          case 3:
            result = {
              "method": 'PROXY',
              "target": DOOR,
              "visitor": NHK,
              "message": REPEL,
            }
            status = 0
            break
          case 4:
            result = {
              "method": 'PROXY',
              "target": DOOR,
              "visitor": SERVICE,
              "message": REPEL,
            }
            status = 0
            break
          case 5:
            result = {
              "method": 'PROXY',
              "target": APP,
              "visitor": UBER,
              "message": SIREN,
            }
            status = 0
            break
          default:
            result = {
              "status": "ERROR"
            }
            break
        }
      } else if (json.from === APP) {
        const select = parseInt(json.select)
        switch (select) {
          case 1:
            result = {
              "method": 'PROXY',
              "target": DOOR,
              "visitor": null,
              "message": OK,
            }
            status = 0
            break
          case 2:
            result = {
              "method": 'PROXY',
              "target": DOOR,
              "visitor": null,
              "message": NG,
            }
            status = 0
            break
          default:
            result = {
              "status": "ERROR"
            }
            break
        }
      }
      // broadcast(JSON.stringify(data)) // 返す
      broadcast(JSON.stringify(result)) // 返す
    }
  }
};

const broadcast = async (message: string): Promise<void> => {
  if (!message) {
    return;
  }
  await Promise.all(sockets.map((socket) => socket.send(message)));
};