import React, { Component } from 'react';

import {Layout, } from 'antd';

const {Footer} = Layout;

class FooterCustom extends Component {
    render() {
        return (
            <Footer style={{ textAlign: 'center' }}>
                工业探伤检测系统 ©2019 Created by TJU A214
            </Footer>

        );
    }
}

export default FooterCustom;