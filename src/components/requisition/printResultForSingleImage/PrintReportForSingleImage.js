import React, { Component } from 'react';
import './report.css'
import axios from "axios";
import saveLoginInfo from '../../../utils/saveLogInfo'

class PrintReportForSingleImage extends Component {

    constructor(props){
        super(props);
        this.state = {
            requisition: [],
            picture: {},
            statistic: [],
            polygonList:{},//获得数据库的多边形List
            damageTypeList:[],
        };
    }

    componentWillMount() {
        // console.log(this.props.match.params.picture_id);
        // console.log(this.props.match.params.display);
        // console.log(this.props.match.params.requisition_id);
       // alert(this.props.match.params.requisition_id)
        this.getPicture(this.props.match.params.picture_id);
        // this.getRequisition(this.props.match.params.picture_id.picture_requisition_id);
        this.getDamageTypeStatistic(this.props.match.params.picture_id, this.props.match.params.display);
        this.getDamageTypeList();
        this.getPicturePolygon(this.props.match.params.picture_id);
       // this.getPictureList(this.props.match.params.requisition_id);
    }

    componentDidMount() {
        this.getPicture(this.props.match.params.picture_id);
        this.getDamageTypeStatistic(this.props.match.params.picture_id, this.props.match.params.display);
    }

    getPicturePolygon=(picture_id)=>{
        let api = global.AppConfig.serverIP + '/getPicturePolygon?picture_id='+ picture_id;
        axios.post(api)
            .then((response)=>{
                console.log('getPicturePolygon:'+JSON.stringify(response.data));
                this.setState({
                    polygonList:response.data,
                })
            })
            .catch( (error)=> {
                console.log(error);
            });
    }

    getDamageTypeList=()=>{

        let api = global.AppConfig.serverIP + '/getDamageTypeList' ;
        axios.post(api)
            .then((response)=> {
                console.log('getDamageTypeList:'+JSON.stringify(response.data));
                // alert(JSON.stringify(response.data));
                this.setState({
                    damageTypeList: response.data,
                })
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

    getPicture=(picture_id)=>{
        // console.log("vvvvvvvvvvvv");
        // console.log(picture_id);
        // console.log("^^^^^^^^^^^^");
        let api = global.AppConfig.serverIP + '/getPicture?picture_id='+ picture_id;
        axios.post(api)
            .then((response)=> {
                // console.log(response);
                // console.log("=============" + picture_id);
                console.log("getPicture:"+JSON.stringify(response.data));
                this.setState({
                    picture: response.data,
                });

                // db_picture_thickness = this.state.picture.picture_thickness;
                // db_picture_teststandard = this.state.picture.picture_teststandard;
                // console.log('getPicture',db_picture_thickness);
                this.getRequisition(this.state.picture.picture_requisition_id);
            })
            .catch( (error)=> {
                console.log(error);
            });

    };

    getDamageTypeColor=(damageTypeId)=>{
        if(damageTypeId == 0)
            return "#ED9D01";
        else if(damageTypeId == 1)
            return "#E4EE5D";
        else if(damageTypeId == 2)
            return "#996699";
        else if(damageTypeId == 3)
            return "#00CEA6";
        else if(damageTypeId == 4)
            return "#003CB1";
        else if(damageTypeId == 5)
            return "#A300B1";
        // else if(damageTypeId == 5)
        //     return "#00B109";
    }

    getDamageTypeStatistic=(picture_id, display)=>{
        let api;
        if (display == 'all') {
            api = global.AppConfig.serverIP + '/getPictureDamageTypeStatistic?picture_id='+ picture_id;
        } else if (display != 'none') {
            api = global.AppConfig.serverIP + '/getPictureDamageTypeStatisticWithSpecificAuthor?picture_id='+ picture_id + '&author=' + display;
        } else {
            return ;
        }
        axios.post(api)
            .then((response)=>{
                console.log('getPictureDamageTypeStatistic:'+JSON.stringify(response.data));
                this.setState({
                    statistic:response.data,
                });
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    render() {
        console.log(this.state.picture.picture_dir)
        // const {getFieldDecorator} = this.props.form;

        //获取rect信息
        let rectList = [];
        let retangle = this.state.rectangleList;
        let damageTypeList = this.state.damageTypeList;

        //获取polygon信息
        let polygList = [];//前端标签<>用于展示用
        let polyg = this.state.polygonList;//将数据库的数据逐个取出来，push到polygList进行展示
        for(let i=0;i<polyg.length;i++)
        {
            let polygon_id = polyg[i].polygon_id;
            let polygon_pt = polyg[i].polygon_pt;
            //  let polygon_picture_id = polyg[i].polygon_picture_id;
            let polygon_author = polyg[i].polygon_author;
            let polygon_damage_type = polyg[i].polygon_damage_type;
            console.log("id="+polygon_id+"  author="+polygon_author)
            let polygon_damage_name;

            let topx = polyg[i].polygon_text_x;
            let topy = polyg[i].polygon_text_y;

            if(damageTypeList.length > 0)
            {
                for(let i = 0; i < damageTypeList.length; i++)
                {
                    if(damageTypeList[i].damagetype_id === polygon_damage_type){
                        polygon_damage_name = damageTypeList[i].damagetype_name;
                    }
                }
            }
            polygList.push({id:polygon_id,points:polygon_pt,author:polygon_author,damage_type:polygon_damage_type,damage_name:polygon_damage_name,textx:topx,texty:topy})
        }
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
                <div >
                    <div className="picManage picManageInReport" >
                        {/*<RectangleManage PictureManage={this}/>
               const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;  */}
                        <div id="raw-view">
                            <img className="tifImg" src={global.AppConfig.XrayDBIP+this.state.picture.picture_dir}  style={{width:1000,height:300}}  />
                        </div>
                        <svg
                            onMouseDown={this.mousedown}
                            onMouseMove={this.mousemove}
                            onMouseUp={this.mouseup}
                            // onMouseOver={this.mouseover}
                            className="svgG" id="svgG" version="1.1"  width="1000" height="300"  xmlns="http://www.w3.org/2000/svg"
                        >
                            {/*/!*<rect  x={80} y={80} width={150} height={150} stroke="red" strokeWidth={2} onClick={()=>{alert(11111)}}/>*!/*/}
                            {/*{rectList.map((item,index)=>{*/}
                            {/*    if(item.author!=='member') {*/}
                            {/*        return <rect style={{display:this.state.AIRectDisplay}}  onMouseDownCapture={()=>this.updateDamageType(item.id,item.author)}  key={index} id={item.id} damage={item.damage_type} rect_conf={item.conf} rect_cls_conf={item.cls_conf} x={item.x} y={item.y} width={item.width} height={item.height} fill="black"  fillOpacity={0} stroke={this.state.AIClor} strokeWidth={1}/>*/}

                            {/*    }else{*/}
                            {/*        return <rect style={{display:this.state.rectDisplay}}   onMouseDownCapture={()=>this.updateDamageType(item.id,item.author)}  key={index} id={item.id} damage={item.damage_type} rect_conf={item.conf} rect_cls_conf={item.cls_conf} x={item.x} y={item.y} width={item.width} height={item.height}  fill="black"  fillOpacity={0} stroke={this.state.memberClor} strokeWidth={1}/>*/}
                            {/*        }*/}
                            {/*    })*/}
                            {/*}*/}

                            {
                                polygList.map((item,index)=>{
                                    // let color = this.getDamageTypeColor(item.damage_type);
                                    // console.log(color);
                                    if(item.author!=='member')
                                    {
                                        return <polygon author={item.author} style={{display:this.state.AIRectDisplay}} key={index} id={item.id} onMouseDownCapture={()=>this.selectPolygon(item.id)} textx={item.textx} texty={item.texty} damage={item.damage_type} points={item.points}  fill={this.getDamageTypeColor(item.damage_type)} stroke="#0099CC"/>

                                    }
                                    else
                                    {
                                        return <polygon author={item.author} style={{display:this.state.rectDisplay}} key={index} id={item.id} onMouseDownCapture={()=>this.selectPolygon(item.id)} textx={item.textx} texty={item.texty} damage={item.damage_type} points={item.points}  fill={this.getDamageTypeColor(item.damage_type)} stroke="red"/>

                                    }
                                })
                            }


                            { <polygon points=  {this.state.polygonPoints}
                                       fill="red" stroke="black"
                            />
                            }

                        </svg>
                    </div>
                    <div className="LegendsInReport">
                        <table>
                            <tr>
                                {
                                    this.state.damageTypeList.map((item, index) => {
                                        return <td >
                                            <div className="LegendsDiv">
                                                <span className="LegendsDivSymbol" style={{color:this.getDamageTypeColor(item.damagetype_id)}}>■</span>
                                                <span className="LegendsDivText">&nbsp;{item.damagetype_name}</span>
                                            </div>
                                        </td>
                                    })
                                }
                                <td>
                                    <div className="LegendsDiv">
                                        <span className="LegendsDivBoundarySymbol" style={{color: '#0099CC'}}>□</span>
                                        <span className="LegendsDivText">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AI标注</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="LegendsDiv">
                                        <span className="LegendsDivBoundarySymbol" style={{color: 'red'}}>□</span>
                                        <span className="LegendsDivText">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;人工标注</span>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <table className="report-title" border={0} style={{position: "absolute", top: '500px', marginLeft: '2.5%'}}>
                    <tr>
                        <td  align="left" width="30%">无损检测室：</td>
                        <td  width="30%"></td>
                        <td  width="30%"> </td>
                    </tr>
                    <tr/>
                </table>
                <br/>
                <table  className="report-table" border={1} cellSpacing="0" width="800" height="300" style={{position: "absolute", top: '520px', marginLeft: '2.5%', borderColor: 'black'}}>
                    <tr>
                        <td colSpan="2" >来样编号：{this.state.requisition.requisition_samplenumber}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="2" >报告编号:&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="2" >日期:&nbsp;&nbsp;&nbsp;&nbsp;</td>
                    </tr>
                    <tr>
                        <td colSpan="2" >工程编号：{this.state.requisition.requisition_number}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="2" >工程名称: {this.state.requisition.requisition_name}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="2" >结构名称: {this.state.requisition.requisition_structurename}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                    </tr>
                    <tr>
                        <td colSpan="2" >施工单位： {this.state.requisition.requisition_constructunit}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="2" >仪器型号： {this.state.requisition.requisition_instrumenttype}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="2" >胶片型号： {this.state.requisition.requisition_filmtype}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                    </tr>
                    <tr>
                        <td colSpan="2" >检测标准： {this.state.requisition.requisition_testingstandard}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="2" >合格级别： {this.state.requisition.requisition_qualificationlevel}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="2" >增 感 屏：{this.state.requisition.requisition_intensifyscreen}&nbsp;&nbsp;&nbsp;&nbsp;</td>
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
                        <td colSpan="2">焊缝编号：{this.state.picture.picture_number}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="2">厚度mm：{this.state.picture.picture_thickness}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="2">合格级别：{this.state.picture.picture_qualifylevel}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                    </tr>
                    <tr>
                        <td colSpan="2">检测方法：{this.state.picture.picture_testmethod}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="2">影像图长：{this.state.picture.picture_width}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="2">影像图宽：{this.state.picture.picture_height}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                    </tr>
                    <tr>
                        <td colSpan="2">检测标准：{this.state.picture.picture_teststandard}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="2">评定级别：{this.state.picture.picture_level}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="2">接头型号：{this.state.picture.picture_jointform}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                    </tr>
                    <tr>
                        <td colSpan="8">录入时间：{this.state.picture.picture_entrytime}&nbsp;&nbsp;&nbsp;&nbsp;</td>

                    </tr>
                    {/*<tr>*/}
                    {/*    {*/}
                    {/*        this.state.statistic.map((item, index) => {*/}
                    {/*            return <td colSpan={index % 2 == 1 ? "2" : "1"}>{item.damagetype_name}: {item.count}个&nbsp;({(item.frequency * 100).toFixed(2)}%)</td>*/}
                    {/*        })*/}
                    {/*    }*/}
                    {/*    /!*<td colSpan="2">未熔合：&nbsp;&nbsp;&nbsp;&nbsp;个</td>*!/*/}
                    {/*    /!*<td colSpan="1">未焊透：&nbsp;&nbsp;&nbsp;&nbsp;个</td>*!/*/}
                    {/*    /!*<td colSpan="2">裂纹：&nbsp;&nbsp;&nbsp;&nbsp;个</td>*!/*/}
                    {/*    /!*<td colSpan="1">气孔：&nbsp;&nbsp;&nbsp;&nbsp;个</td>*!/*/}
                    {/*</tr>*/}
                    <tr>
                        <td colSpan="8">
                            {
                                this.state.statistic.map((item, index) => {
                                    return <span>{item.damagetype_name}: {item.count}个&nbsp;({(item.frequency * 100).toFixed(2)}%)&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                })
                            }
                        </td>
                    </tr>

                        {/*{*/}
                        {/*    this.state.pictureList.map((picture,index)=>{*/}
                        {/*        return(*/}
                        {/*                <tr>*/}
                        {/*                    <td colSpan="2" >{picture.picture_number}&nbsp;&nbsp;</td>*/}
                        {/*                    <td colSpan="1" >{picture.picture_thickness}&nbsp;&nbsp;</td>*/}
                        {/*                    <td colSpan="2" >11&nbsp;&nbsp;</td>*/}
                        {/*                    <td colSpan="1" >{picture.picture_level}&nbsp;&nbsp;</td>*/}
                        {/*                </tr>*/}
                        {/*            )*/}
                        {/*        }*/}
                        {/*    )*/}
                        {/*}*/}



                    {/*<tr>*/}
                    {/*    /!*<td colSpan="2" >&nbsp;&nbsp;&nbsp;&nbsp;</td>*!/*/}
                    {/*    <td colSpan="4">A：气孔 B:未焊透 C:未熔合 D:裂纹</td>*/}
                    {/*</tr>*/}
                    <tr>
                        <td colSpan="3">评片员：&nbsp;&nbsp;&nbsp;&nbsp;</td>
                        <td colSpan="3">审核员：</td>
                    </tr>
                </table>
            </div>
        );
    }
}

export default PrintReportForSingleImage;
