import React, { Component } from 'react';
import saveLoginInfo from  '../../utils/saveLogInfo'
class Index extends Component{

    componentWillMount() {
        // saveLoginInfo('测试1下');
        saveLoginInfo('登录了首页')
    }

    constructor(props) {
        super(props);
        this.state={

        }
    }

    render() {

        return(<div style={{textAlign:'center',fontSize:'large'}}>欢迎登录无损探伤胶片数字化系统！</div>)
    }
}

export default Index;