import {HttpBuilder} from "foundation";
import {Http} from "foundation";
import {Stream} from "./Stream";


export function StreamBuilderCreator(headerAPIKey:string = "api"): (baseUrl:string)=>HttpBuilder {
  return baseUrl => {
    let builder = new class extends HttpBuilder {
      build(): Http {
        return new Stream(this, headerAPIKey)
      }
    }

    return builder.setBaseUrl(baseUrl)
  }
}
