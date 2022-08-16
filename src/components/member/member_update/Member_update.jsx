import {
    Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, Radio,
} from 'antd';
import React, { Component } from 'react';
import '../../../config/config'
import axios from "axios";
import { Redirect } from "react-router-dom";
import './memberUpdate.css'
import saveLoginInfo from '../../../utils/saveLogInfo'

const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;
const RadioGroup = Radio.Group;


class RegistrationForm extends Component {

    constructor(props){
        super(props);

        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
            member_id: '',
            member: {
                member_id: '',
                member_name: '',
                member_username: '',
                member_password: '',
                member_role: '',
                member_jointime: '',
                member_number: '',
                member_sex: '',
                member_phone: '',
                member_address: '',
            },
            updateState: 0,  // 定义当前页面提交状态，0表示当前页面没有提交，1时为提交

    };

    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);

                this.updateMember(values);
            }
        });
    }


    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('member_password')) {
            callback('两次密码输入不一致!');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    handleWebsiteChange = (value) => {
        let autoCompleteResult;
        if (!value) {
            autoCompleteResult = [];
        } else {
            autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
        }
        this.setState({ autoCompleteResult });
    }

    componentWillMount() {

      // console.log(this.props.match.params.id);  // 取出通过路由传递的值，可以在前端web浏览器输出父组件的props查看对象定义
       let member_id = this.props.match.params.member_id;
       this.getMember(member_id);


    }

    getMember=(member_id)=>{

        /**使用axios将value表单信息发送到后端
         * */
        let api = global.AppConfig.serverIP + '/getMemberById?member_id='+ member_id;
        axios.post(api)
            .then((response)=> {
                console.log(response);
                console.log(JSON.stringify(response.data));
                //this.props.MemberList.run();
                this.setState({
                    member: response.data,
                })
            })
            .catch( (error)=> {
                console.log(error);
            });

    }


    updateMember=(member)=>{
        saveLoginInfo('更新了'+member.member_name +'的个人信息');
        /**使用axios将value表单信息发送到后端
         * */
        let api = global.AppConfig.serverIP + '/updateMemberById';
        axios.post(api,member)
            .then((response)=> {
                console.log(response);
                console.log(JSON.stringify(response.data));
                alert('更新完成')
                this.setState({
                    updateState: 1,
                })
            })
            .catch( (error)=> {
                console.log(error);
            });

    }


    render() {

         if(this.state.updateState == 1){
             return  <Redirect to="/app/member"/>;
         }
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult } = this.state;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{ width: 70 }}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        );

        const websiteOptions = autoCompleteResult.map(website => (
            <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
        ));

        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit} className="memberUpdate">
                <Form.Item
                    style={{display: "none"}}
                    label="id"

                >
                    {getFieldDecorator('member_id', {
                        rules: [{
                            required: true, message: 'id',
                        }],

                        initialValue: this.state.member.member_id,
                    })(
                        <Input />
                    )}
                </Form.Item>

                <Form.Item
                    style={{display: "none"}}
                    label="member_jointime"

                >
                    {getFieldDecorator('member_jointime', {
                        initialValue: this.state.member.member_jointime,
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item
                    label="姓名"
                >
                    {getFieldDecorator('member_name', {
                        rules: [{
                            required: true, message: '请输入您的姓名',
                        }],
                        initialValue: this.state.member.member_name,
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item
                    label="用户名"
                >
                    {getFieldDecorator('member_username', {
                        rules: [{
                            required: true, message: '请输入您的账号',
                        }],
                        initialValue: this.state.member.member_username,
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item
                    label="密码"
                >
                    {getFieldDecorator('member_password', {
                        rules: [{
                            required: true, message: '请输入您的密码!',
                        }, {
                            validator: this.validateToNextPassword,
                        }],
                    })(
                        <Input type="password" />
                    )}
                </Form.Item>
                <Form.Item
                    label="确认密码"
                >
                    {getFieldDecorator('confirm', {
                        rules: [{
                            required: true, message: '请确认您的密码!',
                        }, {
                            validator: this.compareToFirstPassword,
                        }],
                    })(
                        <Input type="password" onBlur={this.handleConfirmBlur} />
                    )}
                </Form.Item>

                <Form.Item
                    label={(
                        <span>
              性别&nbsp;

            </span>
                    )}
                >

                    {getFieldDecorator('member_sex',{
                            initialValue: this.state.member.member_sex,
                        }
                    )(<RadioGroup name="member_sex" >
                        <Radio value={'男'}>男</Radio>
                        <Radio value={'女'}>女</Radio>
                    </RadioGroup>)}

                </Form.Item>

                <Form.Item
                    label={(
                        <span>
              管理权限&nbsp;

            </span>
                    )}
                >

                    {getFieldDecorator('member_role',{
                        initialValue: this.state.member.member_role,
                        }
                        )(<RadioGroup name="member_role" >
                        <Radio value={1}>管理员</Radio>
                        <Radio value={2}>一级审核员</Radio>
                        <Radio value={3}>二级审核员</Radio>
                        <Radio value={4}>三级审核员</Radio>
                        <Radio value={5}>扫描员</Radio>
                    </RadioGroup>)}

                </Form.Item>

                <Form.Item
                    label={(
                        <span>
              工号&nbsp;
                            <Tooltip title="工作使用的工号">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
                    )}
                >
                    {getFieldDecorator('member_number', {
                        rules: [{ required: true, message: '请输入您的工号!', whitespace: true }],
                        initialValue: this.state.member.member_number,
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item
                    label="家庭住址"
                >
                    {getFieldDecorator('member_address', {
                        initialValue: this.state.member.member_address,
                    })(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item
                    label="电话号码"
                >
                    {getFieldDecorator('member_phone', {
                        rules: [{ required: true, message: '请输入您的联系方式!' }],
                        initialValue: this.state.member.member_phone,
                    })(
                        <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                    )}
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">提交更改</Button>
                </Form.Item>
            </Form>
        );
    }
}

const Member_update = Form.create({ name: 'register' })(RegistrationForm);
export default Member_update;