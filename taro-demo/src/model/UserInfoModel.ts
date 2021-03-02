import {DetailModelItem, DetailModelEvent, TheDetailModel} from "foundation";
import {DefaultConstructor} from "utils";
import {TheApp} from "../TheApp";

export class UserInfoModelItem extends DetailModelItem{
  public uid:string|null=null;
  public name:string|null=null;

  getId(): string | null {
    return this.uid;
  }
}

export class UserInfoModelEvent extends DetailModelEvent {
}

export class UserInfoModel extends TheDetailModel {
  protected getSubEvent(ids: string[]): DetailModelEvent {
    return new UserInfoModelEvent(ids);
  }

  protected getItemClazz(): DefaultConstructor<DetailModelItem> {
    return UserInfoModelItem;
  }

  protected getTableName(): string {
    return "UserInfo";
  }
}

export async function GetUserInfoModelItem(id:string): Promise<UserInfoModelItem|null> {
  let item = (await (await TheApp.getModel(UserInfoModel)).get([id], UserInfoModelItem)).get(id);
  if (!item || item.isInvalid()) {
    return null;
  }

  return item;
}

