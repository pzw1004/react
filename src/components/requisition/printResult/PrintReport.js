import React, { Component } from 'react';
import './report.css'
import axios from "axios";
import saveLoginInfo from '../../../utils/saveLogInfo'

class PrintReport extends Component {

    constructor(props){
        super(props);
        this.state = {
             requisition: [],
             pictureList:[],
             statistic: [],
        };
    }

    componentWillMount() {

       // alert(this.props.match.params.requisition_id)
       this.getRequisition(this.props.match.params.requisition_id);
       this.getPictureList(this.props.match.params.requisition_id);
       this.getDamageTypeStatistic(this.props.match.params.requisition_id);
    }

    componentDidMount() {
        this.getRequisition(this.props.match.params.requisition_id);
        this.getDamageTypeStatistic(this.props.match.params.requisition_id);
    }

    getDamageTypeStatistic=(requisition_id)=>{
        let api = global.AppConfig.serverIP + '/getRequisitionDamageTypeStatistic?requisition_id='+ requisition_id;
        axios.post(api)
            .then((response)=>{
                console.log('getRequisitionDamageTypeStatistic:'+JSON.stringify(response.data));
                this.setState({
                    statistic:response.data,
                });
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    getRequisition=(requisition_id)=>{

        let api = global.AppConfig.serverIP + '/getRequisition?requisition_id=' + requisition_id;
        axios.post(api)
            .then((response)=> {
                console.log(JSON.stringify(response.data));
                this.setState({
                    requisition: response.data,
                })
            })
            .catch( (error)=> {
                console.log(error);
            });
    }

    getPictureList=(requisition_id)=>{

        let api = global.AppConfig.serverIP + '/getPictureListByReqId?requisition_id=' + requisition_id;
        axios.post(api)
            .then((response)=> {
                console.log(JSON.stringify(response.data));
                this.setState({
                    pictureList: response.data,
                })
            })
            .catch( (error)=> {
                console.log(error);
            });
    }

    render() {
        saveLoginInfo('查看了申请单编号'+this.state.requisition.requisition_number+'的报告单')
        return (
            // <!-- cellspacing 是td间距设置-->
            <div className="report">

                <div>
                    <span><font size="6">渤 海 造 船 厂 集 团 有 限 公 司
                        <br/>无 损 检 测 报 告<br/></font>
                    </span>
                </div>
                <br/>
                <table className="report-title" border={0}>
                    <tr>
                        <td  align="left" width="30%">无损检测室：</td>
                        <td  width="30%"></td>
                        <td  width="30%"> </td>
                    </tr>
                </table>
                <table  className="report-table" border={1} cellSpacing="0" width="800" height="300" style={{borderColor: "black"}}>
                    <tr>
                        <td colSpan="2" >来样编号：{this.state.requisition.requisition_samplenumber}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="2" >报告编号: {this.state.requisition.requisition_reportnumber}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="2" >日期:</td>
                    </tr>
                    <tr>
                        <td colSpan="2" >工程编号：{this.state.requisition.requisition_number}&nbsp;&nbsp;&nbsp;&nbsp; <br/><br/></td>
                        <td colSpan="2" >工程名称: {this.state.requisition.requisition_name}<br/><br/></td>
                        <td colSpan="2" >结构名称: {this.state.requisition.requisition_structurename}<br/><br/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2" >施工单位： {this.state.requisition.requisition_constructunit}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="2" >仪器型号： {this.state.requisition.requisition_instrumenttype}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="2" >胶片型号： {this.state.requisition.requisition_filmtype}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                    </tr>
                    <tr>
                        <td colSpan="2" >检测标准： {this.state.requisition.requisition_testingstandard}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="2" >合格级别： {this.state.requisition.requisition_qualificationlevel}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="2" >增 感  屏：{this.state.requisition.requisition_intensifyscreen}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                    </tr>
                    <tr>
                        <td colSpan="2" >管 电 压： {this.state.requisition.requisition_tubevoltage}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="2" >管 电 流： {this.state.requisition.requisition_tubecurrent}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="2" >曝光时间： {this.state.requisition.requisition_exposuretime}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                    </tr>
                    <tr>
                        <td colSpan="2" >灵 敏 度： {this.state.requisition.requisition_sensitivity}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="2" >底片黑度： {this.state.requisition.requisition_density}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="2" >焦  距：   {this.state.requisition.requisition_focus}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                    </tr>
                    <tr>
                        <td colSpan="2" >显影时间： {this.state.requisition.requisition_developmenttime}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="2" >显影温度： {this.state.requisition.requisition_developertemperature}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="2" >钢  号：   {this.state.requisition.requisition_steelnumber}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                    </tr>
                    <tr>
                        <td colSpan="2" >接头形式：{this.state.requisition.requisition_jointform}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="2" >焊接方法：{this.state.requisition.requisition_weldingmethod}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="2" >数   量： {this.state.requisition.requisition_totalnumber}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                    </tr>
                    <tr>
                        <td colSpan="2">焊缝编号：&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="1">厚度mm：&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="2">缺陷定位、定量、定性：&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="1">级别：&nbsp;&nbsp;&nbsp;&nbsp;</td>
                    </tr>

                        {
                            this.state.pictureList.map((picture,index)=>{
                                return(
                                        <tr>
                                            <td colSpan="2" >{picture.picture_number}&nbsp;&nbsp;</td>
                                            <td colSpan="1" >{picture.picture_thickness}&nbsp;&nbsp;</td>
                                            <td colSpan="2" >11&nbsp;&nbsp;</td>
                                            <td colSpan="1" >{picture.picture_level}&nbsp;&nbsp;</td>
                                        </tr>
                                )
                            }
                            )
                        }



                    <tr>
                        {/*<td colSpan="2" >&nbsp;&nbsp;&nbsp;&nbsp;</td>*/}
                        {/*<td colSpan="4">A：圆形缺陷 B:条形缺陷 C:未焊透 D:未熔合 E:裂纹</td>*/}
                        <td colSpan="4">A：气孔 B:未焊透 C:未熔合 D:裂纹 E:未确定</td>
                        <td colSpan="4"></td>
                    </tr>
                    <tr>
                        <td colSpan="8">
                        {
                            this.state.statistic.map((item, index) => {
                                return <span>{item.damagetype_name}: {item.count}个&nbsp;({(item.frequency * 100).toFixed(2)}%)&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            })
                        }
                        {/*<td colSpan="2">未熔合：&nbsp;&nbsp;&nbsp;&nbsp;个</td>*/}
                        {/*<td colSpan="1">未焊透：&nbsp;&nbsp;&nbsp;&nbsp;个</td>*/}
                        {/*<td colSpan="2">裂纹：&nbsp;&nbsp;&nbsp;&nbsp;个</td>*/}
                        {/*<td colSpan="1">气孔：&nbsp;&nbsp;&nbsp;&nbsp;个</td>*/}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="3">评片员：&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="3">审核员：</td>
                    </tr>
                </table>
            </div>
        );
    }
}

export default PrintReport;
