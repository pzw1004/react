import React, { Component } from 'react';
import './App.css';
import {Layout, Menu, } from 'antd';
import HeaderCustom from 'components/common/HeaderCustom'
import FooterCustom from 'components/common/FooterCustom'
import BreadcrumbCustom from 'components/common/BreadcrumbCustom'
import SiderCustom from "./components/common/SiderCustom";

const {Content, } = Layout;

class App extends Component {
  render() {
    return (
        <Layout>
            <HeaderCustom/>
            <Content style={{ padding: '0 50px' }}>
                <BreadcrumbCustom/>
                <Layout style={{ padding: '24px 0', background: '#fff' }}>
                   <SiderCustom/>
                    <Content style={{ padding: '0 24px', minHeight: 280 }}>
                        Content
                    </Content>
                </Layout>
            </Content>
            <FooterCustom/>
        </Layout>

    );
  }
}

export default App;
