import {ListModel, Me, Plugin} from "foundation";
import {Model, ModelClazz} from "foundation/src/model/Model";

export class LiaoRan {
  private static registered:boolean = false;
  private static pluginName_:string = "LiaoRan";

  public static plugin():Plugin {
    if (this.registered) {
      return Plugin.getBy(this.pluginName_)
    }

    Plugin.register(this.pluginName_);
    let plugin = Plugin.getBy(this.pluginName_);

    this.registered = true;

    return plugin;
  }

  public static async getModel<T extends Model>(modelClazz: ModelClazz<T>): Promise<T> {
    return (await LiaoRan.plugin().mf().getModel(modelClazz))
  }

  public static async me(): Promise<string> {
    return (await (await LiaoRan.plugin().mf().getModel(Me)).uid())
  }

  public static async listModel(): Promise<ListModel> {
    return (await LiaoRan.plugin().mf().getModel(ListModel))
  }
}
