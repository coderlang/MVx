import {DetailModelItem, DetailModelEvent, TheDetailModel} from "foundation";
import {DefaultConstructor} from "utils";

export enum UserCustom {
  BigName = 0x01,
  Corp = 0x02,
  Oper = 0x04,
}

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
