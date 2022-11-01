import {
    message,
    Form,
    Divider,
    Table,
    Badge,
    Menu,
    Dropdown,
    Icon,
    Button,
    Modal,
    Row,
    Col,
    Input,
    Select,
    Switch,
    InputNumber
} from 'antd';
import cv, {COLOR_BGR2GRAY} from "@techstark/opencv-js";
import {ShrinkOutlined, PoweroffOutlined, SearchOutlined} from '@ant-design/icons';
import React, {Component} from "react";
import axios from "axios";
import '../../config/config'
import tifImage37 from '../../assets/images/VIDARImage4.tif'
import './pictureManage.css'
import * as d3 from "d3";
import saveLoginInfo from '../../utils/saveLogInfo'
import history from '../common/history'
import EChartsReact from "echarts-for-react";
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import {Link} from "react-router-dom";
import {render} from "react-dom";
import ReactTooltip from 'react-tooltip';
import windows from '../../assets/images/windows.png';
import tools from '../../assets/images/tools.png'
import TextArea from "antd/es/input/TextArea";
window.cv = cv;
const {Option} = Select;
message.config({
    maxCount: 2
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
//
var cross_x = 0
var cross_y = 0
var set_cross = false
var setCrossTag;
//

var damage_type = 7;
//
var rectList = []
var polygList = []
var hanfenglist = []
//
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
let newCircle;
let flawlength; //缺陷长度
//用来画多边形
let polygonFlag = false;
let polygonPointsNum = 0;
let polygonPointArrayX = new Array(20);
let polygonPointArrayY = new Array(20);
let polygonPointsString = "";//保存多边形当前的点
let polygonBeginTag = "";
let uploadV = '';
let globalPolygon;//globalPolygon指向每次创建后多边形，操控多边形属性
let polygonId = "";//点击多边形框后，暂存该框的id，用于更新类型或者删除   //东哥放在state里了
let lastPolygonId = "";
let polygonTopx = 1050;
let polygonTopy = 350;//先设置成最大，只要每次变小就更新，找到最上方点作为损伤类型位置
let polygonClickflag = false;//用于改变损伤框类型(为了与rect框区分)   若点击多边形，设置为true，发送给后端对应的接口

//单击延时触发
var clickTimeId;
let enhance = false;
let updateRectClor = '';
let clickRectClor = '';  // rect的Id?
const confirm = Modal.confirm;
class PictureManage extends Component {

    constructor(props) {
        super(props);
        this.cannyEdgeRef = React.createRef();
        this.state = {
            chan: " ",
            labeltools: " ",
            pagesize: 5,
            current: 1,
            pid: -1,
            rowId: -1,
            wheelTimes: 2.5,
            fdDispaly: "none",
            propsPictureId: '',
            requisition: '',
            hanfengdisplay: "none",
            clsconfdispaly: "",
            AIConfDisplay: "",
            drawConfDisplay: '',
            drawDamageTypeDisplay: "none",
            AIDamageTypeDisplay: "none",
            AIDamageBeliefDisplay: "none",
            rectDisplay: '',
            AIRectDisplay: '',
            svgG: '',
            rectT: '',
            picture: {},
            pictureLevel: ['I级', 'II级', 'III级', 'IV级', 'V级'],
            pictureTeststandard: ['Q/WSJ06.091-2000', '1', '2'],

            polygonPoints: " ",//测试用
            polygonList: {},//获得数据库的多边形List

            rectangleList: {},
            visible: false,
            rectangle: {}, //当前鼠标选择的方框属性
            damageType: {"damagetype_id": "0", "damagetype_name": "未确定"},
            test: {"FirstName": "xu", "LastName": "Xiang"},
            damageTypeList: [],
            //updateRectClor标志颜色变化，为空则svg内没有发生颜色变化，变色则记录上次点击的颜色

            memberClor: 'red',
            AIClor: 'yellow',
            onClickRectId: '',
            AIDetectLoading: '',
            crossdisplay:'',
            a:''
        }
    }

    componentWillMount() {
        let picture_id = this.props.match.params.picture_id;
        this.setState({
            propsPictureId: picture_id,
        });
        this.getPicture(picture_id);
        this.getPictureRect(picture_id);
        this.getDamageTypeList();
        this.getPicturePolygon(picture_id);
        //this.render_Rect_Polygon_List();
        console.log(this.state)
    }

    polygonModel = () => {//开启或关闭多边形模式
        //todo 多边形模式
        this.deleteAllCircle();
        if (polygonFlag == false) {//开启
            polygonTopy = 350;
            polygonTopx = 1050;
            polygonFlag = true;
            polygonPointsNum = 0;
            polygonPointsString = "";
            polygonBeginTag = message.loading('多边形模式运行中..', 120);
        } else {//关闭
            this.setState({
                polygonPoints: "",
            })
            polygonFlag = false;
            setTimeout(polygonBeginTag, 1);
        }

    }

    rePolygon = () => {//重画多边形
        this.deleteAllCircle();
        if (polygonFlag == true) {
            polygonTopy = 350;
            polygonTopx = 1050;
            polygonPointsNum = 0;
            polygonPointsString = "";

            this.setState({
                polygonPoints: "",
            })
        } else {
            message.error("请打开画多边形模式！")
        }

    }

    savetmpPolygon = () => {//在前端保存多边形到<polygon/>标签
        // info()
        this.deleteAllCircle()

        if (polygonPointsString != "") //&&polygonPointsString.length>14
        {
            // globalPolygon = globalSVG.append("polygon")
            //     .attr("points", polygonPointsString)
            //     .attr("damage", damage_type)
            //     .attr("textx", polygonTopx)
            //     .attr("texty", polygonTopy)
            //     .attr("id", 'tempId')
            //     .attr("fill", "black")
            //     .attr("fill-opacity", 0)
            //     .attr("stroke", "red")
            //     .attr("author", 'member')
            //     .attr("stroke-width", 1);

            // console.log("topx: "+globalPolygon);
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
        } else {
            message.error("未画多边形，保存失败！")
        }

        polygonPointsNum = 0;
        polygonPointsString = "";
        this.componentWillMount();//
    }


    getPicturePolygon = (picture_id) => {
        let api = global.AppConfig.serverIP + '/getPicturePolygon?picture_id=' + picture_id;
        axios.post(api)
            .then((response) => {
                console.log('getPicturePolygon:' + JSON.stringify(response.data));

                this.setState({
                    polygonList: response.data,
                })
                this.render_Rect_Polygon_List() //防止出现之前代码的问题（之前这个函数的功能写在render里，每次点击等对svg的操作都会执行一边这个功能）
            })
            .catch((error) => {
                console.log(error);
            });
    }

    getFile = () => {

        let api = global.AppConfig.serverIP + '/getRequisitionFile';
        axios.post(api)
            .then((response) => {
                console.log(response);
                console.log(JSON.stringify(response.data));
                this.setState({
                    requisitionFile: response.data,
                })
            })
            .catch((error) => {
                console.log(error);
            });
    };

    getPictureRect = (picture_id) => {

        let api = global.AppConfig.serverIP + '/getPictureRect?picture_id=' + picture_id;
        axios.post(api)
            .then((response) => {
                //console.log(response);
                console.log('getPictureRect:' + JSON.stringify(response.data));
                //this.removeAllChild();
                this.setState({
                    rectangleList: response.data,
                })
            })
            .catch((error) => {
                console.log(error);
            });

    };

    onDectect = (picture_number) => {
        loadinghide = message.loading('编号' + picture_number + '的影像图正在进行AI检测。。', 0);
        //setTimeout(hide, 2500);
    };


    getPicture = (picture_id) => {
        console.log("vvvvvvvvvvvv");
        console.log(picture_id);
        console.log("^^^^^^^^^^^^");
        let api = global.AppConfig.serverIP + '/getPicture?picture_id=' + picture_id;
        axios.post(api)
            .then((response) => {
                // console.log(response);
                // console.log("=============" + picture_id);
                console.log("getPicture:" + JSON.stringify(response.data));
                this.setState({
                    picture: response.data,
                });

                db_picture_thickness = this.state.picture.picture_thickness;
                db_picture_teststandard = this.state.picture.picture_teststandard;
                console.log('getPicture', db_picture_thickness);
                this.getRequisition(this.state.picture.picture_requisition_id);
            })
            .catch((error) => {
                console.log(error);
            });

    };


    componentDidMount() {

        let svg = d3.select("#svgG");
        globalSVG = svg; //方便后面操控<rect></rect>
        // this.fangDa();
    }

    aa1 = () => {
        alert('这里是svg测试')
    };


    judegeColor = () => {
        console.log("judegeColor:" + "updateRectClor=" + updateRectClor + " clickRectClor=" + clickRectClor)
        if (updateRectClor != '')//之前有点击过其他框
        {
            if (updateRectClor == 'red') {                                                   //作用：当点击下一个框时，把上一个框颜色red恢复！！！
                let ele = document.getElementById(clickRectClor);//拿到clickRectClor这个Id框的引用 ？？ 这是上一个框的吧
                console.log("judgeColor里面: " + "updateRectClor=" + updateRectClor + " clickRectClor:" + clickRectClor);
                if (ele != null) {
                    ele.setAttribute("stroke", "red");
                }

                // message.success("改变state状态前"+this.state.updateRectClor);
                updateRectClor = '';//恢复完 清空这俩临时变量
                clickRectClor = '';
                // message.success("改变state状态后"+this.state.updateRectClor);

            } else {
                let ele = document.getElementById(clickRectClor);
                if (ele != null) {
                    ele.setAttribute("stroke", "yellow");
                }
                updateRectClor = '';
                clickRectClor = '';
            }
        }
    };
    //删除所有顶点
    deleteAllCircle = () => {
        while (document.getElementById("newc")) {
            document.getElementById("newc").remove();
        }
    }
    deleteAllCross = () =>{
        while (document.getElementById("cross")) {
            document.getElementById("cross").remove();
        }
}
    createCross = (x,y)=>{
        this.deleteAllCross()
        var svg = document.getElementById('svgG');
        var newcircle = document.createElementNS('http://www.w3.org/2000/svg', "circle");
        newcircle.setAttribute("id", "cross");
        newcircle.setAttribute("cx", x);
        newcircle.setAttribute("cy", y);
        newcircle.setAttribute("r", "3");
        newcircle.setAttribute("fill", "red");
        newcircle.setAttribute("stroke", "black");
        newcircle.setAttribute("stroke-width", "1");
        svg.appendChild(newcircle);
        this.updateCross(x,y)
    }
    //创建顶点
    createCircle = (x, y) => {
        console.log("!!!!!!!!!!!!!!!!!!!!!!")
        var svg = document.getElementById('svgG');
        var newcircle = document.createElementNS('http://www.w3.org/2000/svg', "circle");
        console.log(x)
        console.log(y)
        newcircle.setAttribute("id", "newc");
        newcircle.setAttribute("cx", x);
        newcircle.setAttribute("cy", y);
        newcircle.setAttribute("r", "1");
        newcircle.setAttribute("fill", "green");
        newcircle.setAttribute("stroke", "black");
        newcircle.setAttribute("stroke-width", "1");
        svg.appendChild(newcircle);

    }
    updateCross = (x,y)=>{
        var crossxy = x + "," + y
        let api = global.AppConfig.serverIP + '/updatePictureCross/' + crossxy + '/' + this.state.picture.picture_id;
        axios.post(api)
            .then((response) => {
                //this.props.MemberList.run();
                this.setState({
                    picture: response.data,
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }

    mousedown = (e) => {
        console.log(e.offsetX)
        globalRectX = parseInt(e.clientX - document.getElementById('svgG').getBoundingClientRect().left);
        globalRectY =  parseInt(e.clientY - document.getElementById('svgG').getBoundingClientRect().top);
        if(set_cross){
            cross_x = globalRectX
            cross_y = globalRectY
            console.log("crossx,y",cross_x,cross_y)
            this.createCross(cross_x,cross_y)
        }

        if (polygonFlag) //如果是正在画多边形
        {
            if (polygonPointsNum < 21) {
                console.log(polygonFlag);
                // globalRectX = parseInt(e.clientX - document.getElementById('svgG').getBoundingClientRect().left);
                // globalRectY =  parseInt(e.clientY - document.getElementById('svgG').getBoundingClientRect().top);
                this.createCircle(globalRectX, globalRectY)
                console.log(globalRectX + '这是鼠标位置x');
                console.log(globalRectY + '这是鼠标位置y');

                if (globalRectY < polygonTopy)//记录多边形最上方点的坐标，画损伤类型
                {
                    polygonTopy = parseInt(globalRectY);
                    polygonTopx = parseInt(globalRectX);
                }

                polygonPointArrayX[polygonPointsNum] = globalRectX;
                polygonPointArrayY[polygonPointsNum] = globalRectY;

                polygonPointsString = polygonPointsString + polygonPointArrayX[polygonPointsNum].toString() + "," + polygonPointArrayY[polygonPointsNum].toString() + " ";

                console.log(polygonPointsString);
                this.setState({
                        polygonPoints: polygonPointsString,
                    }
                )//state的polygonPoints 是测试单个多边形用的，后期删掉


                console.log(polygonPointArrayX[polygonPointsNum]);
                console.log(polygonPointArrayY[polygonPointsNum]);
                console.log('第' + polygonPointsNum + '个点');
                polygonPointsNum++;
            }
        }
        else{
            // this.judegeColor();
            console.log("点击了svg");
            //message.success(this.state.updateRectClor);
            globalFlag = true;//为true,鼠标移动更新tempx  tempy
            //使用当前界面鼠标位置减去svg画布的距离屏幕左边或上边的距离
            // globalRectX = parseInt(e.clientX - document.getElementById('svgG').getBoundingClientRect().left);
            // globalRectY =  parseInt(e.clientY - document.getElementById('svgG').getBoundingClientRect().top);
            //console.log(document.getElementById('svgG').getBoundingClientRect());
            console.log(globalRectX + '这是鼠标位置x');
            console.log(globalRectY + '这是鼠标位置y');

            let tempRect = globalSVG.append("rect")  //向globalSVG里面新加了一个rect,tempRect拿到引用
                .attr("x", globalRectX)
                .attr("y", globalRectY)
                .attr("height", 0)
                .attr("width", 0)
                .attr("fill", "black")
                .attr("fill-opacity", 0)
                .attr("stroke", "red")
                .attr("stroke-width", 1)
                .attr("damage", 1)
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


    deletePolygon = () => {
        lastPolygonId=""
        this.deleteAllCircle();
        if (polygonFlag == false) {
            if (polygonId != "") {
                confirm({
                    title: '确定要删除吗',
                    content: ' ',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk: (() => {
                        this.deletep();
                    }),
                    onCancel() {
                        console.log('Cancel');
                    },
                });
            } else {
                message.error("请选中损伤框再删除！");
            }
        } else {
            message.error("请先关闭画多边形模式，再删除!")
        }
    };

    deletep = () => {

        let api = global.AppConfig.serverIP + '/deletePolygonById?polygon_id=' + polygonId + '&picture_id=' + this.state.picture.picture_id;
        axios.post(api)
            .then((response) => {
                console.log("delete:" + JSON.stringify(response));
                //setTimeout(loadinghide, 100);
                message.success("已成功删除多边形框！");
                polygonId = "";
                //this.props.MemberList.run();
                this.setState({
                    polygonList: response.data,
                })
                this.componentWillMount()
            })
            .catch((error) => {
                console.log(error);
            });
    }

    deleteRect = (rectId) => {

        // if(clickTimeId) {//取消上次延时未执行的方法
        //     clickTimeId = clearTimeout(clickTimeId);
        // }
        // console.log("双击");

        saveLoginInfo('删除了编号' + this.state.picture.picture_number + '的损伤标记框');
        confirm({
            title: '确定要删除吗',
            content: ' ',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: (() => {
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

    delete = (rectId) => {
        if (rectId != "") {
            updateRectClor = '';
            clickRectClor = '';
            let api = global.AppConfig.serverIP + '/deleteRectById?rectangle_id=' + rectId + '&picture_id=' + this.state.picture.picture_id;
            axios.post(api)
                .then((response) => {
                    console.log("delete:" + JSON.stringify(response));
                    setTimeout(loadinghide, 100);
                    message.success("已成功删除损伤框！");
                    //this.props.MemberList.run();
                    this.setState({
                        rectangleList: response.data,
                    })

                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            message.error("请选中损伤框再删除！");
        }
    };


    mousemove = (e) => {

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

    mouseup = () => {
        if (polygonFlag == false) {
            // 根据绘制的长宽筛选掉较小的框
            if (globalJudgeRectY * globalJudgeRectX < 30) {
                globalRect.remove();
            } else {
                saveLoginInfo('绘制了影像图编号' + this.state.picture.picture_number + '的损伤标记框');
                this.saveRect();
                globalFlag = false;
            }
        }

    };

    onWhellChange = () => {
        //message.success("捕捉到滚轮")
        let tempTime = this.state.wheelTimes;
        this.setState({
            // wheelTimes: tempTime + 0.1,
        });
        //this.fangDa();
    };

    AIprocess = () => {
        this.onDectect(this.state.picture.picture_number);
        saveLoginInfo('对编号' + this.state.picture.picture_number + '进行了ai检测');
        let picture_id = this.state.propsPictureId;
        let api = global.AppConfig.serverIP + '/detectionById_backstage/' + picture_id+'/'+this.state.picture.picture_real_width;
        axios.post(api)
            .then((response) => {
                setTimeout(loadinghide, 100);
                message.success("编号" + this.state.picture.picture_number + "影像图成功获取检测结果！！");
                //this.props.MemberList.run();
                // this.setState({
                //     polygonList: response.data,
                // })
                //这里存在state里没有必要
                let picture_id = this.props.match.params.picture_id;
                this.getPicturePolygon(picture_id);
                this.getPicture(picture_id);
            })
            .catch((error) => {
                console.log(error);
            });

        message.success("开始AI智能检测--！");

    };
    getFlawLengths = (points) => {//外包矩形框
        let max_x = 0;
        let min_x = 9999;
        let max_y = 0;
        let min_y = 9999;
        let d_x = 0;
        let d_y = 0;
        for (let i = 0; i < points[0].length; i++) {
            if (points[0][i] > max_x) {
                max_x = points[0][i]
            }
            if (points[0][i] < min_x) {
                min_x = points[0][i]
            }
        }

        for (let i = 0; i < points[1].length; i++) {
            if (points[1][i] > max_y) {
                max_y = points[1][i]
            }
            if (points[1][i] < min_y) {
                min_y = points[1][i]
            }
        }
        //todo 计算缺陷大小
        d_x = max_x - min_x
        d_y = max_y - min_y

        d_x = d_x * (this.state.picture.picture_real_width/1000)
        d_y = d_y *(100/300)
        console.log("d_x","d_y",d_x," ",d_y)
        var d = d_x > d_y ? d_x : d_y
        d = d.toFixed(2)
        return d
    }
    savePolygon = () => {//给发送到后端做准备
        //TODO 保存多边形

        let svgDOM = document.getElementById('svgG');
        let polygons = document.getElementById('newPolygonByMember');//把所有rects拿出来保存到一个对象，发送给后端
        let picture_id = this.state.propsPictureId; //取出当前页面picture_id
        let points = polygons.getAttribute("points")
        let pointsXY = this.parseStringToPointsXY(points)
        let point_shift = ""
        for(let i=0;i<pointsXY[1].length;i++){ //处理偏移
            pointsXY[1][i] = pointsXY[1][i] - 100
        }
        for(let i=0;i<pointsXY[1].length;i++){
            point_shift = point_shift  + pointsXY[0][i] + "," + pointsXY[1][i]+ " "
        }
        //polygons和polygonArray之间有转换，polygons信息用于给前端(有stroke啥的)，polygonArray是处理后用来给后端的数据(bean的)
        let polygonArray = new Array();

        let obj = {
            "polygon_picture_id": picture_id,
            "polygon_pt": point_shift,
            "polygon_author": "member",
            "polygon_damage_type": damage_type,
            "polygon_text_x": polygonTopx,
            "polygon_text_y": polygonTopy,
            "polygon_flaw_length": this.getFlawLengths(pointsXY),
        };
        //new RectData(temp[0],temp[1],temp[2],temp[3],temp[4]);
        // polygonArray[j] = obj;
        // this.savePolygonList(polygonArray,picture_id);
        this.saveOneMemberPolygon(obj, picture_id)
    }

    saveOneMemberPolygon = (polygonArray, picture_id) => {
        let api = global.AppConfig.serverIP + '/saveOneMemberPolygon?picture_id=' + picture_id;
        console.log(polygonArray);
        axios.post(api, polygonArray)
            .then((response) => {
                // console.log(JSON.stringify(response.data));
                message.success('保存成功');
                let ele = document.getElementById("tempId");
                if (ele != null) {
                    ele.parentNode.removeChild(ele);
                }
                this.setState({
                    polygonList: response.data,
                });

                this.setState({
                    polygonPoints: "",
                });//把临时框清空
                this.componentWillMount()
            })
            .catch((error) => {
                console.log(error);
            });
    }


    savePolygonList = (polygonArray, picture_id) => {
        let api = global.AppConfig.serverIP + '/getPolygonArray?picture_id=' + picture_id;
        console.log('polygonArray:' + polygonArray);
        axios.post(api, polygonArray)
            .then((response) => {
                // console.log(JSON.stringify(response.data));
                message.success('保存成功');
                let ele = document.getElementById("tempId");
                if (ele != null) {
                    ele.parentNode.removeChild(ele);
                }
                this.setState({
                    polygonList: response.data,
                });

                this.setState({
                    polygonPoints: "",
                });//把临时框清空
            })
            .catch((error) => {
                console.log(error);
            });
    }

    generateReport = () => {
        const w = window.open('about:blank');
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
        w.location.href = `/printReportForSingleImage/${this.props.match.params.picture_id}/${display}`;
        //以下为备用方法，可直接写在button标签内，但经过实测IE浏览器可能出现无法传值的情况
        // <Link to="/printReport" target="_blank">测试弹出</Link>
        // <Link to={`/printReport/${this.props.RequisitionList.state.requisition.requisition_id}`}
    };

    saveRect = () => {
        saveLoginInfo('对编号' + this.state.picture.picture_number + '的损伤标记框进行了保存');
        let svgDOM = document.getElementById('svgG');
        let rects = svgDOM.getElementsByTagName("rect");//把所有rects拿出来保存到一个对象，发送给后端

        let rectangleArray = new Array();
        for (let j = 0; j < rects.length; j++) {
            let temp = new Array();
            temp[4] = rects[j].getAttribute("stroke");

        }

        for (let j = 0; j < rects.length; j++) {
            let temp = new Array();

            temp[0] = parseInt(rects[j].getAttribute("x"));
            temp[1] = parseInt(rects[j].getAttribute("y"));
            temp[2] = parseInt(rects[j].getAttribute("width")) + temp[0];
            temp[3] = parseInt(rects[j].getAttribute("height")) + temp[1];
            temp[4] = rects[j].getAttribute("stroke");
            temp[5] = rects[j].getAttribute("damage");
            temp[6] = rects[j].getAttribute("rect_conf");
            temp[7] = rects[j].getAttribute("rect_cls_conf");

            console.log("saveRect:" + updateRectClor);
            if (temp[4] == 'black') {
                if (updateRectClor == 'red') {
                    temp[4] = 'red';
                    let ele = document.getElementById(clickRectClor);
                    if (ele != null) {
                        ele.setAttribute("stroke", "red");
                    }
                    updateRectClor = '';
                    clickRectClor = '';
                } else {
                    temp[4] = 'yellow';
                    let ele = document.getElementById(clickRectClor);
                    if (ele != null) {
                        ele.setAttribute("stroke", "yellow");
                    }
                    updateRectClor = '';
                    clickRectClor = '';

                }
            }

            if (temp[4] == 'red') {
                temp[4] = 'member';
                let obj = {
                    "x1": temp[0] + 1,
                    "x2": temp[2] + 1,
                    "y1": temp[1] + 1,
                    "y2": temp[3] + 1,
                    "retangle_author": temp[4],
                    "retangle_damage_type": temp[5],
                    "conf": temp[6],
                    "cls_conf": temp[7],
                };
                //new RectData(temp[0],temp[1],temp[2],temp[3],temp[4]);
                rectangleArray[j] = obj;
            }
            if (temp[4] == 'yellow') {
                temp[4] = 'Algorithm';
                let obj = {
                    "x1": temp[0] + 1,
                    "x2": temp[2] + 1,
                    "y1": temp[1] + 1,
                    "y2": temp[3] + 1,
                    "retangle_author": temp[4],
                    "retangle_damage_type": temp[5],
                    "conf": temp[6],
                    "cls_conf": temp[7],
                };
                rectangleArray[j] = obj;
            }
        }
        // this.clearSVG();
        // console.log(rectangleArray);
        let picture_id = this.state.propsPictureId; //取出当前页面picture_id
        this.saveRectList(rectangleArray, picture_id);

    };

    saveRectList = (rectangleArray, picture_id) => {
        let api = global.AppConfig.serverIP + '/getRectangleArray?picture_id=' + picture_id;
        console.log('rectangleArray:' + rectangleArray);
        axios.post(api, rectangleArray)
            .then((response) => {
                // console.log(JSON.stringify(response.data));
                message.success('保存成功');
                let ele = document.getElementById("tempId");
                if (ele != null) {
                    ele.parentNode.removeChild(ele);
                }
                this.setState({
                    rectangleList: response.data,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    selectPolygon = (polygon_id) => {
        //todo 1111
        polygonId = polygon_id;
        //polygonId为全局变量
        polygonClickflag = true;//改变缺陷类型用到
        var p = document.getElementById(polygonId)

        if(lastPolygonId !== ""){
            var last_p = document.getElementById(lastPolygonId)
            last_p.style.cssText = ""
        }
        if(lastPolygonId === polygonId){
            p.style.cssText = ""
        }
        else{
            p.style.cssText = "opacity: 0.6;stroke-Width:5px;"
            message.success("多边形损伤框已选中,请“添加缺陷类型” 或 “删除损伤框”")
        }
        lastPolygonId = polygon_id;
    };

    updateDamageType = (retangle_id, author) => {

        polygonClickflag = false;
        // message.success("获取id"+ retangle_id);
        this.judegeColor();//判断是否第一次点击
        //message.success(1111+updateRectClor);
        if (updateRectClor == '') // ==' '表示第一次点击
        {
            // message.success(1111)
            if (author == 'member') {
                updateRectClor = 'red';//第一次点击人工框，记录点击的是红色框
            } else {
                updateRectClor = 'yellow';
            }
            // message.success(updateRectClor);
            this.updateRectClorMethod(retangle_id);
            clickRectClor = retangle_id;//记下 点击的框 的id

            console.log("updateDamageType之后:" + "updateRectClor=" + updateRectClor + " clickRectClor=" + clickRectClor)
        } else//不是第一次
        {
            if (updateRectClor == 'red') {
                let ele = document.getElementById(clickRectClor);
                if (ele != null) {
                    ele.setAttribute("stroke", "red");
                }
                updateRectClor = '';
                clickRectClor = '';

            } else {
                let ele = document.getElementById(clickRectClor);
                if (ele != null) {
                    ele.setAttribute("stroke", "yellow");
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
            onClickRectId: retangle_id,
        });
        console.log("鼠标单击");
        // }, 200);

    };
    updateDamageTypeByselect = (e) => {
        console.log("参数e:" + e);
        damage_type = e;
        /**使用axios将value表单信息与当前选择的方框信息一起发送到后端
         * damagetype_id
         * 得到的数据应是更新后的画框的列表，即是rectangleList
         * */

        if (polygonClickflag == false)//表示点击的不是多边形，要更改rect损伤类型
        {
            // let api = global.AppConfig.serverIP + '/updateRectangleDamageTypeByDamageType?rectangle_id=' + this.state.onClickRectId + '&damagetype_id=' + e + '&picture_id=' + this.state.propsPictureId;
            // axios.post(api)
            //     .then((response) => {
            //         // console.log(response);
            //         // console.log(JSON.stringify(response.data));
            //         //saveLoginInfo('更新了编号'+this.state.picture.picture_number+'的损伤类型描述信息')
            //         message.success("已更新损伤类型");
            //         // let ele = document.getElementById( this.state.clickRectClor);
            //         // if(ele!=null){
            //         //     ele.setAttribute("stroke",this.state.updateRectClor);
            //         // }
            //         this.setState({
            //             rectangleList: response.data
            //         })
            //     })
            //     .catch((error) => {
            //         console.log(error);
            //     });
        } else   //点击多边形
        {
            let api = global.AppConfig.serverIP + '/updatePolygonDamageTypeByDamageType?polygon_id=' + polygonId + '&damagetype_id=' + e + '&picture_id=' + this.state.propsPictureId;
            axios.post(api)
                .then((response) => {
                    // console.log(response);
                    // console.log(JSON.stringify(response.data));
                    //saveLoginInfo('更新了编号'+this.state.picture.picture_number+'的损伤类型描述信息')
                    message.success("已更新损伤类型");
                    // let ele = document.getElementById( this.state.clickRectClor);
                    // if(ele!=null){
                    //     ele.setAttribute("stroke",this.state.updateRectClor);
                    // }
                    this.setState({
                        polygonList: response.data
                    })
                })
                .catch((error) => {
                    console.log(error);
                });

            polygonClickflag = false;
        }

    };

    updateRectClorMethod = (retangle_id) => {
        message.success("损伤框已选中,请“添加缺陷类型” 或 “删除损伤框”")
        // message.success(retangle_id)
        let ele = document.getElementById(retangle_id); //拿到这个框的引用
        console.log(ele);
        if (ele != null) {
            //ele.setAttribute("stroke","black"); //暂时将边框颜色设置为黑色
        }
    };

    getRectangleInfo = (rectangle_id) => {

        let api = global.AppConfig.serverIP + '/getRectangleInfo?rectangle_id=' + rectangle_id;
        axios.post(api)
            .then((response) => {
                // console.log(JSON.stringify(response.data));
                // alert(JSON.stringify(response.data.retangle_damage_type));
                this.getDamageType(JSON.stringify(response.data.retangle_damage_type));
                this.setState({
                    rectangle: response.data,
                })
            })
            .catch((error) => {
                console.log(error);
            });
    };

    getDamageType = (damagetype_id) => {
        let api = global.AppConfig.serverIP + '/getDamageTypeInfo?damagetype_id=' + damagetype_id;
        axios.post(api)
            .then((response) => {
                // console.log(JSON.stringify(response.data));
                // alert(JSON.stringify(response.data));
                this.setState({
                    damageType: response.data,
                })
            })
            .catch((error) => {
                console.log(error);
            });
    };

    getDamageTypeList = () => {

        let api = global.AppConfig.serverIP + '/getDamageTypeList';
        axios.post(api)
            .then((response) => {
                console.log('getDamageTypeList:' + JSON.stringify(response.data));
                // alert(JSON.stringify(response.data));
                this.setState({
                    damageTypeList: response.data,
                })
            })
            .catch((error) => {
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

    getRequisition = (picture_requisition_id) => {
        let api = global.AppConfig.serverIP + '/getRequisition?requisition_id=' + picture_requisition_id;
        axios.post(api)
            .then((response) => {
                // console.log(JSON.stringify(response.data));
                this.setState({
                    requisition: response.data,
                });

                //alert("完成影像图信息更新！")
            })
            .catch((error) => {
                console.log(error);
            });
    };

    updatePicture = (picture) => {//该picture为当前框中的值
        //todo 更新
        let picture_id = this.props.match.params.picture_id;
        // this.setState({
        //     propsPictureId: picture_id,
        // });
        // this.getPicture(picture_id);
        // this.getPictureRect(picture_id);
        // this.getDamageTypeList();

        //判断是否更改厚度和检测标准
        var obj_updatepicture = null;
        // var flag = true;
        obj_updatepicture = Object.assign({}, this.state.picture, {
            picture_real_width:picture.picture_real_width,
            picture_real_height:100,
            picture_number:picture.picture_number,
            picture_hanfeng_name:picture.picture_hanfeng_name,
            picture_hanfeng_number:picture.picture_hanfeng_number,
            picture_hanfeng_method:picture.picture_hanfeng_method,
            picture_bevel_form:picture.picture_bevel_form,
            picture_material_number:picture.picture_material_number,
            picture_hanfeng_length:picture.picture_hanfeng_length,
            picture_testing_rate:picture.picture_testing_rate,
            picture_hanfeng_testlength:picture.picture_hanfeng_testlength,
            picture_density:picture.picture_density,
            picture_quality:picture.picture_quality,
            picture_parts_Introductions:picture.picture_parts_Introductions,
            picture_thickness:picture.picture_thickness,
            picture_entrytime:picture.picture_entrytime,
            picture_conclusion:picture.picture_conclusion,
            picture_welding_operator:picture.picture_welding_operator
        });
        // if (db_picture_teststandard == picture.picture_teststandard && db_picture_thickness == picture.picture_thickness)//说明都没改
        // {
        //     flag = false;
        // } else {
        //     obj_updatepicture = Object.assign({}, this.state.picture, {
        //         picture_teststandard: picture.picture_teststandard,
        //         picture_thickness: picture.picture_thickness,
        //         picture_density:picture.picture_density,
        //         picture_quality:picture.picture_quality,
        //         picture_entrytime:picture.picture_entrytime,
        //         picture_qualifylevel:picture.picture_qualifylevel,
        //         picture_testmethod:picture.picture_testmethod,
        //         picture_jointform:picture.picture_jointform,
        //         picture_parts_Introductions:picture.picture_parts_Introductions,
        //     });
        // }

            console.log("图片更新后requisition是否改  id:" + obj_updatepicture.requisition_id + " last-test-standard:" + obj_updatepicture.requisition_last_teststandard)
            this.setState({
                picture: obj_updatepicture,
            });
            //更新requisition的last_thickness,即上一次处理的厚度
            let api1 = global.AppConfig.serverIP + '/updatePicture';

            axios.post(api1, obj_updatepicture)
                .then((response) => {
                    // console.log(response);
                    // console.log(JSON.stringify(response.data));
                    this.setState({
                        requisition: response.data,
                    });
                    this.getPicturePolygon(picture_id)
                })
                .catch((error) => {
                    console.log(error);
                });




        /**使用axios将value表单信息发送到后端
         * */
        //console.log(this.state.requisition);
        // saveLoginInfo('更新了影像图编号' + picture.picture_number + '的信息');
        // let api2 = global.AppConfig.serverIP + '/updatePicture';
        // axios.post(api2, picture)
        //     .then((response) => {
        //         // console.log(response);
        //         // console.log(JSON.stringify(response.data));
        //         this.setState({
        //             picture: response.data,
        //         });
        //         message.success("完成影像图信息更新！")
        //
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     });

    };

    changeAIRectDisplay = () => {
        if (this.state.AIRectDisplay == "none") {
            this.setState({
                AIRectDisplay: "",
                //  AIDamageTypeDisplay:"",
                // AIConfDisplay:""
            })
        } else {
            this.setState({
                AIRectDisplay: "none",
                AIDamageTypeDisplay: "none",
                AIDamageBeliefDisplay: "none",
                //AIConfDisplay:"none"
            })
        }
    };

    changeFdDispaly = () => {
        if (this.state.fdDispaly == "none") {
            this.setState({
                fdDispaly: ''
            })
        } else {
            this.setState({
                fdDispaly: "none",
            })
        }
    };

    changeRectDisplay = () => {

        console.log(this.state.rectDisplay)
        if (this.state.rectDisplay == "none") {
            this.setState({
                rectDisplay: "",
                 drawDamageTypeDisplay:"",
                drawConfDisplay: ""
            })
        } else {
            this.setState({
                rectDisplay: "none",
                drawDamageTypeDisplay:"none",
                drawConfDisplay: "none"
            })
        }
    };

    clearSVG = () => {
        var myNode = document.getElementById("svgG");
        myNode.innerHTML = '';
        // alert(111)
    };

    changeDamageTypeDisplay = () => {
        if (this.state.AIDamageTypeDisplay == "none" && this.state.drawDamageTypeDisplay == "none") {
            this.setState({
                AIDamageTypeDisplay: "",
                drawDamageTypeDisplay: "",
            })
        } else {
            this.setState({
                AIDamageTypeDisplay: "none",
                drawDamageTypeDisplay: "none",
            })
        }
    };

    changehanfengDisplay = () => {
        if (this.state.hanfengdisplay == "none") {
            console.log(this.state.hanfengdisplay);
            this.setState({
                hanfengdisplay: "",
                // drawDamageTypeDisplay:"",
            })
        } else {
            console.log("ssssssssssssssssssssssssaa");
            this.setState({
                hanfengdisplay: "none",
                // drawDamageTypeDisplay:"none",
            })
        }


    };

    changeDisplay = () => {
        if (this.state.drawConfDisplay == "none" && this.state.AIConfDisplay == "none") {
            this.setState({
                AIConfDisplay: "",
                drawConfDisplay: '',
            })
        } else {
            this.setState({
                AIConfDisplay: "none",
                drawConfDisplay: 'none',
            })
        }
    };

    changeClsDisplay = () => {
        if (this.state.clsconfdispaly == "none") {
            this.setState({
                clsconfdispaly: "",
            })
        } else {
            this.setState({
                clsconfdispaly: "none",
            })
        }
    };

    getUpPagePicture = () => {
        let api = global.AppConfig.serverIP + '/getUpPagePicture/' + this.state.picture.picture_id;
        axios.post(api)
            .then((response) => {
                if (this.state.propsPictureId == response.data) {
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
            .catch((error) => {
                console.log(error);
            });
    };


    getNextPagePicture = () => {

        let api = global.AppConfig.serverIP + '/getNextPagePicture/' + this.state.picture.picture_id;
        axios.post(api)
            .then((response) => {
                if (this.state.propsPictureId == response.data) {
                    message.info("已经到最后一张了");
                } else {
                    const path = `/app`;
                    history.push(path);
                    const path2 = `/app/pictureManage/${response.data}`;
                    history.push(path2)
                }
                //message.success("完成影像图信息更新！")
            })
            .catch((error) => {
                console.log(error);
            });
    };


    getDamageTypeColor = (damageTypeId) => {//TODO getcolor
        if (damageTypeId === 0)
            return "#ED9D01";
        else if (damageTypeId === 1)
            return "#E4EE5D";
        else if (damageTypeId === 2)
            return "#0aff02";
        else if (damageTypeId === 3)
            return "#00CEA6";
        else if (damageTypeId === 4)
            return "#003CB1";
        else if (damageTypeId === 6)
            return "#A300B1";
        else if (damageTypeId === 7)
            return "#b1000f";
        // else if(damageTypeId == 5)
        //     return "#00B109";
    }

    parseStringToPointsXY = (points) => {
        var points = points.trim().split(" ")
        var points_x = new Array()
        var points_y = new Array()
        var p = new Array()
        var center = new Array()
        points.forEach((e) => {
            points_x.push(parseInt(e.split(",")[0]))
            points_y.push(parseInt(e.split(",")[1]))
        })
        p.push(points_x)
        p.push(points_y)
        return p
    }
    getCenterPoint = (points) => {
        var p = this.parseStringToPointsXY(points)
        var points_x = p[0]
        var points_y = p[1]
        var center = new Array()


        var max_x = Math.max.apply(null, points_x)
        var min_x = Math.min.apply(null, points_x)
        var max_y = Math.max.apply(null, points_y)
        var min_y = Math.min.apply(null, points_y)
        var center_y = Math.round((max_y + min_y) / 2)
        var center_x = Math.round((max_x + min_x) / 2)
        center.push(center_x)
        center.push(center_y)
        return center
    }
    getNearestToCOfSVG = (points) =>{
        var p = this.parseStringToPointsXY(points)
        // console.log("解析"+p[0])
        // console.log("解析"+p[1])
        var res = new Array()
        var points_x = p[0]
        var points_y = p[1]
        var x = 0
        var y = 0
        var d_x = 9999;
        var d_y = 9999;
        for (let i = 0; i < points_y.length; i++) {
            if(Math.abs(points_x[i] - 500)<d_x){
                d_x = Math.abs(points_x[i] - 500)
                x = points_x[i];
            }
            if(Math.abs(points_y[i] - 250)<d_y){
                d_y =  Math.abs(points_y[i] - 250)
                y = points_y[i];
            }
        }

        res.push(x)
        res.push(y)
        return res
    }
    getNearestToCenterOfSVG = (points) => {
        var p = this.parseStringToPointsXY(points)
        // console.log("解析"+p[0])
        // console.log("解析"+p[1])
        var res = new Array()
        var points_x = p[0]
        var points_y = p[1]
        // var n_x = 0
        // var n_x_d = 9999
        // for (let i = 0; i < points_x.length; i++) {
        //     if (n_x_d > Math.abs(points_x[i] - 0)) {
        //         n_x_d = Math.abs(points_x[i] - 0)
        //         n_x = points_x[i]
        //     }
        // }
        var n_y_0 = 0
        var n_y_0_d = 9999
        var n_y_500 = 0
        var n_y_500_d = 9999
        var iy_0 = 0
        var iy_500 = 0
        for (let i = 0; i < points_y.length; i++) {
            if (n_y_0_d > Math.abs(points_y[i] - 0)) {
                n_y_0_d = Math.abs(points_y[i] - 0)
                n_y_0 = points_y[i]
                iy_0 = i
            }
        }
        for (let i = 0; i < points_y.length; i++) {
            if (n_y_500_d > Math.abs(points_y[i] - 500)) {
                n_y_500_d = Math.abs(points_y[i] - 500)
                n_y_500 = points_y[i]
                iy_500 = i
            }
        }

        res.push(points_x[iy_0])
        res.push(n_y_0)
        res.push(points_x[iy_500])
        res.push(n_y_500)
        return res
    }
//判断象限
    judgeQuadrant = (points) => {
        var res = new Array()
        var r1 = points[0] - 500
        var r2 = points[1] - 150
        if (r1 <= 0 && r2 <= 0) {
            res.push(0)
            res.push(0)

        } else if (r1 > 0 && r2 < 0) {
            res.push(1)
            res.push(0)

        } else if (r1 < 0 && r2 > 0) {
            res.push(0)
            res.push(1)
        } else {
            res.push(1)
            res.push(1)
        }
        return res

    }
    showDefectInfo = (item) => (e) => {
        console.log("！！！！！！！！！！" + item)
        if (item) {
            console.log("缺陷区域监听到了进入事件！！！！！！！！！！")
            var polygon_text = document.getElementById('text' + item.id)
            var rect_info = document.getElementById('rect_info' + item.id)
            var line = document.getElementById('line' + item.id)
            rect_info.style.display = ''
            polygon_text.style.display = ''
            line.style.display = ''
            var n_x_y = this.getNearestToCenterOfSVG(item.points)
            console.log("最近x" + n_x_y[0])
            console.log("最近y" + n_x_y[1])
        }


    }
    showDefectInfoBytable = (item) => {
        if (item) {
            //todo
            console.log("缺陷区域监听到了进入事件！！！！！！！！！！")
            var p = document.getElementById(item.id)
            var polygon_text = document.getElementById('text' + item.id)
            var rect_info = document.getElementById('rect_info' + item.id)
            var line = document.getElementById('line' + item.id)
            p.style.cssText = "opacity: 0.6;stroke-Width:5px;"
            rect_info.style.display = ''
            polygon_text.style.display = ''
            line.style.display = ''
            var n_x_y = this.getNearestToCenterOfSVG(item.points)
            console.log("最近x" + n_x_y[0])
            console.log("最近y" + n_x_y[1])
        }
    }
    closeDefectInfoforTable = (item) => {
        if (item.id !== this.state.pid) {
            console.log("缺陷区域监听到了离开事件！！！！！！！！！！")
            var p = document.getElementById(item.id)
            var polygon_text = document.getElementById('text' + item.id)
            var rect_info = document.getElementById('rect_info' + item.id)
            var line = document.getElementById('line' + item.id)
            p.style.cssText = ""
            rect_info.style.display = 'none'
            polygon_text.style.display = 'none'
            line.style.display = 'none'
        }

    }
    closeDefectInfoById = (id) => {
        var p = document.getElementById(id)
        var polygon_text = document.getElementById('text' + id)
        var rect_info = document.getElementById('rect_info' + id)
        var line = document.getElementById('line' + id)
        rect_info.style.display = 'none'
        polygon_text.style.display = 'none'
        line.style.display = 'none'
    }
    closeDefectInfo = (item) => (e) => {
        if (item) {
            console.log("缺陷区域监听到了离开事件！！！！！！！！！！")
            var polygon_text = document.getElementById('text' + item.id)
            var rect_info = document.getElementById('rect_info' + item.id)
            var line = document.getElementById('line' + item.id)
            rect_info.style.display = 'none'
            polygon_text.style.display = 'none'
            line.style.display = 'none'
        }

    }
//取ploygon渲染至前端
    render_Rect_Polygon_List = () => {
        //获取rect信息
        rectList = [];
        var retangle = this.state.rectangleList;
        var damageTypeList = this.state.damageTypeList;
        //获取polygon信息
        hanfenglist = [];
        polygList = [];//前端标签<>用于展示用
        let polyg = this.state.polygonList;//将数据库的数据逐个取出来，push到polygList进行展示
        console.log("assssssssssd" + this.state.polygonList)
        for (let i = 0; i < polyg.length; i++) {
            let polygon_id = polyg[i].polygon_id;
            let polygon_pt = polyg[i].polygon_pt;
            let polygon_belief = polyg[i].polygon_belief;
            let polygon_p_x = polyg[i].polygon_flaw_position_x;
            let polygon_p_y = polyg[i].polygon_flaw_position_y;
            //  let polygon_picture_id = polyg[i].polygon_picture_id;
            let polygon_author = polyg[i].polygon_author;
            let polygon_damage_type = polyg[i].polygon_damage_type;
            console.log("id=" + polygon_id + "  author=" + polygon_author)
            let polygon_damage_name;
            let topx = polyg[i].polygon_text_x;
            let topy = polyg[i].polygon_text_y;
            let polygon_flaw_lengths = polyg[i].polygon_flaw_length;
            if (damageTypeList.length > 0) {
                for (let i = 0; i < damageTypeList.length; i++) {
                    if (damageTypeList[i].damagetype_id === polygon_damage_type) {
                        polygon_damage_name = damageTypeList[i].damagetype_name;
                    }
                }
            }
            if (polygon_damage_type != 6) {
                hanfenglist.push({
                    id: polygon_id,
                    points: polygon_pt,
                    author: this.trans_str(polygon_author),
                    damage_type: polygon_damage_type,
                    damage_name: polygon_damage_name,
                    textx: topx,
                    texty: topy,
                    belief: polygon_belief,
                    lengths: polygon_flaw_lengths,
                    flaw_positions: polygon_p_x+","+polygon_p_y,
                })
            }
            polygList.push({
                id: polygon_id,
                points: polygon_pt,
                author:  this.trans_str(polygon_author),
                damage_type: polygon_damage_type,
                damage_name: polygon_damage_name,
                textx: topx,
                texty: topy,
                belief: polygon_belief,
                lengths: polygon_flaw_lengths,
                flaw_positions: polygon_p_x+","+polygon_p_y,
            })

        }
        this.setState({
                polygonList: ''
            }
        )
    }
    getRowClassName = (record, index) => {
        console.log(index)
        const rid = this.state.rowId;
        console.log(rid)
        let className = 'normal';
        if (index === rid) {
            className = 'blue';
        }
        console.log(className)
        return className;
    }
    tableDown = (record, index) => {
        console.log(index)
        if (this.state.pid !== -1) {
            this.closeDefectInfoById(this.state.pid)
        }
        if (this.state.rowId === index) {
            console.log("2222" + record.id)
            this.closeDefectInfoforTable(record)
            this.setState({
                rowId: -1,
                pid: -1
            })
        } else {
            this.showDefectInfoBytable(record)
            this.setState({
                rowId: index,
                pid: record.id
            })

        }


    }
    sendToApitest = () => {
        uploadV = message.loading('正在上传中..', 120);
        let api = global.AppConfig.serverIP + '/sendToApitest/' + this.state.picture.picture_id;
        axios.post(api)
            .then((response) => {
                console.log(response.data)
                setTimeout(uploadV, 1);
                if(response.data == "success"){
                    loadinghide = message.info('该图片标注确认成功!', 2);
                }else{
                    loadinghide = message.error('失败!', 2);
                }
                //message.success("完成影像图信息更新！")
            })
            .catch((error) => {
                console.log(error);
            });

    }
    HorizatalFlipPicture = () => {
        let api = global.AppConfig.serverIP + '/HorizatalFlipPicture/' + this.state.picture.picture_id;
        let a = this.state.picture.picture_id
        axios.post(api)
            .then((response) => {
                if (response.data == "success") {
                    loadinghide = message.info('图片水平翻转成功!', 2);
                    this.setState({})
                } else {

                }

                //message.success("完成影像图信息更新！")
            })
            .catch((error) => {
                console.log(error);
            });
    }


    VerticalFlipPicture = () => {
        let api = global.AppConfig.serverIP + '/VerticalFlipPicture/' + this.state.picture.picture_id;
        let a = this.state.picture.picture_id
        axios.post(api)
            .then((response) => {
                if (response.data == "success") {
                    loadinghide = message.info('图片垂直翻转成功!', 2);
                    this.setState({})
                } else {

                }

                //message.success("完成影像图信息更新！")
            })
            .catch((error) => {
                console.log(error);
            });
    }
    getTypeNumber = () => {
        var count = new Array(6)
        for (let i = 0; i < count.length; i++)
            count[i] = 0;
        for (let i = 0; i < polygList.length; i++) {
            switch (parseInt(polygList[i].damage_type)) {
                case 0:
                    count[0]++;
                    break;
                case 1:
                    count[1]++;
                    break;
                case 2:
                    count[2]++;
                    break;
                case 3:
                    count[3]++;
                    break;
                case 4:
                    console.log(count[4])
                    count[4]++;
                    console.log("++++++++++++" + count[4])
                    break;
                case 7:
                    console.log(count[5])
                    count[4]++;
                    console.log("++++++++++++" + count[4])
                    break;
            }
        }
        return count
        console.log("counttttttttttt" + count)
    }
    getRandom = () => {
        return Math.random()
    }
    changeToolsDisplay = (a) => {
        if (a) {
            this.setState({
                labeltools: " ",
            })
        } else {
            this.setState({
                labeltools: "none",
            })
        }

    }
    imgEnhance = () =>{
        let img = document.getElementById("img111")
        let img_org = cv.imread(img)
        let mat = new cv.Mat() ;
        cv.cvtColor(img_org,img_org,COLOR_BGR2GRAY)
        if(!enhance){
            cv.equalizeHist(img_org,mat);
            //  cv.Canny(img_org, mat, 10, 50);
             // mat = cv.add(img_org,mat,mat)
            cv.imshow(this.cannyEdgeRef.current,mat)
            enhance = true
        }
        else{
            cv.imshow(this.cannyEdgeRef.current,img_org)
            enhance = false
        }
}

    imgCanyEnhance = () =>{
        let img = document.getElementById("img111")
        let img_org = cv.imread(img)
        let mat = new cv.Mat() ;
        cv.cvtColor(img_org,img_org,COLOR_BGR2GRAY)
        if(!enhance){
            // cv.equalizeHist(img_org,mat);
            cv.Canny(img_org, mat, 50, 70);
            cv.add(mat,img_org,mat)
            cv.imshow(this.cannyEdgeRef.current,mat)
            enhance = true
        }
        else{
            cv.imshow(this.cannyEdgeRef.current,img_org)
            enhance = false
        }
    }
    setCross= ()=>{
        //todo: setcross
        if(!set_cross){
            set_cross = true
            setCrossTag = message.loading('请鼠标点击十字，校准位置', 120);
        }else{
            set_cross = false

            setTimeout(setCrossTag, 1);
        }

}
closeCross=()=>{
        console.log("this.state.crossdisplay",this.state.crossdisplay)
    if(this.state.crossdisplay === 'none'){
        this.setState({
            crossdisplay: ''
        })}
        else{
        this.setState({
            crossdisplay: 'none'
        })
        }
    }
    getposition=()=>{
        //todo  重新计算
        this.updateCross(this.state.picture.picture_cross_point)
        window.location.replace(window.location.href);
    }


    renderCross = ()=>{
            if(this.state.picture.picture_cross_point !== null){
                var xy =this.state.picture.picture_cross_point +""
                var x = parseInt(xy.split(",")[0])
                var y = parseInt(xy.split(",")[1])
                //console.log(this.state.picture.picture_cross_point)
                // var svg = document.getElementById('svgG');
                // var newcircle = document.createElementNS('http://www.w3.org/2000/svg', "circle");
                // newcircle.setAttribute("id", "cross");
                // newcircle.setAttribute("cx", x);
                // newcircle.setAttribute("cy", y);
                // newcircle.setAttribute("r", "3");
                // newcircle.setAttribute("fill", "red");
                // newcircle.setAttribute("stroke", "black");
                // newcircle.setAttribute("stroke-width", "1");
                // svg.appendChild(newcircle);
                return <circle id="cross" cx={x} cy={y} fill={"red"} strokeWidth={1} r={3} stroke={"black"} display={this.state.crossdisplay} />
            }
    }
    trans_str=(str)=>{
        if(str==="member"){
            return "人工标注"
        }else{
            return "AI检测"
        }
    }
    render() {
        //this.getTypeNumber();
        console.log(polygList)
        const columns = [{
            width: 160,
            title: '类型',
            dataIndex: 'damage_name',
            key: 'damage_name',
        }, {
            width: 160,
            title: '标注来源',
            dataIndex: 'author',
            key: 'author',
        }, {
            width: 160,
            title: '置信度',
            dataIndex: 'belief',
            key: 'belief',
        },
            {
                width: 160,
                title: '大小(mm)',
                dataIndex: 'lengths',
                key: 'belief',
            },

            {
                width: 160,
                title: '位置',
                dataIndex: 'flaw_positions',
                key: 'belief',
            },
        ];
        console.log(this.state.picture.picture_dir)
        const {getFieldDecorator} = this.props.form;
        //TODO 横轴
        const COLORS = ["#ED9D01", "#E4EE5D", "#0aff02", "#00CEA6", "#003CB1", "#b1000f"];
        const option = {
            xAxis: {
                type: 'category',
                data: ['气孔', '夹渣', '裂纹', '未熔合', '未焊透', '人工标注未确定'],
                axisTick: {
                    alignWithLabel: true
                },
                axisLabel: {
                    showMaxLabel: true,
                    interval: 0,
                    rotate: 40,
                },
            },
            yAxis: {
                type: 'value',
                minInterval: 1
            },
            series: [{
                data: this.getTypeNumber(),
                type: 'bar',
                barWidth: '20%',
                itemStyle: {
                    normal: {
                        color: item => {
                            return COLORS[item.dataIndex % (COLORS.length)]
                        }
                    }
                }
            }]

        }
        const a = this.getRandom()
        return (

            <div>
                <div>
                    <strong>标注工具</strong>
                    &emsp;<Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked
                                  onChange={this.changeToolsDisplay}></Switch>
                    <div className="labeltools" style={{display: this.state.labeltools}}>
                        <div style={{marginTop: "4px", marginLeft: "4px"}}>
                            <Button style={{marginLeft: "10px"}} onClick={this.polygonModel} size="small" type="primary"
                                    shape="round"><font size="2">(开/关)标注模式</font></Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button onClick={this.rePolygon} type="primary" size="small" shape="round"><font
                                size="2">重新画</font></Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button onClick={this.savetmpPolygon} type="primary" size="small" shape="round"><font
                                size="2">保存标注</font></Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button onClick={() => this.deletePolygon()} type="danger" size="small" shape="round"><font
                                size="2">删除标注</font></Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Select placeholder="请选择损伤类型" style={{width: 200}} size="small"
                                    defaultValue={this.state.damageType.damagetype_name}
                                    onChange={this.updateDamageTypeByselect}>
                                {this.state.damageTypeList.map((item, index) => {
                                    return <Option value={item.damagetype_id}>{item.damagetype_name}</Option>
                                })
                                }
                            </Select>
                            {/*&emsp;&emsp;<font size="2">缩放比例</font>*/}
                            {/*<InputNumber*/}
                            {/*    style={{width:"80px"}}*/}
                            {/*    defaultValue={100}*/}
                            {/*    min={100}*/}
                            {/*    max={500}*/}
                            {/*    step={20}*/}
                            {/*    formatter={(value) => `${value}%`}*/}
                            {/*    parser={(value) => value.replace('%', '')}*/}
                            {/*    onChange={this.changeZoom}*/}
                            {/*/>*/}
                        </div>
                    </div>
                </div>
                <br/>
                <div className="Legends">
                    <table width="800px">
                        <tr>
                            {
                                this.state.damageTypeList.map((item, index) => {
                                    return <td>
                                        <div className="LegendsDiv">
                                        <span className="LegendsDivSymbol"
                                              style={{color: this.getDamageTypeColor(item.damagetype_id)}}>■</span>
                                            <span className="LegendsDivText">&nbsp;{item.damagetype_name}</span>
                                        </div>
                                    </td>
                                })
                            }
                        </tr>
                    </table>
                </div>
                <div className="picManage">
                    {/*<div id="raw-view">*/}
                    {/*    <img className="tifImg"*/}
                    {/*         src={global.AppConfig.XrayDBIP + this.state.picture.picture_dir + "?rand=" + Math.random()}*/}
                    {/*         style={{width: 1000, height: 300}}/>*/}
                    {/*</div>*/}
                    <div className="svgpanel">
                        <img className="tifImg"
                             id="img111"
                             src={global.AppConfig.XrayDBIP + this.state.picture.picture_dir + "?rand=" + Math.random()}
                             style={{width: 1000, height: 300}}
                        crossOrigin="anonymous"/>
                        <canvas className="tifImg" id="canvans111" style={{width: 1000, height: 300}} ref={this.cannyEdgeRef} />
                        <svg
                            onMouseDown={this.mousedown}
                            onMouseMove={this.mousemove}
                            onMouseUp={this.mouseup}
                            // onMouseOver={this.mouseover
                            className="svgG" id="svgG" version="1.1" width="1000px" height="500px"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {this.renderCross()}
                            }
                            {
                                polygList.map((item, index) => {
                                        // let color = this.getDamageTypeColor(item.damage_type);
                                        // console.log(color);
                                        if (item.damage_type !== 6) {
                                            if (item.author !== '人工标注') {
                                                return <polygon onMouseLeave={this.closeDefectInfo(item)}
                                                                onMouseEnter={this.showDefectInfo(item)}
                                                                author={item.author}
                                                                style={{display: this.state.AIRectDisplay}} key={index}
                                                                id={item.id}
                                                                onMouseDownCapture={() => this.selectPolygon(item.id)}
                                                                textx={item.textx} texty={item.texty}
                                                                damage={item.damage_type}
                                                                points={item.points}
                                                                fill={this.getDamageTypeColor(item.damage_type)}
                                                                stroke="#0099CC" opacity={0.8}>
                                                </polygon>

                                            } else {
                                                return <polygon onMouseLeave={this.closeDefectInfo(item)}
                                                                onMouseEnter={this.showDefectInfo(item)}
                                                                author={item.author}
                                                                style={{display: this.state.rectDisplay}} key={index}
                                                                id={item.id}
                                                                onMouseDownCapture={() => this.selectPolygon(item.id)}
                                                                textx={item.textx} texty={item.texty}
                                                                damage={item.damage_type}
                                                                points={item.points}
                                                                fill={this.getDamageTypeColor(item.damage_type)}
                                                                stroke="red" opacity={0.8}>
                                                </polygon>

                                            }
                                        } else {
                                            return <polygon onMouseLeave={this.closeDefectInfo(item)}
                                                            onMouseEnter={this.showDefectInfo(item)} author={item.author}
                                                            tag={'hanfeng'}
                                                            style={{display: this.state.hanfengdisplay}} key={index}
                                                            id={item.id}
                                                            onMouseDownCapture={() => this.selectPolygon(item.id)}
                                                            textx={item.textx} texty={item.texty} damage={item.damage_type}
                                                            points={item.points}
                                                            fill={this.getDamageTypeColor(item.damage_type)}
                                                            stroke="red" opacity={0.3}>
                                            </polygon>
                                        }
                                    }
                                )
                            }


                            {<polygon onMouseOver={this.showDefectInfo()} points={this.state.polygonPoints}
                                      id="newPolygonByMember"
                                      fill="red" stroke="black"
                            />
                            }

                            {polygList.map((item, index) => {
                                if(item.damage_type!=6){
                                    var n_p = this.getNearestToCenterOfSVG(item.points)
                                    var r = this.judgeQuadrant(n_p)
                                    var x1 = index > 7 ? n_p[2] : n_p[0]
                                    var y1 = index > 7 ? n_p[3] : n_p[1]
                                    var rect_y = index > 7 ? 410 : 0
                                    index = index > 7 ? index - 8 : index;
                                    var rect_x = index * (120 + 5)
                                    var line_x = rect_x + 60
                                    var line_y = rect_y > 0 ? 410 : 80
                                    console.log("index" + index + " rect_x" + rect_x)
                                    if (item.author !== '人工标注') {

                                        return <>
                                            <line id={'line' + item.id} x1={x1} y1={y1} x2={line_x} y2={line_y}
                                                  stroke={"slategrey"} strokeWidth={2}
                                                  style={{display: this.state.drawDamageTypeDisplay}}/>
                                            <rect rx="5" ry="5" stroke-opacity="0.9" stroke="rgb(0,0,0)" strokeWidth="3"
                                                  opacity="0.5" style={{display: this.state.drawDamageTypeDisplay}}
                                                  fill="rgb(255,255,255)" id={'rect_info' + item.id} x={rect_x}
                                                  y={rect_y} width="120" height="90"/>
                                            <text style={{display: this.state.drawDamageTypeDisplay}} id={'text' + item.id}
                                                  key={'text' + index} damage={item.damage_type} fontSize="12">
                                                <tspan x={rect_x + 5}
                                                       y={rect_y + 12}>缺陷类型：{item.damage_name}</tspan>
                                                <tspan x={rect_x + 5}
                                                       y={rect_y + 12 + 12 + 5}>标注来源：{item.author}</tspan>
                                                <tspan x={rect_x + 5}
                                                       y={rect_y + 12 + 12 + 5 + 12 + 5}>置&ensp;信&ensp;度：{item.belief}
                                                </tspan>
                                                <tspan x={rect_x + 5}
                                                       y={rect_y + 12 + 12 + 5 + 12 + 5 + 12 + 5}>缺陷大小：{item.lengths+"mm"}
                                                </tspan>
                                                <tspan x={rect_x + 5}
                                                       y={rect_y + 12 + 12 + 5 + 12 + 5 + 12 + +12+5+5}>缺陷位置：{(item.flaw_positions)}
                                                </tspan>
                                            </text>
                                        </>
                                    } else {
                                        return <>
                                            <line id={'line' + item.id} x1={x1} y1={y1} x2={line_x} y2={line_y}
                                                  stroke={"slategrey"} strokeWidth={2}
                                                  style={{display: this.state.drawDamageTypeDisplay}}/>
                                            <rect rx="5" ry="5" stroke-opacity="0.9" stroke="rgb(0,0,0)" strokeWidth="3"
                                                  opacity="0.5" style={{display: this.state.drawDamageTypeDisplay}}
                                                  fill="rgb(255,255,255)" id={'rect_info' + item.id} x={rect_x}
                                                  y={rect_y} width="120" height="90"/>
                                            <text style={{display: this.state.drawDamageTypeDisplay}} id={'text' + item.id}
                                                  key={'text' + index} damage={item.damage_type} fontSize="12">
                                                <tspan x={rect_x + 5}
                                                       y={rect_y + 12}>缺陷类型：{item.damage_name}</tspan>
                                                <tspan x={rect_x + 5}
                                                       y={rect_y + 12 + 12 + 5}>标注来源：{item.author}</tspan>
                                                <tspan x={rect_x + 5}
                                                       y={rect_y + 12 + 12 + 5 + 12 + 5}>置&ensp;信&ensp;度：人工标注
                                                </tspan>
                                                <tspan x={rect_x + 5}
                                                       y={rect_y + 12 + 12 + 5 + 12 + 5 + 12 + 5}>缺陷大小：{item.lengths+"mm"}
                                                </tspan>
                                                <tspan x={rect_x + 5}
                                                       y={rect_y + 12 + 12 + 5 + 12 + 5 + 12 + +12+5+5}>缺陷位置：{(item.flaw_positions)}
                                                </tspan>
                                            </text>
                                        </>
                                    }

                                }
                                else {
                                    var n_p = this.getNearestToCOfSVG(item.points)
                                    var r = this.judgeQuadrant(n_p)
                                    var x1 = n_p[0]
                                    var y1 = n_p[1]
                                    var rect_y = 100
                                    var rect_x = 1000-120
                                    var line_x = rect_x + 60
                                    var line_y = rect_y + 40
                                    console.log("index" + index + " rect_x" + rect_x)
                                    if (item.author !== '人工标注') {

                                        return <>
                                            <line id={'line' + item.id} x1={x1} y1={y1} x2={line_x} y2={line_y}
                                                  stroke={"slategrey"} strokeWidth={2}
                                                  style={{display: this.state.hanfengdisplay}}/>
                                            <rect rx="5" ry="5" stroke-opacity="0.9" stroke="rgb(0,0,0)" strokeWidth="3"
                                                  opacity="0.5" style={{display: this.state.hanfengdisplay}}
                                                  fill="rgb(255,255,255)" id={'rect_info' + item.id} x={rect_x}
                                                  y={rect_y} width="120" height="40"/>
                                            <text style={{display: this.state.hanfengdisplay}} id={'text' + item.id}
                                                  key={'text' + index} damage={item.damage_type} fontSize="12">
                                                <tspan x={rect_x + 5}
                                                       y={rect_y + 12}>缺陷类型：{item.damage_name}</tspan>
                                                <tspan x={rect_x + 5}
                                                       y={rect_y + 12 + 12 +5}>标注来源：{item.author}</tspan>
                                                {/*<tspan x={rect_x + 5}*/}
                                                {/*       y={rect_y + 12 + 12 + 5 + 12 + 5}>置&ensp;信&ensp;度：人工标注*/}
                                                {/*</tspan>*/}
                                                {/*<tspan x={rect_x + 5}*/}
                                                {/*       y={rect_y + 12 + 12 + 5 + 12 + 5 + 12 + 5}>缺陷大小：{item.lengths+"mm"}*/}
                                                {/*</tspan>*/}
                                            </text>
                                        </>
                                    } else {
                                        return <>
                                            //todo
                                            <line id={'line' + item.id} x1={x1} y1={y1} x2={line_x} y2={line_y}
                                                  stroke={"slategrey"} strokeWidth={2}
                                                  style={{display: this.state.hanfengdisplay}}/>
                                            <rect rx="5" ry="5" stroke-opacity="0.9" stroke="rgb(0,0,0)" strokeWidth="3"
                                                  opacity="0.5" style={{display: this.state.hanfengdisplay}}
                                                  fill="rgb(255,255,255)" id={'rect_info' + item.id} x={rect_x}
                                                  y={rect_y} width="120" height="40"/>
                                            <text style={{display: this.state.hanfengdisplay}} id={'text' + item.id}
                                                  key={'text' + index} damage={item.damage_type} fontSize="12">
                                                <tspan x={rect_x + 5}
                                                       y={rect_y + 12}>缺陷类型：{item.damage_name}</tspan>
                                                <tspan x={rect_x + 5}
                                                       y={rect_y + 12 + 12 +5}>标注来源：{item.author}</tspan>
                                                {/*<tspan x={rect_x + 5}*/}
                                                {/*       y={rect_y + 12 + 12 + 5 + 12 + 5}>置&ensp;信&ensp;度：人工标注*/}
                                                {/*</tspan>*/}
                                                {/*<tspan x={rect_x + 5}*/}
                                                {/*       y={rect_y + 12 + 12 + 5 + 12 + 5 + 12 + 5}>缺陷大小：{item.lengths+"mm"}*/}
                                                {/*</tspan>*/}
                                            </text>
                                        </>
                                    }
                                }

                            })
                            };

                            {/*{polygList.map((item, index) => {*/}
                            {/*    return <text style={{display: this.state.AIDamageBeliefDisplay}} id={'text' + item.id}*/}
                            {/*                 key={'text' + index} damage={item.damage_type} x={item.textx + 10}*/}
                            {/*                 y={item.texty - 3}>{item.belief}</text>*/}
                            {/*})*/}
                            {/*};*/}
                        </svg>


                    </div>
                </div>

                <div className="defectInfo">
                    <div style={{textAlign: "center"}}>
                        <br/>
                        <img src={tools} width="20px" height="20px"/>
                        <strong><font size={3}> AI检测 </font></strong>
                    </div>
                    <br/>
                    &emsp;图片调整：
                    <Button type="primary" onClick={this.HorizatalFlipPicture}>水平翻转</Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&emsp;
                    <Button type="primary" onClick={this.VerticalFlipPicture}>垂直翻转</Button>
                    <br/>
                    <br/>
                    &emsp;校准准星：
                    <Button onClick={this.setCross}> 校准准星</Button>&emsp;&emsp;
                    <Button onClick={this.closeCross}> 隐藏/显示准星</Button>&emsp;&emsp;
                    <br/>
                    <br/>
                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<Button onClick={this.getposition}> 重新计算</Button>
                    <br/>
                    <br/>
                    &emsp;AI &nbsp;检测 &nbsp;：
                    <Button onClick={this.AIprocess}>AI检测</Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&emsp;&emsp;
                    <Button type="danger" onClick={this.deletePolygon}>删除AI检测框</Button>
                    <br/>
                    <div style={{textAlign: "center"}}>
                        <br/>
                        <img src={tools} width="20px" height="20px"/>
                        <strong><font size={3}> 工&nbsp;具 </font></strong>
                    </div>
                    <br/>
                    &emsp;图像增强：
                    <Button onClick={this.imgEnhance}>对比度增强</Button>&emsp;
                    <Button onClick={this.imgCanyEnhance}>文字增强</Button>
                    <br/>
                    {/*<br/>*/}
                    {/*&emsp;报告功能：*/}
                    {/*<Button onClick={() => this.generateReport()}>生成报告</Button>*/}
                    {/*<br/>*/}
                    <br/>
                    &emsp;信息展示：
                    {/*<Button onClick={()=>this.deleteRect(clickRectClor)}>删除矩形框</Button>*/}
                    {/*    &nbsp;&nbsp;&nbsp;&nbsp;*/}
                    <Button onClick={this.changeRectDisplay}>关闭/开启人工标注</Button>
                    <br/>
                    <br/>
                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<Button onClick={this.changeAIRectDisplay}>关闭/开启AI检测框</Button>
                    <br/>
                    <br/>
                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<Button
                    onClick={this.changeDamageTypeDisplay}>关闭/开启损伤信息</Button>
                    <br/>
                    <br/>
                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<Button onClick={this.changehanfengDisplay}>关闭/开启焊缝显示</Button>
                    <br/><br/>
                    &emsp;确认标注：
                    <Button type="primary" onClick={() => this.sendToApitest()}>标注完成</Button>
                </div>
                    <div className="defectInfoUtils">
                        <Button onClick={this.getUpPagePicture}>上一张</Button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button onClick={this.getNextPagePicture}>下一张</Button>
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
                <div className="Utils">
                    <div className="info">
                        <Divider>缺陷详细信息<p align="center" style={{fontWeight: "bold"}}>共 {hanfenglist.length} 条记录</p>
                        </Divider>
                        <div className="infoTable">
                            <Table
                                style={{ wordBreak: "break-all"}}
                                pagination={false}
                                rowClassName={this.getRowClassName}
                                onRow={(record, index) => ({
                                    onClick: () => {
                                        this.tableDown(record, index);
                                    },
                                    onMouseEnter: () => {
                                        this.showDefectInfoBytable(record)
                                    },
                                    onMouseLeave: () => {
                                        this.closeDefectInfoforTable(record)
                                    }
                                })}
                                columns={columns}
                                dataSource={hanfenglist}
                                scroll={{
                                    x: 'max-content',
                                    y: '200px'}}

                                // onChange={this.handleChange}
                                // rowKey="log_id"
                            />
                        </div>
                        <div className="infoChart">
                            <EChartsReact option={option}/>
                        </div>

                    </div>
                    <div className="pageUtils">
                        {/*<div style={{textAlign: "center"}}>*/}
                        {/*    <Button onClick={this.getUpPagePicture}>上一张</Button>*/}
                        {/*    &nbsp;&nbsp;&nbsp;&nbsp;*/}
                        {/*    <Button onClick={this.getNextPagePicture}>下一张</Button>*/}
                        {/*</div>*/}
                        <Divider>确认影像图信息</Divider>
                        <Form layout="vertical" onSubmit={this.handleSubmit}>
                            <Row gutter={21}>
                                <Col span={3}>
                                    <Form.Item label="焊缝名称" style={{display: true}}>
                                        {getFieldDecorator('picture_hanfeng_name', {
                                            rules: [{required: true, message: '请输入焊缝名称'}],
                                            initialValue: this.state.picture.picture_hanfeng_name,
                                        })(<Input placeholder="焊缝名称" />)}
                                    </Form.Item>
                                </Col>

                                <Col span={3}>
                                    <Form.Item label="焊接编号" style={{display: true}}>
                                        {getFieldDecorator('picture_hanfeng_number', {
                                            rules: [{required: true, message: '请输入焊接编号'}],
                                            initialValue: this.state.picture.picture_hanfeng_number,
                                        })(<Input placeholder="焊接编号" />)}
                                    </Form.Item>
                                </Col>
                                <Col span={3}>
                                    <Form.Item label="焊接方法" style={{display: true}}>
                                        {getFieldDecorator('picture_hanfeng_method', {
                                            rules: [{required: true, message: '请输入焊接方法'}],
                                            initialValue: this.state.picture.picture_hanfeng_method,
                                        })(<Input placeholder="焊接方法" />)}
                                    </Form.Item>
                                </Col>
                                <Col span={3}>
                                    <Form.Item label="板厚(几何尺寸)">
                                        {getFieldDecorator('picture_thickness', {
                                            rules: [{required: true, message: '请输入板厚'}],
                                            initialValue: this.state.picture.picture_thickness,
                                        })(<Input placeholder="板厚"/>)}
                                    </Form.Item>
                                </Col>
                                <Col span={3}>
                                    <Form.Item label="坡口形式">
                                        {getFieldDecorator('picture_bevel_form', {
                                            rules: [{required: true, message: '请输入坡口形式'}],
                                            initialValue: this.state.picture.picture_bevel_form,
                                        })(<Input placeholder="坡口形式"/>)}
                                    </Form.Item>
                                </Col>

                                <Col span={3}>
                                    <Form.Item label="材料牌号">
                                        {getFieldDecorator('picture_material_number', {
                                            rules: [{required: true, message: '请输入材料牌号'}],
                                            initialValue: this.state.picture.picture_material_number,
                                        })(<Input placeholder="材料牌号"/>)}
                                    </Form.Item>
                                </Col>

                                <Col span={3}>
                                    <Form.Item label="焊缝长度">
                                        {getFieldDecorator('picture_hanfeng_length', {
                                            rules: [{required: true, message: '请输入焊缝长度'}],
                                            initialValue: this.state.picture.picture_hanfeng_length,
                                        })(<Input placeholder="焊缝长度"/>)}
                                    </Form.Item>
                                </Col>

                                <Col span={3}>
                                    <Form.Item label="检测长度">
                                        {getFieldDecorator('picture_hanfeng_testlength', {
                                            rules: [{required: true, message: '请输入检测长度'}],
                                            initialValue: this.state.picture.picture_hanfeng_testlength,
                                        })(<Input placeholder="检测长度"/>)}
                                    </Form.Item>
                                </Col>

                                <Col span={3}>
                                    <Form.Item label="检测比例%">
                                        {getFieldDecorator('picture_testing_rate', {
                                            rules: [{required: true, message: '请输入检测比例'}],
                                            initialValue: this.state.picture.picture_testing_rate,
                                        })(<Input placeholder="检测比例"/>)}
                                    </Form.Item>
                                </Col>
                                {/*<Col span={4}>*/}
                                {/*    <Form.Item label="影像图id" style={{display: "none"}}>*/}
                                {/*        {getFieldDecorator('picture_id', {*/}
                                {/*            rules: [{required: true, message: '影像图id'}],*/}
                                {/*            initialValue: this.state.picture.picture_id,*/}
                                {/*        })(<Input placeholder="影像图id" disabled={"true"}/>)}*/}
                                {/*    </Form.Item>*/}
                                {/*</Col>*/}
                                {/*<Col span={4}>*/}
                                {/*    <Form.Item label="合格级别">*/}
                                {/*        {getFieldDecorator('picture_qualifylevel', {*/}
                                {/*            rules: [{required: true, message: '合格级别'}],*/}
                                {/*            initialValue: this.state.picture.picture_qualifylevel,*/}
                                {/*        })(<Input placeholder="合格级别"/>)}*/}
                                {/*    </Form.Item>*/}
                                {/*</Col>*/}
                                {/*<Col span={4}>*/}
                                {/*    <Form.Item label="检测方法">*/}
                                {/*        {getFieldDecorator('picture_testmethod', {*/}
                                {/*            rules: [{required: true, message: '请输入检测方法'}],*/}
                                {/*            initialValue: "RT",*/}
                                {/*        })(<Input placeholder="检测方法"/>)}*/}
                                {/*    </Form.Item>*/}
                                {/*</Col>*/}
                                {/*<Col span={4}>*/}
                                {/*    <Form.Item label="检测标准">*/}
                                {/*        {getFieldDecorator('picture_teststandard', {*/}
                                {/*            rules: [{required: true, message: '请输入检测标准'}],*/}
                                {/*            initialValue: this.state.picture.picture_teststandard == null ? (this.state.requisition.requisition_last_teststandard == null ? this.state.requisition.requisition_testingstandard : this.state.requisition.requisition_last_teststandard) : this.state.picture.picture_teststandard,*/}
                                {/*        })(*/}
                                {/*            <Select placeholder="检测标准">*/}
                                {/*                {*/}
                                {/*                    this.state.pictureTeststandard.map(function (value, key) {*/}
                                {/*                        return <option key={value}>{value}</option>*/}
                                {/*                    })*/}
                                {/*                }*/}
                                {/*            </Select>*/}
                                {/*        )}*/}
                                {/*    </Form.Item>*/}
                                {/*</Col>*/}
                                {/*<Col span={4}>*/}
                                {/*    <Form.Item label="评定级别">*/}
                                {/*        {getFieldDecorator('picture_level', {*/}
                                {/*            rules: [{required: true, message: '请输入评定级别'}],*/}
                                {/*            initialValue: this.state.picture.picture_level,*/}
                                {/*        })(*/}
                                {/*            <Select placeholder="评定级别">*/}
                                {/*                {*/}
                                {/*                    this.state.pictureLevel.map(function (value, key) {*/}
                                {/*                        return <option key={value}>{value}</option>*/}
                                {/*                    })*/}
                                {/*                }*/}
                                {/*            </Select>*/}
                                {/*        )}*/}
                                {/*    </Form.Item>*/}
                                {/*</Col>*/}
                                <Col span={3}>
                                <Form.Item label="底片长度">
                                    {getFieldDecorator('picture_real_width', {
                                        rules: [{required: true, message: '请选择底片长度'}],
                                        initialValue: this.state.picture.picture_real_width,
                                    })(<Select placeholder="底片长度">
                                        <option key={300}>300</option>
                                        <option key={360}>360</option>
                                    </Select>)}
                                </Form.Item>
                            </Col>
                            <Col span={3}>
                                <Form.Item label="底片黑度">
                                    {getFieldDecorator('picture_density', {
                                        rules: [{required: true, message: '请输入底片黑度'}],
                                        initialValue: this.state.picture.picture_density,
                                    })(<Input placeholder="底片黑度"/>)}
                                </Form.Item>
                            </Col>

                            <Col span={3}>
                                <Form.Item label="像质指数">
                                    {getFieldDecorator('picture_quality', {
                                        rules: [{required: true, message: '像质指数'}],
                                        initialValue: this.state.picture.picture_quality,
                                    })(<Input placeholder="像质指数"/>)}
                                </Form.Item>
                            </Col>
                                {/*<Col span={6}>*/}
                                {/*    <br/>*/}
                                {/*    <br/>*/}
                                {/*<strong>注:更新底片长度后，需重新进行AI检测和人工标注</strong></Col>*/}
                                <Col span={3}>
                                    <Form.Item label="影像图编号" style={{display: "none"}}>
                                        {getFieldDecorator('picture_number', {
                                            rules: [{required: true, message: '请输入焊接编号'}],
                                            initialValue: this.state.picture.picture_number,
                                        })(<Input placeholder="影像图编号" />)}
                                    </Form.Item>
                                </Col>

                                {/*<Col span={4} style={{display: "none"}}>*/}
                                {/*    <Form.Item label="picture_AIresult">*/}
                                {/*        {getFieldDecorator('picture_AIresult', {*/}
                                {/*            rules: [{required: true, message: 'picture_AIresult'}],*/}
                                {/*            initialValue: this.state.picture.picture_AIresult,*/}
                                {/*        })(<Input placeholder="picture_AIresult" disabled={"true"}/>)}*/}
                                {/*    </Form.Item>*/}
                                {/*</Col>*/}
                                <Col span={3} style={{display: "none"}}>
                                    <Form.Item label="picture_requisition_id">
                                        {getFieldDecorator('picture_requisition_id', {
                                            rules: [{required: true, message: 'picture_requisition_id'}],
                                            initialValue: this.state.picture.picture_requisition_id,
                                        })(<Input placeholder="picture_requisition_id" disabled={"true"}/>)}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider/>
                            <Row gutter={21}>
                                {/*<Col span={4}>*/}
                                {/*    <Form.Item label="接头形式">*/}
                                {/*        {getFieldDecorator('picture_jointform', {*/}
                                {/*            rules: [{required: true, message: '请输入接头形式'}],*/}
                                {/*            initialValue: this.state.picture.picture_jointform,*/}
                                {/*        })(<Input placeholder="接头形式"/>)}*/}
                                {/*    </Form.Item>*/}
                                {/*</Col>*/}
                                {/*<Col span={4}>*/}
                                {/*    <Form.Item label="影像图的长">*/}
                                {/*        {getFieldDecorator('picture_width', {*/}
                                {/*            rules: [{required: true, message: '影像图的长'}],*/}
                                {/*            initialValue: this.state.picture.picture_width,*/}
                                {/*        })(<Input placeholder="影像图的长" disabled={"true"}/>)}*/}
                                {/*    </Form.Item>*/}
                                {/*</Col>*/}
                                {/*<Col span={4}>*/}
                                {/*    <Form.Item label="影像图的高">*/}
                                {/*        {getFieldDecorator('picture_height', {*/}
                                {/*            rules: [{required: true, message: '影像图的高'}],*/}
                                {/*            initialValue: this.state.picture.picture_height,*/}
                                {/*        })(<Input placeholder="影像图的高" disabled={"true"}/>)}*/}
                                {/*    </Form.Item>*/}
                                {/*</Col>*/}
                                <Col span={3}>
                                <Form.Item label="影像图存放路径">
                                    {getFieldDecorator('picture_dir', {
                                        rules: [{required: true, message: '请输入影像图存放路径'}],
                                        initialValue: this.state.picture.picture_dir,
                                    })(<Input placeholder="影像图存放路径" disabled={"true"}/>)}
                                </Form.Item>
                            </Col>
                                <Col span={3}>
                                    <Form.Item label="焊接人">
                                        {getFieldDecorator('picture_welding_operator', {
                                            rules: [{required: true, message: '焊接人'}],
                                            initialValue: this.state.picture.picture_welding_operator,
                                        })(<Input placeholder="焊接人"/>)}
                                    </Form.Item>
                                </Col>

                                <Col span={3}>
                                    <Form.Item label="录入时间">
                                        {getFieldDecorator('picture_entrytime', {
                                            rules: [{required: true, message: '请输入录入时间'}],
                                            initialValue: this.state.picture.picture_entrytime,
                                        })(<Input placeholder="录入时间"/>)}
                                    </Form.Item>
                                </Col>

                                <Col span={3}>
                                    <Form.Item label="检测部位以及说明">
                                        {getFieldDecorator('picture_parts_Introductions', {
                                            rules: [{required: true, message: '请输入检测部位以及说明'}],
                                            initialValue: this.state.picture.picture_parts_Introductions,
                                        })(<TextArea placeholder="请输入检测部位以及说明"/>)}
                                    </Form.Item>
                                </Col>
                                <Col span={3}>
                                    <Form.Item label="检测结论">
                                        {getFieldDecorator('picture_conclusion', {
                                            rules: [{required: true, message: '检测结论'}],
                                            initialValue: this.state.picture.picture_conclusion,
                                        })(<Input placeholder="检测结论"/>)}
                                    </Form.Item>
                                </Col>
                            </Row>
                            {/*<Row gutter={20}>*/}
                            {/*<Col span={4}>*/}
                            {/*    <Form.Item label="影像图存放路径">*/}
                            {/*        {getFieldDecorator('picture_dir', {*/}
                            {/*            rules: [{required: true, message: '请输入影像图存放路径'}],*/}
                            {/*            initialValue: this.state.picture.picture_dir,*/}
                            {/*        })(<Input placeholder="影像图存放路径" disabled={"true"}/>)}*/}
                            {/*    </Form.Item>*/}
                            {/*</Col>*/}
                            {/*<Col span={4}>*/}
                            {/*    <Form.Item label="检测部位以及说明">*/}
                            {/*        {getFieldDecorator('picture_parts_Introductions', {*/}
                            {/*            rules: [{required: true, message: '请输入检测部位以及说明'}],*/}
                            {/*            initialValue: this.state.picture.picture_parts_Introductions,*/}
                            {/*        })(<TextArea placeholder="请输入检测部位以及说明"/>)}*/}
                            {/*    </Form.Item>*/}
                            {/*</Col>*/}
                            {/*</Row>*/}
                            {/*<br/><br/>*/}
                            <Divider>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">更新影像图信息</Button>
                                    </Form.Item>
                            </Divider>
                        </Form>
                    </div>


                </div>
            </div>
        );
    }
}


const PictureManager = Form.create()(PictureManage);
export default PictureManager;