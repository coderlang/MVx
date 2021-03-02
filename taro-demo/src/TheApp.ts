import {ListModel, Me, Plugin} from "foundation";
import {Model, ModelClazz} from "foundation/src/model/Model";

export class TheApp {
  private static registered:boolean = false;
  private static pluginName_:string = "TheApp";

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
    return (await TheApp.plugin().mf().getModel(modelClazz))
  }

  public static async me(): Promise<string> {
    // return (await (await TheApp.plugin().mf().getModel(Me)).uid())
    return "demo";
  }

  public static async listModel(): Promise<ListModel> {
    return (await TheApp.plugin().mf().getModel(ListModel))
  }
}
