import React, {Component} from 'react';
import {render} from "react-dom";
import axios from "axios";
import {Button, DatePicker, Divider, Drawer, Form, Icon, Input, message, Popconfirm, Steps, Table} from "antd";
import moment from "moment";

let drawProduct = ''

let current_product_id = ''
let current_product_name = ''

class productManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addDisplay: false,
            drawDisplay: false,
            productList: [],
            drawProduct: [],
            visible: true,
        };
    }

    showDrawer = (a) => {
        console.log(a)
        current_product_id = a.product_id
        current_product_name = a.product_name
        this.setState({
            drawDisplay: true
        })
    }
    onclose = () => {
        this.setState({
            drawDisplay: false
        })
    }
    oncloseadd = () => {
        this.setState({
            addDisplay: false
        })
    }
    deleteProduct = (record) => {
        console.log(record)
        let api = global.AppConfig.serverIP + '/deleteProductByProductId/' + record.product_id;
        axios.get(api)
            .then((response) => {
                message.info('删除成功', 3);
                this.componentWillMount()
            })
            .catch((error) => {
                console.log(error);
            });
    }
    columns = [
        {title: '产品名称', dataIndex: 'product_name'},
        {title: '修改', key: 'operation', render: (record) => (<a onClick={() => this.showDrawer(record)}> 修改产品</a>)},
        {
            title: '删除', key: 'delete', width: 110, render: (record) =>
                <Popconfirm
                    title="确定要删除该产品吗？该操作会导致该产品分类下所有申请单的删除!请谨慎操作！"
                    icon={<Icon type="question-circle-o" style={{color: 'red'}}/>}
                    okText="确定删除"
                    cancelText="取消"
                    onConfirm={() => this.deleteProduct(record)}
                >
                    <a href="#">删除产品</a>
                </Popconfirm>
        },
    ]

    componentWillMount() {
        this.getAllProduct()
    }

    getAllProduct = () => {
        let api = global.AppConfig.serverIP + '/getAllProduct';
        axios.get(api)
            .then((response) => {
                this.setState({
                    productList: response.data,
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }
    handlesubmit = (e) => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.updateProduct(values)
                // this.updateProduct(values)
                // this.updateMember(values);
            }
        });
    }
    handleadd = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
                console.log(values.add_product_name)
                if(values.add_product_name){
                    this.addproduct(values.add_product_name)
                }
                else{
                    message.error("名称不能为空")
                }
                // this.updateProduct(values)
                // this.updateMember(values);
        });
    }
    updateProduct = (p) => {
        let api = global.AppConfig.serverIP + '/updateProduct';
        axios.get(api, {
            params: {
                product_id: p.product_id,
                product_name: p.product_name
            }
        })
            .then((response) => {
                message.info('上传成功', 3);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    displayadd = () => {
        this.setState({
            addDisplay: true
        })
    }
    addproduct = (e) => {

        let api = global.AppConfig.serverIP + '/addProduct/' + e;
        axios.get(api)
            .then((response) => {

                message.info('添加成功', 3);
                this.componentWillMount()
            })
            .catch((error) => {
                console.log(error);
            });

    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (<div>
                <div style={{width:"600px"}}>
            <Steps size={"default"} current={1}>
                <Steps.Step icon={<Icon type="database" />} title={<strong>申请单信息处理</strong>} />
                <Steps.Step icon={<Icon type="folder-open" />} title={<strong>产品类别信息管理</strong>} description={"对产品类别信息增加、删除、修改"}/>
            </Steps> </div>
                <Divider><strong>产品类别信息</strong></Divider>
                <Button style={{marginLeft:"500px"}} type="primary" onClick={this.displayadd}> 新建产品</Button>
                <Drawer
                    title="修改产品"
                    closable={false}
                    onClose={this.onclose}
                    visible={this.state.drawDisplay}
                    placement="right">
                    <Form onSubmit={this.handlesubmit}>
                        <Form.Item
                            label="产品编号">
                            {getFieldDecorator('product_id', {
                                rules: [{
                                    required: true, message: '请输入产品名称',
                                }],
                                initialValue: current_product_id,
                            })(<Input disabled={true}></Input>)}
                        </Form.Item>
                        <Form.Item
                            label="产品名称">
                            {getFieldDecorator('product_name', {
                                rules: [{
                                    required: true, message: '请输入产品名称',
                                }],
                                initialValue: current_product_name,
                            })(<Input></Input>)}
                        </Form.Item>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                    </Form>
                </Drawer>
                <Drawer
                    title="增加新产品"
                    closable={false}
                    onClose={this.oncloseadd}
                    visible={this.state.addDisplay}
                    placement="right">
                    <Form onSubmit={this.handleadd}>
                        <Form.Item
                            label="产品名称">
                            {getFieldDecorator('add_product_name', {
                            })(<Input></Input>)}
                        </Form.Item>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                    </Form>
                </Drawer>
                <Table
                    style={{marginLeft: "500px", width: "600px", height: "1200px"}}
                    columns={this.columns}
                    scroll={{
                        y: 1200,
                    }}
                    dataSource={this.state.productList}
                />
            </div>
        );
    }
}


const productmanage = Form.create({name: 'pm'})(productManage);
export default productmanage;