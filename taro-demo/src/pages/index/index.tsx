import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import Taro from '@tarojs/taro'
import {Async} from "utils";

import './index.scss'
import {TheApp} from "../../TheApp";
import {GetUserInfoModelItem, UserInfoModelEvent} from "../../model/UserInfoModel";

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

    Async(async () => {
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

  changeName () {
    Taro.navigateTo({url:'/pages/edit-userinfo/edit-userinfo'})
  }
  render () {
    return (
      <View className='index'>
        <Text>姓名 {this.state.name} </Text>
        <AtButton type='primary' onClick={this.changeName.bind(this)}>修改名字</AtButton>
      </View>
    )
  }
}
