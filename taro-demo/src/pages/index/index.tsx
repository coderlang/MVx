import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import Taro from '@tarojs/taro'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import './index.scss'

interface Props {
  name:string;
}

interface State {
  name:string
}

export default class Index extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      name:"Hello World"
    };

    this.changeName = this.changeName.bind(this);
  }

  componentWillMount () {
  }

  componentDidMount () {

  }

  componentWillUnmount () {
  }

  componentDidShow () { }

  componentDidHide () { }
  changeName () {
    Taro.navigateTo({url:'/pages/edit-userinfo/edit-userinfo'})
  }
  render () {
    return (
      <View className='index'>
        <Text>姓名 {this.state.name} </Text>
        <AtButton type='primary' onClick={this.changeName}>修改名字</AtButton>
      </View>
    )
  }
}
