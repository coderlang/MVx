import {Storage, DBManager} from "foundation";
import {Taro} from "@tarojs/taro"

class WebLocalStorage implements Storage {
  async get(key: string): Promise<[string, Error | null]> {
    let ret = await Taro.getStorage({key:key});
    if (ret.data === null || ret.errMsg) {
      return Promise.resolve(["", new Error("key not found")]);
    }

    return [ret.data, null]
  }

  async remove(key: string): Promise<Error | null> {
    await Taro.removeStorage({key:key});
    return Promise.resolve(null);
  }

  async set(key: string, value: string): Promise<Error | null> {
    await Taro.setStorage({data:value, key:key});
    return Promise.resolve(null);
  }
}

export class WebDBManager extends DBManager {
  protected newSessionStorage():Storage {
    return new WebLocalStorage();
  }

  protected newLocalStorage():Storage {
    return new WebLocalStorage();
  }
}