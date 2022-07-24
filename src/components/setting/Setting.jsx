import React, { Component } from 'react';
import saveLoginInfo from  '../../utils/saveLogInfo'
import {Badge, Divider, message,Button} from "antd";
import SubMenu from "antd/es/menu/SubMenu";
import axios from "axios";
class Setting extends Component{



    constructor(props) {
        super(props);
        this.state={
            updateRectClor:'red',
            retrainStatus:'success',
            retrainState:'暂无训练队列',
            connectStatus:'error',
            connectState:'AI检测服务器连接中',
            istraining: false,
        }
    }
    componentWillMount() {
        this.getTrainState();
        this.getConnectState();
        //设置监控时间间隔发送请求
        setTimeout(()=>{
            var i=0;
            var handler = setInterval(()=>{
                this.getTrainState();
                this.getConnectState();
                // console.log(getNowFormatDate());
            },30000);
        },0);
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

    ttt=()=>{
        message.success("改变state状态前"+this.state.updateRectClor);
        this.setState({
            updateRectClor:'1',
        });
        message.success("改变state状态后"+this.state.updateRectClor);
    }

    render() {
        return(
            <div>
                <Divider>模型训练相关</Divider>
                <br/>
                <div style={{textAlign:"center"}}>
                    <Badge status={this.state.retrainStatus} />
                    <span style={{fontSize:15,color: "black"}} >
                      {this.state.retrainState}
                    </span><br/><br/>
                    <Button style={{width:80}} onClick={this.retrain}>重新训练</Button>
                </div><br/><br/><br/><br/><br/><br/>
                <Divider>其他</Divider>
                <Button onClick={this.ttt} style={{display:"none"}}>ces</Button>

            </div>)
    }
}

export default Setting;