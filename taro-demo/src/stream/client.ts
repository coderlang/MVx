import Taro from '@tarojs/taro'
import {Request, Response, Status} from "./fakehttp";

export class Client {
  private readonly conn: Taro.Websocket;
  private allReq: Map<number, (res: Response) => void>;
  private reqId: number;
  private readonly onPush: (res:string)=>void;

  constructor(wss: string, push:(res:string)=>void = (res:string)=>{}) {
    if (wss.indexOf("s://") == -1) {
      wss = "ws://" + wss;
    }
    this.onPush = push;
    this.conn = new Taro.Websocket(wss, {
      onMessage: (value: string | ArrayBuffer): void => {
        // 类型不对，直接返回
        if (typeof value === "string") {
          console.error("error response type(string): " + value);
          return;
        }

        let res = new Response(value);
        if (res.isPush()) {
          this.onPush(res.data());
          return;
        }

        let clb = this.allReq.get(res.reqID()) || ((res: Response) => {});
        clb(res);
        this.allReq.delete(res.reqID());

      }, onClose: (result: Taro.SocketTaskOnCloseCallbackResult): void => {
        this.allReq.forEach((value, key) => {
          value(Response.fromError(key, new Error(result.reason)))
        });
        this.allReq.clear()
      }
    });

    // start from 10
    this.reqId = 10;
    this.allReq = new Map();
  }

  public async send(data: ArrayBuffer | string, header?: Map<string, string>)
    : Promise<[string, Error | null]> {

    let err = await this.conn.Connect();
    if (err != null) {
      return ["", err];
    }

    let req = new Request(data, header);
    let reqId = this.reqId++;
    req.SetReqId(reqId);
    err = await req.sendTo(this.conn);
    if (err != null) {
      return ["", err];
    }

    return new Promise<[string, Error | null]>(
      (resolve: (ret: [string, Error | null ]) => void, reject) => {
        this.allReq.set(reqId, (res:Response)=>{
          if (res.status != Status.Ok) {
            resolve(["", new Error(res.data())]);
            return
          }

          resolve([res.data(), null]);
        });

        // 暂时用定时的方式来处理。
        setTimeout(()=>{
          resolve(["", new Error("timeout")]);
        }, 60*1000);
      })
  }

  private static defaultClient:Client;
  public static creatDefault(wss: string, push:(res:string)=>void = (res:string)=>{}):void {
    Client.defaultClient = new Client(wss, push);
  }
  public static default():Client {
    return Client.defaultClient;
  }
}
