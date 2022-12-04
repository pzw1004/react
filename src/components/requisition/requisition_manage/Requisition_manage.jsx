import {
    Drawer, Form, Button, Col, Row, Input, Select, Divider, Radio, AutoComplete, DatePicker
} from 'antd';
import React,{Component} from "react";
import axios from "axios";
import '../../../config/config'
import saveLoginInfo from '../../../utils/saveLogInfo'
import moment from "moment";

const { Option } = Select;
const RadioGroup = Radio.Group;

class DrawerForm extends Component {

    constructor(props){
        super(props);

        this.state = {
            visible: false,
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
        };
    }

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
        // this.getProductNameById(this.props.RequisitionList.state.requisition.requisition_product_id);
        this.getAllProduct();

    }

    onClose = () => {
        this.props.RequisitionList.setState({
            visible: false,
        });
    };

    completeApproval = () => {
        let member_id = JSON.parse(sessionStorage.getItem("temp_user")).member_id;
        let api = global.AppConfig.serverIP + '/completeApproval?requisition_id='+this.props.RequisitionList.state.requisition.requisition_id+'&requisition_state='+this.props.RequisitionList.state.requisition.requisition_state + '&member_id='+member_id+'&product_id='+this.props.RequisitionList.state.product_id;
        axios.post(api)
            .then((response)=> {
                console.log(response);
                console.log(JSON.stringify(response.data));
                //this.props.MemberList.run();
                alert("已完成审批");
                window.location.replace(window.location.href);
                // this.props.RequisitionList.shenpiState(response.data);
                // this.props.RequisitionList.setState({
                //     requisitionList: response.data,
                // })
            })
            .catch( (error)=> {
                console.log(error);
            });
        this.onClose();
    };

    rejectRequest=()=>{
        //todo 跳转bug
        let api = global.AppConfig.serverIP + '/rejectRequest?requisition_id='+this.props.RequisitionList.state.requisition.requisition_id+'&requisition_state='+this.props.RequisitionList.state.requisition.requisition_state+'&product_id='+this.props.RequisitionList.state.product_id;
        axios.post(api)
            .then((response)=> {
                console.log(response);
                console.log(JSON.stringify(response.data));
                //this.props.MemberList.run();
                alert("已完成驳回");
                window.location.replace(window.location.href);//驳回是指：当级别n完成审核时，而n+1认为n的审核不正确，可以把上一级的驳回，让其重新审核
                // this.props.RequisitionList.shenpiState(response.data);
                // this.props.RequisitionList.setState({
                //     requisitionList: response.data,
                // })
            })
            .catch( (error)=> {
                console.log(error);
            });
        this.onClose();
    };

    handleSubmit = (e) => {
        e.preventDefault();
        console.log("this.props.RequisitionList.state.requisition",this.props.RequisitionList.state.requisition)
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.addRequisition(values);
                this.onClose();
            }
        });

    };

    getAllProduct=()=>{

        let api = global.AppConfig.serverIP + '/getAllProduct';
        console.log(api);
        axios.post(api)
            .then((response)=> {
                this.setState({
                    productList: response.data,
                });
                // console.log("!!!!!!!!!!!!!!????????????");
                // console.log(response.data);
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    // getProductNameById=(productId)=>{
    //     var productName;
    //     // console.log(productId);
    //     let api = global.AppConfig.serverIP + '/getProductByProductId?productId='+productId;
    //     console.log(api);
    //     axios.get(api)
    //         .then((response)=> {
    //             // this.setState({
    //             //     curr_product_name: response.data.product_name,
    //             // });
    //             this.props.form.setFieldsValue({
    //                 ['requisition_product_name']: response.data.product_name
    //             });
    //             productName = response.data.product_name;
    //         })
    //         .catch( (error)=> {
    //             console.log(error);
    //             return "Error";
    //         });
    //     // return productName
    // };

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
                // console.log("????????");
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
                // console.log(response);
                // console.log(JSON.stringify(response.data));
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
                // console.log(response);
                // console.log(JSON.stringify(response.data));
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
                // console.log(response);
                // console.log(JSON.stringify(response.data));
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

    addRequisition=(requisition)=>{
        /**使用axios将value表单信息发送到后端
         * */
        //requisition_firstexam_member

        console.log("addRequisition",requisition)
        requisition.requisition_firstexam_member = this.props.RequisitionList.state.firstMemberId;
        requisition.requisition_secondexam_member = this.props.RequisitionList.state.secondMemberId;
        requisition.requisition_thirdexam_member = this.props.RequisitionList.state.thirdMemberId;

        console.log("三个人员ID  "+requisition.requisition_firstexam_member+ "  "+ requisition.requisition_secondexam_member+" "+requisition.requisition_thirdexam_member);
        saveLoginInfo('更新了申请单编号'+requisition.requisition_number+'的信息');
        let api = global.AppConfig.serverIP + '/updateRequisition';
        axios.post(api,requisition)
            .then((response)=> {
                console.log(response);
                console.log(JSON.stringify(response.data));
                //this.props.MemberList.run();
                this.props.RequisitionList.showPageList();
                // this.props.RequisitionList.setState({
                //     requisitionList: response.data,
                // })
               console.log("更新成功！")
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    /** 当采用弹出新页面时候使用的方法
     * */

    handleReport=()=>{
        const w=window.open('about:blank');
        w.location.href=`/printReport/${this.props.RequisitionList.state.requisition.requisition_id}`;
            //以下为备用方法，可直接写在button标签内，但经过实测IE浏览器可能出现无法传值的情况
            // <Link to="/printReport" target="_blank">测试弹出</Link>
            // <Link to={`/printReport/${this.props.RequisitionList.state.requisition.requisition_id}`}
    };

    con=()=>{
        console.log("this.props.RequisitionList.state.requisition",this.props.RequisitionList.state.requisition)
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
            <div className="requisition_manage">
                {/*<Button type="default" onClick={this.showDrawer}>*/}
                {/*    <Icon type="plus" /> 添加新申请单*/}
                {/*</Button>*/}
                <Drawer
                    title="委托单"
                    width={1200}
                    onClose={this.onClose}
                    visible={this.props.RequisitionList.state.visible}
                    placement="left"
                >
                    <Form  layout="vertical"  onSubmit={this.handleSubmit}>

                        <Row gutter={20}>
                            <Col span={4}>
                            <Form.Item label="结构名称">
                                {getFieldDecorator('requisition_structure_name', {
                                    rules: [{ required: true, message: '请输入结构名称' }],
                                    initialValue: this.props.RequisitionList.state.requisition.requisition_structure_name
                                })(<Input placeholder="结构名称" />)}
                            </Form.Item>
                        </Col>
                            <Col span={4}>
                                <Form.Item label="检测部位">
                                    {getFieldDecorator('requisition_test_part', {
                                        rules: [{ required: true, message: '请输入检测部位' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_test_part
                                    })(<Input placeholder="检测部位" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="表面状态">
                                    {getFieldDecorator('requisition_surface_state', {
                                        rules: [{ required: true, message: '请输入表面状态' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_surface_state
                                    })(<Input placeholder="表面状态" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="外观检查结论">
                                    {getFieldDecorator('requisition_surface_conclusion', {
                                        rules: [{ required: true, message: '请输入外观检查结论' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_surface_conclusion
                                    })(<Input placeholder="外观检查结论" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="被检物地址">
                                    {getFieldDecorator('requisition_item_address', {
                                        rules: [{ required: true, message: '请输入被检物地址' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_item_address
                                    })(<Input placeholder="被检物地址" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="施工部门">
                                    {getFieldDecorator('requisition_constructunit', {
                                        rules: [{ required: true, message: '请输入施工部门' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_constructunit
                                    })(<Input placeholder="施工部门" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="联系人">
                                    {getFieldDecorator('requisition_contact', {
                                        rules: [{ required: true, message: '请输入联系人'}],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_contact
                                    })(<Input placeholder="联系人" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="生产管理部门">
                                    {getFieldDecorator('requisition_management_department', {
                                        rules: [{ required: true, message: '请输入生产管理部门' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_management_department
                                    })(<Input placeholder="生产管理部门" />)}
                                </Form.Item>
                            </Col>

                            <Col span={4}>
                                <Form.Item label="无损检测室">
                                    {getFieldDecorator('requisition_test_room', {
                                        rules: [{ required: true, message: '请输入无损检测室' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_test_room
                                    })(<Input placeholder="无损检测室" />)}
                                </Form.Item>
                            </Col>

                            <Col span={4}>
                                <Form.Item label="顾客">
                                    {getFieldDecorator('requisition_customer', {
                                        rules: [{ required: true, message: '请输入顾客' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_customer
                                    })(<Input placeholder="顾客" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="识别码">
                                    {getFieldDecorator('requisition_code', {
                                        rules: [{ required: true, message: '请输入识别码' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_code
                                    })(<Input placeholder="识别码" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="检测时间">
                                    {getFieldDecorator('requisition_test_time', {
                                        rules: [{ required: true, message: '请输入检测时间' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_test_time
                                    })(<Input placeholder="检测时间" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="检查员">
                                    {getFieldDecorator('requisition_inspector', {
                                        rules: [{ required: true, message: '请输入检查员' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_inspector
                                    })(<Input placeholder="检查员" />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Col span={4}>
                                <Form.Item label="申请单id" style={{display:"none"}}>
                                    {getFieldDecorator('requisition_id', {
                                        rules: [{ required: false, message: '申请单id' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_id,
                                    })(<Input placeholder="申请单id" />)}
                                </Form.Item>
                            </Col>
                        <Col span={4}>
                            <Form.Item label="产品id" style={{display:"none"}}>
                                {getFieldDecorator('requisition_product_id', {
                                    rules: [{ required: false, message: '产品id' }],
                                    initialValue: this.props.RequisitionList.state.product_id,
                                })(<Input placeholder="申请单id" />)}
                            </Form.Item>
                        </Col>
                        {/*<Row gutter={20} >*/}
                        {/*    /!*<Col span={4}>*!/*/}
                        {/*    /!*    <Form.Item label="申请单id" style={{display:true}}>*!/*/}
                        {/*    /!*        {getFieldDecorator('requisition_id', {*!/*/}
                        {/*    /!*            rules: [{ required: true, message: '申请单id' }],*!/*/}
                        {/*    /!*            initialValue: this.props.RequisitionList.state.requisition.requisition_id,*!/*/}
                        {/*    /!*        })(<Input placeholder="申请单id" />)}*!/*/}
                        {/*    /!*    </Form.Item>*!/*/}
                        {/*    /!*</Col>*!/*/}
                        {/*    <Col span={4}>*/}
                        {/*        /!*产品名称*!/*/}
                        {/*        <Form.Item label="产品名称">*/}
                        {/*            {getFieldDecorator('requisition_product_name', {*/}
                        {/*                rules: [{ required: true, message: '请输入产品名称' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_product_name*/}
                        {/*            })(<AutoComplete*/}
                        {/*                showSearch*/}
                        {/*                placeholder="产品名称"*/}
                        {/*                optionFilterProp="children"*/}
                        {/*                dataSource={   this.state.productList.map((item,key)=>{*/}
                        {/*                    return(*/}
                        {/*                        <Option value={item.product_name}>{item.product_name}</Option>*/}
                        {/*                    )*/}
                        {/*                })}*/}
                        {/*            />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="工程编号">*/}
                        {/*            {getFieldDecorator('requisition_number', {*/}
                        {/*                rules: [{ required: true, message: '请输入工程编号' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_number*/}
                        {/*            })(<Input placeholder="工程编号" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}

                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="工程名称">*/}
                        {/*            {getFieldDecorator('requisition_name', {*/}
                        {/*                rules: [{ required: true, message: '请输入工程名称' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_name*/}
                        {/*            })(<Input placeholder="工程名称" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}

                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="结构名称">*/}
                        {/*            {getFieldDecorator('requisition_structurename', {*/}
                        {/*                rules: [{ required: true, message: '请输入结构名称' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_structurename*/}
                        {/*            })(<Input placeholder="结构名称" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="施工单位">*/}
                        {/*            {getFieldDecorator('requisition_constructunit', {*/}
                        {/*                rules: [{ required: true, message: '请输入施工单位' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_constructunit*/}
                        {/*            })(<Input placeholder="施工单位" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="焊接方法">*/}
                        {/*            {getFieldDecorator('requisition_weldingmethod', {*/}
                        {/*                rules: [{ required: true, message: '请输入焊接方法' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_weldingmethod*/}
                        {/*            })(<Input placeholder="焊接方法" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}
                        {/*<Row gutter={20}>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="存放位置">*/}
                        {/*            {getFieldDecorator('requisition_saveplace', {*/}
                        {/*                rules: [{ required: true, message: '请输入存放位置' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_saveplace*/}
                        {/*            })(<Input placeholder="存放位置" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="来样编号">*/}
                        {/*            {getFieldDecorator('requisition_samplenumber', {*/}
                        {/*                rules: [{ required: true, message: '请输入来样编号' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_samplenumber*/}
                        {/*            })(<Input placeholder="来样编号" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}

                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="黑度值">*/}
                        {/*            {getFieldDecorator('requisition_density', {*/}
                        {/*                rules: [{ required: true, message: '请输入黑度值' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_density*/}
                        {/*            })(<Input placeholder="黑度值" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="报告编号">*/}
                        {/*            {getFieldDecorator('requisition_reportnumber', {*/}
                        {/*                rules: [{ required: true, message: '请输入报告编号' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_reportnumber*/}
                        {/*            })(<Input placeholder="报告编号" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}

                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="胶片型号">*/}
                        {/*            {getFieldDecorator('requisition_filmtype', {*/}
                        {/*                rules: [{ required: true, message: '请输入胶片型号' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_filmtype*/}
                        {/*            })(<Input placeholder="胶片型号" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="检测标准">*/}
                        {/*            {getFieldDecorator('requisition_testingstandard', {*/}
                        {/*                rules: [{ required: true, message: '请输入检测标准' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_testingstandard*/}
                        {/*            })(<Input placeholder="检测标准" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}
                        {/*<Row gutter={16}>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="合格级别">*/}
                        {/*            {getFieldDecorator('requisition_qualificationlevel', {*/}
                        {/*                rules: [{ required: true, message: '请输入合格级别' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_qualificationlevel*/}
                        {/*            })(<Input placeholder="合格级别" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="增感屏">*/}
                        {/*            {getFieldDecorator('requisition_intensifyscreen', {*/}
                        {/*                rules: [{ required: true, message: '请输入增感屏' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_intensifyscreen*/}
                        {/*            })(<Input placeholder="增感屏" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="管电流">*/}
                        {/*            {getFieldDecorator('requisition_tubecurrent', {*/}
                        {/*                rules: [{ required: true, message: '请输入管电流' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_tubecurrent*/}
                        {/*            })(<Input placeholder="管电流" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}

                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="管电压">*/}
                        {/*            {getFieldDecorator('requisition_tubevoltage', {*/}
                        {/*                rules: [{ required: true, message: '请输入管电压' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_tubevoltage*/}
                        {/*            })(<Input placeholder="管电压" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}

                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="曝光时间">*/}
                        {/*            {getFieldDecorator('requisition_exposuretime', {*/}
                        {/*                rules: [{ required: true, message: '请输入曝光时间' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_exposuretime*/}
                        {/*            })(<Input placeholder="曝光时间" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="敏感度">*/}
                        {/*            {getFieldDecorator('requisition_sensitivity', {*/}
                        {/*                rules: [{ required: true, message: '请输入敏感度' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_sensitivity*/}
                        {/*            })(<Input placeholder="敏感度" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}
                        {/*<Row gutter={16}>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="焦距">*/}
                        {/*            {getFieldDecorator('requisition_focus', {*/}
                        {/*                rules: [{ required: true, message: '请输入焦距' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_focus*/}
                        {/*            })(<Input placeholder="焦距" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="显影时间">*/}
                        {/*            {getFieldDecorator('requisition_developmenttime', {*/}
                        {/*                rules: [{ required: true, message: '请输入显影时间' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_developmenttime*/}
                        {/*            })(<Input placeholder="显影时间" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="显影温度">*/}
                        {/*            {getFieldDecorator('requisition_developertemperature', {*/}
                        {/*                rules: [{ required: true, message: '请输入显影温度' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_developertemperature*/}
                        {/*            })(<Input placeholder="显影温度" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="钢号">*/}
                        {/*            {getFieldDecorator('requisition_steelnumber', {*/}
                        {/*                rules: [{ required: true, message: '请输入钢号' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_steelnumber*/}
                        {/*            })(<Input placeholder="钢号" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="接头形式">*/}
                        {/*            {getFieldDecorator('requisition_jointform', {*/}
                        {/*                rules: [{ required: true, message: '请输入接头形式' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_jointform*/}
                        {/*            })(<Input placeholder="接头形式" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="仪器型号">*/}
                        {/*            {getFieldDecorator('requisition_instrumenttype', {*/}
                        {/*                rules: [{ required: true, message: '请输入仪器型号' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_instrumenttype*/}
                        {/*            })(<Input placeholder="仪器型号" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}
                        {/*<Row gutter={16}>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="焊缝数量">*/}
                        {/*            {getFieldDecorator('requisition_totalnumber', {*/}
                        {/*                rules: [{ required: true, message: '请输入焊缝数量' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_totalnumber*/}
                        {/*            })(<Input placeholder="焊缝数量" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="返工次数">*/}
                        {/*            {getFieldDecorator('requisition_reworktimes', {*/}
                        {/*                rules: [{ required: true, message: '请输入返工次数' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_reworktimes*/}
                        {/*            })(<Input placeholder="返工次数" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}
                        {/*<Row gutter={16}>*/}
                        {/*    <Col span={16}>*/}
                        {/*        <Form.Item label="申请单备注信息">*/}
                        {/*            {getFieldDecorator('requisition_ps', {*/}
                        {/*                rules: [{ required: false, message: '请输入申请单备注信息' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_ps*/}
                        {/*            })(<Input.TextArea rows={4} placeholder="申请单备注信息" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}
                        <Row gutter={20} >
                            {/*<Col span={4}>*/}
                            {/*    <Form.Item label="申请单id" style={{display:true}}>*/}
                            {/*        {getFieldDecorator('requisition_id', {*/}
                            {/*            rules: [{ required: true, message: '申请单id' }],*/}
                            {/*            // initialValue: this.props.RequisitionList.state.requisition.requisition_id,*/}
                            {/*        })(<Input placeholder="申请单id" />)}*/}
                            {/*    </Form.Item>*/}
                            {/*</Col>*/}
                            <Divider>详细信息</Divider>
                            <Col span={4}>
                                {/*产品名称*/}
                                <Form.Item label="产品名称">
                                    {getFieldDecorator('requisition_product_name', {
                                        rules: [{ required: true, message: '请输入产品名称' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_product_name,
                                    })(<AutoComplete
                                        showSearch
                                        placeholder="产品名称"
                                        optionFilterProp="children"
                                        dataSource={   this.state.productList.map((item,key)=>{
                                            return(
                                                <Option value={item.product_name}>{item.product_name}</Option>
                                            )
                                        })}
                                    />)}
                                </Form.Item>
                            </Col>

                            <Col span={4}>
                                {/*左上角编号*/}
                                <Form.Item label="编号">
                                    {getFieldDecorator('requisition_number', {
                                        rules: [{ required: true, message: '请输入编号' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_number
                                    })(<Input placeholder="编号" />)}
                                </Form.Item>
                            </Col>

                            <Col span={4}>
                                <Form.Item label="工程名称">
                                    {getFieldDecorator('requisition_name', {
                                        rules: [{ required: true, message: '请输入工程名称' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_name
                                    })(<Input placeholder="工程名称" />)}
                                </Form.Item>
                            </Col>

                            <Col span={4}>
                                <Form.Item label="军检号">
                                    {getFieldDecorator('requisition_military_inspection_id', {
                                        rules: [{ required: true, message: '请输入军检号' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_military_inspection_id
                                    })(<Input placeholder="军检号" />)}
                                </Form.Item>
                            </Col>


                            <Col span={4}>
                                <Form.Item label="完工日期">
                                    {getFieldDecorator('requisition_complete_date', {
                                        rules: [{ required: true, message: '请输入完工日期' }],
                                        initialValue: moment(this.props.RequisitionList.state.requisition.requisition_complete_date)
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

                            <Col span={4}>
                                <Form.Item label="检测比例">
                                    {getFieldDecorator('requisition_testing_rate', {
                                        rules: [{ required: true, message: '请输入检测比例' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_testing_rate
                                    })
                                    (<AutoComplete
                                        showSearch
                                        placeholder="检测比例"
                                        optionFilterProp="children"
                                        dataSource={   this.state.distinctTestingRate.map((item,key)=>{
                                            return(
                                                <Option value={item.requisition_testing_rate}>{item.requisition_testing_rate}</Option>
                                            )
                                        })}
                                    />)}
                                </Form.Item>
                            </Col>

                        </Row>
                        <Row gutter={20}>

                            <Col span={4}>
                                <Form.Item label="坡口形式">
                                    {getFieldDecorator('requisition_bevel_form', {
                                        rules: [{ required: true, message: '请输入坡口形式' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_bevel_form
                                    })
                                    (<AutoComplete
                                        showSearch
                                        placeholder="坡口形式"
                                        optionFilterProp="children"
                                        dataSource={   this.state.distinctBevelForm.map((item,key)=>{
                                            return(
                                                <Option value={item.requisition_bevel_form}>{item.requisition_bevel_form}</Option>
                                            )
                                        })}
                                    />)}
                                </Form.Item>
                            </Col>
                            {/*<Col span={4}>*/}
                            {/*    <Form.Item label="来样编号">*/}
                            {/*        {getFieldDecorator('requisition_samplenumber', {*/}
                            {/*            rules: [{ required: true, message: '请输入来样编号' }],*/}
                            {/*            // initialValue: this.props.RequisitionList.state.requisition.requisition_samplenumber*/}
                            {/*        })(<Input placeholder="来样编号" />)}*/}
                            {/*    </Form.Item>*/}
                            {/*</Col>*/}
                            <Col span={4}>
                                <Form.Item label="透照方式">
                                    {getFieldDecorator('requisition_transillumination', {
                                        rules: [{ required: true, message: '请输入透照方式' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_transillumination
                                    })

                                    (<AutoComplete
                                        showSearch
                                        placeholder="透照方式"
                                        optionFilterProp="children"
                                        dataSource={   this.state.distinctTransillumination.map((item,key)=>{
                                            return(
                                                <Option value={item.requisition_transillumination}>{item.requisition_transillumination}</Option>
                                            )
                                        })}
                                    />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="检测日期">
                                    {getFieldDecorator('requisition_testing_date', {
                                        rules: [{ required: false, message: '请输入检测日期' }],
                                        initialValue: moment(this.props.RequisitionList.state.requisition.requisition_testing_date)
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
                            <Col span={4}>
                                <Form.Item label="检测标准">
                                    {getFieldDecorator('requisition_testingstandard', {
                                        rules: [{ required: true, message: '请输入检测标准' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_testingstandard
                                    })(<Input placeholder="检测标准" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="合格级别">
                                    {getFieldDecorator('requisition_qualificationlevel', {
                                        rules: [{ required: true, message: '请输入合格级别' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_qualificationlevel
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
                                <Form.Item label="检测设备">
                                    {/*{getFieldDecorator('requisition_testing_instrument', {*/}
                                    {/*    rules: [{ required: false, message: '请输入检测设备' }],*/}
                                    {/*    // initialValue: this.props.RequisitionList.state.requisition.requisition_reworktimes*/}
                                    {/*})(<Input placeholder="检测设备" />)}*/}
                                    {getFieldDecorator('requisition_testing_instrument', {
                                        rules: [{ required: true, message: '请输入检测设备' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_testing_instrument
                                    })
                                    (<AutoComplete
                                        showSearch
                                        placeholder="检测设备"
                                        optionFilterProp="children"
                                        dataSource={   this.state.distinctTestingInstrument.map((item,key)=>{
                                            return(
                                                <Option value={item.requisition_testing_instrument}>{item.requisition_testing_instrument}</Option>
                                            )
                                        })}
                                    />)}
                                </Form.Item>
                            </Col>

                        </Row>
                        <Row gutter={20}>
                            <Col span={4}>
                                <Form.Item label="设备型号">
                                    {getFieldDecorator('requisition_instrumenttype', {
                                        rules: [{ required: false, message: '请输入设备型号' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_instrumenttype
                                    })(<Input placeholder="设备型号" />)}
                                </Form.Item>
                            </Col>

                            <Col span={4}>
                                <Form.Item label="源强（Ci）">
                                    {getFieldDecorator('requisition_source_strength', {
                                        rules: [{ required: false, message: '请输入源强' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_source_strength
                                    })(<Input placeholder="源强（Ci）" />)}
                                </Form.Item>
                            </Col>

                            <Col span={4}>
                                <Form.Item label="源龄（天）">
                                    {getFieldDecorator('requisition_source_age', {
                                        rules: [{ required: false, message: '请输入源龄' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_source_age
                                    })(<Input placeholder="源龄（天）" />)}
                                </Form.Item>
                            </Col>

                            <Col span={4}>
                                <Form.Item label="焦距（mm）">
                                    {getFieldDecorator('requisition_focus', {
                                        rules: [{ required: false, message: '请输入焦距' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_focus
                                    })(<Input placeholder="焦距" />)}
                                </Form.Item>
                            </Col>

                            <Col span={4}>
                                <Form.Item label="焦点尺寸(mm)">
                                    {getFieldDecorator('requisition_focus_size', {
                                        rules: [{ required: false, message: '请输入焦点尺寸' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_focus_size
                                    })
                                    (<AutoComplete
                                        showSearch
                                        placeholder="焦点尺寸(mm)"
                                        optionFilterProp="children"
                                        dataSource={   this.state.distinctFocusSize.map((item,key)=>{
                                            return(
                                                <Option value={item.requisition_focus_size}>{item.requisition_focus_size}</Option>
                                            )
                                        })}
                                    />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="管电压（KV）">
                                    {getFieldDecorator('requisition_tubevoltage', {
                                        rules: [{ required: false, message: '请输入管电压' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_tubevoltage
                                    })(<Input placeholder="管电压（KV）" />)}
                                </Form.Item>
                            </Col>

                        </Row>
                        <Row gutter={20}>
                            <Col span={4}>
                                <Form.Item label="管电流（mA）">
                                    {getFieldDecorator('requisition_tubecurrent', {
                                        rules: [{ required: false, message: '请输入管电流' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_tubecurrent
                                    })(<Input placeholder="管电流" />)}
                                </Form.Item>
                            </Col>

                            <Col span={4}>
                                <Form.Item label="材质">

                                    {getFieldDecorator('requisition_material', {
                                        rules: [{ required: false, message: '请输入材质' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_material
                                    })(<Input placeholder="材质" />)}
                                </Form.Item>
                            </Col>

                            <Col span={4}>
                                <Form.Item label="胶片类型">
                                    {getFieldDecorator('requisition_filmtype', {
                                        rules: [{ required: false, message: '请输入胶片类型' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_filmtype
                                    })
                                    (<AutoComplete
                                        showSearch
                                        placeholder="胶片类型"
                                        optionFilterProp="children"
                                        dataSource={   this.state.distinctFilmtype.map((item,key)=>{
                                            return(
                                                <Option value={item.requisition_filmtype}>{item.requisition_filmtype}</Option>
                                            )
                                        })}
                                    />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="增感方式">
                                    {getFieldDecorator('requisition_sensitization_method', {
                                        rules: [{ required: false, message: '请输入增感方式' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_sensitization_method
                                    })
                                    (<AutoComplete
                                        showSearch
                                        placeholder="增感方式"
                                        optionFilterProp="children"
                                        dataSource={   this.state.distinctSensitizationMethod.map((item,key)=>{
                                            return(
                                                <Option value={item.requisition_sensitization_method}>{item.requisition_sensitization_method}</Option>
                                            )
                                        })}
                                    />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="底片处理方式">
                                    {getFieldDecorator('requisition_film_processing_method', {
                                        rules: [{ required: false, message: '请输入底片处理方式' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_film_processing_method
                                    })
                                    (<AutoComplete
                                        showSearch
                                        placeholder="底片处理方式"
                                        optionFilterProp="children"
                                        dataSource={   this.state.distinctFilmProcessingMethod.map((item,key)=>{
                                            return(
                                                <Option value={item.requisition_film_processing_method}>{item.requisition_film_processing_method}</Option>
                                            )
                                        })}
                                    />)}
                                </Form.Item>
                            </Col>
                            {/*<Col span={4}>*/}
                            {/*    <Form.Item label="曝光时间">*/}
                            {/*        {getFieldDecorator('requisition_exposuretime', {*/}
                            {/*            rules: [{ required: false, message: '请输入曝光时间' }],*/}
                            {/*            initialValue: this.props.RequisitionList.state.requisition.requisition_exposuretime*/}
                            {/*        })(<Input placeholder="曝光时间" />)}*/}
                            {/*    </Form.Item>*/}
                            {/*</Col>*/}
                            <Col span={4}>
                                <Form.Item label="报告编号">
                                    {getFieldDecorator('requisition_reportnumber', {
                                        rules: [{ required: true, message: '请输入报告编号' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_reportnumber
                                    })(<Input placeholder="报告编号" />)}
                                </Form.Item>
                            </Col>
                            {/*<Col span={4}>*/}
                            {/*    <Form.Item label="钢号">*/}
                            {/*        {getFieldDecorator('requisition_steelnumber', {*/}
                            {/*            rules: [{ required: true, message: '请输入钢号' }],*/}
                            {/*            // initialValue: this.props.RequisitionList.state.requisition.requisition_steelnumber*/}
                            {/*        })(<Input placeholder="钢号" />)}*/}
                            {/*    </Form.Item>*/}
                            {/*</Col>*/}

                        </Row>

                        <Row gutter={20}>
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="结构名称">*/}
                        {/*            {getFieldDecorator('requisition_structurename', {*/}
                        {/*                rules: [{ required: true, message: '请输入结构名称' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_structurename*/}
                        {/*            })(<Input placeholder="结构名称" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="存放位置">*/}
                        {/*            {getFieldDecorator('requisition_saveplace', {*/}
                        {/*                rules: [{ required: true, message: '请输入存放位置' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_saveplace*/}
                        {/*            })(<Input placeholder="存放位置" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="增感屏">*/}
                        {/*            {getFieldDecorator('requisition_intensifyscreen', {*/}
                        {/*                rules: [{ required: true, message: '请输入增感屏' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_intensifyscreen*/}
                        {/*            })(<Input placeholder="增感屏" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}

                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="敏感度">*/}
                        {/*            {getFieldDecorator('requisition_sensitivity', {*/}
                        {/*                rules: [{ required: true, message: '请输入敏感度' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_sensitivity*/}
                        {/*            })(<Input placeholder="敏感度" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="显影时间">*/}
                        {/*            {getFieldDecorator('requisition_developmenttime', {*/}
                        {/*                rules: [{ required: true, message: '请输入显影时间' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_developmenttime*/}
                        {/*            })(<Input placeholder="显影时间" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="显影温度">*/}
                        {/*            {getFieldDecorator('requisition_developertemperature', {*/}
                        {/*                rules: [{ required: true, message: '请输入显影温度' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_developertemperature*/}
                        {/*            })(<Input placeholder="显影温度" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}
                        {/*<Row gutter={20}>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="返工次数">*/}
                        {/*            {getFieldDecorator('requisition_reworktimes', {*/}
                        {/*                rules: [{ required: true, message: '请输入返工次数' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_reworktimes*/}
                        {/*            })(<Input placeholder="返工次数" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="接头形式">*/}
                        {/*            {getFieldDecorator('requisition_jointform', {*/}
                        {/*                rules: [{ required: true, message: '请输入接头形式' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_jointform*/}
                        {/*            })(<Input placeholder="接头形式" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="仪器型号">*/}
                        {/*            {getFieldDecorator('requisition_instrumenttype', {*/}
                        {/*                rules: [{ required: true, message: '请输入仪器型号' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_instrumenttype*/}
                        {/*            })(<Input placeholder="仪器型号" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                            <Col span={4}>
                                <Form.Item label="曝光时间(时)">
                                    {getFieldDecorator('requisition_exposuretime_hour', {
                                        rules: [{ required: false, message: '请输入曝光时间(时)' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_exposuretime_hour
                                    })(<Input placeholder="曝光时间(时)" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="曝光时间(分)">
                                    {getFieldDecorator('requisition_exposuretime_minute', {
                                        rules: [{ required: false, message: '请输入曝光时间(分)' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_exposuretime_minute
                                    })(<Input placeholder="曝光时间(分)" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="曝光时间(秒)">
                                    {getFieldDecorator('requisition_exposuretime_second', {
                                        rules: [{ required: false, message: '请输入曝光时间(秒)' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_exposuretime_second
                                    })(<Input placeholder="曝光时间(秒)" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="增感屏(前屏)">
                                    {getFieldDecorator('requisition_intensifyscreen_front', {
                                        rules: [{ required: false, message: '请输入增感屏(前屏)' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_intensifyscreen_front
                                    })
                                    (<AutoComplete
                                        showSearch
                                        placeholder="增感屏(前屏)"
                                        optionFilterProp="children"
                                        dataSource={   this.state.distinctIntensifyScreenFront.map((item,key)=>{
                                            return(
                                                <Option value={item.requisition_intensifyscreen_front}>{item.requisition_intensifyscreen_front}</Option>
                                            )
                                        })}
                                    />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="增感屏(中屏)">
                                    {/*{getFieldDecorator('requisition_intensifyscreen_middle', {*/}
                                    {/*    rules: [{ required: false, message: '增感屏(中屏)' }],*/}
                                    {/*    // initialValue: this.props.RequisitionList.state.requisition.requisition_intensifyscreen_middle*/}
                                    {/*})(<Input placeholder="增感屏(中屏)" />)}*/}
                                    {getFieldDecorator('requisition_intensifyscreen_middle', {
                                        rules: [{ required: false, message: '请输入增感屏(中屏)' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_intensifyscreen_middle
                                    })
                                    (<AutoComplete
                                        showSearch
                                        placeholder="增感屏(中屏)"
                                        optionFilterProp="children"
                                        dataSource={   this.state.distinctIntensifyScreenMiddle.map((item,key)=>{
                                            return(
                                                <Option value={item.requisition_intensifyscreen_middle}>{item.requisition_intensifyscreen_middle}</Option>
                                            )
                                        })}
                                    />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="增感屏(后屏)">
                                    {/*{getFieldDecorator('requisition_intensifyscreen_behind', {*/}
                                    {/*    rules: [{ required: false, message: '增感屏(后屏)' }],*/}
                                    {/*    // initialValue: this.props.RequisitionList.state.requisition.requisition_intensifyscreen_behind*/}
                                    {/*})(<Input placeholder="增感屏(后屏)" />)}*/}
                                    {getFieldDecorator('requisition_intensifyscreen_behind', {
                                        rules: [{ required: false, message: '请输入增感屏(后屏)' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_intensifyscreen_behind
                                    })
                                    (<AutoComplete
                                        showSearch
                                        placeholder="增感屏(后屏)"
                                        optionFilterProp="children"
                                        dataSource={   this.state.distinctIntensifyScreenBehind.map((item,key)=>{
                                            return(
                                                <Option value={item.requisition_intensifyscreen_behind}>{item.requisition_intensifyscreen_behind}</Option>
                                            )
                                        })}
                                    />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={20}>
                            {/*<Col span={4}>*/}
                            {/*    <Form.Item label="施工单位">*/}
                            {/*        {getFieldDecorator('requisition_constructunit', {*/}
                            {/*            rules: [{ required: true, message: '请输入施工单位' }],*/}
                            {/*            initialValue: this.props.RequisitionList.state.requisition.requisition_constructunit*/}
                            {/*        })(<Input placeholder="施工单位" />)}*/}
                            {/*    </Form.Item>*/}
                            {/*</Col>*/}
                            {/*<Col span={4}>*/}
                            {/*    <Form.Item label="钢号">*/}
                            {/*        {getFieldDecorator('requisition_steelnumber', {*/}
                            {/*            rules: [{ required: true, message: '请输入钢号' }],*/}
                            {/*            initialValue: this.props.RequisitionList.state.requisition.requisition_steelnumber*/}
                            {/*        })(<Input placeholder="钢号" />)}*/}
                            {/*    </Form.Item>*/}
                            {/*</Col>*/}
                            <Col span={4}>
                                <Form.Item label="焊接方法">
                                    {/*{getFieldDecorator('requisition_weldingmethod', {*/}
                                    {/*    rules: [{ required: true, message: '请输入焊接方法' }],*/}
                                    {/*    // initialValue: this.props.RequisitionList.state.requisition.requisition_weldingmethod*/}
                                    {/*})(<Input placeholder="焊接方法" />)}*/}
                                    {getFieldDecorator('requisition_weldingmethod', {
                                        rules: [{ required: false, message: '请输入焊接方法' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_weldingmethod
                                    })
                                    (<AutoComplete
                                        showSearch
                                        placeholder="焊接方法"
                                        optionFilterProp="children"
                                        dataSource={   this.state.distinctWeldingMethod.map((item,key)=>{
                                            return(
                                                <Option value={item.requisition_weldingmethod}>{item.requisition_weldingmethod}</Option>
                                            )
                                        })}
                                    />)}
                                </Form.Item>
                            </Col>
                            {/*<Col span={4}>*/}
                            {/*    <Form.Item label="厚度">*/}
                            {/*        {getFieldDecorator('requisition_density', {*/}
                            {/*            rules: [{ required: true, message: '请输入厚度' }],*/}
                            {/*            initialValue: this.props.RequisitionList.state.requisition.requisition_density*/}
                            {/*        })(<Input placeholder="厚度" />)}*/}
                            {/*    </Form.Item>*/}
                            {/*</Col>*/}
                            <Col span={4}>
                                <Form.Item label="焊缝数量">
                                    {getFieldDecorator('requisition_totalnumber', {
                                        rules: [{ required: true, message: '请输入焊缝数量' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_totalnumber
                                    })(<Input placeholder="焊缝数量" />)}
                                </Form.Item>
                            </Col>

                            {/*<Col span={4}>*/}
                            {/*    <Form.Item label="检测比例">*/}
                            {/*        {getFieldDecorator('requisition_testing_rate', {*/}
                            {/*            rules: [{ required: true, message: '请输入检测比例' }],*/}
                            {/*            // initialValue: this.props.RequisitionList.state.requisition.requisition_ps*/}
                            {/*        })*/}
                            {/*            (<AutoComplete*/}
                            {/*                showSearch*/}
                            {/*                placeholder="检测比例"*/}
                            {/*                optionFilterProp="children"*/}
                            {/*                dataSource={   this.state.distinctTestingRate.map((item,key)=>{*/}
                            {/*                    return(*/}
                            {/*                        <Option value={item.requisition_testing_rate}>{item.requisition_testing_rate}</Option>*/}
                            {/*                    )*/}
                            {/*                })}*/}
                            {/*            />)}*/}
                            {/*    </Form.Item>*/}
                            {/*</Col>*/}
                            {/*<Col span={4}>*/}
                            {/*    <Form.Item label="坡口形式">*/}
                            {/*        {getFieldDecorator('requisition_bevel_form', {*/}
                            {/*            rules: [{ required: true, message: '请输入坡口形式' }],*/}
                            {/*            // initialValue: this.props.RequisitionList.state.requisition.requisition_ps*/}
                            {/*        })*/}
                            {/*            (<AutoComplete*/}
                            {/*                showSearch*/}
                            {/*                placeholder="坡口形式"*/}
                            {/*                optionFilterProp="children"*/}
                            {/*                dataSource={   this.state.distinctBevelForm.map((item,key)=>{*/}
                            {/*                    return(*/}
                            {/*                        <Option value={item.requisition_bevel_form}>{item.requisition_bevel_form}</Option>*/}
                            {/*                    )*/}
                            {/*                })}*/}
                            {/*            />)}*/}
                            {/*    </Form.Item>*/}
                            {/*</Col>*/}
                            {/*<Col span={4}>*/}
                            {/*    <Form.Item label="透照方式">*/}
                            {/*        {getFieldDecorator('requisition_transillumination', {*/}
                            {/*            rules: [{ required: true, message: '请输入透照方式' }],*/}
                            {/*            // initialValue: this.props.RequisitionList.state.requisition.requisition_ps*/}
                            {/*        })*/}
                            {/*            (<AutoComplete*/}
                            {/*                showSearch*/}
                            {/*                placeholder="透照方式"*/}
                            {/*                optionFilterProp="children"*/}
                            {/*                dataSource={   this.state.distinctTransillumination.map((item,key)=>{*/}
                            {/*                    return(*/}
                            {/*                        <Option value={item.requisition_transillumination}>{item.requisition_transillumination}</Option>*/}
                            {/*                    )*/}
                            {/*                })}*/}
                            {/*            />)}*/}
                            {/*    </Form.Item>*/}
                            {/*</Col>*/}
                            {/*<Col span={4}>*/}
                            {/*    <Form.Item label="焦点尺寸(mm)">*/}
                            {/*        {getFieldDecorator('requisition_focus_size', {*/}
                            {/*            rules: [{ required: true, message: '请输入焦点尺寸' }],*/}
                            {/*            // initialValue: this.props.RequisitionList.state.requisition.requisition_ps*/}
                            {/*        })*/}
                            {/*            (<AutoComplete*/}
                            {/*                showSearch*/}
                            {/*                placeholder="焦点尺寸(mm)"*/}
                            {/*                optionFilterProp="children"*/}
                            {/*                dataSource={   this.state.distinctFocusSize.map((item,key)=>{*/}
                            {/*                    return(*/}
                            {/*                        <Option value={item.requisition_focus_size}>{item.requisition_focus_size}</Option>*/}
                            {/*                    )*/}
                            {/*                })}*/}
                            {/*            />)}*/}
                            {/*    </Form.Item>*/}
                            {/*</Col>*/}

                        </Row>
                        <Row gutter={16}>
                            <Col span={16}>
                                <Form.Item label="申请单备注信息">
                                    {getFieldDecorator('requisition_ps', {
                                        rules: [{ required: false, message: '请输入申请单备注信息' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_ps
                                    })(<Input.TextArea rows={4} placeholder="申请单备注信息" />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        {/*<Row gutter={16}>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="一级审核结果">*/}
                        {/*            {getFieldDecorator('requisition_firstexam', {*/}
                        {/*                rules: [{ required: true, message: '请输入一级审核结果' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_firstexam*/}
                        {/*            })(<Input placeholder="一级审核结果" disabled={"true"}/>)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="一级审核人员">*/}
                        {/*            {getFieldDecorator('requisition_firstexam_member', {*/}
                        {/*                rules: [{ required: true, message: '请输入一级审核人员' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.firstMember*/}
                        {/*            })(<Input placeholder="一级审核人员" disabled={"true"}/>)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={8}>*/}
                        {/*        <Form.Item label="一级审核意见">*/}
                        {/*            {getFieldDecorator('requisition_firstopinion', {*/}
                        {/*                rules: [{ required: false, message: '请输入一级审核意见' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_firstopinion*/}
                        {/*            })(<Input.TextArea rows={4} placeholder="一级审核意见" disabled={this.props.RequisitionList.state.threeRoleManage.requisition_firstexam}/>)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}
                        {/*<Row gutter={16}>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="二级审核结果">*/}
                        {/*            {getFieldDecorator('requisition_secondexam', {*/}
                        {/*                rules: [{ required: true, message: '请输入二级审核结果' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_secondexam*/}
                        {/*            })(<Input placeholder="二级审核结果" disabled={"true"}/>)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="二级审核人员">*/}
                        {/*            {getFieldDecorator('requisition_secondexam_member', {*/}
                        {/*                rules: [{ required: true, message: '请输入二级审核人员' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.secondMember*/}
                        {/*            })(<Input placeholder="二级审核人员" disabled={"true"}/>)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={8}>*/}
                        {/*        <Form.Item label="二级审核意见">*/}
                        {/*            {getFieldDecorator('requisition_secondopinion', {*/}
                        {/*                rules: [{ required: false, message: '请输入二级审核意见' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_secondopinion*/}
                        {/*            })(<Input.TextArea rows={4} placeholder="二级审核意见" disabled={this.props.RequisitionList.state.threeRoleManage.requisition_secondexam}/>)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}
                        {/*<Row gutter={16}>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="三级审核结果">*/}
                        {/*            {getFieldDecorator('requisition_thirdexam', {*/}
                        {/*                rules: [{ required: true, message: '请输入三级审核结果' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_thirdexam*/}
                        {/*            })(<Input placeholder="三级审核结果" disabled={"true"}/>)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="三级审核人员">*/}
                        {/*            {getFieldDecorator('requisition_thirdexam_member', {*/}
                        {/*                rules: [{ required: true, message: '请输入三级审核人员' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.thirdMember*/}
                        {/*            })(<Input placeholder="三级审核人员" disabled={"true"}/>)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={8}>*/}
                        {/*        <Form.Item label="三级审核意见">*/}
                        {/*            {getFieldDecorator('requisition_thirdopinion', {*/}
                        {/*                rules: [{ required: false, message: '请输入三级审核意见' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_thirdopinion*/}
                        {/*            })(<Input.TextArea rows={4} placeholder="三级审核意见" disabled={this.props.RequisitionList.state.threeRoleManage.requisition_thirdexam}/>)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}
                        {/*<Row gutter={16}>*/}
                        {/*    <Col span={0}>*/}
                        {/*        <Form.Item label="审核状态" >*/}
                        {/*            {getFieldDecorator('requisition_state', {*/}
                        {/*                rules: [{ required: true, message: '审核状态' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_state*/}
                        {/*            })(<Input placeholder="审核状态"  disabled={this.props.RequisitionList.state.requisition_tubevoltage_disabled}/>)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={0} >*/}
                        {/*        <Form.Item label="是否提交（扫描端）" style={{display:"none"}}>*/}
                        {/*            {getFieldDecorator('requisition_submit', {*/}
                        {/*                rules: [{ required: true, message: '是否提交' }],*/}
                        {/*                initialValue: 1*/}
                        {/*                // initialValue: this.props.RequisitionList.state.requisition.requisition_submit*/}
                        {/*            })(<Input placeholder="是否提交" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={4}>*/}
                        {/*        <Form.Item label="存入时间">*/}
                        {/*            {getFieldDecorator('requisition_entrytime', {*/}
                        {/*                rules: [{ required: true, message: '存入时间' }],*/}
                        {/*                initialValue: this.props.RequisitionList.state.requisition.requisition_entrytime*/}
                        {/*            })(<Input placeholder="存入时间" />)}*/}
                        {/*        </Form.Item>*/}
                        {/*    </Col>*/}

                        {/*</Row>*/}
                        <br/><br/>
                        <Divider />
                        <Row gutter={16}>
                            <Col span={4}>
                                <Form.Item >
                                    <Button onClick={this.onClose} style={{ marginRight: 8 }}>关闭当前窗口</Button>
                                </Form.Item>
                            </Col>

                            {/*<Col span={4}>*/}
                            {/*    <Form.Item >*/}
                            {/*        <Button type="danger" disabled={this.props.RequisitionList.state.requisition_button_disabled} onClick={this.rejectRequest} style={{ marginRight: 8 }}>驳回申请单</Button>*/}
                            {/*    </Form.Item>*/}
                            {/*</Col>*/}

                            {/*<Col span={4}>*/}
                            {/*    <Form.Item >*/}
                            {/*        <Button type="primary" disabled={this.props.RequisitionList.state.requisition_button_disabled} onClick={this.completeApproval} style={{ marginRight: 8 }}>完成审批</Button>*/}
                            {/*    </Form.Item>*/}
                            {/*</Col>*/}
                            {/*<Col span={4}>*/}
                            {/*    <Form.Item >*/}
                            {/*        <Button  type="primary" htmlType="submit" onClick={this.handleReport}>生成检测报告</Button>*/}
                            {/*    </Form.Item>*/}
                            {/*</Col>*/}

                            <Col span={4}>
                                {/*<Form.Item >*/}
                                {/*    <Button type="danger"  htmlType="submit">提交并更改审核信息</Button>*/}
                                {/*</Form.Item>*/}
                                <Form.Item >
                                    <Button type="danger"  htmlType="submit">修改信息</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>

                </Drawer>
            </div>
        );
    }
}

const Requisition_manage = Form.create()(DrawerForm);

export default Requisition_manage;