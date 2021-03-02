import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtInput, AtButton} from 'taro-ui'

import "taro-ui/dist/style/index.scss"
import './edit-userinfo.scss'

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

  componentWillMount () {
  }

  componentDidMount () {

  }

  componentWillUnmount () {
  }

  componentDidShow () { }

  componentDidHide () { }

  //https://taro-ui.jd.com/#/docs/input
  changeName(value) {
    this.setState({
      name:value
    });

    // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
    return value;
  }
  save() {
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
