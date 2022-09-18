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

        return(<div style={{textAlign:'center',fontSize:'large'}}>欢迎登录射线底片数字化管理及辅助判读技术！</div>)
    }
}

export default Index;