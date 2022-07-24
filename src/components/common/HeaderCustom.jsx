import React, { Component } from 'react';
import history from './history'
import {Layout, Icon, Menu, Switch,message} from 'antd';
import { Badge } from 'antd';
import { Divider } from 'antd';
import SubMenu from "antd/es/menu/SubMenu";
import '../../assets/css/header.css'
import saveLoginInfo from '../../utils/saveLogInfo'
import axios from "axios";

const {Header} = Layout;

//得到当前的系统时间
function getNowFormatDate(){
    let date = new Date();
    let seperator1 = "-";
    let seperator2 = ":";
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    let strHours = date.getHours();
    let strMinutes = date.getMinutes();
    let strSeconds = date.getSeconds();

    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (strHours >= 0 && strHours <= 9) {
        strHours = "0" + strHours;
    }
    if (strMinutes >= 0 && strMinutes <= 9) {
        strMinutes = "0" + strMinutes;
    }
    if (strSeconds >= 0 && strSeconds <= 9) {
        strSeconds = "0" + strSeconds;
    }

    let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + strHours + seperator2 + strMinutes
        + seperator2 + strSeconds;
    return currentdate;
};

class HeaderCustom extends Component {

    constructor(props) {
        super(props);

        this.state={
            data :1,
            msg: [],
            connectStatus:'error',
            connectState:'AI检测服务器连接中',

            retrainStatus:'success',
            retrainState:'暂无训练队列',

            istraining: false,
        }

    }

    logout=()=>{
        sessionStorage.removeItem("temp_user");
        history.push('/login');
    };
    componentWillMount(){

        this.setState({
            msg: this.props.message,
        });

        // this.getTrainState();
        this.getConnectState();
        //设置监控时间间隔发送请求
        setTimeout(()=>{
            var i=0;
            var handler = setInterval(()=>{
                this.getTrainState();
                this.getConnectState();
                // console.log(getNowFormatDate());
            },60000);
        },0);

    }

    getTrainState=()=>{
        //saveLoginInfo('查看了申请单列表信息');
        let api = global.AppConfig.aiIP + '/istraining';
        axios.post(api)
            .then((response)=> {
                // console.log('-----------------');
                // console.log(JSON.stringify(response.data));
                // console.log('-----------------');
                let tempRetrainStatus;
                let tempRetrainState;
                if(response.data){
                    tempRetrainStatus = 'error';
                    tempRetrainState = '已有训练队列'
                }else{
                    tempRetrainStatus = 'success';
                    tempRetrainState = '暂无训练队列';
                }
                this.setState({
                    istraining: response.data,
                    retrainStatus: tempRetrainStatus,
                    retrainState: tempRetrainState,
                })
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    retrain=()=>{
        if(this.state.connectStatus=='success'){
            if(this.state.istraining){
                this.setState({
                    retrainState:'已有训练任务进行中',
                });
                alert("已有训练任务进行中！")
            }else{
                alert("开始重新训练");
            let api = global.AppConfig.aiIP + '/retrain';
            axios.post(api)
                .then((response)=> {
                    console.log(response.data);
                    message.success("训练任务完成");
                    this.setState({
                        retrainStatus: 'success',
                        retrainState:  '暂无训练队列',
                    });
                })
                .catch( (error)=> {
                    console.log(error);
                });
                this.getTrainState();
            }
        }
        this.getTrainState();
    };

    getConnectState=()=>{
        let api = global.AppConfig.aiIP + '/istraining';
        axios.post(api)
            .then((response)=> {
                console.log(JSON.stringify(response.data));
                console.log(response);
                this.setState({
                    connectStatus:'success',
                    connectState:'AI检测服务器连接中',
                })
            })
            .catch( (error)=> {
                console.log(error);
                this.setState({
                    connectStatus:'error',
                    connectState:'AI检测服务器连接失败',
                })
            });
    };



    changeTheme = (value) => {
        this.props.AppObj.setState({
            theme: value ? 'dark' : 'light',
        });
    };





    render() {
        return (

            <Header className="header" style={{  padding: 0, left: 50}} >
                <Icon style={{ padding: 0, left:0}}
                    className="trigger"
                    type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.props.toggle}
                />
                {/*X光影像探伤系统logo放置位置*/}
                {/*msg:{this.props.message}  msg2:{this.state.msg}*/}
                {/*<Menu mode="horizontal">*/}
                <div  style={{ top: 0,right:30, position: "absolute" }}>
                    {/*<Avatar icon="user" size="small" />*/}
                    <Menu className="right-box" mode="horizontal" style={{ lineHeight: '40px' ,float: 'right'}}>
                        <Switch
                            // size={"small"}
                            checked={this.props.AppObj.state.theme === 'dark'}
                            onChange={this.changeTheme}
                            checkedChildren="深色主题"
                            unCheckedChildren="浅色主题"
                        />
                        <Divider type="vertical" />
                    <SubMenu title={
                        <div>
                            <span style={{color: "white"}}>
                                <Icon type="user" style={{fontSize:16, color: '#1DA57A'}} />用户：{JSON.parse(sessionStorage.getItem("temp_user")).member_role}登录！
                            </span>
                            <Divider type="vertical" />
                            {/*<span>管理员</span>*/}
                        </div>
                    }>
                        <Menu.Item key="logout" style={{textAlign:'center'}} className="logout">
                            <span style={{fontSize:10}} onClick={this.logout}>退出登录</span>
                        </Menu.Item>
                    </SubMenu>
                    </Menu>
                </div>
                {/*<div style={{ top: 33,right:200, position: "absolute" }}>*/}
                {/*    <Menu className="right-box" mode="horizontal" style={{ lineHeight: '40px' ,float: 'right'}}>*/}
                {/*        <SubMenu title={*/}
                {/*            <div>*/}
                {/*                <Badge status={this.state.retrainStatus} />*/}
                {/*                <span style={{fontSize:15,color: "white"}} >*/}
                {/*                  {this.state.retrainState}*/}
                {/*                </span>*/}
                {/*            </div>*/}
                {/*        }>*/}
                {/*            <Menu.Item key="logout" style={{textAlign:'center'}} className="logout">*/}
                {/*                <span style={{fontSize:10}} onClick={this.retrain}>重新训练</span>*/}
                {/*            </Menu.Item>*/}
                {/*        </SubMenu>*/}
                {/*    </Menu>*/}
                {/*</div>*/}
                <div style={{ top: 20,right:20, position: "absolute" }}>
                    <Badge status={this.state.connectStatus} />
                    <span style={{fontSize:15,color:"white"}}>{this.state.connectState}</span>
                </div>
                {/*</Menu>*/}

            </Header>

        );
    }
}

export default HeaderCustom;
