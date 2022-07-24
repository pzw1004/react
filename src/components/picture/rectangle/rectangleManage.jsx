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



    onClose = () => {
        this.props.PictureManage.setState({
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

                this.updateRectangleDamageType(values);
            }
        });


    };

    updateRectangleDamageType=(values)=>{
        /**使用axios将value表单信息与当前选择的方框信息一起发送到后端
         * 得到的数据应是更新后的画框的列表，即是rectangleList
         * */
        let api = global.AppConfig.serverIP + '/updateRectangleDamageType?rectangle_id=' + this.props.PictureManage.state.rectangle.retangle_id;
        axios.post(api,values)
            .then((response)=> {
                console.log(response);
                console.log(JSON.stringify(response.data));
                saveLoginInfo('更新了编号'+this.props.PictureManage.state.picture.picture_number+'的损伤类型描述信息')
               // this.props.PictureManage.updateRectClor(this.props.PictureManage.state.clickRectId);

                alert("已更新损伤类型");
                window.location.reload();
                this.onClose();//提交完成后关闭当前页面

            })
            .catch( (error)=> {
                console.log(error);
            });

    };



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
                <Drawer
                    title="设置方框属性"
                    width={300}
                    onClose={this.onClose}
                    visible={this.props.PictureManage.state.visible}
                    placement="left"
                >
                    <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
                        <Row gutter={20}>
                            <Col span={20}>
                                <Form.Item label="更新损伤框信息">
                                    {getFieldDecorator('damagetype_id', {
                                        rules: [{ required: true, message: 'Please select your country!' }],
                                        initialValue: this.props.PictureManage.state.damageType.damagetype_id
                                    })(
                                        <Select placeholder="Please select a damageTypeList">
                                            {this.props.PictureManage.state.damageTypeList.map((item,index)=>{
                                                    return <Option value={item.damagetype_id}>{item.damagetype_name}</Option>
                                            })
                                            }
                                            {/*<Option value="china">China</Option>*/}
                                            {/*<Option value="usa">U.S.A</Option>*/}
                                        </Select>,
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={10}>
                            <Col span={10}>
                                <Form.Item {...tailFormItemLayout}>
                                    <Button type="primary" htmlType="submit">提交新属性信息</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Drawer>
            </div>
        );
    }
}

const Member_add = Form.create()(DrawerForm);

export default Member_add;