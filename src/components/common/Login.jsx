import {
    Form, Icon, Input, Button, Checkbox,
} from 'antd';
import React, { Component } from 'react';
import '../../assets/css/login.css'
import { Redirect } from "react-router-dom";
import axios from "axios";
import '../../config/config'
import Background from '../../assets/images/login1.jpg';

class NormalLoginForm extends Component {

    constructor(props){

        super(props);
        this.state={
            member: null,
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);

                this.requestLogin(values);
                console.log('-----------'+this.state.member+'-----------------')

            }
        });
    };

    requestLogin=(member)=>{
        let api = global.AppConfig.serverIP+'/login';
        axios.post(api,member)
            .then((response)=> {
                console.log(response);
                console.log(JSON.stringify(response.data));
                this.setState({
                    member: response.data,
                });

                if(this.state.member!==null&&this.state.member!==""){

                    sessionStorage.setItem('temp_user',JSON.stringify(this.state.member));
                    let that =this;
                    that.props.history.push({pathname:'/app',state:this.state.member});

                }else {
                    alert("登录账户或密码错误，请重新输入");
                }

            })
            .catch( (error)=> {
                console.log("this is error!!!!!!!!!!!");
                console.log(error);
            });

    }

    render() {

        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login-div" >
            <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                    {getFieldDecorator('member_username', {
                        rules: [{ required: true, message: '请输入用户名!' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('member_password', {
                        rules: [{ required: true, message: '请输入密码!' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        登  录
                    </Button>
                    {/*Or <a href="">登录</a>*/}
                </Form.Item>
            </Form>
            </div>
        );
    }
}

const Login = Form.create({ name: 'normal_login' })(NormalLoginForm);

export default Login;