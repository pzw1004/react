import {
     Form, Button, Col, Row, Input, Select, Divider, Radio, Upload, Icon, message, AutoComplete, DatePicker
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
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
            distinctTestingRate: [],
            distinctBevelForm: [],
            distinctFilmtype: [],
            distinctTransillumination: [],
            distinctFocusSize: [],
            distinctSensitizationMethod: [],
            distinctFilmProcessingMethod: [],
            distinctQualificationLevel: [],
            distinctTestingInstrument: [],
            distinctWeldingMethod: [],
            distinctIntensifyScreenFront: [],
            distinctIntensifyScreenMiddle: [],
            distinctIntensifyScreenBehind: [],
            productList: [],
            accountofpic:0,
            arrpic:[]
        }
    };

    componentWillMount() {
        this.getRequisitionFileDistinctByTestingRate();
        this.getRequisitionFileDistinctByBevelForm();
        this.getRequisitionFileDistinctByFilmtype();
        this.getRequisitionFileDistinctByTransillumination();
        this.getRequisitionFileDistinctByFocusSize();
        this.getRequisitionFileDistinctBySensitizationMethod();
        this.getRequisitionFileDistinctByFilmProcessingMethod();
        this.getRequisitionFileDistinctByQualificationLevel();
        this.getRequisitionFileDistinctByTestingInstrument();
        this.getRequisitionFileDistinctByWeldingMethod();
        this.getRequisitionFileDistinctByIntensifyScreenFront();
        this.getRequisitionFileDistinctByIntensifyScreenMiddle();
        this.getRequisitionFileDistinctByIntensifyScreenBehind();
        this.getAllProduct();
    }

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
        //todo handlesubmit
        const that = this;
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log(values)
            if (!err) {
                let data = moment(values.requisition_complete_date).format("YYYY-MM-DD");
                values.requisition_complete_date = data;
                console.log('Received values of form: ', values);
                this.addRequisition(values);
                this.onClose();
            }
        });

    };

    addpicture=(values,id)=>{
        var piclist = [];
        // var name = "picture_hanfeng_name"+ i
        // var name1 = "picture_hanfeng_number"+ i
        // var name2 = "picture_hanfeng_method"+ i
        // var name3 = "picture_thickness"+ i
        // var name4 = "picture_bevel_form"+ i
        // var name5 = "picture_material_number"+ i
        // var name6 = "picture_hanfeng_length"+ i
        // var name7 = "picture_hanfeng_testlength"+ i
        // var name8 = "picture_testing_rate%"+ i
        for (let i=0;i<this.state.accountofpic;i++){
            var name = "picture_hanfeng_name"+ i
            var name1 = "picture_hanfeng_number"+ i
            var name2 = "picture_hanfeng_method"+ i
            var name3 = "picture_thickness"+ i
            var name4 = "picture_bevel_form"+ i
            var name5 = "picture_material_number"+ i
            var name6 = "picture_hanfeng_length"+ i
            var name7 = "picture_hanfeng_testlength"+ i
            var name8 = "picture_testing_rate%"+ i
            var name9 = "picture_real_width"+ i
            var name10 = "picture_welding_operator"+ i
            console.log(name)
            let obj = {
                picture_requisition_id:id,
                picture_hanfeng_name:values[name],
                picture_hanfeng_number:values[name1],
                picture_hanfeng_method:values[name2],
                picture_thickness:values[name3],
                picture_bevel_form:values[name4],
                picture_material_number:values[name5],
                picture_hanfeng_length:values[name6],
                picture_hanfeng_testlength:values[name7],
                picture_testing_rate:values[name8],
                picture_real_width:values[name9],
                picture_welding_operator:values[name10],
            }
            // console.log(piclist)
            piclist.push(obj)
        }
        console.log(piclist)
        let api = global.AppConfig.serverIP + '/createpic';
        axios.post(api,piclist)
            .then((response)=> {

            })
            .catch( (error)=> {
                console.log(error);
            });
    }

    addRequisition=(requisition)=>{
        /**使用axios将value表单信息发送到后端
         * */
        saveLoginInfo('增加了申请单编号'+requisition.requisition_number+'的信息');
        let api = global.AppConfig.serverIP + '/addRequisition';
        axios.post(api,requisition)
            .then((response)=> {
                if(response.data[1] !== -1){
                    message.success(response.data[0]);
                    this.addpicture(requisition,response.data[1]);
                }else{
                    message.error(response.data[0]);
                }

            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    getAllProduct=()=>{
        let api = global.AppConfig.serverIP + '/getAllProduct';
        axios.post(api)
            .then((response)=> {
                this.setState({
                    productList: response.data,
                })
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    getRequisitionFileDistinctByTestingRate=()=>{
        let api = global.AppConfig.serverIP + '/getRequisitionFileDistinctByTestingRate';
        axios.post(api)
            .then((response)=> {
                // console.log(response);
                // console.log(JSON.stringify(response.data));
                this.setState({
                    distinctTestingRate: response.data,
                })
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    getRequisitionFileDistinctByBevelForm=()=>{
        let api = global.AppConfig.serverIP + '/getRequisitionFileDistinctByBevelForm';
        axios.post(api)
            .then((response)=> {
                // console.log(response);
                // console.log(JSON.stringify(response.data));
                this.setState({
                    distinctBevelForm: response.data,
                })
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    getRequisitionFileDistinctByFilmtype=()=>{
        let api = global.AppConfig.serverIP + '/getRequisitionFileDistinctByFilmtype';
        axios.post(api)
            .then((response)=> {
                // console.log(response);
                // console.log(JSON.stringify(response.data));
                this.setState({
                    distinctFilmtype: response.data,
                })
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    getRequisitionFileDistinctByTransillumination=()=>{
        let api = global.AppConfig.serverIP + '/getRequisitionFileDistinctByTransillumination';
        axios.post(api)
            .then((response)=> {
                // console.log(response);
                // console.log(JSON.stringify(response.data));
                this.setState({
                    distinctTransillumination: response.data,
                })
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    getRequisitionFileDistinctByFocusSize=()=>{
        let api = global.AppConfig.serverIP + '/getRequisitionFileDistinctByFocusSize';
        axios.post(api)
            .then((response)=> {
                this.setState({
                    distinctFocusSize: response.data,
                })
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    getRequisitionFileDistinctBySensitizationMethod=()=>{
        let api = global.AppConfig.serverIP + '/getRequisitionFileDistinctBySensitizationMethod';
        axios.post(api)
            .then((response)=> {
                this.setState({
                    distinctSensitizationMethod: response.data,
                })
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    getRequisitionFileDistinctByFilmProcessingMethod=()=>{
        let api = global.AppConfig.serverIP + '/getRequisitionFileDistinctByFilmProcessingMethod';
        axios.post(api)
            .then((response)=> {
                this.setState({
                    distinctFilmProcessingMethod: response.data,
                })
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    getRequisitionFileDistinctByQualificationLevel=()=>{

        let api = global.AppConfig.serverIP + '/getRequisitionFileDistinctByQualificationLevel';
        axios.post(api)
            .then((response)=> {
                this.setState({
                    distinctQualificationLevel: response.data,
                })
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    getRequisitionFileDistinctByTestingInstrument=()=>{

        let api = global.AppConfig.serverIP + '/getRequisitionFileDistinctByTestingInstrument';
        axios.post(api)
            .then((response)=> {
                this.setState({
                    distinctTestingInstrument: response.data,
                })
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    getRequisitionFileDistinctByWeldingMethod=()=>{

        let api = global.AppConfig.serverIP + '/getRequisitionFileDistinctByWeldingMethod';
        axios.post(api)
            .then((response)=> {
                this.setState({
                    distinctWeldingMethod: response.data,
                })
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    getRequisitionFileDistinctByIntensifyScreenFront=()=>{

        let api = global.AppConfig.serverIP + '/getRequisitionFileDistinctByIntensifyScreenFront';
        axios.post(api)
            .then((response)=> {
                this.setState({
                    distinctIntensifyScreenFront: response.data,
                })
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    getRequisitionFileDistinctByIntensifyScreenMiddle=()=>{

        let api = global.AppConfig.serverIP + '/getRequisitionFileDistinctByIntensifyScreenMiddle';
        axios.post(api)
            .then((response)=> {
                this.setState({
                    distinctIntensifyScreenMiddle: response.data,
                })
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    getRequisitionFileDistinctByIntensifyScreenBehind=()=>{

        let api = global.AppConfig.serverIP + '/getRequisitionFileDistinctByIntensifyScreenBehind';
        axios.post(api)
            .then((response)=> {
                this.setState({
                    distinctIntensifyScreenBehind: response.data,
                })
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

getaccount=(e)=>{
    console.log("sssssssssss",e.target.value)
    var arr = []
    for(let i=0;i<e.target.value;i++){
        arr.push(" ")
    }
    this.setState({
        accountofpic: e.target.value,
        arrpic:arr,
    })
}
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
            <div style={{textAlign:"center"}}>
                <strong><font size={6}>无损检测委托单</font></strong>
            </div>
        <Divider></Divider>
            <div>
                <br/>
                <br/>
                <Form layout="vertical"  onSubmit={this.handleSubmit}>
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
                            {/*左上角编号*/}
                            <Form.Item label="编号">
                                {getFieldDecorator('requisition_number', {
                                    rules: [{ required: true, message: '请输入编号' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_number
                                })(<Input placeholder="编号" />)}
                            </Form.Item>
                        </Col>

                        <Col span={4}>
                            <Form.Item label="军检号">
                                {getFieldDecorator('requisition_military_inspection_id', {
                                    rules: [{ required: true, message: '请输入军检号' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_structurename
                                })(<Input placeholder="军检号" />)}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="检测方法">
                                {getFieldDecorator('requisition_test_method', {
                                    rules: [{ required: true, message: '请输入检测方法' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_structurename
                                })(<Input placeholder="检测方法" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={4}>
                            {/*产品名称*/}
                            <Form.Item label="产品名称">
                                {getFieldDecorator('requisition_product_name', {
                                    rules: [{ required: true, message: '请输入产品名称' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_number
                                })(<Select
                                    showSearch
                                    placeholder="产品名称"
                                    optionFilterProp="children">
                                    {   this.state.productList.map((item,key)=>{
                                        return(
                                            <Option value={item.product_name}>{item.product_name}</Option>
                                        )
                                    })}
                                </Select>)}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="结构名称">
                                {getFieldDecorator('requisition_structure_name', {
                                    rules: [{ required: true, message: '请输入结构名称' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_name
                                })(<Input placeholder="结构名称" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                        {/*<Col span={4}>*/}
                        {/*    <Form.Item label="工程名称">*/}
                        {/*        {getFieldDecorator('requisition_name', {*/}
                        {/*            rules: [{ required: true, message: '请输入工程名称' }],*/}
                        {/*            // initialValue: this.props.RequisitionList.state.requisition.requisition_name*/}
                        {/*        })(<Input placeholder="工程名称" />)}*/}
                        {/*    </Form.Item>*/}
                        {/*</Col>*/}
<Row gutter={20}>
    <Col span={4}>
        <Form.Item label="检测部位">
            {getFieldDecorator('requisition_test_part', {
                rules: [{ required: true, message: '请输入检测部位' }],
                // initialValue: this.props.RequisitionList.state.requisition.requisition_name
            })(<Input placeholder="检测部位" />)}
        </Form.Item>
    </Col>
    <Col span={4}>
        <Form.Item label="表面状态">
            {getFieldDecorator('requisition_surface_state', {
                rules: [{ required: true, message: '请输入表面状态' }],
                // initialValue: this.props.RequisitionList.state.requisition.requisition_name
            })(<Input placeholder="表面状态" />)}
        </Form.Item>
    </Col>
    <Col span={4}>
        <Form.Item label="外观检查结论">
            {getFieldDecorator('requisition_surface_conclusion', {
                rules: [{ required: true, message: '请输入外观检查结论' }],
                // initialValue: this.props.RequisitionList.state.requisition.requisition_name
            })(<Input placeholder="外观检查结论" />)}
        </Form.Item>
    </Col>
</Row>
                    <Row gutter={20}>
                        <Col span={4}>
                            <Form.Item label="检测标准">
                                {getFieldDecorator('requisition_testingstandard', {
                                    rules: [{ required: true, message: '请输入检测标准' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_testingstandard
                                })(<Input placeholder="检测标准" />)}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="合格级别">
                                {getFieldDecorator('requisition_qualificationlevel', {
                                    rules: [{ required: true, message: '请输入合格级别' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_qualificationlevel
                                })
                                (<AutoComplete
                                    showSearch
                                    placeholder="合格级别"
                                    optionFilterProp="children"
                                    dataSource={   this.state.distinctQualificationLevel.map((item,key)=>{
                                        return(
                                            <Option value={item.requisition_qualificationlevel}>{item.requisition_qualificationlevel}</Option>
                                        )
                                    })}
                                />)}
                            </Form.Item>
                        </Col>

                        <Col span={4}>
                            <Form.Item label="被检物地址">
                                {getFieldDecorator('requisition_item_address', {
                                    rules: [{ required: true, message: '请输入被检物地址' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_name
                                })(<Input placeholder="被检物地址" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={4}>
                            <Form.Item label="施工部门">
                                {getFieldDecorator('requisition_constructunit', {
                                    rules: [{ required: true, message: '请输入施工部门' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_name
                                })(<Input placeholder="施工部门" />)}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="联系人">
                                {getFieldDecorator('requisition_contact', {
                                    rules: [{ required: true, message: '请输入联系人'}],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_name
                                })(<Input placeholder="联系人" />)}
                            </Form.Item>
                        </Col>
                                    <Col span={4}>
                                    <Form.Item label="完工日期">
                                {getFieldDecorator('requisition_complete_date', {
                                    rules: [{ required: true, message: '请输入完工日期' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_constructunit
                                })(<DatePicker
                                    defaultValue={moment()}
                                    format={'YYYY-MM-DD'}
                                    placeholder="完工日期"
                                    style={{ width: "100%", minWidth: "100%", }}
                                    showTime
                                    // locale={locale}
                                    />)}
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
                    <Row gutter={20}>
                        <Col span={4}>
                            <Form.Item label="生产管理部门">
                                {getFieldDecorator('requisition_management_department', {
                                    rules: [{ required: true, message: '请输入生产管理部门' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_name
                                })(<Input placeholder="生产管理部门" />)}
                            </Form.Item>
                        </Col>

                        <Col span={4}>
                            <Form.Item label="无损检测室">
                                {getFieldDecorator('requisition_test_room', {
                                    rules: [{ required: true, message: '请输入无损检测室' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_name
                                })(<Input placeholder="无损检测室" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={4}>
                            <Form.Item label="顾客">
                                {getFieldDecorator('requisition_customer', {
                                    rules: [{ required: true, message: '请输入顾客' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_name
                                })(<Input placeholder="顾客" />)}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="识别码">
                                {getFieldDecorator('requisition_code', {
                                    rules: [{ required: true, message: '请输入识别码' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_name
                                })(<Input placeholder="识别码" />)}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="检测时间">
                                {getFieldDecorator('requisition_test_time', {
                                    rules: [{ required: true, message: '请输入检测时间' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_name
                                })(<Input placeholder="检测时间" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={4}>
                            <Form.Item label="检查员">
                                {getFieldDecorator('requisition_inspector', {
                                    rules: [{ required: true, message: '请输入检查员' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_name
                                })(<Input placeholder="检查员" />)}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="检测日期">
                                {getFieldDecorator('requisition_testing_date', {
                                    rules: [{ required: false, message: '请输入检测日期' }],
                                    // initialValue: this.props.RequisitionList.state.requisition.requisition_constructunit
                                })(<DatePicker
                                    defaultValue={moment()}
                                    format={'YYYY-MM-DD'}
                                    placeholder="检测日期"
                                    style={{ width: "100%", minWidth: "100%", }}
                                    showTime
                                    // locale={locale}
                                />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    {/*<Divider>底片信息</Divider>*/}
                    {/*<Row gutter={20}>*/}
                    {/*    <Col span={2}>*/}
                    {/*<Form.Item label="底片数量">*/}
                    {/*    {getFieldDecorator('countofpic', {*/}
                    {/*        rules: [{ required: false, message: '请输入底片数量' }],*/}
                    {/*        // initialValue: this.props.RequisitionList.state.requisition.requisition_name*/}
                    {/*    })(<Input id="account" placeholder="0" onChange={this.getaccount}/>)}*/}
                    {/*</Form.Item></Col>*/}
                    {/*</Row>*/}
                    {/*{this.state.arrpic.map((item,i)=>{*/}
                    {/*    var name = "picture_hanfeng_name"+ i*/}
                    {/*    var name1 = "picture_hanfeng_number"+ i*/}
                    {/*    var name2 = "picture_hanfeng_method"+ i*/}
                    {/*    var name3 = "picture_thickness"+ i*/}
                    {/*    var name4 = "picture_bevel_form"+ i*/}
                    {/*    var name5 = "picture_material_number"+ i*/}
                    {/*    var name6 = "picture_hanfeng_length"+ i*/}
                    {/*    var name7 = "picture_hanfeng_testlength"+ i*/}
                    {/*    var name8 = "picture_testing_rate%"+ i*/}
                    {/*    var name9 = "picture_real_width"+ i*/}
                    {/*    var name10 = "picture_welding_operator"+ i*/}
                    {/*    return    (*/}
                    {/*        <Row gutter={20}>*/}
                    {/*            <Divider>{i+1}</Divider>*/}
                    {/*            <Col span={4}>*/}
                    {/*                <Form.Item label="焊接人">*/}
                    {/*                    {getFieldDecorator(name10, {*/}
                    {/*                        rules: [{required: true, message: '请输入焊接人'}],*/}
                    {/*                        // initialValue: this.props.RequisitionList.state.requisition.requisition_testingstandard*/}
                    {/*                    })(<Input placeholder="焊接人"/>)}*/}
                    {/*                </Form.Item>*/}
                    {/*            </Col>*/}
                    {/*            <Col span={4}>*/}
                    {/*                <Form.Item label="底片长度">*/}
                    {/*                    {getFieldDecorator(name9, {*/}
                    {/*                        rules: [{required: true, message: '请输入底片长度'}],*/}
                    {/*                        // initialValue: this.props.RequisitionList.state.requisition.requisition_testingstandard*/}
                    {/*                    })(<Input placeholder="底片长度"/>)}*/}
                    {/*                </Form.Item>*/}
                    {/*            </Col>*/}
                    {/*        <Col span={4}>*/}
                    {/*            <Form.Item label="焊缝名称">*/}
                    {/*                {getFieldDecorator(name, {*/}
                    {/*                    rules: [{required: true, message: '请输入焊缝名称'}],*/}
                    {/*                    // initialValue: this.props.RequisitionList.state.requisition.requisition_testingstandard*/}
                    {/*                })(<Input placeholder="焊缝名称"/>)}*/}
                    {/*            </Form.Item>*/}
                    {/*        </Col>*/}
                    {/*        <Col span={4}>*/}
                    {/*            <Form.Item label="焊接编号">*/}
                    {/*                {getFieldDecorator(name1, {*/}
                    {/*                    rules: [{required: true, message: '请输入焊接编号'}],*/}
                    {/*                    // initialValue: this.props.RequisitionList.state.requisition.requisition_testingstandard*/}
                    {/*                })(<Input placeholder="焊接编号"/>)}*/}
                    {/*            </Form.Item>*/}
                    {/*        </Col>*/}

                    {/*        <Col span={4}>*/}
                    {/*            <Form.Item label="焊接方法">*/}
                    {/*                {getFieldDecorator(name2, {*/}
                    {/*                    rules: [{required: true, message: '请输入焊接方法'}],*/}
                    {/*                    // initialValue: this.props.RequisitionList.state.requisition.requisition_testingstandard*/}
                    {/*                })(<Input placeholder="焊接方法"/>)}*/}
                    {/*            </Form.Item>*/}
                    {/*        </Col>*/}

                    {/*        <Col span={4}>*/}
                    {/*            <Form.Item label="板厚(几何尺寸)">*/}
                    {/*                {getFieldDecorator(name3, {*/}
                    {/*                    rules: [{required: true, message: '请输入板厚(几何尺寸)'}],*/}
                    {/*                    // initialValue: this.props.RequisitionList.state.requisition.requisition_testingstandard*/}
                    {/*                })(<Input placeholder="板厚(几何尺寸)"/>)}*/}
                    {/*            </Form.Item>*/}
                    {/*        </Col>*/}

                    {/*        <Col span={4}>*/}
                    {/*            <Form.Item label="坡口形式">*/}
                    {/*                {getFieldDecorator(name4, {*/}
                    {/*                    rules: [{required: true, message: '请输入坡口形式'}],*/}
                    {/*                    // initialValue: this.props.RequisitionList.state.requisition.requisition_testingstandard*/}
                    {/*                })(<Input placeholder="坡口形式"/>)}*/}
                    {/*            </Form.Item>*/}
                    {/*        </Col>*/}
                    {/*        <Col span={4}>*/}
                    {/*            <Form.Item label="材料牌号">*/}
                    {/*                {getFieldDecorator(name5, {*/}
                    {/*                    rules: [{required: true, message: '请输入材料牌号'}],*/}
                    {/*                    // initialValue: this.props.RequisitionList.state.requisition.requisition_testingstandard*/}
                    {/*                })(<Input placeholder="材料牌号"/>)}*/}
                    {/*            </Form.Item>*/}
                    {/*        </Col>*/}
                    {/*        <Col span={4}>*/}
                    {/*            <Form.Item label="焊缝长度">*/}
                    {/*                {getFieldDecorator(name6, {*/}
                    {/*                    rules: [{required: true, message: '请输入焊缝长度'}],*/}
                    {/*                    // initialValue: this.props.RequisitionList.state.requisition.requisition_testingstandard*/}
                    {/*                })(<Input placeholder="焊缝长度"/>)}*/}
                    {/*            </Form.Item>*/}
                    {/*        </Col>*/}
                    {/*        <Col span={4}>*/}
                    {/*            <Form.Item label="检测长度">*/}
                    {/*                {getFieldDecorator(name7, {*/}
                    {/*                    rules: [{required: false, message: '请输入检测长度'}],*/}
                    {/*                    // initialValue: this.props.RequisitionList.state.requisition.requisition_testingstandard*/}
                    {/*                })(<Input placeholder="检测长度"/>)}*/}
                    {/*            </Form.Item>*/}
                    {/*        </Col>*/}
                    {/*        <Col span={4}>*/}
                    {/*            <Form.Item label="检测比例%">*/}
                    {/*                {getFieldDecorator(name8, {*/}
                    {/*                    rules: [{required: true, message: '请输入检测比例'}],*/}
                    {/*                    // initialValue: this.props.RequisitionList.state.requisition.requisition_testingstandard*/}
                    {/*                })(<Input placeholder="检测比例%"/>)}*/}
                    {/*            </Form.Item>*/}
                    {/*        </Col>*/}
                    {/*    </Row>)*/}
                    {/*})}*/}
                    {/*<Divider></Divider>*/}
                    {/*<Row gutter={20}>*/}
                    {/*    <Col span={4}>*/}
                    {/*        <Form.Item label="检测比例">*/}
                    {/*            {getFieldDecorator('requisition_testing_rate', {*/}
                    {/*                rules: [{ required: true, message: '请输入检测比例' }],*/}
                    {/*                // initialValue: this.props.RequisitionList.state.requisition.requisition_ps*/}
                    {/*            })*/}
                    {/*                (<AutoComplete*/}
                    {/*                    showSearch*/}
                    {/*                    placeholder="检测比例"*/}
                    {/*                    optionFilterProp="children"*/}
                    {/*                    dataSource={   this.state.distinctTestingRate.map((item,key)=>{*/}
                    {/*                        return(*/}
                    {/*                            <Option value={item.requisition_testing_rate}>{item.requisition_testing_rate}</Option>*/}
                    {/*                        )*/}
                    {/*                    })}*/}
                    {/*                />)}*/}
                    {/*        </Form.Item>*/}
                    {/*    </Col>*/}

                    {/*    <Col span={4}>*/}
                    {/*        <Form.Item label="坡口形式">*/}
                    {/*            {getFieldDecorator('requisition_bevel_form', {*/}
                    {/*                rules: [{ required: true, message: '请输入坡口形式' }],*/}
                    {/*                // initialValue: this.props.RequisitionList.state.requisition.requisition_ps*/}
                    {/*            })*/}
                    {/*                (<AutoComplete*/}
                    {/*                    showSearch*/}
                    {/*                    placeholder="坡口形式"*/}
                    {/*                    optionFilterProp="children"*/}
                    {/*                    dataSource={   this.state.distinctBevelForm.map((item,key)=>{*/}
                    {/*                        return(*/}
                    {/*                            <Option value={item.requisition_bevel_form}>{item.requisition_bevel_form}</Option>*/}
                    {/*                        )*/}
                    {/*                    })}*/}
                    {/*                />)}*/}
                    {/*        </Form.Item>*/}
                    {/*    </Col>*/}
                    {/*    /!*<Col span={4}>*!/*/}
                    {/*    /!*    <Form.Item label="来样编号">*!/*/}
                    {/*    /!*        {getFieldDecorator('requisition_samplenumber', {*!/*/}
                    {/*    /!*            rules: [{ required: true, message: '请输入来样编号' }],*!/*/}
                    {/*    /!*            // initialValue: this.props.RequisitionList.state.requisition.requisition_samplenumber*!/*/}
                    {/*    /!*        })(<Input placeholder="来样编号" />)}*!/*/}
                    {/*    /!*    </Form.Item>*!/*/}
                    {/*    /!*</Col>*!/*/}
                    {/*    <Col span={4}>*/}
                    {/*        <Form.Item label="透照方式">*/}
                    {/*            {getFieldDecorator('requisition_transillumination', {*/}
                    {/*                rules: [{ required: true, message: '请输入透照方式' }],*/}
                    {/*                // initialValue: this.props.RequisitionList.state.requisition.requisition_ps*/}
                    {/*            })*/}

                    {/*                (<AutoComplete*/}
                    {/*                    showSearch*/}
                    {/*                    placeholder="透照方式"*/}
                    {/*                    optionFilterProp="children"*/}
                    {/*                    dataSource={   this.state.distinctTransillumination.map((item,key)=>{*/}
                    {/*                        return(*/}
                    {/*                            <Option value={item.requisition_transillumination}>{item.requisition_transillumination}</Option>*/}
                    {/*                        )*/}
                    {/*                    })}*/}
                    {/*                />)}*/}
                    {/*        </Form.Item>*/}
                    {/*    </Col>*/}

                    {/*    <Col span={4}>*/}
                    {/*        <Form.Item label="检测设备">*/}
                    {/*            /!*{getFieldDecorator('requisition_testing_instrument', {*!/*/}
                    {/*            /!*    rules: [{ required: false, message: '请输入检测设备' }],*!/*/}
                    {/*            /!*    // initialValue: this.props.RequisitionList.state.requisition.requisition_reworktimes*!/*/}
                    {/*            /!*})(<Input placeholder="检测设备" />)}*!/*/}
                    {/*            {getFieldDecorator('requisition_testing_instrument', {*/}
                    {/*                rules: [{ required: true, message: '请输入检测设备' }],*/}
                    {/*                // initialValue: this.props.RequisitionList.state.requisition.requisition_testing_instrument*/}
                    {/*            })*/}
                    {/*            (<AutoComplete*/}
                    {/*                showSearch*/}
                    {/*                placeholder="检测设备"*/}
                    {/*                optionFilterProp="children"*/}
                    {/*                dataSource={   this.state.distinctTestingInstrument.map((item,key)=>{*/}
                    {/*                    return(*/}
                    {/*                        <Option value={item.requisition_testing_instrument}>{item.requisition_testing_instrument}</Option>*/}
                    {/*                    )*/}
                    {/*                })}*/}
                    {/*            />)}*/}
                    {/*        </Form.Item>*/}
                    {/*    </Col>*/}

                    {/*</Row>*/}
                    {/*<Row gutter={20}>*/}
                    {/*    <Col span={4}>*/}
                    {/*        <Form.Item label="设备型号">*/}
                    {/*            {getFieldDecorator('requisition_instrumenttype', {*/}
                    {/*                rules: [{ required: false, message: '请输入设备型号' }],*/}
                    {/*                // initialValue: this.props.RequisitionList.state.requisition.requisition_reworktimes*/}
                    {/*            })(<Input placeholder="设备型号" />)}*/}
                    {/*        </Form.Item>*/}
                    {/*    </Col>*/}

                    {/*    <Col span={4}>*/}
                    {/*        <Form.Item label="源强（Ci）">*/}
                    {/*            {getFieldDecorator('requisition_source_strength', {*/}
                    {/*                rules: [{ required: false, message: '请输入源强' }],*/}
                    {/*                // initialValue: this.props.RequisitionList.state.requisition.requisition_reportnumber*/}
                    {/*            })(<Input placeholder="源强（Ci）" />)}*/}
                    {/*        </Form.Item>*/}
                    {/*    </Col>*/}

                    {/*    <Col span={4}>*/}
                    {/*        <Form.Item label="源龄（天）">*/}
                    {/*            {getFieldDecorator('requisition_source_age', {*/}
                    {/*                rules: [{ required: false, message: '请输入源龄' }],*/}
                    {/*                // initialValue: this.props.RequisitionList.state.requisition.requisition_reportnumber*/}
                    {/*            })(<Input placeholder="源龄（天）" />)}*/}
                    {/*        </Form.Item>*/}
                    {/*    </Col>*/}

                    {/*    <Col span={4}>*/}
                    {/*        <Form.Item label="焦距（mm）">*/}
                    {/*            {getFieldDecorator('requisition_focus', {*/}
                    {/*                rules: [{ required: false, message: '请输入焦距' }],*/}
                    {/*                // initialValue: this.props.RequisitionList.state.requisition.requisition_focus*/}
                    {/*            })(<Input placeholder="焦距" />)}*/}
                    {/*        </Form.Item>*/}
                    {/*    </Col>*/}

                    {/*    <Col span={4}>*/}
                    {/*        <Form.Item label="焦点尺寸(mm)">*/}
                    {/*            {getFieldDecorator('requisition_focus_size', {*/}
                    {/*                rules: [{ required: false, message: '请输入焦点尺寸' }],*/}
                    {/*            })*/}
                    {/*                (<AutoComplete*/}
                    {/*                    showSearch*/}
                    {/*                    placeholder="焦点尺寸(mm)"*/}
                    {/*                    optionFilterProp="children"*/}
                    {/*                    dataSource={   this.state.distinctFocusSize.map((item,key)=>{*/}
                    {/*                        return(*/}
                    {/*                            <Option value={item.requisition_focus_size}>{item.requisition_focus_size}</Option>*/}
                    {/*                        )*/}
                    {/*                    })}*/}
                    {/*                />)}*/}
                    {/*        </Form.Item>*/}
                    {/*    </Col>*/}
                    {/*    <Col span={4}>*/}
                    {/*        <Form.Item label="管电压（KV）">*/}
                    {/*            {getFieldDecorator('requisition_tubevoltage', {*/}
                    {/*                rules: [{ required: false, message: '请输入管电压' }],*/}
                    {/*                // initialValue: this.props.RequisitionList.state.requisition.requisition_tubevoltage*/}
                    {/*            })(<Input placeholder="管电压（KV）" />)}*/}
                    {/*        </Form.Item>*/}
                    {/*    </Col>*/}





                    {/*</Row>*/}
                    {/*<Row gutter={20}>*/}
                    {/*    <Col span={4}>*/}
                    {/*        <Form.Item label="管电流（mA）">*/}
                    {/*            {getFieldDecorator('requisition_tubecurrent', {*/}
                    {/*                rules: [{ required: false, message: '请输入管电流' }],*/}
                    {/*                // initialValue: this.props.RequisitionList.state.requisition.requisition_tubecurrent*/}
                    {/*            })(<Input placeholder="管电流" />)}*/}
                    {/*        </Form.Item>*/}
                    {/*    </Col>*/}

                    {/*    <Col span={4}>*/}
                    {/*        <Form.Item label="材质">*/}

                    {/*            {getFieldDecorator('requisition_material', {*/}
                    {/*                rules: [{ required: false, message: '请输入材质' }],*/}
                    {/*                // initialValue: this.props.RequisitionList.state.requisition.requisition_tubecurrent*/}
                    {/*            })(<Input placeholder="材质" />)}*/}
                    {/*        </Form.Item>*/}
                    {/*    </Col>*/}

                    {/*    <Col span={4}>*/}
                    {/*        <Form.Item label="胶片类型">*/}
                    {/*            {getFieldDecorator('requisition_filmtype', {*/}
                    {/*                rules: [{ required: false, message: '请输入胶片类型' }],*/}
                    {/*            })*/}
                    {/*                (<AutoComplete*/}
                    {/*                    showSearch*/}
                    {/*                    placeholder="胶片类型"*/}
                    {/*                    optionFilterProp="children"*/}
                    {/*                    dataSource={   this.state.distinctFilmtype.map((item,key)=>{*/}
                    {/*                        return(*/}
                    {/*                            <Option value={item.requisition_filmtype}>{item.requisition_filmtype}</Option>*/}
                    {/*                        )*/}
                    {/*                    })}*/}
                    {/*                />)}*/}
                    {/*        </Form.Item>*/}
                    {/*    </Col>*/}
                    {/*    <Col span={4}>*/}
                    {/*        <Form.Item label="增感方式">*/}
                    {/*            {getFieldDecorator('requisition_sensitization_method', {*/}
                    {/*                rules: [{ required: false, message: '请输入增感方式' }],*/}
                    {/*                // initialValue: this.props.RequisitionList.state.requisition.requisition_ps*/}
                    {/*            })*/}
                    {/*                (<AutoComplete*/}
                    {/*                    showSearch*/}
                    {/*                    placeholder="增感方式"*/}
                    {/*                    optionFilterProp="children"*/}
                    {/*                    dataSource={   this.state.distinctSensitizationMethod.map((item,key)=>{*/}
                    {/*                        return(*/}
                    {/*                            <Option value={item.requisition_sensitization_method}>{item.requisition_sensitization_method}</Option>*/}
                    {/*                        )*/}
                    {/*                    })}*/}
                    {/*                />)}*/}
                    {/*        </Form.Item>*/}
                    {/*    </Col>*/}
                    {/*    <Col span={4}>*/}
                    {/*        <Form.Item label="底片处理方式">*/}
                    {/*            {getFieldDecorator('requisition_film_processing_method', {*/}
                    {/*                rules: [{ required: false, message: '请输入底片处理方式' }],*/}
                    {/*            })*/}
                    {/*                (<AutoComplete*/}
                    {/*                    showSearch*/}
                    {/*                    placeholder="底片处理方式"*/}
                    {/*                    optionFilterProp="children"*/}
                    {/*                    dataSource={   this.state.distinctFilmProcessingMethod.map((item,key)=>{*/}
                    {/*                        return(*/}
                    {/*                            <Option value={item.requisition_film_processing_method}>{item.requisition_film_processing_method}</Option>*/}
                    {/*                        )*/}
                    {/*                    })}*/}
                    {/*                />)}*/}
                    {/*        </Form.Item>*/}
                    {/*    </Col>*/}
                    {/*    /!*<Col span={4}>*!/*/}
                    {/*    /!*    <Form.Item label="曝光时间">*!/*/}
                    {/*    /!*        {getFieldDecorator('requisition_exposuretime', {*!/*/}
                    {/*    /!*            rules: [{ required: false, message: '请输入曝光时间' }],*!/*/}
                    {/*    /!*            // initialValue: this.props.RequisitionList.state.requisition.requisition_exposuretime*!/*/}
                    {/*    /!*        })(<Input placeholder="曝光时间" />)}*!/*/}
                    {/*    /!*    </Form.Item>*!/*/}
                    {/*    /!*</Col>*!/*/}
                    {/*    <Col span={4}>*/}
                    {/*        <Form.Item label="报告编号">*/}
                    {/*            {getFieldDecorator('requisition_reportnumber', {*/}
                    {/*                rules: [{ required: true, message: '请输入报告编号' }],*/}
                    {/*                // initialValue: this.props.RequisitionList.state.requisition.requisition_reportnumber*/}
                    {/*            })(<Input placeholder="报告编号" />)}*/}
                    {/*        </Form.Item>*/}
                    {/*    </Col>*/}

                    {/*    /!*<Col span={4}>*!/*/}
                    {/*    /!*    <Form.Item label="钢号">*!/*/}
                    {/*    /!*        {getFieldDecorator('requisition_steelnumber', {*!/*/}
                    {/*    /!*            rules: [{ required: true, message: '请输入钢号' }],*!/*/}
                    {/*    /!*            // initialValue: this.props.RequisitionList.state.requisition.requisition_steelnumber*!/*/}
                    {/*    /!*        })(<Input placeholder="钢号" />)}*!/*/}
                    {/*    /!*    </Form.Item>*!/*/}
                    {/*    /!*</Col>*!/*/}

                    {/*</Row>*/}
                    {/*<Row gutter={20}>*/}
                    {/*    /!*    <Col span={4}>*!/*/}
                    {/*    /!*        <Form.Item label="结构名称">*!/*/}
                    {/*    /!*            {getFieldDecorator('requisition_structurename', {*!/*/}
                    {/*    /!*                rules: [{ required: true, message: '请输入结构名称' }],*!/*/}
                    {/*    /!*                initialValue: this.props.RequisitionList.state.requisition.requisition_structurename*!/*/}
                    {/*    /!*            })(<Input placeholder="结构名称" />)}*!/*/}
                    {/*    /!*        </Form.Item>*!/*/}
                    {/*    /!*    </Col>*!/*/}
                    {/*    /!*    <Col span={4}>*!/*/}
                    {/*    /!*        <Form.Item label="存放位置">*!/*/}
                    {/*    /!*            {getFieldDecorator('requisition_saveplace', {*!/*/}
                    {/*    /!*                rules: [{ required: true, message: '请输入存放位置' }],*!/*/}
                    {/*    /!*                initialValue: this.props.RequisitionList.state.requisition.requisition_saveplace*!/*/}
                    {/*    /!*            })(<Input placeholder="存放位置" />)}*!/*/}
                    {/*    /!*        </Form.Item>*!/*/}
                    {/*    /!*    </Col>*!/*/}
                    {/*    /!*    <Col span={4}>*!/*/}
                    {/*    /!*        <Form.Item label="增感屏">*!/*/}
                    {/*    /!*            {getFieldDecorator('requisition_intensifyscreen', {*!/*/}
                    {/*    /!*                rules: [{ required: true, message: '请输入增感屏' }],*!/*/}
                    {/*    /!*                initialValue: this.props.RequisitionList.state.requisition.requisition_intensifyscreen*!/*/}
                    {/*    /!*            })(<Input placeholder="增感屏" />)}*!/*/}
                    {/*    /!*        </Form.Item>*!/*/}
                    {/*    /!*    </Col>*!/*/}

                    {/*    /!*    <Col span={4}>*!/*/}
                    {/*    /!*        <Form.Item label="敏感度">*!/*/}
                    {/*    /!*            {getFieldDecorator('requisition_sensitivity', {*!/*/}
                    {/*    /!*                rules: [{ required: true, message: '请输入敏感度' }],*!/*/}
                    {/*    /!*                initialValue: this.props.RequisitionList.state.requisition.requisition_sensitivity*!/*/}
                    {/*    /!*            })(<Input placeholder="敏感度" />)}*!/*/}
                    {/*    /!*        </Form.Item>*!/*/}
                    {/*    /!*    </Col>*!/*/}
                    {/*    /!*    <Col span={4}>*!/*/}
                    {/*    /!*        <Form.Item label="显影时间">*!/*/}
                    {/*    /!*            {getFieldDecorator('requisition_developmenttime', {*!/*/}
                    {/*    /!*                rules: [{ required: true, message: '请输入显影时间' }],*!/*/}
                    {/*    /!*                initialValue: this.props.RequisitionList.state.requisition.requisition_developmenttime*!/*/}
                    {/*    /!*            })(<Input placeholder="显影时间" />)}*!/*/}
                    {/*    /!*        </Form.Item>*!/*/}
                    {/*    /!*    </Col>*!/*/}
                    {/*    /!*    <Col span={4}>*!/*/}
                    {/*    /!*        <Form.Item label="显影温度">*!/*/}
                    {/*    /!*            {getFieldDecorator('requisition_developertemperature', {*!/*/}
                    {/*    /!*                rules: [{ required: true, message: '请输入显影温度' }],*!/*/}
                    {/*    /!*                initialValue: this.props.RequisitionList.state.requisition.requisition_developertemperature*!/*/}
                    {/*    /!*            })(<Input placeholder="显影温度" />)}*!/*/}
                    {/*    /!*        </Form.Item>*!/*/}
                    {/*    /!*    </Col>*!/*/}
                    {/*    /!*</Row>*!/*/}
                    {/*    /!*<Row gutter={20}>*!/*/}
                    {/*    /!*    <Col span={4}>*!/*/}
                    {/*    /!*        <Form.Item label="返工次数">*!/*/}
                    {/*    /!*            {getFieldDecorator('requisition_reworktimes', {*!/*/}
                    {/*    /!*                rules: [{ required: true, message: '请输入返工次数' }],*!/*/}
                    {/*    /!*                initialValue: this.props.RequisitionList.state.requisition.requisition_reworktimes*!/*/}
                    {/*    /!*            })(<Input placeholder="返工次数" />)}*!/*/}
                    {/*    /!*        </Form.Item>*!/*/}
                    {/*    /!*    </Col>*!/*/}
                    {/*    /!*    <Col span={4}>*!/*/}
                    {/*    /!*        <Form.Item label="接头形式">*!/*/}
                    {/*    /!*            {getFieldDecorator('requisition_jointform', {*!/*/}
                    {/*    /!*                rules: [{ required: true, message: '请输入接头形式' }],*!/*/}
                    {/*    /!*                initialValue: this.props.RequisitionList.state.requisition.requisition_jointform*!/*/}
                    {/*    /!*            })(<Input placeholder="接头形式" />)}*!/*/}
                    {/*    /!*        </Form.Item>*!/*/}
                    {/*    /!*    </Col>*!/*/}
                    {/*    /!*    <Col span={4}>*!/*/}
                    {/*    /!*        <Form.Item label="仪器型号">*!/*/}
                    {/*    /!*            {getFieldDecorator('requisition_instrumenttype', {*!/*/}
                    {/*    /!*                rules: [{ required: true, message: '请输入仪器型号' }],*!/*/}
                    {/*    /!*                initialValue: this.props.RequisitionList.state.requisition.requisition_instrumenttype*!/*/}
                    {/*    /!*            })(<Input placeholder="仪器型号" />)}*!/*/}
                    {/*    /!*        </Form.Item>*!/*/}
                    {/*    /!*    </Col>*!/*/}
                    {/*    <Col span={4}>*/}
                    {/*        <Form.Item label="曝光时间(时)">*/}
                    {/*            {getFieldDecorator('requisition_exposuretime_hour', {*/}
                    {/*                rules: [{ required: false, message: '请输入曝光时间(时)' }],*/}
                    {/*                // initialValue: this.props.RequisitionList.state.requisition.requisition_exposuretime_hour*/}
                    {/*            })(<Input placeholder="曝光时间(时)" />)}*/}
                    {/*        </Form.Item>*/}
                    {/*    </Col>*/}
                    {/*    <Col span={4}>*/}
                    {/*        <Form.Item label="曝光时间(分)">*/}
                    {/*            {getFieldDecorator('requisition_exposuretime_minute', {*/}
                    {/*                rules: [{ required: false, message: '请输入曝光时间(分)' }],*/}
                    {/*                // initialValue: this.props.RequisitionList.state.requisition.requisition_exposuretime_minute*/}
                    {/*            })(<Input placeholder="曝光时间(分)" />)}*/}
                    {/*        </Form.Item>*/}
                    {/*    </Col>*/}
                    {/*    <Col span={4}>*/}
                    {/*        <Form.Item label="曝光时间(秒)">*/}
                    {/*            {getFieldDecorator('requisition_exposuretime_second', {*/}
                    {/*                rules: [{ required: false, message: '请输入曝光时间(秒)' }],*/}
                    {/*                // initialValue: this.props.RequisitionList.state.requisition.requisition_exposuretime_second*/}
                    {/*            })(<Input placeholder="曝光时间(秒)" />)}*/}
                    {/*        </Form.Item>*/}
                    {/*    </Col>*/}
                    {/*    <Col span={4}>*/}
                    {/*        <Form.Item label="增感屏(前屏)">*/}
                    {/*            {getFieldDecorator('requisition_intensifyscreen_front', {*/}
                    {/*                rules: [{ required: false, message: '请输入增感屏(前屏)' }],*/}
                    {/*                // initialValue: this.props.RequisitionList.state.requisition.requisition_intensifyscreen_front*/}
                    {/*            })*/}
                    {/*            (<AutoComplete*/}
                    {/*                showSearch*/}
                    {/*                placeholder="增感屏(前屏)"*/}
                    {/*                optionFilterProp="children"*/}
                    {/*                dataSource={   this.state.distinctIntensifyScreenFront.map((item,key)=>{*/}
                    {/*                    return(*/}
                    {/*                        <Option value={item.requisition_intensifyscreen_front}>{item.requisition_intensifyscreen_front}</Option>*/}
                    {/*                    )*/}
                    {/*                })}*/}
                    {/*            />)}*/}
                    {/*        </Form.Item>*/}
                    {/*    </Col>*/}
                    {/*    <Col span={4}>*/}
                    {/*        <Form.Item label="增感屏(中屏)">*/}
                    {/*            /!*{getFieldDecorator('requisition_intensifyscreen_middle', {*!/*/}
                    {/*            /!*    rules: [{ required: false, message: '增感屏(中屏)' }],*!/*/}
                    {/*            /!*    // initialValue: this.props.RequisitionList.state.requisition.requisition_intensifyscreen_middle*!/*/}
                    {/*            /!*})(<Input placeholder="增感屏(中屏)" />)}*!/*/}
                    {/*            {getFieldDecorator('requisition_intensifyscreen_middle', {*/}
                    {/*                rules: [{ required: false, message: '请输入增感屏(中屏)' }],*/}
                    {/*                // initialValue: this.props.RequisitionList.state.requisition.requisition_intensifyscreen_middle*/}
                    {/*            })*/}
                    {/*            (<AutoComplete*/}
                    {/*                showSearch*/}
                    {/*                placeholder="增感屏(中屏)"*/}
                    {/*                optionFilterProp="children"*/}
                    {/*                dataSource={   this.state.distinctIntensifyScreenMiddle.map((item,key)=>{*/}
                    {/*                    return(*/}
                    {/*                        <Option value={item.requisition_intensifyscreen_middle}>{item.requisition_intensifyscreen_middle}</Option>*/}
                    {/*                    )*/}
                    {/*                })}*/}
                    {/*            />)}*/}
                    {/*        </Form.Item>*/}
                    {/*    </Col>*/}
                    {/*    <Col span={4}>*/}
                    {/*        <Form.Item label="增感屏(后屏)">*/}
                    {/*            /!*{getFieldDecorator('requisition_intensifyscreen_behind', {*!/*/}
                    {/*            /!*    rules: [{ required: false, message: '增感屏(后屏)' }],*!/*/}
                    {/*            /!*    // initialValue: this.props.RequisitionList.state.requisition.requisition_intensifyscreen_behind*!/*/}
                    {/*            /!*})(<Input placeholder="增感屏(后屏)" />)}*!/*/}
                    {/*            {getFieldDecorator('requisition_intensifyscreen_behind', {*/}
                    {/*                rules: [{ required: false, message: '请输入增感屏(后屏)' }],*/}
                    {/*                // initialValue: this.props.RequisitionList.state.requisition.requisition_intensifyscreen_behind*/}
                    {/*            })*/}
                    {/*            (<AutoComplete*/}
                    {/*                showSearch*/}
                    {/*                placeholder="增感屏(后屏)"*/}
                    {/*                optionFilterProp="children"*/}
                    {/*                dataSource={   this.state.distinctIntensifyScreenBehind.map((item,key)=>{*/}
                    {/*                    return(*/}
                    {/*                        <Option value={item.requisition_intensifyscreen_behind}>{item.requisition_intensifyscreen_behind}</Option>*/}
                    {/*                    )*/}
                    {/*                })}*/}
                    {/*            />)}*/}
                    {/*        </Form.Item>*/}
                    {/*    </Col>*/}
                    {/*</Row>*/}
                    {/*<Row gutter={20}>*/}

                    {/*    /!*<Col span={4}>*!/*/}
                    {/*    /!*    <Form.Item label="施工单位">*!/*/}
                    {/*    /!*        {getFieldDecorator('requisition_constructunit', {*!/*/}
                    {/*    /!*            rules: [{ required: true, message: '请输入施工单位' }],*!/*/}
                    {/*    /!*            // initialValue: this.props.RequisitionList.state.requisition.requisition_constructunit*!/*/}
                    {/*    /!*        })(<Input placeholder="施工单位" />)}*!/*/}
                    {/*    /!*    </Form.Item>*!/*/}
                    {/*    /!*</Col>*!/*/}
                    {/*    /!*<Col span={4}>*!/*/}
                    {/*    /!*    <Form.Item label="钢号">*!/*/}
                    {/*    /!*        {getFieldDecorator('requisition_steelnumber', {*!/*/}
                    {/*    /!*            rules: [{ required: true, message: '请输入钢号' }],*!/*/}
                    {/*    /!*            // initialValue: this.props.RequisitionList.state.requisition.requisition_steelnumber*!/*/}
                    {/*    /!*        })(<Input placeholder="钢号" />)}*!/*/}
                    {/*    /!*    </Form.Item>*!/*/}
                    {/*    /!*</Col>*!/*/}
                    {/*    <Col span={4}>*/}
                    {/*        <Form.Item label="焊接方法">*/}
                    {/*            /!*{getFieldDecorator('requisition_weldingmethod', {*!/*/}
                    {/*            /!*    rules: [{ required: true, message: '请输入焊接方法' }],*!/*/}
                    {/*            /!*    // initialValue: this.props.RequisitionList.state.requisition.requisition_weldingmethod*!/*/}
                    {/*            /!*})(<Input placeholder="焊接方法" />)}*!/*/}
                    {/*            {getFieldDecorator('requisition_weldingmethod', {*/}
                    {/*                rules: [{ required: false, message: '请输入焊接方法' }],*/}
                    {/*            })*/}
                    {/*            (<AutoComplete*/}
                    {/*                showSearch*/}
                    {/*                placeholder="焊接方法"*/}
                    {/*                optionFilterProp="children"*/}
                    {/*                dataSource={   this.state.distinctWeldingMethod.map((item,key)=>{*/}
                    {/*                    return(*/}
                    {/*                        <Option value={item.requisition_weldingmethod}>{item.requisition_weldingmethod}</Option>*/}
                    {/*                    )*/}
                    {/*                })}*/}
                    {/*            />)}*/}
                    {/*        </Form.Item>*/}
                    {/*    </Col>*/}
                    {/*    /!*<Col span={4}>*!/*/}
                    {/*    /!*    <Form.Item label="厚度">*!/*/}
                    {/*    /!*        {getFieldDecorator('requisition_density', {*!/*/}
                    {/*    /!*            rules: [{ required: true, message: '请输入厚度' }],*!/*/}
                    {/*    /!*            // initialValue: this.props.RequisitionList.state.requisition.requisition_totalnumber*!/*/}
                    {/*    /!*        })(<Input placeholder="厚度" />)}*!/*/}
                    {/*    /!*    </Form.Item>*!/*/}
                    {/*    /!*</Col>*!/*/}
                    {/*    <Col span={4}>*/}
                    {/*        <Form.Item label="焊缝数量">*/}
                    {/*            {getFieldDecorator('requisition_totalnumber', {*/}
                    {/*                rules: [{ required: true, message: '请输入焊缝数量' }],*/}
                    {/*                // initialValue: this.props.RequisitionList.state.requisition.requisition_density*/}
                    {/*            })(<Input placeholder="焊缝数量" />)}*/}
                    {/*        </Form.Item>*/}
                    {/*    </Col>*/}

                    {/*    /!*<Col span={4}>*!/*/}
                    {/*    /!*    <Form.Item label="检测比例">*!/*/}
                    {/*    /!*        {getFieldDecorator('requisition_testing_rate', {*!/*/}
                    {/*    /!*            rules: [{ required: true, message: '请输入检测比例' }],*!/*/}
                    {/*    /!*            // initialValue: this.props.RequisitionList.state.requisition.requisition_ps*!/*/}
                    {/*    /!*        })*!/*/}
                    {/*    /!*            (<AutoComplete*!/*/}
                    {/*    /!*                showSearch*!/*/}
                    {/*    /!*                placeholder="检测比例"*!/*/}
                    {/*    /!*                optionFilterProp="children"*!/*/}
                    {/*    /!*                dataSource={   this.state.distinctTestingRate.map((item,key)=>{*!/*/}
                    {/*    /!*                    return(*!/*/}
                    {/*    /!*                        <Option value={item.requisition_testing_rate}>{item.requisition_testing_rate}</Option>*!/*/}
                    {/*    /!*                    )*!/*/}
                    {/*    /!*                })}*!/*/}
                    {/*    /!*            />)}*!/*/}
                    {/*    /!*    </Form.Item>*!/*/}
                    {/*    /!*</Col>*!/*/}
                    {/*    /!*<Col span={4}>*!/*/}
                    {/*    /!*    <Form.Item label="坡口形式">*!/*/}
                    {/*    /!*        {getFieldDecorator('requisition_bevel_form', {*!/*/}
                    {/*    /!*            rules: [{ required: true, message: '请输入坡口形式' }],*!/*/}
                    {/*    /!*            // initialValue: this.props.RequisitionList.state.requisition.requisition_ps*!/*/}
                    {/*    /!*        })*!/*/}
                    {/*    /!*            (<AutoComplete*!/*/}
                    {/*    /!*                showSearch*!/*/}
                    {/*    /!*                placeholder="坡口形式"*!/*/}
                    {/*    /!*                optionFilterProp="children"*!/*/}
                    {/*    /!*                dataSource={   this.state.distinctBevelForm.map((item,key)=>{*!/*/}
                    {/*    /!*                    return(*!/*/}
                    {/*    /!*                        <Option value={item.requisition_bevel_form}>{item.requisition_bevel_form}</Option>*!/*/}
                    {/*    /!*                    )*!/*/}
                    {/*    /!*                })}*!/*/}
                    {/*    /!*            />)}*!/*/}
                    {/*    /!*    </Form.Item>*!/*/}
                    {/*    /!*</Col>*!/*/}
                    {/*    /!*<Col span={4}>*!/*/}
                    {/*    /!*    <Form.Item label="透照方式">*!/*/}
                    {/*    /!*        {getFieldDecorator('requisition_transillumination', {*!/*/}
                    {/*    /!*            rules: [{ required: true, message: '请输入透照方式' }],*!/*/}
                    {/*    /!*            // initialValue: this.props.RequisitionList.state.requisition.requisition_ps*!/*/}
                    {/*    /!*        })*!/*/}
                    {/*    /!*            (<AutoComplete*!/*/}
                    {/*    /!*                showSearch*!/*/}
                    {/*    /!*                placeholder="透照方式"*!/*/}
                    {/*    /!*                optionFilterProp="children"*!/*/}
                    {/*    /!*                dataSource={   this.state.distinctTransillumination.map((item,key)=>{*!/*/}
                    {/*    /!*                    return(*!/*/}
                    {/*    /!*                        <Option value={item.requisition_transillumination}>{item.requisition_transillumination}</Option>*!/*/}
                    {/*    /!*                    )*!/*/}
                    {/*    /!*                })}*!/*/}
                    {/*    /!*            />)}*!/*/}
                    {/*    /!*    </Form.Item>*!/*/}
                    {/*    /!*</Col>*!/*/}
                    {/*    /!*<Col span={4}>*!/*/}
                    {/*    /!*    <Form.Item label="焦点尺寸(mm)">*!/*/}
                    {/*    /!*        {getFieldDecorator('requisition_focus_size', {*!/*/}
                    {/*    /!*            rules: [{ required: true, message: '请输入焦点尺寸' }],*!/*/}
                    {/*    /!*            // initialValue: this.props.RequisitionList.state.requisition.requisition_ps*!/*/}
                    {/*    /!*        })*!/*/}
                    {/*    /!*            (<AutoComplete*!/*/}
                    {/*    /!*                showSearch*!/*/}
                    {/*    /!*                placeholder="焦点尺寸(mm)"*!/*/}
                    {/*    /!*                optionFilterProp="children"*!/*/}
                    {/*    /!*                dataSource={   this.state.distinctFocusSize.map((item,key)=>{*!/*/}
                    {/*    /!*                    return(*!/*/}
                    {/*    /!*                        <Option value={item.requisition_focus_size}>{item.requisition_focus_size}</Option>*!/*/}
                    {/*    /!*                    )*!/*/}
                    {/*    /!*                })}*!/*/}
                    {/*    /!*            />)}*!/*/}
                    {/*    /!*    </Form.Item>*!/*/}
                    {/*    /!*</Col>*!/*/}

                    {/*</Row>*/}
                    {/*/!*<Row gutter={20}>*!/*/}
                    {/*/!*    <Col span={4}>*!/*/}
                    {/*/!*        <Form.Item label="结构名称">*!/*/}
                    {/*/!*            {getFieldDecorator('requisition_structurename', {*!/*/}
                    {/*/!*                rules: [{ required: true, message: '请输入结构名称' }],*!/*/}
                    {/*/!*                // initialValue: this.props.RequisitionList.state.requisition.requisition_structurename*!/*/}
                    {/*/!*            })(<Input placeholder="结构名称" />)}*!/*/}
                    {/*/!*        </Form.Item>*!/*/}
                    {/*/!*    </Col>*!/*/}
                    {/*/!*    <Col span={4}>*!/*/}
                    {/*/!*        <Form.Item label="存放位置">*!/*/}
                    {/*/!*            {getFieldDecorator('requisition_saveplace', {*!/*/}
                    {/*/!*                rules: [{ required: true, message: '请输入存放位置' }],*!/*/}
                    {/*/!*                // initialValue: this.props.RequisitionList.state.requisition.requisition_saveplace*!/*/}
                    {/*/!*            })(<Input placeholder="存放位置" />)}*!/*/}
                    {/*/!*        </Form.Item>*!/*/}
                    {/*/!*    </Col>*!/*/}
                    {/*/!*    <Col span={4}>*!/*/}
                    {/*/!*        <Form.Item label="增感屏">*!/*/}
                    {/*/!*            {getFieldDecorator('requisition_intensifyscreen', {*!/*/}
                    {/*/!*                rules: [{ required: true, message: '请输入增感屏' }],*!/*/}
                    {/*/!*                // initialValue: this.props.RequisitionList.state.requisition.requisition_intensifyscreen*!/*/}
                    {/*/!*            })(<Input placeholder="增感屏" />)}*!/*/}
                    {/*/!*        </Form.Item>*!/*/}
                    {/*/!*    </Col>*!/*/}

                    {/*/!*    <Col span={4}>*!/*/}
                    {/*/!*        <Form.Item label="敏感度">*!/*/}
                    {/*/!*            {getFieldDecorator('requisition_sensitivity', {*!/*/}
                    {/*/!*                rules: [{ required: true, message: '请输入敏感度' }],*!/*/}
                    {/*/!*                // initialValue: this.props.RequisitionList.state.requisition.requisition_sensitivity*!/*/}
                    {/*/!*            })(<Input placeholder="敏感度" />)}*!/*/}
                    {/*/!*        </Form.Item>*!/*/}
                    {/*/!*    </Col>*!/*/}
                    {/*/!*    <Col span={4}>*!/*/}
                    {/*/!*        <Form.Item label="显影时间">*!/*/}
                    {/*/!*            {getFieldDecorator('requisition_developmenttime', {*!/*/}
                    {/*/!*                rules: [{ required: true, message: '请输入显影时间' }],*!/*/}
                    {/*/!*                // initialValue: this.props.RequisitionList.state.requisition.requisition_developmenttime*!/*/}
                    {/*/!*            })(<Input placeholder="显影时间" />)}*!/*/}
                    {/*/!*        </Form.Item>*!/*/}
                    {/*/!*    </Col>*!/*/}
                    {/*/!*    <Col span={4}>*!/*/}
                    {/*/!*        <Form.Item label="显影温度">*!/*/}
                    {/*/!*            {getFieldDecorator('requisition_developertemperature', {*!/*/}
                    {/*/!*                rules: [{ required: true, message: '请输入显影温度' }],*!/*/}
                    {/*/!*                // initialValue: this.props.RequisitionList.state.requisition.requisition_developertemperature*!/*/}
                    {/*/!*            })(<Input placeholder="显影温度" />)}*!/*/}
                    {/*/!*        </Form.Item>*!/*/}
                    {/*/!*    </Col>*!/*/}
                    {/*/!*</Row>*!/*/}
                    {/*/!*<Row gutter={20}>*!/*/}
                    {/*/!*    <Col span={4}>*!/*/}
                    {/*/!*        <Form.Item label="返工次数">*!/*/}
                    {/*/!*            {getFieldDecorator('requisition_reworktimes', {*!/*/}
                    {/*/!*                rules: [{ required: true, message: '请输入返工次数' }],*!/*/}
                    {/*/!*                // initialValue: this.props.RequisitionList.state.requisition.requisition_reworktimes*!/*/}
                    {/*/!*            })(<Input placeholder="返工次数" />)}*!/*/}
                    {/*/!*        </Form.Item>*!/*/}
                    {/*/!*    </Col>*!/*/}
                    {/*/!*    <Col span={4}>*!/*/}
                    {/*/!*        <Form.Item label="接头形式">*!/*/}
                    {/*/!*            {getFieldDecorator('requisition_jointform', {*!/*/}
                    {/*/!*                rules: [{ required: true, message: '请输入接头形式' }],*!/*/}
                    {/*/!*                // initialValue: this.props.RequisitionList.state.requisition.requisition_jointform*!/*/}
                    {/*/!*            })(<Input placeholder="接头形式" />)}*!/*/}
                    {/*/!*        </Form.Item>*!/*/}
                    {/*/!*    </Col>*!/*/}
                    {/*/!*    <Col span={4}>*!/*/}
                    {/*/!*        <Form.Item label="仪器型号">*!/*/}
                    {/*/!*            {getFieldDecorator('requisition_instrumenttype', {*!/*/}
                    {/*/!*                rules: [{ required: true, message: '请输入仪器型号' }],*!/*/}
                    {/*/!*                // initialValue: this.props.RequisitionList.state.requisition.requisition_instrumenttype*!/*/}
                    {/*/!*            })(<Input placeholder="仪器型号" />)}*!/*/}
                    {/*/!*        </Form.Item>*!/*/}
                    {/*/!*    </Col>*!/*/}
                    {/*/!*</Row>*!/*/}


                    {/*<br/><br/>*/}
                    {/*<Divider />*/}
                    <Row gutter={16} >
                        <Col span={4}>
                            <Form.Item >
                                <Button type="primary"  htmlType="submit">增加申请单信息</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
        );

    }
}

const Requisition_manage = Form.create()(AddRequisition);

export default Requisition_manage;

// export default AddRequisition;