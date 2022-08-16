import {
    message,Form, Divider, Table, Badge, Menu, Dropdown, Icon, Button, Modal, Row, Col, Input, Select
} from 'antd';
import React,{Component} from "react";
import axios from "axios";
import '../../config/config'
import tifImage37 from '../../assets/images/VIDARImage4.tif'
import './pictureManage.css'
import * as d3 from "d3";
import RectangleManage from './rectangle/rectangleManage'
import saveLoginInfo from '../../utils/saveLogInfo'
import history from '../common/history'
import {Link } from "react-router-dom";


const { Option } = Select;

message.config({
    maxCount:2
});

const multiView = {
    width: "405px",
    height: "405px",
    borderRadius: "50%",
    boxShadow: "0 0 0 7px rgba(255, 255, 255, .8),0 0 7px 7px rgba(0, 0, 0, .2),inset 0 0 40px 2px rgba(0, 0, 0, 0.25)",
    backgroundImage: `url(http://192.168.0.103:8080//XrayImageDB//199//VIDARImage16.tif)`,
    backgroundSize: "2000px 600px",
    backgroundRepeat: "no-repeat",
    position: "absolute",
    zIndex: "3",
};


var timer;
var db_picture_thickness;
var db_picture_teststandard;
let loadinghide;
let globalSVG;
let globalRect;
let globalRectX;
let globalRectY;
let globalJudgeRectX;
let globalJudgeRectY;
let globalFlag;

//用来画多边形
let polygonFlag = false;
let polygonPointsNum = 0;
let polygonPointArrayX = new Array(8);
let polygonPointArrayY = new Array(8);
let polygonPointsString = "";//保存多边形当前的点
let polygonBeginTag = "";
let globalPolygon;//globalPolygon指向每次创建后多边形，操控多边形属性
let polygonId ="";//点击多边形框后，暂存该框的id，用于更新类型或者删除   //东哥放在state里了
let polygonTopx = 1050;
let polygonTopy = 350;//先设置成最大，只要每次变小就更新，找到最上方点作为损伤类型位置
let polygonClickflag = false;//用于改变损伤框类型(为了与rect框区分)   若点击多边形，设置为true，发送给后端对应的接口

//单击延时触发
var clickTimeId;

let updateRectClor = '';
let clickRectClor = '';  // rect的Id?
const confirm = Modal.confirm;


class PictureManage extends Component{

    constructor(props) {
        super(props);
        this.state={
            wheelTimes: 2.5,
            fdDispaly:"none",
            propsPictureId:'',
            requisition:'',
            clsconfdispaly:"",
            AIConfDisplay: "",
            drawConfDisplay:'',
            drawDamageTypeDisplay:"none",
            AIDamageTypeDisplay:"none",
            AIDamageBeliefDisplay:"none",
            rectDisplay:'',
            AIRectDisplay:'',
            svgG:'',
            rectT: '',
            picture: {},
            pictureLevel:['I级','II级','III级','IV级','V级'],
            pictureTeststandard:['Q/WSJ06.091-2000','1','2'],

            polygonPoints:" ",//测试用
            polygonList:{},//获得数据库的多边形List

            rectangleList: {},
            visible: false,
            rectangle:{}, //当前鼠标选择的方框属性
            damageType:{"damagetype_id":"0","damagetype_name":"未确定"},
            test: {"FirstName": "xu","LastName":"Xiang"},
            damageTypeList:[],
            //updateRectClor标志颜色变化，为空则svg内没有发生颜色变化，变色则记录上次点击的颜色

            memberClor:'red',
            AIClor:'yellow',
            onClickRectId:'',
            AIDetectLoading:'',
        }
    }

    componentWillMount() {
        let picture_id = this.props.match.params.picture_id;
        this.setState({
            propsPictureId:  picture_id,
        });
        this.getPicture(picture_id);
        this.getPictureRect(picture_id);
        this.getDamageTypeList();
        this.getPicturePolygon(picture_id);

    }

    polygonModel=()=>{//开启或关闭多边形模式
        if(polygonFlag==false)
        {//开启
            polygonTopy = 350;
            polygonTopx = 1050;
            polygonFlag = true;
            polygonPointsNum = 0;
            polygonPointsString = "";
            polygonBeginTag = message.loading('多边形模式运行中..',120);
        }
        else
        {//关闭
            this.setState({
                polygonPoints:"",
            })
            polygonFlag = false;
            setTimeout(polygonBeginTag, 1);
        }

    }

    rePolygon=()=>{//重画多边形
        if(polygonFlag==true)
        {
            polygonTopy = 350;
            polygonTopx = 1050;
            polygonPointsNum = 0;
            polygonPointsString = "";

            this.setState({
                polygonPoints:"",
            })
        }
        else
        {
            message.error("请打开画多边形模式！")
        }

    }

    savetmpPolygon=()=>{//在前端保存多边形到<polygon/>标签
        if(polygonPointsString!=""&&polygonPointsString.length>14)
        {
            globalPolygon = globalSVG.append("polygon")
                .attr("points",polygonPointsString)
                .attr("damage",1)
                .attr("textx",polygonTopx)
                .attr("texty",polygonTopy)
                .attr("id", 'tempId')
                .attr("fill", "black")
                .attr("fill-opacity",0)
                .attr("stroke", "red")
                .attr("author",'member')
                .attr("stroke-width", 1);

            console.log("topx: "+globalPolygon);
            this.savePolygon();

            polygonTopy = 350;
            polygonTopx = 1050;
            // for(let i=0;i<polygonPointsNum;i++)
            // {
            //     console.log(polygonPointArrayX[i]+","+polygonPointArrayY[i]);
            //     polygonPointsString = polygonPointsString + polygonPointArrayX[i].toString() + "," + polygonPointArrayY[i].toString()+" ";
            // }
            // console.log(polygonPointsString);
            // this.setState({
            //         polygonPoints: polygonPointsString,
            //     }
            // )
            //...展示，保存到数据库等
        }
        else
        {
            message.error("未画多边形，保存失败！")
        }

        polygonPointsNum = 0;
        polygonPointsString = "";
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

    getPictureRect=(picture_id)=>{

        let api = global.AppConfig.serverIP + '/getPictureRect?picture_id='+ picture_id;
        axios.post(api)
            .then((response)=> {
                //console.log(response);
                 console.log('getPictureRect:'+JSON.stringify(response.data));
                //this.removeAllChild();
                this.setState({
                    rectangleList: response.data,
                })
            })
            .catch( (error)=> {
                console.log(error);
            });

    };

    onDectect=(picture_number)=>{
        loadinghide = message.loading('编号'+picture_number+'的影像图正在进行AI检测。。', 0);
        //setTimeout(hide, 2500);
    };


    getPicture=(picture_id)=>{
        console.log("vvvvvvvvvvvv");
        console.log(picture_id);
        console.log("^^^^^^^^^^^^");
        let api = global.AppConfig.serverIP + '/getPicture?picture_id='+ picture_id;
        axios.post(api)
            .then((response)=> {
                // console.log(response);
                // console.log("=============" + picture_id);
                console.log("getPicture:"+JSON.stringify(response.data));
                this.setState({
                    picture: response.data,
                });

                db_picture_thickness = this.state.picture.picture_thickness;
                db_picture_teststandard = this.state.picture.picture_teststandard;
                console.log('getPicture',db_picture_thickness);
                this.getRequisition(this.state.picture.picture_requisition_id);
            })
            .catch( (error)=> {
                console.log(error);
            });

    };


    componentDidMount() {

        let svg = d3.select("#svgG");
        globalSVG = svg; //方便后面操控<rect></rect>

        this.fangDa();

    }

    aa1=()=>{
        alert('这里是svg测试')
    };


    judegeColor=()=>{
        console.log("judegeColor:"+"updateRectClor="+updateRectClor+" clickRectClor="+clickRectClor)
        if(updateRectClor!='')//之前有点击过其他框
        {
            if(updateRectClor=='red')
            {                                                   //作用：当点击下一个框时，把上一个框颜色red恢复！！！
                let ele = document.getElementById(clickRectClor);//拿到clickRectClor这个Id框的引用 ？？ 这是上一个框的吧
                console.log("judgeColor里面: "+"updateRectClor="+updateRectClor+" clickRectClor:"+clickRectClor);
                if(ele!=null)
                {
                    ele.setAttribute("stroke","red");
                }

                // message.success("改变state状态前"+this.state.updateRectClor);
                updateRectClor = '';//恢复完 清空这俩临时变量
                clickRectClor = '';
                // message.success("改变state状态后"+this.state.updateRectClor);

            }else
                {
                let ele = document.getElementById(clickRectClor);
                if(ele!=null) {
                    ele.setAttribute("stroke", "yellow");
                }
                updateRectClor = '';
                clickRectClor = '';
            }
        }
    };

    mousedown=(e)=> {

        if (polygonFlag) //如果是正在画多边形
        {
            if(polygonPointsNum < 8)
            {
                console.log(polygonFlag);
                globalRectX = e.pageX - document.getElementById('svgG').getBoundingClientRect().left;
                globalRectY = e.pageY - document.getElementById('svgG').getBoundingClientRect().top;
                console.log(globalRectX+'这是鼠标位置x');
                console.log(globalRectY+'这是鼠标位置y');

                if( globalRectY < polygonTopy)//记录多边形最上方点的坐标，画损伤类型
                {
                    polygonTopy = parseInt(globalRectY);
                    polygonTopx = parseInt(globalRectX);
                }

                polygonPointArrayX[polygonPointsNum] = globalRectX;
                polygonPointArrayY[polygonPointsNum] = globalRectY;

                polygonPointsString = polygonPointsString + polygonPointArrayX[polygonPointsNum].toString() + "," + polygonPointArrayY[polygonPointsNum].toString()+" ";

                console.log(polygonPointsString);
                this.setState({
                        polygonPoints: polygonPointsString,
                    }
                )//state的polygonPoints 是测试单个多边形用的，后期删掉


                console.log(polygonPointArrayX[polygonPointsNum]);
                console.log(polygonPointArrayY[polygonPointsNum]);
                console.log('第'+polygonPointsNum+'个点');
                polygonPointsNum++;
            }
        }
        else
        {
            // this.judegeColor();
            console.log("点击了svg");
            //message.success(this.state.updateRectClor);
            globalFlag = true;//为true,鼠标移动更新tempx  tempy
            //使用当前界面鼠标位置减去svg画布的距离屏幕左边或上边的距离
            globalRectX = e.pageX - document.getElementById('svgG').getBoundingClientRect().left;
            globalRectY = e.pageY - document.getElementById('svgG').getBoundingClientRect().top;
            //console.log(document.getElementById('svgG').getBoundingClientRect());
             console.log(globalRectX+'这是鼠标位置x');
            console.log(globalRectY+'这是鼠标位置y');

            let tempRect = globalSVG.append("rect")  //向globalSVG里面新加了一个rect,tempRect拿到引用
                .attr("x", globalRectX)
                .attr("y", globalRectY)
                .attr("height", 0)
                .attr("width", 0)
                .attr("fill", "black")
                .attr("fill-opacity",0)
                .attr("stroke", "red")
                .attr("stroke-width", 1)
                .attr("damage",1)
            // .on('dblclick',()=>{
            //     confirm({
            //     title: '确定要删除吗',
            //     content: ' ',
            //     okText: '确定',
            //     okType: 'danger',
            //     cancelText: '取消',
            //     onOk: (()=>{
            //         tempRect.remove()
            //         }),
            //     onCancel() {
            //         console.log('Cancel');
            //     },
            //      });
            // });

            globalRect = tempRect;//把tempRect接过来，好像可以操作tempReact指向的方框； 把引用给globalRect
            globalJudgeRectX = 0;
            globalJudgeRectY = 0;
        }
    };

    deletePolygon=()=>{
        if(polygonFlag==false)
        {
            if(polygonId!="")
            {
                confirm({
                    title: '确定要删除吗',
                    content: ' ',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk: (()=>{
                        this.deletep();
                    }),
                    onCancel() {
                        console.log('Cancel');
                    },
                });
            }
            else
            {
                message.error("请选中损伤框再删除！");
            }
        }
        else
        {
            message.error("请先关闭画多边形模式，再删除!")
        }
    };

    deletep=()=>{

        let api = global.AppConfig.serverIP + '/deletePolygonById?polygon_id='+ polygonId + '&picture_id=' +this.state.picture.picture_id;
        axios.post(api)
            .then((response)=> {
                console.log("delete:"+JSON.stringify(response));
                //setTimeout(loadinghide, 100);
                message.success("已成功删除多边形框！");
                polygonId = "";
                //this.props.MemberList.run();
                this.setState({
                    polygonList: response.data,
                })

            })
            .catch( (error)=> {
                console.log(error);
            });
    }

    deleteRect=(rectId)=>{

        // if(clickTimeId) {//取消上次延时未执行的方法
        //     clickTimeId = clearTimeout(clickTimeId);
        // }
        // console.log("双击");

        saveLoginInfo('删除了编号'+this.state.picture.picture_number+'的损伤标记框');
        confirm({
            title: '确定要删除吗',
            content: ' ',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: (()=>{
                this.delete(rectId);

                // let rect = document.getElementById(rectId);
                // let text = document.getElementById('text'+rectId);
                // let conf = document.getElementById('conf'+rectId);
                // let cls_conf = document.getElementById('cls_conf'+rectId);
                // text.parentNode.removeChild(text);
                // rect.parentNode.removeChild(rect);
                // conf.parentNode.removeChild(conf);
                // cls_conf.parentNode.removeChild(cls_conf);
            }),
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    delete=(rectId)=>{
        if(rectId!="")
        {
            updateRectClor = '';
            clickRectClor = '';
            let api = global.AppConfig.serverIP + '/deleteRectById?rectangle_id='+ rectId + '&picture_id=' +this.state.picture.picture_id;
            axios.post(api)
                .then((response)=> {
                    console.log("delete:"+JSON.stringify(response));
                    setTimeout(loadinghide, 100);
                    message.success("已成功删除损伤框！");
                    //this.props.MemberList.run();
                    this.setState({
                        rectangleList: response.data,
                    })

                })
                .catch( (error)=> {
                    console.log(error);
                });
        }
        else
        {
            message.error("请选中损伤框再删除！");
        }
    };




    mousemove=(e)=> {

       // if(globalFlag){
       //  let tempX = e.pageX - document.getElementById('svgG').getBoundingClientRect().left +1;
       //  let tempY = e.pageY - document.getElementById('svgG').getBoundingClientRect().top  +1;
       //  globalRect.attr("width", Math.max(0, tempX - +globalRectX))
       //            .attr("height", Math.max(0, tempY - +globalRectY))
       //            .attr("id", 'tempId');
       //
       //  globalJudgeRectX = Math.max(0, tempX - +globalRectX);//绘制矩形的长
       //  globalJudgeRectY = Math.max(0, tempY - +globalRectY);//绘制矩形的宽
       // }

    };

    mouseup=()=> {
        if(polygonFlag == false)
        {
            // 根据绘制的长宽筛选掉较小的框
            if(globalJudgeRectY*globalJudgeRectX < 30)
            {
                globalRect.remove();
            }else{
                saveLoginInfo('绘制了影像图编号'+this.state.picture.picture_number+'的损伤标记框');
                this.saveRect();
                globalFlag = false;
            }
        }

    };

    onWhellChange=()=>{
        //message.success("捕捉到滚轮")
        let tempTime = this.state.wheelTimes;
        this.setState({
           // wheelTimes: tempTime + 0.1,
        });
        //this.fangDa();
    };

    AIprocess=()=>{
        this.onDectect(this.state.picture.picture_number);
        saveLoginInfo('对编号'+this.state.picture.picture_number+'进行了ai检测');
        let picture_id = this.state.propsPictureId;
        let api = global.AppConfig.serverIP + '/detectionById_backstage?id='+ picture_id;
        axios.post(api)
            .then((response)=> {
                setTimeout(loadinghide, 100);
                message.success("编号"+this.state.picture.picture_number+"影像图成功获取检测结果！！");
                //this.props.MemberList.run();
                this.setState({
                    polygonList: response.data,
                })


                let picture_id = this.props.match.params.picture_id;
                this.getPicturePolygon(picture_id);



            })
            .catch( (error)=> {
                console.log(error);
            });

        message.success("开始AI智能检测--！");

    };

    savePolygon=()=>{//给发送到后端做准备
        let svgDOM = document.getElementById('svgG');
        let polygons = svgDOM.getElementsByTagName("polygon");//把所有rects拿出来保存到一个对象，发送给后端
        let picture_id = this.state.propsPictureId; //取出当前页面picture_id

        //polygons和polygonArray之间有转换，polygons信息用于给前端(有stroke啥的)，polygonArray是处理后用来给后端的数据(bean的)
        let polygonArray = new Array();

        //....转换格式发送给后端
        for(let j = 0; j < polygons.length; j++)
        {
          //  if(polygons[j].getAttribute("damage") !== 1)//临时多边形不添加

         

            {
                let obj ={
                    "polygon_pt": polygons[j].getAttribute("points"),
                    "polygon_author": polygons[j].getAttribute("author"),
                    "polygon_damage_type": polygons[j].getAttribute("damage"),
                    "polygon_text_x":polygons[j].getAttribute("textx"),
                    "polygon_text_y":polygons[j].getAttribute("texty"),
                };
                //new RectData(temp[0],temp[1],temp[2],temp[3],temp[4]);
                polygonArray[j]=obj;
            }

        }
        this.savePolygonList(polygonArray,picture_id);
    }

    savePolygonList=(polygonArray,picture_id)=>{
        let api = global.AppConfig.serverIP + '/getPolygonArray?picture_id='+ picture_id;
        console.log('polygonArray:'+polygonArray);
        axios.post(api,polygonArray)
            .then((response)=> {
                // console.log(JSON.stringify(response.data));
                message.success('保存成功');
                let ele = document.getElementById("tempId");
                if(ele!=null){
                    ele.parentNode.removeChild(ele);
                }
                this.setState({
                    polygonList: response.data,
                });

                this.setState({
                        polygonPoints:"",
                    });//把临时框清空
            })
            .catch( (error)=> {
                console.log(error);
            });
    }

    generateReport=()=>{
        const w=window.open('about:blank');
        let display = '';
        if (this.state.rectDisplay == 'none' && this.state.AIRectDisplay == 'none') {
            display = 'none';
        } else if (this.state.rectDisplay == 'none') {
            display = 'Algorithm';
        } else if (this.state.AIRectDisplay == 'none') {
            display = 'member';
        } else {
            display = 'all';
        }
        w.location.href=`/printReportForSingleImage/${this.props.match.params.picture_id}/${display}`;
        //以下为备用方法，可直接写在button标签内，但经过实测IE浏览器可能出现无法传值的情况
        // <Link to="/printReport" target="_blank">测试弹出</Link>
        // <Link to={`/printReport/${this.props.RequisitionList.state.requisition.requisition_id}`}
    };

    rotate=()=>{
      console.log("待做")  
    };

    saveRect=()=>{
        saveLoginInfo('对编号'+this.state.picture.picture_number+'的损伤标记框进行了保存');
        let svgDOM = document.getElementById('svgG');
        let rects = svgDOM.getElementsByTagName("rect");//把所有rects拿出来保存到一个对象，发送给后端

        let rectangleArray = new Array();
        for(let j = 0; j < rects.length; j++) {
            let temp = new Array();
            temp[4]=rects[j].getAttribute("stroke") ;

        }

        for(let j = 0; j < rects.length; j++)
        {
            let temp = new Array();

            temp[0]=parseInt(rects[j].getAttribute("x")) ;
            temp[1]=parseInt(rects[j].getAttribute("y")) ;
            temp[2]=parseInt(rects[j].getAttribute("width")) + temp[0];
            temp[3]=parseInt(rects[j].getAttribute("height")) + temp[1];
            temp[4]=rects[j].getAttribute("stroke") ;
            temp[5]=rects[j].getAttribute("damage") ;
            temp[6]=rects[j].getAttribute("rect_conf");
            temp[7]=rects[j].getAttribute("rect_cls_conf");

            console.log("saveRect:"+updateRectClor);
            if(temp[4]=='black')
            {
                if(updateRectClor == 'red')
                {
                    temp[4] = 'red';
                    let ele = document.getElementById(clickRectClor);
                    if(ele!=null)
                    {
                    ele.setAttribute("stroke","red");
                    }
                    updateRectClor = '';
                    clickRectClor = '';
                }
                else
                    {
                    temp[4] = 'yellow';
                    let ele = document.getElementById(clickRectClor);
                    if(ele!=null) {
                        ele.setAttribute("stroke", "yellow");
                    }
                    updateRectClor = '';
                    clickRectClor = '';

                }
            }

            if(temp[4]=='red'){
                temp[4]='member';
                let obj ={
                    "x1": temp[0]+1,
                    "x2": temp[2]+1,
                    "y1": temp[1]+1,
                    "y2": temp[3]+1,
                    "retangle_author": temp[4],
                    "retangle_damage_type": temp[5],
                    "conf":temp[6],
                    "cls_conf":temp[7],
                };
                //new RectData(temp[0],temp[1],temp[2],temp[3],temp[4]);
                rectangleArray[j]=obj;
            }
            if(temp[4]=='yellow')
            {
                temp[4]='Algorithm';
                let obj = {
                    "x1": temp[0]+1,
                    "x2": temp[2]+1,
                    "y1": temp[1]+1,
                    "y2": temp[3]+1,
                    "retangle_author": temp[4],
                    "retangle_damage_type": temp[5],
                    "conf":temp[6],
                    "cls_conf":temp[7],
                };
                rectangleArray[j]=obj;
            }
        }
        // this.clearSVG();
        // console.log(rectangleArray);
        let picture_id = this.state.propsPictureId; //取出当前页面picture_id
        this.saveRectList(rectangleArray,picture_id);

    };

    saveRectList=(rectangleArray,picture_id)=>{
         let api = global.AppConfig.serverIP + '/getRectangleArray?picture_id='+ picture_id;
         console.log('rectangleArray:'+rectangleArray);
         axios.post(api,rectangleArray)
                          .then((response)=> {
                 // console.log(JSON.stringify(response.data));
                 message.success('保存成功');
                 let ele = document.getElementById("tempId");
                 if(ele!=null){
                     ele.parentNode.removeChild(ele);
                 }
                 this.setState({
                     rectangleList: response.data,
                 });
             })
             .catch( (error)=> {
                 console.log(error);
             });
    };

    selectPolygon=(polygon_id)=>{
        polygonId = polygon_id;//polygonId为全局变量
        polygonClickflag = true;//改变缺陷类型用到
        message.success("多边形损伤框已选中,请“添加缺陷类型” 或 “删除损伤框”")
    };

    updateDamageType=(retangle_id,author)=>{

        polygonClickflag = false;
        // message.success("获取id"+ retangle_id);
        this.judegeColor();//判断是否第一次点击
        //message.success(1111+updateRectClor);
        if(updateRectClor=='') // ==' '表示第一次点击
        {
            // message.success(1111)
            if(author=='member'){
                updateRectClor = 'red';//第一次点击人工框，记录点击的是红色框
            }else{
                updateRectClor= 'yellow';
            }
            // message.success(updateRectClor);
            this.updateRectClorMethod(retangle_id);
            clickRectClor = retangle_id;//记下 点击的框 的id

            console.log("updateDamageType之后:"+"updateRectClor="+updateRectClor+" clickRectClor="+clickRectClor)
        }
        else//不是第一次
            {
            if(updateRectClor=='red'){
                let ele = document.getElementById(clickRectClor);
                if(ele!=null){
                    ele.setAttribute("stroke","red");
                }
                updateRectClor = '';
                clickRectClor = '';

            }else{
                let ele = document.getElementById(clickRectClor);
                if(ele!=null){
                    ele.setAttribute("stroke","yellow");
                }
                updateRectClor = '';
                clickRectClor = '';
            }
        }

        // if(clickTimeId) {//取消上次延时未执行的方法
        //     clickTimeId = clearTimeout(clickTimeId);
        // }
        // //执行延时
        // clickTimeId = setTimeout(()=> {
            //此处为单击事件要执行的代码
            this.getRectangleInfo(retangle_id);
            this.setState({
                visible: true,
                onClickRectId:retangle_id,
            });
            console.log("鼠标单击");
        // }, 200);

    };

    updateDamageTypeByselect=(e)=>{
        console.log("参数e:"+e);
        /**使用axios将value表单信息与当前选择的方框信息一起发送到后端
         * damagetype_id
         * 得到的数据应是更新后的画框的列表，即是rectangleList
         * */

        if(polygonClickflag == false)//表示点击的不是多边形，要更改rect损伤类型
        {
            let api = global.AppConfig.serverIP + '/updateRectangleDamageTypeByDamageType?rectangle_id=' + this.state.onClickRectId + '&damagetype_id='+ e+ '&picture_id='+ this.state.propsPictureId;
            axios.post(api)
                .then((response)=> {
                    // console.log(response);
                    // console.log(JSON.stringify(response.data));
                    //saveLoginInfo('更新了编号'+this.state.picture.picture_number+'的损伤类型描述信息')
                    message.success("已更新损伤类型");
                    // let ele = document.getElementById( this.state.clickRectClor);
                    // if(ele!=null){
                    //     ele.setAttribute("stroke",this.state.updateRectClor);
                    // }
                    this.setState({
                        rectangleList:response.data
                    })
                })
                .catch( (error)=> {
                    console.log(error);
                });
        }
        else   //点击多边形
        {
            let api = global.AppConfig.serverIP + '/updatePolygonDamageTypeByDamageType?polygon_id=' + polygonId + '&damagetype_id='+ e+ '&picture_id='+ this.state.propsPictureId;
            axios.post(api)
                .then((response)=> {
                    // console.log(response);
                    // console.log(JSON.stringify(response.data));
                    //saveLoginInfo('更新了编号'+this.state.picture.picture_number+'的损伤类型描述信息')
                    message.success("已更新损伤类型");
                    // let ele = document.getElementById( this.state.clickRectClor);
                    // if(ele!=null){
                    //     ele.setAttribute("stroke",this.state.updateRectClor);
                    // }
                    this.setState({
                        polygonList:response.data
                    })
                })
                .catch( (error)=> {
                    console.log(error);
                });

            polygonClickflag = false;
        }

    };

    updateRectClorMethod=(retangle_id)=>{
        message.success("损伤框已选中,请“添加缺陷类型” 或 “删除损伤框”")
        // message.success(retangle_id)
        let ele = document.getElementById(retangle_id); //拿到这个框的引用
        console.log(ele);
        if(ele!=null)
        {
            //ele.setAttribute("stroke","black"); //暂时将边框颜色设置为黑色
        }
    };

    getRectangleInfo=(rectangle_id)=>{

        let api = global.AppConfig.serverIP + '/getRectangleInfo?rectangle_id=' + rectangle_id;
        axios.post(api)
            .then((response)=> {
                // console.log(JSON.stringify(response.data));
                 // alert(JSON.stringify(response.data.retangle_damage_type));
                this.getDamageType(JSON.stringify(response.data.retangle_damage_type));
                this.setState({
                    rectangle: response.data,
                })
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    getDamageType=(damagetype_id)=>{
        let api = global.AppConfig.serverIP + '/getDamageTypeInfo?damagetype_id=' + damagetype_id;
        axios.post(api)
            .then((response)=> {
                // console.log(JSON.stringify(response.data));
                // alert(JSON.stringify(response.data));
                this.setState({
                    damageType: response.data,
                })
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

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



    handleSubmit = (e) => {

        e.preventDefault();

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.updatePicture(values);

            }
        });

    };

    getRequisition=(picture_requisition_id)=>{
        let api = global.AppConfig.serverIP + '/getRequisition?requisition_id='+picture_requisition_id;
        axios.post(api)
            .then((response)=> {
                // console.log(JSON.stringify(response.data));
                this.setState({
                    requisition: response.data,
                });

                //alert("完成影像图信息更新！")
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    updatePicture=(picture)=>{//该picture为当前框中的值

        let picture_id = this.props.match.params.picture_id;
        this.setState({
            propsPictureId:  picture_id,
        });
        this.getPicture(picture_id);
        this.getPictureRect(picture_id);
        this.getDamageTypeList();

        //判断是否更改厚度和检测标准
            var obj_updatepicture = null;
            var flag = true;

            if(db_picture_teststandard==picture.picture_teststandard&&db_picture_thickness==picture.picture_thickness)//说明都没改
            {
                flag = false;
            }
            else
            {
                obj_updatepicture = Object.assign({}, this.state.requisition, { requisition_last_teststandard: picture.picture_teststandard,requisition_last_thickness: picture.picture_thickness });
            }
            if(flag == true)
            {
                console.log("图片更新后requisition是否改  id:"+obj_updatepicture.requisition_id+" last-test-standard:"+obj_updatepicture.requisition_last_teststandard)
                this.setState({
                    requisition: obj_updatepicture,
                });
                //更新requisition的last_thickness,即上一次处理的厚度
                let api1 = global.AppConfig.serverIP + '/updateRequisition';

                axios.post(api1,obj_updatepicture)
                    .then((response)=> {
                        // console.log(response);
                        // console.log(JSON.stringify(response.data));
                        this.setState({
                            requisition: response.data,
                        });
                    })
                    .catch( (error)=> {
                        console.log(error);
                    });
                console.log(db_picture_thickness,picture.picture_thickness,db_picture_thickness==picture.picture_thickness);
            }


            /**使用axios将value表单信息发送到后端
             * */
            //console.log(this.state.requisition);
            saveLoginInfo('更新了影像图编号'+picture.picture_number+'的信息');
            let api2 = global.AppConfig.serverIP + '/updatePicture';
            axios.post(api2,picture)
                .then((response)=> {
                    // console.log(response);
                    // console.log(JSON.stringify(response.data));
                    this.setState({
                        picture: response.data,
                    });
                    message.success("完成影像图信息更新！")

                })
                .catch( (error)=> {
                    console.log(error);
                });

    };

    changeAIRectDisplay=()=>{
        if(this.state.AIRectDisplay == "none"){
            this.setState({
                AIRectDisplay: "",
              //  AIDamageTypeDisplay:"",
               // AIConfDisplay:""
            })
        }else{
            this.setState({
                AIRectDisplay: "none",
                AIDamageTypeDisplay:"none",
                AIDamageBeliefDisplay:"none",
                //AIConfDisplay:"none"
            })
        }
    };

    changeFdDispaly=()=>{
        if(this.state.fdDispaly == "none"){
            this.setState({
                fdDispaly:''
            })
        }else{
            this.setState({
                fdDispaly: "none",
            })
        }
    };

    changeRectDisplay=()=>{

        if(this.state.rectDisplay == "none"){
            this.setState({
                rectDisplay: "",
              //  drawDamageTypeDisplay:"",
                drawConfDisplay:""
            })
        }else{
            this.setState({
                rectDisplay: "none",
               // drawDamageTypeDisplay:"none",
                drawConfDisplay:"none"
            })
        }
    };

    clearSVG=()=>{
        var myNode = document.getElementById("svgG");
        myNode.innerHTML = '';
       // alert(111)
    };

    changeDamageTypeDisplay=()=>{
        if(this.state.AIDamageTypeDisplay == "none" && this.state.drawDamageTypeDisplay == "none"){
            this.setState({
                AIDamageTypeDisplay:"",
                drawDamageTypeDisplay:"",
            })
        }else{
            this.setState({
                AIDamageTypeDisplay:"none",
                drawDamageTypeDisplay:"none",
            })
        }
    };

    changeDamageBeliefDisplay=()=>{
        if(this.state.AIDamageBeliefDisplay === "none" && this.state.AIRectDisplay === "" ){
            // console.log(this.state.polygonList);
            this.setState({
                AIDamageBeliefDisplay:"",
                // drawDamageTypeDisplay:"",
            })
        }else{
            this.setState({
                AIDamageBeliefDisplay:"none",
                // drawDamageTypeDisplay:"none",
            })
        }
    };

    changeDisplay=()=>{
        if(this.state.drawConfDisplay == "none" && this.state.AIConfDisplay == "none"){
            this.setState({
                AIConfDisplay: "",
                drawConfDisplay:'',
            })
        }else{
            this.setState({
                AIConfDisplay: "none",
                drawConfDisplay:'none',
            })
        }
    };

    changeClsDisplay=()=>{
        if(this.state.clsconfdispaly == "none"){
            this.setState({
                clsconfdispaly: "",
            })
        }else{
            this.setState({
                clsconfdispaly: "none",
            })
        }
    };

    getUpPagePicture=()=>{
        let api = global.AppConfig.serverIP + '/getUpPagePicture/'+ this.state.picture.picture_id;
        axios.post(api)
            .then((response)=> {
                if (this.state.propsPictureId == response.data){
                    message.info("已经到第一张了");
                } else {
                    //window.location.href= "/app/pictureManage/"+response.data;
                    // this.props.tiaozhuan();
                        const path = `/app`;
                        history.push(path);
                        const path2 = `/app/pictureManage/${response.data}`;
                        history.push(path2)

                }
                //message.success("完成影像图信息更新！")
            })
            .catch( (error)=> {
                console.log(error);
            });
    };


    getNextPagePicture=()=>{

        let api = global.AppConfig.serverIP + '/getNextPagePicture/'+ this.state.picture.picture_id;
        axios.post(api)
            .then((response)=> {
                if (this.state.propsPictureId == response.data){
                    message.info("已经到最后一张了");
                } else {
                    const path = `/app`;
                    history.push(path);
                    const path2 = `/app/pictureManage/${response.data}`;
                    history.push(path2)
                }
                //message.success("完成影像图信息更新！")
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    fangDa=()=>{
        let tempTimes = this.state.wheelTimes;
        // 获取原图片的dom对象
        var rawViewDom = document.getElementById('raw-view');
        // 获取将要把放大图片放置在这个容器的DOM对象
        var multiViewDom = document.getElementById('multi-view');
        rawViewDom.onmouseenter = function (e) {
            var left,
                top,
                rawLeft = rawViewDom.offsetLeft,
                rawTop = rawViewDom.offsetTop,
                bgLeft,
                bgTop;
            rawViewDom.onmousemove = function (e) {
                left = e.clientX - rawLeft;
                top = e.clientY - rawTop;
                bgLeft = -tempTimes*left + multiViewDom.offsetWidth / tempTimes;
                bgTop = -tempTimes*top + multiViewDom.offsetHeight / tempTimes;
                // 改变放大镜中背景图片的位置
                multiViewDom.style.backgroundPosition = bgLeft+'px '+bgTop+'px';
                // 改变放大镜的位置
                multiViewDom.style.left = left - multiViewDom.offsetWidth / tempTimes +'px';
                multiViewDom.style.top = top - multiViewDom.offsetHeight / tempTimes +'px';
            };
            rawViewDom.onmouseleave = function (e) {
                rawViewDom.onmousemove = null;
            }
        }
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

    render() {

        console.log(this.state.picture.picture_dir)
        const {getFieldDecorator} = this.props.form;

        //获取rect信息
        let rectList = [];
        let retangle = this.state.rectangleList;
        let damageTypeList = this.state.damageTypeList;
        // alert(JSON.stringify(damageTypeList))
        for (let i = 0; i < retangle.length; i++)
        {   //循环遍历取出方框所有信息
            let x1 = retangle[i].retangle_x1;
            let y1 = retangle[i].retangle_y1;
            let x2 = retangle[i].retangle_x2;
            let y2 = retangle[i].retangle_y2;
            let retangle_id = retangle[i].retangle_id;
            let retangle_author = retangle[i].retangle_author;
            let retangle_damage_type = retangle[i].retangle_damage_type;
            let conf = retangle[i].conf;
            let cls_conf = retangle[i].cls_conf;

            x1 = x1 * 1000.0 / this.state.picture.picture_width;
            y1 = y1 * 300.0 / this.state.picture.picture_height;
            x2 = x2 * 1000.0 / this.state.picture.picture_width;
            y2 = y2 * 300.0 / this.state.picture.picture_height;
            // console.log("x1="+x1+"y1="+y1+"x2="+x2+"y2="+y2);

            let rectangle_width = x2 - x1;
            let rectangle_height = y2 - y1;
            let retangle_damage_name;

            if(damageTypeList.length > 0)
            {
                for(let i = 0; i < damageTypeList.length; i++)
                {
                    if(damageTypeList[i].damagetype_id === retangle_damage_type){
                        retangle_damage_name = damageTypeList[i].damagetype_name;
                    }
                }
            }
            rectList.push({x:x1,y:y1,width:rectangle_width,height:rectangle_height,author:retangle_author,id:retangle_id,damage_type:retangle_damage_type,damage_name:retangle_damage_name,conf:conf,cls_conf:cls_conf});
        }

        //获取polygon信息
        let polygList = [];//前端标签<>用于展示用
        let polyg = this.state.polygonList;//将数据库的数据逐个取出来，push到polygList进行展示
        for(let i=0;i<polyg.length;i++)
        {
            let polygon_id = polyg[i].polygon_id;
            let polygon_pt = polyg[i].polygon_pt;
            let polygon_belief = polyg[i].polygon_belief;
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
            polygList.push({id:polygon_id,points:polygon_pt,author:polygon_author,damage_type:polygon_damage_type,damage_name:polygon_damage_name,textx:topx,texty:topy,belief:polygon_belief})
        }

        return (
            <div >
            <div className="picManage" >
                {/*<RectangleManage PictureManage={this}/>
               const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;  */}
                <div id="raw-view">
                    <img className="tifImg" src={global.AppConfig.XrayDBIP+this.state.picture.picture_dir}  style={{width:1000,height:300}}  />
                    <div id="multi-view" style={{
                        width: "405px",
                        height: "405px",
                        borderRadius: "50%",
                        boxShadow: "0 0 0 7px rgba(255, 255, 255, .8),0 0 7px 7px rgba(0, 0, 0, .2),inset 0 0 40px 2px rgba(0, 0, 0, 0.25)",
                        backgroundImage: `url(`+global.AppConfig.XrayDBIP+this.state.picture.picture_dir+`)`,
                        backgroundSize: `${this.state.wheelTimes*1000}px ${this.state.wheelTimes*300}px`,
                        // backgroundPosition: "1000px 1000px",
                        backgroundRepeat: "no-repeat",
                        position: "absolute",
                        zIndex: "3",
                        display:this.state.fdDispaly
                    }} onWheel={this.onWhellChange} onMouseDownCapture={this.changeFdDispaly}/>
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

                    {polygList.map((item,index)=>{
                        if(item.author!=='member') {
                            return <text style={{display:this.state.AIDamageTypeDisplay}}  id={'text'+item.id} key={'text'+index}  damage={item.damage_type} x={item.textx - 35} y={item.texty - 3} >{item.damage_name}</text>
                        
                        }else{
                            return <text style={{display:this.state.drawDamageTypeDisplay}}  id={'text'+item.id} key={'text'+index}  damage={item.damage_type} x={item.textx - 35} y={item.texty - 3} >{item.damage_name}</text>
                        
                        }
                    })
                    };

                    {polygList.map((item,index)=>{
                        return <text style={{display:this.state.AIDamageBeliefDisplay}}  id={'text'+item.id} key={'text'+index}  damage={item.damage_type} x={item.textx + 10} y={item.texty - 3} >{item.belief}</text>
                    })
                    };

                    {/*{<polygon points="320,120 340,95 370,105 380,125 380,145 360,165 330,155 "*/}
                    {/*           stroke="blue"*/}
                    {/*/>}*/}
                    {/*onDoubleClick={()=>this.deleteRect(item.id)}   onMouseUpCapture={this.judegeColor}*/}
                    {/*{rectList.map((item,index)=>{*/}
                    {/*    if(item.author!=='member') {*/}
                    {/*        return <text style={{display:this.state.AIDamageTypeDisplay}}  id={'text'+item.id} key={'text'+index}  damage={item.damage_type} x={item.x} y={item.y - 3} >{item.damage_name} </text>*/}

                    {/*    }else{*/}
                    {/*        return <text style={{display:this.state.drawDamageTypeDisplay}}  id={'text'+item.id} key={'text'+index}  damage={item.damage_type} x={item.x} y={item.y - 3} >{item.damage_name}</text>*/}
                    {/*    }*/}
                    {/*})*/}
                    {/*};*/}

                    {/*{rectList.map((item,index)=>{*/}
                    {/*    if(item.author!=='member') {*/}
                    {/*        return <text  style={{display:this.state.AIConfDisplay}} id={'conf'+item.id} key={'text'+index}  rect_conf={item.conf} x={item.x} y={item.y - 16 } >{( parseInt(item.conf*1000)/1000).toFixed(3)}</text>*/}

                    {/*    }else{*/}
                    {/*        // return <text  style={{display:this.state.drawConfDisplay}} id={'conf'+item.id} key={'text'+index}  rect_conf={item.conf} x={item.x} y={item.y - 16} >{( parseInt(item.conf*1000)/1000).toFixed(3)}</text>*/}
                    {/*    }*/}
                    {/*})*/}
                    {/*}*/}

                    {/*{rectList.map((item,index)=>{*/}
                    {/*    if(item.author!=='member') {*/}
                    {/*        return <text  style={{display:this.state.clsconfdispaly}} id={'cls_conf'+item.id} key={'text'+index}  rect_cls_conf={item.cls_conf} x={item.x} y={item.y - 16} >{( parseInt(item.cls_conf*1000)/1000).toFixed(3)}</text>*/}

                    {/*    }else{*/}
                    {/*        return <text  style={{display:this.state.clsconfdispaly}} id={'cls_conf'+item.id} key={'text'+index}  rect_cls_conf={item.cls_conf} x={item.x} y={item.y - 16} >{( parseInt(item.cls_conf*1000)/1000).toFixed(3)}</text>*/}
                    {/*    }*/}
                    {/*})*/}
                    {/*}*/}
                </svg>
            </div>
                <div className="Legends">
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
                {/*<div className="Legends">*/}
                {/*    <Row>*/}
                {/*        <Row>*/}
                {/*            <Col span={4}>col-4</Col>*/}
                {/*            <Col span={4}>col-4</Col>*/}
                {/*            <Col span={4}>col-4</Col>*/}
                {/*            <Col span={4}>col-4</Col>*/}
                {/*            <Col span={4}>col-4</Col>*/}
                {/*            <Col span={4}>col-4</Col>*/}
                {/*        </Row>*/}
                {/*    </Row>*/}
                {/*</div>*/}
                <div className="Utils" >
                <br/>
                <Button onClick={this.AIprocess}>进行AI检测</Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                <Select placeholder="请选择损伤类型" style={{ width: 200 }} defaultValue={this.state.damageType.damagetype_name} onChange={this.updateDamageTypeByselect}>
                    {this.state.damageTypeList.map((item,index)=>{
                        return <Option value={item.damagetype_id}>{item.damagetype_name}</Option>
                    })
                    }
                </Select>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                {/*<Button onClick={()=>this.deleteRect(clickRectClor)}>删除矩形框</Button>*/}
                {/*    &nbsp;&nbsp;&nbsp;&nbsp;*/}
                
                    <Button   onClick={()=>this.rotate()}>显示焊缝</Button>
                <br></br>
                <br></br>
                
                <Button onClick={this.changeFdDispaly}>关闭/开启放大镜</Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                <Button onClick={this.changeRectDisplay}>关闭/开启人工绘制框</Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                <Button onClick={this.changeAIRectDisplay}>关闭/开启AI检测框</Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;

                {/*<Button onClick={this.changeDisplay}>关闭/开启置信度</Button>*/}
                {/*    &nbsp;&nbsp;&nbsp;&nbsp;*/}
                {/*<Button onClick={this.changeClsDisplay}>关闭/开启分类置信度</Button>*/}
                {/*    &nbsp;&nbsp;&nbsp;&nbsp;<br/><br/>*/}
                    <Button onClick={this.changeDamageTypeDisplay}>关闭/开启损伤信息</Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button onClick={this.polygonModel}>(启动/关闭) 多边形模式</Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button onClick={this.changeDamageBeliefDisplay}>关闭/开启可信度信息</Button>
                    <br/><br/>

                    
                    
                    <Button onClick={this.rePolygon}>重新画</Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button onClick={this.savetmpPolygon}>保存多边形</Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button onClick={()=>this.deletePolygon()}>删除多边形</Button>
                    
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    
                    <Button   onClick={()=>this.rotate()}>上下翻转图片</Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button  onClick={()=>this.rotate()}>左右翻转图片</Button>
                    
                    <br/><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                <div style={{textAlign:"center"}}>
                    <Button onClick={this.getUpPagePicture}>上一张</Button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button onClick={this.getNextPagePicture}>下一张</Button>
                </div>
                    <Divider>确认影像图信息</Divider>
                    <Form  layout="vertical"  onSubmit={this.handleSubmit}>
                        <Row gutter={20} >
                            <Col span={4}>
                                <Form.Item label="影像图编号" style={{display:true}}>
                                    {getFieldDecorator('picture_number', {
                                        rules: [{ required: true, message: '请输入影像图编号' }],
                                        initialValue: this.state.picture.picture_number,
                                    })(<Input placeholder="影像图编号" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="厚度">
                                    {getFieldDecorator('picture_thickness', {
                                        rules: [{ required: true, message: '请输入厚度' }],
                                        initialValue: db_picture_thickness==null?this.state.requisition.requisition_last_thickness:db_picture_thickness,
                                    })(<Input placeholder="厚度" />)}
                                </Form.Item>
                            </Col>

                            <Col span={4}>
                                <Form.Item label="合格级别">
                                    {getFieldDecorator('picture_qualifylevel', {
                                        rules: [{ required: true, message: '合格级别' }],
                                        initialValue: this.state.picture.picture_qualifylevel,
                                    })(<Input placeholder="合格级别" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="检测方法">
                                    {getFieldDecorator('picture_testmethod', {
                                        rules: [{ required: true, message: '请输入检测方法' }],
                                        initialValue: "RT",
                                    })(<Input placeholder="检测方法" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="检测标准">
                                    {getFieldDecorator('picture_teststandard', {
                                        rules: [{ required: true, message: '请输入检测标准' }],
                                        initialValue: this.state.picture.picture_teststandard==null?(this.state.requisition.requisition_last_teststandard==null?this.state.requisition.requisition_testingstandard:this.state.requisition.requisition_last_teststandard):this.state.picture.picture_teststandard,
                                    })(

                                        <Select placeholder="检测标准"  >
                                            {
                                                this.state.pictureTeststandard.map(function(value,key){
                                                    return <option key={value}>{value}</option>
                                                })
                                            }
                                        </Select>

                                      )}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="评定级别">
                                    {getFieldDecorator('picture_level', {
                                        rules: [{ required: true, message: '请输入评定级别' }],
                                        initialValue: this.state.picture.picture_level,
                                    })(

                                        <Select placeholder="评定级别"  >
                                            {
                                                this.state.pictureLevel.map(function(value,key){
                                                    return <option key={value}>{value}</option>
                                                })
                                            }
                                        </Select>

                                        )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={20}>
                            <Col span={4}>
                                <Form.Item label="接头形式">
                                    {getFieldDecorator('picture_jointform', {
                                        rules: [{ required: true, message: '请输入接头形式' }],
                                        initialValue: this.state.requisition.requisition_jointform,
                                    })(<Input placeholder="接头形式" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="影像图的长">
                                    {getFieldDecorator('picture_width', {
                                        rules: [{ required: true, message: '影像图的长' }],
                                        initialValue: this.state.picture.picture_width,
                                    })(<Input placeholder="影像图的长" disabled={"true"}/>)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="影像图的高">
                                    {getFieldDecorator('picture_height', {
                                        rules: [{ required: true, message: '影像图的高' }],
                                        initialValue: this.state.picture.picture_height,
                                    })(<Input placeholder="影像图的高" disabled={"true"}/>)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="录入时间">
                                    {getFieldDecorator('picture_entrytime', {
                                        rules: [{ required: true, message: '请输入录入时间' }],
                                        initialValue: this.state.picture.picture_entrytime,
                                    })(<Input placeholder="录入时间" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="影像图存放路径">
                                    {getFieldDecorator('picture_dir', {
                                        rules: [{ required: true, message: '请输入影像图存放路径' }],
                                        initialValue: this.state.picture.picture_dir,
                                    })(<Input placeholder="影像图存放路径" disabled={"true"}/>)}
                                </Form.Item>
                            </Col>
                            <Col span={4} style={{display:"none"}}>
                                <Form.Item label="picture_AIresult">
                                    {getFieldDecorator('picture_AIresult', {
                                        rules: [{ required: true, message: 'picture_AIresult' }],
                                        initialValue: this.state.picture.picture_AIresult,
                                    })(<Input placeholder="picture_AIresult"  disabled={"true"}/>)}
                                </Form.Item>
                            </Col>
                            <Col span={4} style={{display:"none"}}>
                                <Form.Item label="picture_requisition_id">
                                    {getFieldDecorator('picture_requisition_id', {
                                        rules: [{ required: true, message: 'picture_requisition_id' }],
                                        initialValue: this.state.picture.picture_requisition_id,
                                    })(<Input placeholder="picture_requisition_id" disabled={"true"}/>)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="影像图id" style={{display:"none"}}>
                                    {getFieldDecorator('picture_id', {
                                        rules: [{ required: true, message: '影像图id' }],
                                        initialValue: this.state.picture.picture_id,
                                    })(<Input placeholder="影像图id" disabled={"true"}/>)}
                                </Form.Item>
                            </Col>
                        </Row>
                        {/*<br/><br/>*/}
                        <Divider />
                        <Row gutter={16}>
                            <Col span={4}>
                                <Form.Item >
                                    <Button type="danger"  htmlType="submit">更新影像图信息</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>

            </div>
        );
        }
}


const PictureManager = Form.create()(PictureManage);
export default PictureManager;