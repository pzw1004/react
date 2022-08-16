import {
    Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Icon, Radio
} from 'antd';
import React,{Component} from "react";
import axios from "axios";
import '../../../config/config'
import saveLoginInfo from '../../../utils/saveLogInfo'

const { Option } = Select;
const RadioGroup = Radio.Group;

class DrawerForm extends Component {

    constructor(props){
        super(props);

    this.state = {
        visible: false,

    };
}
    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.setState({
                    visible: false,
                });

                this.addMember(values);
            }
        });


    }

    addMember=(values)=>{
        /**使用axios将value表单信息发送到后端
         * */
        saveLoginInfo('增加了'+values.member_name+'的个人信息')
        let api = global.AppConfig.serverIP + '/addMember';
        axios.post(api,values)
            .then((response)=> {
                console.log("----------------");
                console.log(response);
                console.log(JSON.stringify(response.data));
                console.log("----------------");
                //this.props.MemberList.run();
                if(response.data==null||response.data==""){
                    alert("已有用户名存在，请勿重复添加")
                }else {
                alert("成功添加新成员");
                this.props.MemberList.setState({
                    memberList: response.data,
                })
                }
            })
            .catch( (error)=> {
                console.log(error);
            });

    }



    render() {
        const { getFieldDecorator } = this.props.form;
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{ width: 70 }}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        );
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



        return (
            <div>
                <Button type="default" onClick={this.showDrawer}>
                    <Icon type="plus" /> 添加新成员
                </Button>
                <Drawer
                    title="增加新成员"
                    width={720}
                    onClose={this.onClose}
                    visible={this.state.visible}
                >
                    <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="姓名">
                                    {getFieldDecorator('member_name', {
                                        rules: [{ required: true, message: '请输入您的姓名' }],
                                    })(<Input placeholder="请输入姓名" />)}
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item label="工号">
                                    {getFieldDecorator('member_number', {
                                        rules: [{ required: true, message: '请输入您的工号' }],
                                    })(<Input placeholder="请输入工号" />)}
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item label="账号">
                                    {getFieldDecorator('member_username', {
                                        rules: [{ required: true, message: '请输入您的账号' }],
                                    })(<Input placeholder="请输入账号" />)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="密码">
                                    {getFieldDecorator('member_password', {
                                        rules: [{ required: true, message: '请输入您的密码' }],
                                    })(<Input placeholder="请输入密码" />)}
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="联系方式"
                                >
                                    {getFieldDecorator('member_phone', {
                                        rules: [{ required: true, message: '请输入您的联系方式!' }],
                                    })(
                                        <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item label="性别">
                                    {getFieldDecorator('member_sex')(<RadioGroup name="member_sex" >
                                        <Radio value={'男'}>男</Radio>
                                        <Radio value={'女'}>女</Radio>
                                    </RadioGroup>)}
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item label="设置权限">
                                    {getFieldDecorator('member_role')(<RadioGroup name="member_role" >
                                        <Radio value={1}>管理员</Radio>
                                        <Radio value={2}>一级审核员</Radio>
                                        <Radio value={3}>二级审核员</Radio>
                                        <Radio value={4}>三级审核员</Radio>
                                        <Radio value={5}>扫描员</Radio>
                                    </RadioGroup>)}
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item label="家庭住址">
                                    {getFieldDecorator('member_address', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入家庭住址',
                                            },
                                        ],
                                    })(<Input.TextArea rows={4} placeholder="请输入家庭住址" />)}
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item {...tailFormItemLayout}>
                                    <Button onClick={this.onClose} style={{ marginRight: 8 }}>取消</Button>
                                 </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item {...tailFormItemLayout}>
                                    <Button type="primary" htmlType="submit">提交新成员信息</Button>
                                </Form.Item>
                            </Col>

                        </Row>
                    </Form>
                    {/*<div*/}
                    {/*    style={{*/}
                    {/*        position: 'absolute',*/}
                    {/*        left: 0,*/}
                    {/*        bottom: 0,*/}
                    {/*        width: '100%',*/}
                    {/*        borderTop: '1px solid #e9e9e9',*/}
                    {/*        padding: '10px 16px',*/}
                    {/*        background: '#fff',*/}
                    {/*        textAlign: 'right',*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*</div>*/}
                </Drawer>
            </div>
        );
    }
}

const Member_add = Form.create()(DrawerForm);

export default Member_add;