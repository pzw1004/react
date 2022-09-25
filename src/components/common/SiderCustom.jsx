import React, { Component } from 'react';
import {  Link, } from "react-router-dom";
import {Button, Divider, Icon, InputNumber, Layout, Menu, Pagination, Switch, Table} from 'antd';
import Setting from "../setting/Setting";
import axios from "axios";
import RequisitionList from "../requisition/RequisitionList";
import './SiderCustom.css'

const {Sider,} = Layout;
const { SubMenu } = Menu;
class SiderCustom extends Component {

    constructor(props){
        super(props);
        this.state = {
            current_iter: 0,
            collapsed: null,
            theme: 'dark',
            productList: [],
            username: null,
            password: null,
            authority: null,
            display: 'none',
        };
    }


    componentWillMount() {

        /*根据权限改变前端页面的状态展示
        * */
        let temp_dispaly = 'none';
        if(JSON.parse(sessionStorage.getItem("temp_user")).member_role==1){
            temp_dispaly = 'true';
        }
        this.getProductlist()
        this.setState({
            username: JSON.parse(sessionStorage.getItem("temp_user")).member_username,
            authority: JSON.parse(sessionStorage.getItem("temp_user")).member_role,
            display: temp_dispaly,
        })
    }

getProductlist=()=>{
    let api = global.AppConfig.serverIP+'/getAllProduct';
    axios.get(api)
        .then((response)=>{
            console.log(response);
            this.setState({
                productList: response.data,
            })
        })
        .catch( (error) =>{
            console.log(error);
        });

}
changeCurrentIter=(iter)=>{
        this.setState({
            current_iter:iter -1,
        })
}

    render() {
        const  current_iter = this.state.current_iter
        let max_iter = Math.ceil(this.state.productList.length /5) - 1
        if( (this.state.productList.length %5)>0){
            max_iter=max_iter+1;
        }
        console.log("current_iter"+current_iter)
        return (

            <Sider
                   // breakpoint="lg"
                   width={180} style={{ background: '#fff' ,position:"inherit"}} trigger={null}
                   collapsible
                   collapsed={this.props.collapsed}>
                <Menu
                    theme={this.props.AppObj.state.theme}
                    mode="inline"
                    // defaultSelectedKeys={['1']}
                    // defaultOpenKeys={['sub1']}
                    style={{ height: '100%' }}
                >

                    <Menu.Item key="0"><Icon type="profile" theme="twoTone" />首页<Link to="/app"></Link></Menu.Item>
                    <SubMenu key="sub1" title={<span><Icon type="profile" theme="twoTone" /><span>申请单处理</span></span>}>

                        <SubMenu style={{marginLeft: '32px'}}mode="vertical" key="1" onTitleClick={this.getProductlist} title={<span>查看申请信息</span>}>

                          {/*<Menu.Item key='11' style={{height: "auto" , "white-space": "break-spaces","line-height":"18px"}} ><Link to="/app/requisition" ><span>大船头啊啊啊啊啊啊啊红红火火恍恍惚惚哈哈哈哈</span></Link></Menu.Item>*/}
                          {/*<Menu.Item key='12'><span>船身</span></Menu.Item>*/}
                          {/*<Menu.Item key='13'><span>船尾</span></Menu.Item>*/}
                            {
                                this.state.productList.map((item,index)=>{
                                    let id = item.product_id
                                    let link =  "/app/requisition/" + id
                                    let linkParams = {
                                        pathname: link,
                                        state: { product_id: 1 },
                                    }
                                    if(index>=current_iter*5&&index<(current_iter+1)*5){
                                        return <Menu.Item key={10+ index}><span>{item.product_name}</span>
                                            <Link to={linkParams} component={RequisitionList}></Link></Menu.Item>
                                    }
                                })

                        }

                        <Menu.Divider></Menu.Divider>
                            {/*<font size="1" color="white">page</font>*/}
                            <div style={{marginLeft: '24px',marginTop:'10px',marginBottom:'10px'}}>
                            {/*<Button size="small" shape="circle" icon="caret-up" type="primary"></Button>&nbsp;*/}

                            {/*<font size="1">当前页码:{current_iter+1}</font>&nbsp;*/}
                                <InputNumber width="10px" size="small" min={1} max={max_iter} defaultValue={1} onChange={this.changeCurrentIter} />
                                <strong> / {max_iter}</strong>
                            {/*<Button size="small" shape="circle" icon="caret-down" type="primary" onClick={()=>{*/}
                            {/*    this.setState({*/}
                            {/*        current_iter:current_iter+1*/}
                            {/*    })*/}
                            {/*}}></Button>*/}
                        </div>
                        </SubMenu>
                        <Menu.Item key="2"><Link to="/app/addRequisition" ><span>增加新申请单</span></Link></Menu.Item>
                        <Menu.Item key="3"><Link to="/app/addPictureList" ><span>导入影像图</span></Link></Menu.Item>
                        {/*<Menu.Item key="4"><Link to="/app/Statistics"><span>统计信息</span></Link></Menu.Item>*/}
                        {/*<Menu.Item key="2"><Link to="/printReport" target="_blank">测试弹出</Link></Menu.Item>*/}
                        {/*<Menu.Item key="2"><Link to="/app/test">增加申请单</Link></Menu.Item>*/}
                        {/*<Menu.Item key="3">批量导入影像图</Menu.Item>*/}
                    </SubMenu>

                    <SubMenu key="sub4" style={{display: (this.state.display)}} title={<span><Icon type="contacts" theme="twoTone" /><span>成员管理</span></span>}>
                        <Menu.Item key="13"><Link to="/app/member"><span>查看成员列表</span></Link></Menu.Item>
                    </SubMenu>

                    <SubMenu key="sub5" title={<span><Icon type="file" theme="twoTone" /><span>日志管理</span></span>}>
                        <Menu.Item key="17"><Link to="/app/log"><span>查看日志列表</span></Link></Menu.Item>
                    </SubMenu>

                    <SubMenu key="sub2" title={<span><Icon type="idcard" theme="twoTone" /><span>个人信息管理</span></span>}>
                        <Menu.Item key="5" ><Link to="/app/personalPage"><span>个人信息</span></Link></Menu.Item>
                        <Menu.Item key="6" ><Link to="/app/signature"><span>电子签名</span></Link></Menu.Item>
                    </SubMenu>

                    <SubMenu key="sub3" title={<span><Icon type="notification" theme="twoTone"/><span>模型训练</span></span>}>
                        <Menu.Item><Link to="/app/settings" ><span>训练信息</span></Link></Menu.Item>
                    </SubMenu>


                </Menu>
            </Sider>

        );
    }
}

export default SiderCustom;