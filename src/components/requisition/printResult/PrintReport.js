import React, {Component, useRef} from 'react';
import './report.css'
import cssc from '../../../assets/images/cssc.jpg'
import axios from "axios";
import saveLoginInfo from '../../../utils/saveLogInfo'
import printJS from "print-js";
import moment from "moment";
import {Button} from "antd";

var rendertag = 0

class PrintReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            picturePolygon: [],
            requisition: [],
            pictureList: [],
            statistic: [],
            name1: '',
            name2: '',
            name3: '',
            member1: '',
            member2: '',
            member3: '',
        };
    }

    openPrint() {
        printJS({
            printable: 'Ptabel',
            type: 'html',
            targetStyle: ['*'],
        })
        // useRef();

    }

    componentWillMount() {

        // alert(this.props.match.params.requisition_id)
        this.getRequisition(this.props.match.params.requisition_id);
        this.getPictureList(this.props.match.params.requisition_id);
        this.getDamageTypeStatistic(this.props.match.params.requisition_id);
        this.getPicturePolygon(this.props.match.params.requisition_id);
        // this.getMemberName1(this.state.requisition.requisition_firstexam_member)
        // this.getMemberName2(this.state.requisition.requisition_secondexam_member)
        // this.getMemberName3(this.state.requisition.requisition_thirdexam_member)
        // this.getMember1(this.state.requisition.requisition_firstexam_member)
        // this.getMember2(this.state.requisition.requisition_secondexam_member)
        // this.getMember3(this.state.requisition.requisition_thirdexam_member)
    }

    componentDidMount() {
        console.log("componentDidMount")
        // this.getRequisition(this.props.match.params.requisition_id);
        // this.getDamageTypeStatistic(this.props.match.params.requisition_id);

    }

    getDamageTypeStatistic = (requisition_id) => {
        let api = global.AppConfig.serverIP + '/getRequisitionDamageTypeStatistic?requisition_id=' + requisition_id;
        axios.post(api)
            .then((response) => {
                console.log('getRequisitionDamageTypeStatistic:' + JSON.stringify(response.data));
                this.setState({
                    statistic: response.data,
                });
            })
            .catch((error) => {
                console.log(error);
            });

        // this.getMemberName1(this.state.requisition.requisition_firstexam_member)
        // this.getMemberName2(this.state.requisition.requisition_secondexam_member)
        // this.getMemberName3(this.state.requisition.requisition_thirdexam_member)
    };

    getRequisition = (requisition_id) => {

        let api = global.AppConfig.serverIP + '/getRequisition?requisition_id=' + requisition_id;
        axios.post(api)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                this.setState({
                    requisition: response.data,
                })
                this.getMember1(this.state.requisition.requisition_firstexam_member)
                this.getMember2(this.state.requisition.requisition_secondexam_member)
                this.getMember3(this.state.requisition.requisition_thirdexam_member)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    getPictureList = (requisition_id) => {

        let api = global.AppConfig.serverIP + '/getPictureListByReqId/' + requisition_id;
        axios.get(api)
            .then((response) => {
                console.log("adsadadsad", response.data);
                this.setState({

                    pictureList: response.data,
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }
    getPicturePolygon = (requisition_id) => {
        let api = global.AppConfig.serverIP + '/getPicturePolygon/' + requisition_id;
        axios.get(api)
            .then((response) => {
                console.log("adsadadsad", response.data);
                this.setState({

                    picturePolygon: response.data,
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }
    // getMemberName1=(member_id)=>{
    //     let api = global.AppConfig.serverIP + '/getMemberNameById?member_id=' + member_id;
    //     axios.post(api)
    //         .then((response)=> {
    //             this.setState({
    //                 name1: response.data,
    //             })
    //         })
    //         .catch( (error)=> {
    //             console.log(error);
    //         });
    //
    // }
    // getMemberName2=(member_id)=>{
    //     let api = global.AppConfig.serverIP + '/getMemberNameById?member_id=' + member_id;
    //     axios.post(api)
    //         .then((response)=> {
    //             this.setState({
    //                 name2: response.data,
    //             })
    //         })
    //         .catch( (error)=> {
    //             console.log(error);
    //         });
    // }
    // getMemberName3=(member_id)=>{
    //     let api = global.AppConfig.serverIP + '/getMemberNameById?member_id=' + member_id;
    //     axios.post(api)
    //         .then((response)=> {
    //             this.setState({
    //                 name3: response.data,
    //             })
    //         })
    //         .catch( (error)=> {
    //             console.log(error);
    //         });
    // }
    getMember1 = (member_id) => {
        let api = global.AppConfig.serverIP + '/RestgetMemberById/' + member_id;
        axios.post(api)
            .then((response) => {
                console.log(response.data)
                this.setState({
                    member1: response.data,
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }
    getMember2 = (member_id) => {
        let api = global.AppConfig.serverIP + '/RestgetMemberById/' + member_id;
        axios.post(api)
            .then((response) => {
                this.setState({
                    member2: response.data,
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }
    getMember3 = (member_id) => {
        let api = global.AppConfig.serverIP + '/RestgetMemberById/' + member_id;
        axios.post(api)
            .then((response) => {
                this.setState({
                    member3: response.data,
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }
    getSign = (index, state) => {
        if (state === "审批完成") {
            if (index === 1) {
                return <img width="80" height="40"
                            src={global.AppConfig.serverIP + "/images/" + this.state.member1.signature}
                            onError={(e) => {
                                e.target.src = ''
                            }}/>
            } else if (index === 2) {
                return <img width="80" height="40"
                            src={global.AppConfig.serverIP + "/images/" + this.state.member2.signature}
                            onError={(e) => {
                                e.target.src = ''
                            }}/>
            } else {

            }
            return <img width="80" height="40"
                        src={global.AppConfig.serverIP + "/images/" + this.state.member3.signature} onError={(e) => {
                e.target.src = ''
            }}/>
        }

    }
    renderFlaw = () => {
        if(rendertag < 3){
            rendertag = rendertag+1
            console.log("renderFlaw")
      }else{
            this.state.picturePolygon.map((item, index) => {

                if (item.damageType.damagetype_id !== 6) {
                    console.log("执行了", index)
                    let f1 = document.getElementById(item.picture.picture_id + "f1")
                    let f2 = document.getElementById(item.picture.picture_id + "f2")
                    // let f3 = document.getElementById(item.picture.picture_id + "f3")

                    let tr1 = document.createElement("tr")
                    let tr2 = document.createElement("tr")
                    // let tr3 = document.createElement("tr")
                    let t1 = document.createTextNode(item.polygon.polygon_flaw_length)  //大小
                    let t2 = document.createTextNode(item.damageType.damagetype_name)  //类型
                    // let t3 = document.createTextNode(item.polygon.polygon_flaw_position_x + "," + item.polygon.polygon_flaw_position_y)  //描述（来源）

                    tr1.appendChild(t1)
                    tr2.appendChild(t2)
                    // tr3.appendChild(t3)

                    f1.appendChild(tr1)
                    f2.appendChild(tr2)
                    // f3.appendChild(tr3)
                }
            })
        }
    }

    render() {
        let last_pic_id = -1; //上个pic id
        saveLoginInfo('查看了申请单编号' + this.state.requisition.requisition_number + '的报告单')
        return (
            <div>
                <Button type="primary" onClick={() => this.openPrint()}>打印此页面</Button>
                <div className="report" id="Ptabel">
                    <div className="top-title">
                        <span>
                            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                            {/*<img src={cssc} width="100" height="35"/>*/}

                            &emsp;&emsp;
                            <font
                                size="6">武&emsp;汉&emsp;造&emsp;船&emsp;厂&emsp;集&emsp;团&emsp;有&emsp;限&emsp;公&emsp;司</font>
                            <br/>
                            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                            <font size="6">WUHAN&ensp;SHIPYARD&ensp;GROUP&ensp;CORPORATION,&ensp;LTD.</font>
                            <hr/>
                            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                            <font size="6">射&emsp;线&emsp;检&emsp;测&emsp;报&emsp;告</font>
                        </span>
                    </div>
                    <br/>
                    <table className="report-title" border={0}>
                        <tr>
                            <td align="left">编号：{this.state.requisition.requisition_number}&emsp;&emsp;&emsp;&emsp;</td>
                            <td align="left">军检号：{this.state.requisition.requisition_military_inspection_id}&emsp;&emsp;&emsp;&emsp;</td>
                            <td align="left">报告编号：{this.state.requisition.requisition_reportnumber}&emsp;&emsp;&emsp;&emsp;</td>

                        </tr>
                    </table>
                    <table className="report-table" border={1} cellSpacing="0" width="800" height="300"
                           style={{borderColor: "black"}}>
                        <tr>
                            <td colSpan="4">产品名称：{this.state.requisition.requisition_structurename}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td colSpan="4">委托单编号: {this.state.requisition.requisition_id}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td colSpan="4">焊接方法:{this.state.requisition.requisition_weldingmethod}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td colSpan="4">完工日期:{this.state.requisition.requisition_complete_date}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        </tr>
                        <tr>
                            <td colSpan="4">检测比例：{this.state.requisition.requisition_testing_rate}&nbsp;&nbsp;&nbsp;&nbsp;
                                <br/><br/></td>
                            <td colSpan="4">坡口形式: {this.state.requisition.requisition_bevel_form}<br/><br/></td>
                            <td colSpan="4">透照方式: {this.state.requisition.requisition_transillumination}<br/><br/>
                            </td>
                            <td colSpan="4">检测日期: {this.state.requisition.requisition_testing_date}<br/><br/></td>
                        </tr>
                        <tr>
                            <td colSpan="8">检测标准： {this.state.requisition.requisition_testingstandard}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td colSpan="4">合格级别： {this.state.requisition.requisition_qualificationlevel}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td colSpan="4">检测设备： {this.state.requisition.requisition_testing_instrument}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        </tr>
                        <tr>
                            <td colSpan="4">设备型号： {this.state.requisition.requisition_instrumenttype}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td colSpan="4">源强(Ci)： {this.state.requisition.requisition_source_strength}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td colSpan="4">源龄(天)：{this.state.requisition.requisition_souce_age}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td colSpan="4">焦距(mm)：{this.state.requisition.requisition_focus}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        </tr>
                        <tr>
                            <td colSpan="4">焦点尺寸(mm)： {this.state.requisition.requisition_focus_size}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td colSpan="4">管电压(KV)： {this.state.requisition.requisition_tubevoltage}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td colSpan="4">管电流(mA)： {this.state.requisition.requisition_tubecurrent}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td colSpan="4">材质： {this.state.requisition.requisition_material}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        </tr>
                        <tr>
                            <td colSpan="4">胶片类型： {this.state.requisition.requisition_filmtype}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td colSpan="4">增感方式： {this.state.requisition.requisition_sensitization_method}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td colSpan="4">底片处理方式： {this.state.requisition.requisition_film_processing_method}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td colSpan="4">曝光时间： {this.state.requisition.requisition_exposuretime}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        </tr>
                        <tr>
                            <td colSpan="1" rowSpan="2">序号：</td>
                            <td colSpan="4" rowSpan="2">检测部位及说明：&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td colSpan="2" rowSpan="2">底片名称：&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td colSpan="2" rowSpan="2">板厚/规格(mm)：&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td colSpan="1" rowSpan="2">底片黑度：&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td colSpan="1" rowSpan="2">像质指数：&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td colSpan="2" rowSpan="1">缺陷记录：
                            </td>
                            <td colSpan="1" rowSpan="2">结论：&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td colSpan="1" rowSpan="2">焊接人：&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        </tr>
                        <tr>
                            <td>
                                大小(mm)：&nbsp;&nbsp;&nbsp;&nbsp;
                            </td>
                            <td>
                                类型：&nbsp;&nbsp;&nbsp;&nbsp;
                            </td>
                            {/*<td>*/}
                            {/*    位置：&nbsp;&nbsp;&nbsp;&nbsp;*/}
                            {/*</td>*/}
                        </tr>
                        {
                            this.state.pictureList.map((picture, index) => {

                                    return (
                                        <tr>
                                            <td colSpan="1">{index + 1}&nbsp;&nbsp;</td>
                                            <td colSpan="4">{picture.picture_parts_Introductions}&nbsp;&nbsp;</td>
                                            <td colSpan="2">{picture.picture_dir}&nbsp;&nbsp;</td>
                                            <td colSpan="2">{picture.picture_thickness}&nbsp;&nbsp;</td>
                                            <td colSpan="1">{picture.picture_density != null ? picture.picture_density : this.state.requisition.requisition_density}&nbsp;&nbsp;</td>
                                            <td colSpan="1">{picture.picture_quality}&nbsp;&nbsp;</td>

                                            {/*<td id={picture.picture_id + "f1"} colSpan="1" ><tr>{picture.picture_flaw_position}&nbsp;&nbsp;</tr></td>*/}
                                            {/*<td id={picture.picture_id + "f2"} colSpan="1" ><tr>{picture.picture_flaw_type}&nbsp;&nbsp;</tr></td>*/}
                                            {/*<td id={picture.picture_id + "f3"} colSpan="1" ><tr>{}&nbsp;&nbsp;</tr></td>*/}
                                            <td id={picture.picture_id + "f1"} colSpan="1">
                                                <tr>&nbsp;&nbsp;</tr>
                                            </td>
                                            <td id={picture.picture_id + "f2"} colSpan="1">
                                                <tr>&nbsp;&nbsp;</tr>
                                            </td>
                                            {/*<td id={picture.picture_id + "f3"} colSpan="1">*/}
                                            {/*    /!*<tr>&nbsp;&nbsp;</tr>*!/*/}
                                            {/*</td>*/}
                                            <td colSpan="1">{picture.picture_conclusion}&nbsp;&nbsp;</td>
                                            <td colSpan="1">{picture.picture_welding_operator}&nbsp;&nbsp;</td>
                                        </tr>
                                    )
                                }
                            )
                        }
                        {this.renderFlaw()}


                        {/*<tr>*/}
                        {/*    /!*<td colSpan="2" >&nbsp;&nbsp;&nbsp;&nbsp;</td>*!/*/}
                        {/*    /!*<td colSpan="4">A：圆形缺陷 B:条形缺陷 C:未焊透 D:未熔合 E:裂纹</td>*!/*/}
                        {/*    <td colSpan="4">A：气孔 B:未焊透 C:未熔合 D:裂纹 E:未确定</td>*/}
                        {/*    <td colSpan="4"></td>*/}
                        {/*</tr>*/}
                        {/*<tr>*/}
                        {/*    <td colSpan="8">*/}
                        {/*    {*/}
                        {/*        this.state.statistic.map((item, index) => {*/}
                        {/*            return <span>{item.damagetype_name}: {item.count}个&nbsp;({(item.frequency * 100).toFixed(2)}%)&nbsp;&nbsp;&nbsp;&nbsp;</span>*/}
                        {/*        })*/}
                        {/*    }*/}
                        {/*    /!*<td colSpan="2">未熔合：&nbsp;&nbsp;&nbsp;&nbsp;个</td>*!/*/}
                        {/*    /!*<td colSpan="1">未焊透：&nbsp;&nbsp;&nbsp;&nbsp;个</td>*!/*/}
                        {/*    /!*<td colSpan="2">裂纹：&nbsp;&nbsp;&nbsp;&nbsp;个</td>*!/*/}
                        {/*    /!*<td colSpan="1">气孔：&nbsp;&nbsp;&nbsp;&nbsp;个</td>*!/*/}
                        {/*    </td>*/}
                        {/*</tr>*/}
                        {/*<tr>*/}
                        {/*    <td colSpan="3">评片员：&nbsp;&nbsp;&nbsp;&nbsp;</td>*/}
                        {/*    <td colSpan="3">审核员：</td>*/}
                        {/*</tr>*/}
                    </table>
                    <table className="report-title" border={0}>
                        <tr>
                            <td colSpan="1">探伤员：{this.getSign(1, this.state.requisition.requisition_firstexam)}</td>
                            <td colSpan="1">复评：{this.getSign(2, this.state.requisition.requisition_secondexam)}</td>
                            <td colSpan="1">无损检测室主任：{this.getSign(3, this.state.requisition.requisition_thirdexam)}</td>
                            <td colSpan="1">报告日期：{moment().format('YYYY-MM-DD HH:mm:ss')}</td>

                        </tr>
                        <tr>
                            <td colSpan="4">施工部门：{this.state.requisition.requisition_reportnumber}&emsp;&emsp;&emsp;&emsp;</td>
                        </tr>
                        <tr>
                            <td colSpan="4"> N--无缺陷No defect,&emsp;P--气孔Porosity,&emsp;S--夹渣Slag,&emsp;I--未焊透Incomplete
                                penetration,&emsp;C--裂纹Crack,&emsp;L--未熔合Lack of fusion
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        );
    }
}

export default PrintReport;
