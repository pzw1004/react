import React, { Component } from 'react';
import { Route,Switch,Redirect } from "react-router-dom";
import '../../App.css';
import  "babel-polyfill";
import {Layout, } from 'antd';
import { Divider } from 'antd';

import HeaderCustom from './HeaderCustom'
import FooterCustom from './FooterCustom'
import BreadcrumbCustom from './BreadcrumbCustom'
import SiderCustom from "./SiderCustom";
import MemberList from '../member/MemberList'
import PersonalPage from '../personalpage/PersonalPage'
import AddPictureList from '../requisition/AddPictureList'
import RequisitionList from '../requisition/RequisitionList'
import AddRequisition from '../requisition/AddRequisition'
import Statistics from '../requisition/Statistics'
import Member_update from '../member/member_update/Member_update'
import PictureManage from '../picture/PictureManage'
import PrintReport from '../../components/requisition/printResult/PrintReport'
import LogList from '../log/LogList'
import NoMatch from './Nomatch'
import Index from '../../components/index/Index'
import Setting from '../setting/Setting'
import Signature from '../personalpage/Signature'
import '../../assets/css/index.css'
import productManage from "../product/productManage";
const {Content, } = Layout;

class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            test: 'ceshi',
            collapsed: false,
            msg: '我是父类的消息',
            theme: 'dark',
        };
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,

        });
    };




    render() {

      if(sessionStorage.getItem("temp_user") === null){
          return <Redirect to="/login"/>
      }


    return (

        <div  className="indexCustom" >
        <Layout  style={{minHeight: '100vh'}}>
            <SiderCustom  collapsed={this.state.collapsed} AppObj={this}/>
            {/*<Content style={{ padding: '0 50px' }}>*/}
                <Layout style={{ padding: '0 16px', background: '#fff' }}>
                    {/*<BreadcrumbCustom/>*/}
                    <HeaderCustom   collapsed={this.state.collapsed} toggle={this.toggle} message={this.state.msg} AppObj={this}/>
                    <Divider orientation="left"></Divider>
                    <div key={this.props.location.key}>
                    <Content style={{ margin: '15px 16px', padding: 0, background: '#fff', minHeight: '140vh' }}>
                        <Switch>
                            <Route exact path="/app" component={Index}/>
                            <Route exact path="/app/member" component={MemberList}/>
                            <Route exact path="/app/requisition/:product_id" component={RequisitionList}/>
                            <Route exact path="/app/addRequisition" component={AddRequisition}/>
                            <Route exact path="/app/addPictureList" component={AddPictureList}/>
                            <Route exact path="/app/signature" component={Signature}/>
                            <Route exact path="/app/Statistics" component={Statistics}/>
                            <Route exact path="/app/log" component={LogList}/>
                            <Route exact path="/app/memberUpdate/:member_id" component={Member_update} />
                            <Route exact path="/app/personalPage" component={PersonalPage} />
                            <Route exact path="/app/pictureManage/:picture_id" component={PictureManage} />
                            <Route exact path="/app/settings" component={Setting}/>

                            <Route exact path="/app/productManage" component={productManage}/>
                            <Route component={NoMatch}/>
                        </Switch>
                    </Content>
                    </div>
                    {/*<FooterCustom/>*/}
                </Layout>

        </Layout>
        </div>
    );
  }
}

export default App;
