import React, {Component} from 'react';
import saveLoginInfo from '../../utils/saveLogInfo'
import {Badge, Divider, message, Button, Progress, Carousel} from "antd";
import SubMenu from "antd/es/menu/SubMenu";
import axios from "axios";
import './setting.css'

class Setting extends Component {


    constructor(props) {
        super(props);
        this.state = {
            recentfilelist: [],
            retrainNum: 0,
            epoch: 0,
            updateRectClor: 'red',
            retrainStatus: 'success',
            retrainState: '暂无训练队列',
            connectStatus: 'error',
            connectState: 'AI检测服务器连接中',
            istraining: false,
        }
    }

    componentWillMount() {
        this.getTrainState();
        this.getConnectState();
        this.getepoch();
        this.getReTrainDataNum();
        this.getRecentImg();
        //设置监控时间间隔发送请求
        setTimeout(() => {
            var i = 0;
            var handler = setInterval(() => {
                this.getTrainState();
                this.getConnectState();
                this.getepoch();
                // console.log(getNowFormatDate());
            }, 3000);
        }, 0);
    };
  getepoch = ()=>{
      let api = global.AppConfig.aiIP + '/getEpochs';
      axios.post(api)
          .then((response) => {
              console.log(response);
              this.setState({
                    epoch: response.data
              })
          })
          .catch((error) => {
              console.log(error);
          });
  }
    getConnectState = () => {
        let api = global.AppConfig.aiIP + '/istraining';
        axios.post(api)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                console.log(response);
                this.setState({
                    connectStatus: 'success',
                    connectState: 'AI检测服务器连接中',
                })
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    connectStatus: 'error',
                    connectState: 'AI检测服务器连接失败',
                })
            });
    };
    getReTrainDataNum=()=>{
        let api = global.AppConfig.aiIP + '/getReTrainDataNum';
        axios.post(api)
            .then((response) => {
                this.setState({
                   retrainNum: response.data,
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }
    retrain = () => {
        // if(this.state.connectStatus=='success'){
        //     if(this.state.istraining){
        //         this.setState({
        //             retrainState:'已有训练任务进行中',
        //         });
        //         alert("已有训练任务进行中！")
        // //     }else{
        // //         alert("开始重新训练");
        // //         let api = global.AppConfig.aiIP + '/retrainF';
        // //         axios.post(api)
        // //             .then((response)=> {
        // //                 console.log(response.data);
        // //                 message.success("训练任务完成");
        // //                 this.setState({
        // //                     retrainStatus: 'success',
        // //                     retrainState:  '暂无训练队列',
        // //                 });
        // //             })
        // //             .catch( (error)=> {
        // //                 console.log(error);
        // //             });
        //         this.getTrainState();
        //     }
        // }
        // this.getTrainState();
        if (this.state.connectStatus == 'success') {
            if (this.state.istraining) {
                this.setState({
                    retrainState: '已有训练任务进行中',
                });
                alert("已有训练任务进行中！")
            } else {
                alert("开始训练");
                let api = global.AppConfig.aiIP + '/retrainNew';
                axios.post(api)
                    .then((response) => {
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                this.getTrainState();
                this.getepoch();
            }
        }
    };


    getTrainState = () => {
        //saveLoginInfo('查看了申请单列表信息');
        let api = global.AppConfig.aiIP + '/istraining';
        axios.post(api)
            .then((response) => {
                // console.log('-----------------');
                // console.log(JSON.stringify(response.data));
                // console.log('-----------------');
                let tempRetrainStatus;
                let tempRetrainState;
                if (response.data) {
                    tempRetrainStatus = 'error';
                    tempRetrainState = '已有训练队列'
                } else {
                    tempRetrainStatus = 'success';
                    tempRetrainState = '暂无训练队列';
                }
                this.setState({
                    istraining: response.data,
                    retrainStatus: tempRetrainStatus,
                    retrainState: tempRetrainState,
                })
            })
            .catch((error) => {
                console.log(error);
            });
    };

    ttt = () => {
        message.success("改变state状态前" + this.state.updateRectClor);
        this.setState({
            updateRectClor: '1',
        });
        message.success("改变state状态后" + this.state.updateRectClor);
    }
    getRecentImg=()=>{
        let api = global.AppConfig.aiIP + '/RecentNewImgs';
        axios.post(api)
            .then((response) => {
                this.setState({
                    recentfilelist: response.data
                })
            })
    }


    canceltrain = () => {
        if (this.state.connectStatus == 'success') {
            if (this.state.istraining) {
                alert("确认取消正在训练中的模型吗？")
                let api = global.AppConfig.aiIP + '/destroyTrain';
                axios.post(api)
                    .then((response) => {
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                this.getTrainState();
            } else {
                alert("没有训练中的模型！");
            }
            this.getTrainState();
            this.getepoch();
        }
    }


    render() {
        return (
            <div>
                <Divider>新增训练数据</Divider>
                <div className="alldiv">
                    <strong>新增训练图片总数：{this.state.retrainNum}</strong><br/>
                    <br/>
                    部分最新增加标注图片
                    <br/>
                <Carousel effect="fade" autoplay="true" autoplaySpeed={2000} arrows={true}>
                    <div className="cdiv" >
                        <img src={global.AppConfig.serverIP+"/images/"+this.state.recentfilelist[0]}/></div>
                    <div className="cdiv">
                        <img src={global.AppConfig.serverIP+"/images/"+this.state.recentfilelist[1]}/></div>
                    <div className="cdiv">
                        <img src={global.AppConfig.serverIP+"/images/"+this.state.recentfilelist[2]}/></div>
                    <div className="cdiv">
                        <img src={global.AppConfig.serverIP+"/images/"+this.state.recentfilelist[3]}/></div>

                </Carousel></div>
                <Divider>模型训练相关</Divider>
                <div style={{textAlign:"center"}}>
                    <strong>已训练轮数：{this.state.epoch}</strong><br/>
                    <Progress type={"circle"} percent={this.state.epoch/5000}   status="active"></Progress>
                </div>

                <br/>
                <div style={{textAlign: "center"}}>
                    <Badge status={this.state.retrainStatus}/>
                    <span style={{fontSize: 15, color: "black"}}>
                      {this.state.retrainState}
                    </span>
                    <br></br>
                    <br></br>
                    <Button style={{width: 80}} onClick={this.retrain}>自主学习</Button>
                    {/*<br/><br/>*/}
                    {/*<Button style={{width: 80}} onClick={this.retrain}>重新训练</Button>*/}
                    <br/><br/>
                    <Button type="danger" style={{width: 80}} onClick={this.canceltrain}>取消训练</Button>
                </div>
                <br/><br/><br/><br/><br/><br/>
                <Divider>其他</Divider>
                <Button onClick={this.ttt} style={{display: "none"}}>ces</Button>

            </div>)

}
}
export default Setting;