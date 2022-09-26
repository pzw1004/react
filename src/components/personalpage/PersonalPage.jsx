import {
    Upload, message,Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, Radio,
} from 'antd';
import React, { Component } from 'react';
import '../../config/config'
import axios from "axios";
import './personalPage.css';
import saveLoginInfo from '../../utils/saveLogInfo'
import reqwest from 'reqwest';
import { PlusOutlined ,UploadOutlined } from '@ant-design/icons';

const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;
const RadioGroup = Radio.Group;


class RegistrationForm extends Component {

    constructor(props){
        super(props);

        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
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
                signature:'',
            },
            fileList: [],
            uploading: false,
            member_id: JSON.parse(sessionStorage.getItem("temp_user")).member_id,
            //updateState: 0,  // 定义当前页面提交状态，0表示当前页面没有提交，1时为提交

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
    };


    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('member_password')) {
            callback('两次密码输入不一致!');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };

    handleWebsiteChange = (value) => {
        let autoCompleteResult;
        if (!value) {
            autoCompleteResult = [];
        } else {
            autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
        }
        this.setState({ autoCompleteResult });
    };

    componentWillMount() {

        // console.log(this.props.match.params.id);  // 取出通过路由传递的值，可以在前端web浏览器输出父组件的props查看对象定义
        let member_id = JSON.parse(sessionStorage.getItem("temp_user")).member_id;
        this.getMember(member_id);


    }

    getMember=(member_id)=>{


        /**使用axios将value表单信息发送到后端
         * */
        let api = global.AppConfig.serverIP + '/getPersonalInfo?member_id='+ member_id;
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

    };


    updateMember=(member)=>{
        /**使用axios将value表单信息发送到后端
         * */
        saveLoginInfo(member.member_name+'更新了个人信息')
        let api = global.AppConfig.serverIP + '/updatePersonalInfo?member_id='+JSON.parse(sessionStorage.getItem("temp_user")).member_id;
        axios.post(api,member)
            .then((response)=> {
                message.success("个人信息更新完成！");
                this.setState({
                    // updateState: 1,
                })
            })
            .catch( (error)=> {
                console.log(error);
            });

    };

    handleUpload = () => {
        const { fileList } = this.state;
        const formData = new FormData();
        fileList.forEach(file => {
            //formData.append('files[]', file);
            formData.append('uploadFile', file);
        });
        console.log(this.state.member_id);
        this.setState({
            uploading: true,
        });

        // You can use any AJAX library you like

        // this.uploadFileList(formData);

        reqwest({

            url: global.AppConfig.serverIP + '/uploadSignature/'+ this.state.member_id,
            method: 'post',
            processData: false,
            contentType: false,
            data: formData,
            success: () => {
                this.setState({
                    fileList: [],
                    uploading: false,
                });
                message.success('电子签名上传成功！');
            },
            error: () => {
                this.setState({
                    uploading: false,
                });
                message.error('upload failed.');
            },
        });
    };



    render() {


        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult } = this.state;
        const { uploading, fileList } = this.state;
        const props = {
            listType: 'picture',
            onRemove: file => {
                console.log(file)
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    console.log(index)
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    console.log(newFileList)
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: file => {
                console.log(file)
                file.url = global.AppConfig.tiffPicsIP+ "0//"+file.name;//预览图片保存的地址

                this.setState(state => ({
                        fileList: [...state.fileList, file],
                    }
                ));
                console.log(this.state.fileList)
                return false;
            },
            fileList,
        };

        const formItemLayout = {
            labelCol: {
                xs: { span: 8 },
                sm: { span: 10 },
            },
            wrapperCol: {
                xs: { span: 8 },
                sm: { span: 10 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 8,
                    offset: 8,
                },
                sm: {
                    span: 10,
                    offset: 10,
                },
            },
        };
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        );

        // const websiteOptions = autoCompleteResult.map(website => (
        //     <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
        // ));

        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit} className="personPalge">
                <Form.Item
                    style={{display: "none"}}
                    label="member_jointime"
                >
                    {getFieldDecorator('member_jointime', {
                        rules: [{
                            required: true, message: 'id',placeholder: "default size"
                        }],
                        initialValue: this.state.member.member_jointime,
                    })(
                        <Input width={10}/>
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
                        <Input disabled={true}/>
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
                        <Input disabled={true}/>
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

                <Form.Item label={(
                    <span> 性别&nbsp; </span>
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

                <Form.Item label={(
                    <span> 管理权限&nbsp;  </span>
                )}
                >
                    {getFieldDecorator('member_role',{
                            initialValue: this.state.member.member_role,
                        }
                    )(<RadioGroup name="member_role" disabled={true}>
                        <Radio value={1}>管理员</Radio>
                        <Radio value={2}>一级审核员</Radio>
                        <Radio value={3}>二级审核员</Radio>
                        <Radio value={4}>三级审核员</Radio>
                        <Radio value={5}>扫描员</Radio>
                    </RadioGroup >)}

                </Form.Item>

                <Form.Item label={(
                    <span> 工号&nbsp;
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
                        <Input disabled={true}/>
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
                    })(<Input.Group compact>
                        {prefixSelector}
                        <Input style={{ width: '35%' }} /></Input.Group>
                    )}
                </Form.Item>

                <Form.Item
                    label="电子签名上传"
                >
                    <div>

                        <Upload {...props}
                                multiple="multiple">
                            <Button>
                                <UploadOutlined /> 选择要上传的电子签名
                            </Button>
                        </Upload>
                        <Button
                            type="primary"
                            onClick={this.handleUpload}
                            disabled={fileList.length === 0}
                            loading={uploading}
                            style={{ marginTop: 16 }}
                        >
                            {uploading ? '正在导入' : '开始导入'}
                        </Button>

                    </div>
                    {/* {getFieldDecorator('signature', {
                        rules: [{
                            required: true, message: '请输入',
                        }],
                        initialValue: this.state.member.signature,
                    })(
                        <Input disabled={true} style={{ width: '100%' }}/>
                    )} */}
                </Form.Item>
                <Form.Item label="电子签名图片">
                    {/* <div align={"center"}> */}
                    <div>
                        <img alt={"还未上传电子签名"}  src={global.AppConfig.serverIP+"/images/"+this.state.member.signature} style={{width: 300, height: 150}} onError={(e) => {e.target.src=''}} />
                    </div>
                </Form.Item>
                <br></br>
                <br></br>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">提交更改</Button>
                </Form.Item>
            </Form>
        );
    }
}

const PersonalPage = Form.create({ name: 'register' })(RegistrationForm);
export default PersonalPage;