import React, { Component } from 'react';
import saveLoginInfo from  '../../utils/saveLogInfo'
import {Icon, Steps} from "antd";
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

        return(<div style={{textAlign:'center',fontSize:'large'}}><strong>欢迎登录x80钢焊缝无损检测系统！</strong>
            {/*<br/>*/}
            {/*<br/>*/}
            {/*    <div style={{width: "1000px",marginTop:"200px"}}>*/}
            {/*        基本流程*/}
            {/*        <Steps size={"default"} current={3}>*/}
            {/*        <Steps.Step icon={<Icon type="database" />} title={<strong>Step1:创建委托单</strong>} description={"填入无损检测委托单的各类信息"}/>*/}
            {/*        <Steps.Step icon={<Icon type="folder-open" />} title={<strong>Step2:检测委托单</strong>} description={"进行底片AI检测"}/>*/}
            {/*        <Steps.Step icon={<Icon type="folder-open" />} title={<strong>Step3:更新委托单</strong>} description={"对完成检测后的委托单信息进行更新"}/>*/}
            {/*    </Steps></div>*/}

    </div>)
    }
}

export default Index;