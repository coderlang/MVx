import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtInput, AtButton} from 'taro-ui'
import Taro from '@tarojs/taro'
import {Async} from 'utils';

import './edit-userinfo.scss'
import {TheApp} from "../../TheApp";
import {GetUserInfoModelItem, UserInfoModel, UserInfoModelEvent, UserInfoModelItem} from "../../model/UserInfoModel";

interface Props {
}

interface State {
  name:string
}

export default class Index extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      name:""
    };
  }

  componentDidMount(): void {
    TheApp.plugin().nc().register(this, UserInfoModelEvent, async (e) => {
      await this.loadFromCache();
    });

    Async(async ()=> {
      await this.loadFromCache();
    });
  }

  componentWillUnmount(): void {
    TheApp.plugin().nc().unRegisterAll(this);
  }

  async loadFromCache():Promise<void> {
    let item = await GetUserInfoModelItem(await TheApp.me());
    if (!item) {
      console.error("item is null");
      return ;
    }

    this.setState({name:item.name});
  }

  //https://taro-ui.jd.com/#/docs/input
  changeName(value) {
    this.setState({
      name:value
    });

    // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
    return value;
  }
  save() {
    Async(async ()=> {
      let item = new UserInfoModelItem();
      item.uid = await TheApp.me();
      item.name = this.state.name;
      let model = await TheApp.getModel(UserInfoModel);
      await model.set([item]);
      await Taro.navigateBack({});
    })
  }
  render () {
    return (
      <View className='index'>
        <AtInput
          name='value'
          title='姓名'
          type='text'
          placeholder='请输入名字'
          value={this.state.name}
          onChange={this.changeName.bind(this)}
        />
        <AtButton type='primary' onClick={this.save.bind(this)}>保存</AtButton>
      </View>
    )
  }
}
