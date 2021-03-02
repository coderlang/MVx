import {Code, CodeError, Net, PostJson as fPostJson} from "foundation";
import {DefaultConstructor, sleep} from "utils";
import {waitingRegistry} from "./ts";
import {Second} from "utils";

export async function PostJsonF<T extends object>(uri:string, requestF: ()=>Promise<object>
  , resType:DefaultConstructor<T>, net:Net, headers:Map<string, string> = new Map<string, string>())
  : Promise<[T, CodeError|null]> {

  let [ret, err] = await fPostJson(uri, await requestF(), resType, net, headers)
  if (err == null) {
    return [ret, err]
  }
  if (err.code != Code.TokenExpireCode) {
    return [ret, err]
  }

  // 根据foundation的时序预定，出现此种情况，net已经恢复正常，则应该直接重试
  if (!net.is401()) {
    return (await fPostJson(uri, await requestF(), resType, net, headers))
  }

  let registry = waitingRegistry.get(net.getPlugin().getName())
  if (registry === undefined) {
    return [ret, err]
  }

  return new Promise(resolve => {
    registry!.push(err1 =>{
      if (err1) {
        resolve([ret, err])
        return
      }

      let retry = async ():Promise<void> =>{
        resolve(await fPostJson(uri, await requestF(), resType, net, headers))
      }
      retry().then()
    })
    sleep(60*Second).then(()=>{
      resolve([ret, new CodeError("time out")])
    })
  })
}

export async function PostJson<T extends object>(uri:string, request: object
  , resType:DefaultConstructor<T>, net:Net, headers:Map<string, string> = new Map<string, string>())
  : Promise<[T, CodeError|null]> {

  return (await PostJsonF(uri, async ()=>{return request}, resType, net, headers))
}
