import React, { Component } from 'react';
import {  Link, } from "react-router-dom";
import {Icon, Layout,Menu ,Switch} from 'antd';
import Setting from "../setting/Setting";



const {Sider,} = Layout;
const { SubMenu } = Menu;

class SiderCustom extends Component {

    constructor(props){
        super(props);
        this.state = {
            collapsed: null,
            theme: 'dark',

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

        this.setState({
            username: JSON.parse(sessionStorage.getItem("temp_user")).member_username,
            authority: JSON.parse(sessionStorage.getItem("temp_user")).member_role,
            display: temp_dispaly,
        })



    }




    render() {

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


                    <SubMenu key="sub1" title={<span><Icon type="profile" theme="twoTone" /><span>申请单处理</span></span>}>
                        <Menu.Item key="0"><Link to="/app">首页</Link></Menu.Item>
                        <SubMenu key="1" title={<Link to="/app/requisition" ><span>查看申请信息</span></Link>}>
                          <Menu.Item key='11' style={{height: "auto" , "white-space": "break-spaces","line-height":"18px"}} ><Link to="/app/requisition" ><span>超级无敌厉害的大船头啊啊啊啊啊啊啊红红火火恍恍惚惚哈哈哈哈</span></Link></Menu.Item>
                          <Menu.Item key='12'><span>船身</span></Menu.Item>
                          <Menu.Item key='13'><span>船尾</span></Menu.Item>
                        </SubMenu>
                        <Menu.Item key="2"><Link to="/app/addRequisition" ><span>增加新申请单</span></Link></Menu.Item>
                        <Menu.Item key="3"><Link to="/app/addPictureList" ><span>导入影像图</span></Link></Menu.Item>
                        <Menu.Item key="4"><Link to="/app/Statistics"><span>统计信息</span></Link></Menu.Item>
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
                    </SubMenu>

                    <SubMenu key="sub3" title={<span><Icon type="notification" theme="twoTone"/><span>系统</span></span>}>
                        <Menu.Item><Link to="/app/settings" ><span>设置</span></Link></Menu.Item>
                    </SubMenu>


                </Menu>
            </Sider>

        );
    }
}

export default SiderCustom;