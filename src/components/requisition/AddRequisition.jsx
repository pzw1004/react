import {
     Form, Button, Col, Row, Input, Select, Divider, Radio, Upload, Icon, message
} from 'antd';
import reqwest from 'reqwest';
import React,{Component} from "react";
import axios from "axios";
import '../../config/config'
import saveLoginInfo from "../../utils/saveLogInfo";

const { Option } = Select;
const RadioGroup = Radio.Group;


class AddRequisition extends Component{

    constructor(props) {
        super(props);
        this.state= {
            fileList: [],
            uploading: false,
        }
    };

    handleUpload = () => {
        const { fileList } = this.state;
        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('files[]', file);
        });

        this.setState({
            uploading: true,
        });

        // You can use any AJAX library you like
        reqwest({
            url: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
            method: 'post',
            processData: false,
            data: formData,
            success: () => {
                this.setState({
                    fileList: [],
                    uploading: false,
                });
                message.success('upload successfully.');
            },
            error: () => {
                this.setState({
                    uploading: false,
                });
                message.error('upload failed.');
            },
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.addRequisition(values);
                this.onClose();
            }
        });

    };

    addRequisition=(requisition)=>{
        /**使用axios将value表单信息发送到后端
         * */
        saveLoginInfo('增加了申请单编号'+requisition.requisition_number+'的信息');
        let api = global.AppConfig.serverIP + '/addRequisition';
        axios.post(api,requisition)
            .then((response)=> {
                console.log(response);
                message.success(response.data);
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { uploading, fileList } = this.state;
        const props = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: file => {
                this.setState(state => ({
                    fileList: [...state.fileList, file],
                }));
                return false;
            },
            fileList,
        };


        return (
            <div>
                <Form  layout="vertical"  onSubmit={this.handleSubmit}>
                    <Row gutter={20} >
                        {/*<Col span={4}>*/}
                        {/*    <Form.Item label="申请单id" style={{display:true}}>*/}
                        {/*        {getFieldDecorator('requisition_id', {*/}
                        {/*            rules: [{ required: true, message: '申请单id' }],*/}
                        {/*            // initialValue: this.props.RequisitionList.state.requisition.requisition_id,*/}
                        {/*        })(<Input placeholder="申请单id" />)}*/}
                        {/*    </Form.Item>*/}
                        {/*</Col>*/}
                        <Col span={4}>
                            <Form.Item label="工程编号">
                                {getFieldDecorator('requisition_number', {
                                    rules: [{ required: true, message: '请输入工程编号' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_number
                                })(<Input placeholder="工程编号" />)}
                            </Form.Item>
                        </Col>

                        <Col span={4}>
                            <Form.Item label="工程名称">
                                {getFieldDecorator('requisition_name', {
                                    rules: [{ required: true, message: '请输入工程名称' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_name
                                })(<Input placeholder="工程名称" />)}
                            </Form.Item>
                        </Col>

                        <Col span={4}>
                            <Form.Item label="结构名称">
                                {getFieldDecorator('requisition_structurename', {
                                    rules: [{ required: true, message: '请输入结构名称' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_structurename
                                })(<Input placeholder="结构名称" />)}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="施工单位">
                                {getFieldDecorator('requisition_constructunit', {
                                    rules: [{ required: true, message: '请输入施工单位' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_constructunit
                                })(<Input placeholder="施工单位" />)}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="焊接方法">
                                {getFieldDecorator('requisition_weldingmethod', {
                                    rules: [{ required: true, message: '请输入焊接方法' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_weldingmethod
                                })(<Input placeholder="焊接方法" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={4}>
                            <Form.Item label="存放位置">
                                {getFieldDecorator('requisition_saveplace', {
                                    rules: [{ required: true, message: '请输入存放位置' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_saveplace
                                })(<Input placeholder="存放位置" />)}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="来样编号">
                                {getFieldDecorator('requisition_samplenumber', {
                                    rules: [{ required: true, message: '请输入来样编号' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_samplenumber
                                })(<Input placeholder="来样编号" />)}
                            </Form.Item>
                        </Col>

                        <Col span={4}>
                            <Form.Item label="黑度值">
                                {getFieldDecorator('requisition_density', {
                                    rules: [{ required: true, message: '请输入黑度值' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_density
                                })(<Input placeholder="黑度值" />)}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="报告编号">
                                {getFieldDecorator('requisition_reportnumber', {
                                    rules: [{ required: true, message: '请输入报告编号' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_reportnumber
                                })(<Input placeholder="报告编号" />)}
                            </Form.Item>
                        </Col>

                        <Col span={4}>
                            <Form.Item label="胶片型号">
                                {getFieldDecorator('requisition_filmtype', {
                                    rules: [{ required: true, message: '请输入胶片型号' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_filmtype
                                })(<Input placeholder="胶片型号" />)}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="检测标准">
                                {getFieldDecorator('requisition_testingstandard', {
                                    rules: [{ required: true, message: '请输入检测标准' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_testingstandard
                                })(<Input placeholder="检测标准" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={4}>
                            <Form.Item label="合格级别">
                                {getFieldDecorator('requisition_qualificationlevel', {
                                    rules: [{ required: true, message: '请输入合格级别' }],
                                    initialValue: "Ⅱ级"
                                })(<Input placeholder="合格级别" />)}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="增感屏">
                                {getFieldDecorator('requisition_intensifyscreen', {
                                    rules: [{ required: true, message: '请输入增感屏' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_intensifyscreen
                                })(<Input placeholder="增感屏" />)}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="管电流">
                                {getFieldDecorator('requisition_tubecurrent', {
                                    rules: [{ required: true, message: '请输入管电流' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_tubecurrent
                                })(<Input placeholder="管电流" />)}
                            </Form.Item>
                        </Col>

                        <Col span={4}>
                            <Form.Item label="管电压">
                                {getFieldDecorator('requisition_tubevoltage', {
                                    rules: [{ required: true, message: '请输入管电压' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_tubevoltage
                                })(<Input placeholder="管电压" />)}
                            </Form.Item>
                        </Col>

                        <Col span={4}>
                            <Form.Item label="曝光时间">
                                {getFieldDecorator('requisition_exposuretime', {
                                    rules: [{ required: true, message: '请输入曝光时间' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_exposuretime
                                })(<Input placeholder="曝光时间" />)}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="敏感度">
                                {getFieldDecorator('requisition_sensitivity', {
                                    rules: [{ required: true, message: '请输入敏感度' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_sensitivity
                                })(<Input placeholder="敏感度" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={4}>
                            <Form.Item label="焦距">
                                {getFieldDecorator('requisition_focus', {
                                    rules: [{ required: true, message: '请输入焦距' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_focus
                                })(<Input placeholder="焦距" />)}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="显影时间">
                                {getFieldDecorator('requisition_developmenttime', {
                                    rules: [{ required: true, message: '请输入显影时间' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_developmenttime
                                })(<Input placeholder="显影时间" />)}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="显影温度">
                                {getFieldDecorator('requisition_developertemperature', {
                                    rules: [{ required: true, message: '请输入显影温度' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_developertemperature
                                })(<Input placeholder="显影温度" />)}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="钢号">
                                {getFieldDecorator('requisition_steelnumber', {
                                    rules: [{ required: true, message: '请输入钢号' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_steelnumber
                                })(<Input placeholder="钢号" />)}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="接头形式">
                                {getFieldDecorator('requisition_jointform', {
                                    rules: [{ required: true, message: '请输入接头形式' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_jointform
                                })(<Input placeholder="接头形式" />)}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="仪器型号">
                                {getFieldDecorator('requisition_instrumenttype', {
                                    rules: [{ required: true, message: '请输入仪器型号' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_instrumenttype
                                })(<Input placeholder="仪器型号" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={4}>
                            <Form.Item label="影像图数量">
                                {getFieldDecorator('requisition_totalnumber', {
                                    rules: [{ required: true, message: '请输入影像图数量' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_totalnumber
                                })(<Input placeholder="影像图数量" />)}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="返工次数">
                                {getFieldDecorator('requisition_reworktimes', {
                                    rules: [{ required: true, message: '请输入返工次数' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_reworktimes
                                })(<Input placeholder="返工次数" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={16}>
                            <Form.Item label="申请单备注信息">
                                {getFieldDecorator('requisition_ps', {
                                    rules: [{ required: false, message: '请输入申请单备注信息' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_ps
                                })(<Input.TextArea rows={4} placeholder="申请单备注信息" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <br/><br/>
                    <Divider />
                    <Row gutter={16}>
                        <Col span={4}>
                            <Form.Item >
                                <Button type="danger"  htmlType="submit">增加申请单信息</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        );

    }
}

const Requisition_manage = Form.create()(AddRequisition);

export default Requisition_manage;

// export default AddRequisition;