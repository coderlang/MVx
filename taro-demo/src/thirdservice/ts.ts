import {Plugin, Net, PostJsonLogin} from "foundation";
import {Taro} from "@tarojs/taro"

export const waitingRegistry = new Map<String, ((err: Error|null)=>void)[]>()

async function login(net:Net, loginFail: (err: Error)=>void) {
  let ret = await Taro.login();

  let [jsCode, err] = [ret.code, ret.errMsg?new Error(ret.errMsg):null];
  if (!err) {
    err = await PostJsonLogin('ts/wxappLogin/LoginByJscode', {jscode: jsCode}, net)
  }


  let waiting = waitingRegistry.get(net.getPlugin().getName())!
  for (let w of waiting) {
    w(err)
  }

  waitingRegistry.set(net.getPlugin().getName(), [])

  if (err) {
    loginFail(err)
  }
}

export function RegisterWxApp(pluginName: string
                              , loginFail: (err: Error)=>void = err => {console.error(err)}) {
  waitingRegistry.set(pluginName, [])
  let net = Plugin.getBy(pluginName).getMainNet()
  net.set401Delegate(net=>{
    login(net, loginFail).then()
  })
}

export function UnRegister(pluginName: string, net401delegate: (net:Net)=>void) {
  let net = Plugin.getBy(pluginName).getMainNet()
  net.set401Delegate(net401delegate)
  waitingRegistry.delete(pluginName)
}

