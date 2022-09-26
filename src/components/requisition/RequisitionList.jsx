import { DownOutlined} from '@ant-design/icons';
import {Table, Input, Button, Dropdown, Icon, Badge, Menu, Popconfirm, message, Steps, Divider} from 'antd';
import Highlighter from 'react-highlight-words';
import React,{Component} from "react";
import axios from "axios";
import '../../config/config'
import { Link } from "react-router-dom";
import saveLoginInfo from '../../utils/saveLogInfo'

import Requisition_manage from './requisition_manage/Requisition_manage'
import PictureManage from '../picture/PictureManage'
import history from "../common/history";

// import Observer from './observer'   传值，监听是否正在上传，实时刷新

const data = [];
const handleMenuClick = (e) => {
    message.info('Click on menu item.');
    console.log('click', e);
  };




class RequisitionList extends Component{

    constructor(props) {
        super(props);
        this.state={

            selectedRowKeys: [], // Check here to configure the default column
            loading: false,
            current_product_name: '',
            // ifuploading:false,
            product_id: '',
            searchText: '',
            requisitionList: [],
            requisition: {
                requisition_id: '',
                requisition_number: '',
                requisition_name: '',
                requisition_structurename: '',
                requisition_constructunit: '',
                requisition_weldingmethod: '',
                requisition_saveplace: '',
                requisition_samplenumber: '',
                requisition_density: '',
                requisition_reportnumber: '',
                requisition_filmtype: '',
                requisition_testingstandard: '',
                requisition_qualificationlevel: '',
                requisition_intensifyscreen: '',
                requisition_tubecurrent: '',
                requisition_tubevoltage: '',
                requisition_exposuretime: '',
                requisition_sensitivity: '',
                requisition_focus: '',
                requisition_developmenttime: '',
                requisition_developertemperature: '',
                requisition_steelnumber: '',
                requisition_jointform: '',
                requisition_ps: '',
                requisition_instrumenttype: '',
                requisition_totalnumber: '',
                requisition_reworktimes: '',
                requisition_firstexam: '',
                requisition_firstexam_member: '',
                requisition_secondexam: '',
                requisition_secondexam_member: '',
                requisition_thirdexam: '',
                requisition_thirdexam_member: '',
                requisition_firstopinion: '',
                requisition_secondopinion: '',
                requisition_thirdopinion: '',
                requisition_state: '',
                requisition_submit: '',
                requisition_entrytime: '',
                requisition_last_thickness:'',
                requisition_last_teststandard:'',
                requisition_product_id:'',
                requisition_complete_date:'',
                requisition_testing_rate:'',
                requisition_bevel_form:'',
                requisition_transillumination:'',
                requisition_testing_date:'',
                requisition_testing_instrument:'',
                requisition_source_strength:'',
                requisition_focus_size:'',
                requisition_material:'',
                requisition_sensitization_method:'',
                requisition_film_processing_method:'',
                requisition_military_inspection_id:'',
                requisition_real_id:'',
                requisition_source_age:'',
                requisition_product_name:'',
            },
            picture:[],
            visible: false,
            requisition_tubevoltage_disabled: true,
            requisition_button_disabled: true,
            threeRoleManage:{
                requisition_firstexam: true,
                requisition_secondexam: true,
                requisition_thirdexam: true,
            },

            firstStatus: '',
            secondStatus: '',
            thirdStatus: '',

            firstMember:'无',
            secondMember:'无',
            thirdMember:'无',

            firstMemberId:'',
            secondMemberId:'',
            thirdMemberId:''

        };
        // this.bindEvent();

    }


    deleteMany = () => {

        console.log(this.state.selectedRowKeys.length);

        for(let i=0;i<this.state.selectedRowKeys.length;i++)
        {
            let api = global.AppConfig.serverIP + '/deletePictureById/'+this.state.selectedRowKeys[i];
            axios.post(api)
                .then((response)=> {
                    console.log(JSON.stringify(response.data));
                    message.success("影像图已删除");
                    this.setState({
                        picture: response.data,
                    })
                })
                .catch( (error)=> {
                    console.log(error);
                });
        }



        this.setState({ loading: true });
        // ajax request after empty completing
        setTimeout(() => {
            this.setState({
                selectedRowKeys: [],
                loading: false,
            });
        }, 1000);
    };

    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };



    // bindEvent(){
    //     {/* 侦听handler事件，以接收信息 */}
    //     Observer.$on("uploading",this.getMsgHandler.bind(this))
    // }
    //
    // getMsgHandler(val){
    //     {/* 来电回调，接收值 */}
    //     this.setState({
    //         ifuploading:val
    //     })
    // }

    showDrawer = (requisition_id) => {
        this.getRequisition(requisition_id);
    };

    getRequisition=(requisition_id)=>{
        saveLoginInfo('查看了申请单列表信息');
        let api = global.AppConfig.serverIP + '/getRequisition?requisition_id=' + requisition_id;
        axios.post(api)
            .then((response)=> {
                console.log(JSON.stringify(response.data));
                /**
                 *通过1234四个数字表示当前审批的状态，对应四个管理权限
                 */
                let temp_state;

                if(JSON.parse(sessionStorage.getItem("temp_user")).member_role === response.data.requisition_state)
                   {temp_state=false;}else {
                    temp_state=true;
                }
                this.threeRoleManage(JSON.parse(sessionStorage.getItem("temp_user")));

                let tempRequisition = response.data;
                this.getMemberName(tempRequisition.requisition_firstexam_member);
                this.getMemberName2(tempRequisition.requisition_secondexam_member);
                this.getMemberName3(tempRequisition.requisition_thirdexam_member);

                console.log("-------------------");
                //console.log(firstName);
                console.log("-------------------");
                var t =setTimeout(()=>{
                    this.setState({
                        visible: true,
                        requisition: response.data,
                        requisition_tubevoltage_disabled: temp_state,
                        requisition_button_disabled: temp_state,
                    })
                },100);
                // this.productNameState();
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    getMemberName=(member_id)=>{

        this.setState({
            firstMemberId:member_id,
        })
        //saveLoginInfo('查看了申请单列表信息');
        let api = global.AppConfig.serverIP + '/getMemberNameById?member_id=' + member_id;
        axios.post(api)
            .then((response)=> {
                console.log(JSON.stringify(response.data));
                this.setState({
                    firstMember: response.data,
                })
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    getMemberName2=(member_id)=>{
        this.setState({
            secondMemberId:member_id,
        })
        //saveLoginInfo('查看了申请单列表信息');
        let api = global.AppConfig.serverIP + '/getMemberNameById?member_id=' + member_id;
        axios.post(api)
            .then((response)=> {
                console.log(JSON.stringify(response.data));
                this.setState({
                    secondMember: response.data,
                })
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    getMemberName3=(member_id)=>{
        this.setState({
            thirdMemberId:member_id,
        })
        //saveLoginInfo('查看了申请单列表信息');
        let api = global.AppConfig.serverIP + '/getMemberNameById?member_id=' + member_id;
        axios.post(api)
            .then((response)=> {
                console.log(JSON.stringify(response.data));
                this.setState({
                    thirdMember: response.data
                })
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    threeRoleManage=(member)=>{
        let requisition_firstexam = true;
        let requisition_secondexam = true;
        let requisition_thirdexam = true;
        if(member.member_role === 1){
            requisition_firstexam=false;
            requisition_secondexam=false;
            requisition_thirdexam=false;
        }
        if(member.member_role === 2){
            requisition_firstexam=false;
        }
        if(member.member_role === 3){
            requisition_secondexam=false;
        }
        if(member.member_role === 4){
            requisition_thirdexam=false;
        }

        this.setState({
            threeRoleManage:{
                requisition_firstexam: requisition_firstexam,
                requisition_secondexam: requisition_secondexam,
                requisition_thirdexam: requisition_thirdexam,
            },

        })

    };

    deleteRequisition=(requisition_id,requisition_number)=>{
        this.getRequisition();
        saveLoginInfo('删除了申请单编号'+requisition_number+'列表信息');

        let api = global.AppConfig.serverIP + '/deleteRequisitionById/'+requisition_id;
        axios.post(api)
            .then((response)=> {
                console.log(JSON.stringify(response.data));
                message.success("删除成功");
                this.setState({
                    requisitionList: response.data,
                })
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    deletePicture=(picture_id,picture_number)=>{
        saveLoginInfo('删除了影像图编号'+picture_number+'列表信息');
        let api = global.AppConfig.serverIP + '/deletePictureById/'+picture_id;
        axios.post(api)
            .then((response)=> {
                console.log(JSON.stringify(response.data));
                message.success("影像图已删除");
                this.setState({
                    picture: response.data,
                })
            })
            .catch( (error)=> {
                console.log(error);
            });

    };

    expandedRowRender = (record) => {

        const columns = [                                     //扩展列表
            //{ title: '所属申请单ID', dataIndex: 'picture_requisition_id',  filteredValue: record.requisition_id},
            { title: '影像图编号', dataIndex: 'picture_number', width:150 },
            { title: '厚度', dataIndex: 'picture_thickness',  width:150 },
            { title: '级别', dataIndex: 'picture_level', width:150  },
            // { title: '状态', key: 'state', render: () => <span><Badge status="success" />已审批</span> },
            {
                title: '操作',
                width:150,
                dataIndex: 'operation',
                key: 'operation',
                render: (text,record) => (
                    <div>
                        <span className="table-operation">
                            <Link to={`/app/pictureManage/${record.picture_id}`}><a>审核影像图</a></Link>
                        </span>
                    </div>
                ),
            },
            {
                title: '删除',
                
                
                dataIndex: 'delete',
                key: 'delete',
                render: (text,record) => (
                        <Popconfirm
                            title="确定要删除该影像图吗？"
                            icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                            onConfirm={()=>this.deletePicture(record.picture_id,record.picture_number)}
                            okText="确定删除"
                            cancelText="取消"
                        >
                            <a href="#">删除影像图</a>
                        </Popconfirm>
                ),
            },
            

        ];

        /**
         * 定义一个临时的数组，存符合当前table展开列的picture对象
         * @type {Array}
         */
        let data = [];
        this.state.picture.map((temp_picture)=>{

            if(temp_picture.picture_requisition_id === record.requisition_id){
                if(temp_picture.picture_thickness==null)
                    temp_picture.picture_thickness = record.requisition_last_thickness;

                data.push(temp_picture);
            }
        });
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            columnWidth:100,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        //console.log(data);
        const pagination={
            style:{height: '32px', lineHeight: '32px', textAlign: 'left',float: 'left'},
            showTotal: (total, range) =>`共${total}条`,
        }
        return (
            <div>
                    <div style={{ marginBottom: 16 }}>
                        <Button type="danger"  onClick={this.deleteMany} disabled={!hasSelected} loading={loading}>
                            批量删除
                        </Button>
                        <span style={{ marginLeft: 8 }}>
                        {hasSelected ? `选择了 ${selectedRowKeys.length} 张` : ''}
                      </span>
                    </div>
                    <Table 
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={data}
                        pagination={pagination}
                        rowKey="picture_id"
                    />
            </div>
        );
    };


    showPageList=()=>{
        let product_id = this.props.match.params.product_id

        let api = global.AppConfig.serverIP+'/getRequisitionListByProductId/'+product_id;
        axios.get(api)
            .then((response)=>{
                this.shenpiState(response.data);
            })
            .catch( (error) =>{
                console.log(error);
            });

        let api3 = global.AppConfig.serverIP+'/getProductByProductId/'+product_id;
        axios.get(api3)
            .then((response)=>{
                console.log("response.data.product_name"+response.data.product_name);
                // this.productNameState(response.data);
                this.setState({
                    current_product_name: response.data.product_name
                    // requisitionList: response.data,
                })
            })
            .catch( (error) =>{
                console.log(error);
            });

        let api2 = global.AppConfig.serverIP+'/getPictureList';
        axios.get(api2)
            .then((response2)=>{
                console.log(response2);
                this.setState({
                    picture: response2.data,
                })
            })
            .catch( (error) =>{
                console.log(error);
            });
    };

    componentWillMount() {
        console.log("!!!!!!!!!!!")
        this.showPageList();
    }

    componentDidMount() {
        // console.log(this.state.ifuploading);
        // this.intervalId = setInterval(() => {
        //     this.showPageList();
        // }, 10000);
    }

    componentWillUnmount() {
        // clearInterval(this.intervalId);
    }


    shenpiState=(requisitionList)=>{

        // eslint-disable-next-line array-callback-return
        requisitionList.map((item)=>{
             if(item.requisition_firstexam==='未审批')
                 item["firstStatus"] = "warning";

            if(item.requisition_firstexam==='审批完成')
                item["firstStatus"] = "success";

            if(item.requisition_firstexam==='已驳回')
                item["firstStatus"] = "error";


            if(item.requisition_secondexam==='未审批')
                item["secondStatus"] = "warning";

            if(item.requisition_secondexam==='审批完成')
                item["secondStatus"] = "success";

            if(item.requisition_secondexam==='已驳回')
                item["secondStatus"] = "error";


            if(item.requisition_thirdexam==='未审批')
                item["thirdStatus"] = "warning";
            if(item.requisition_thirdexam==='审批完成')
                item["thirdStatus"] = "success";
            if(item.requisition_thirdexam==='已驳回')
                item["thirdStatus"] = "error";


        });
         this.setState({
             requisitionList: requisitionList,
         })
        console.log(this.state.requisitionList)

     };

    // productNameState=(requisitionList)=>{
    //     console.log("testestest!!!!!!!!");
    //     requisitionList.map((item)=> {
    //         // eslint-disable-next-line array-callback-return
    //         let api = global.AppConfig.serverIP + '/getProductByProductId?product_id=' + item.requisition_product_id;
    //         axios.post(api)
    //             .then((response) => {
    //                 console.log(JSON.stringify(response.data));
    //                 item.requisition_product_name = response.data.requisition_product_name;
    //             });
    //     });
    //
    //     this.setState({
    //         requisitionList: requisitionList,
    //     })
    // };

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    查询
                </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    重置
                </Button>
            </div>
        ),
        filterIcon: filtered => (
            <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text => (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={()=>{
                    text.toString()
                }

                }
            />
        ),
    });

    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };


    columns = [                     //最外层列表
        { title: '军检号', dataIndex: 'requisition_military_inspection_id', width:110,},
        { title: '工程编号', dataIndex: 'requisition_name',  width:110,},
        // { title: '结构名称', dataIndex: 'requisition_structurename', ...this.getColumnSearchProps('requisition_structurename'), width:180,},
        // { title: '施工单位', dataIndex: 'requisition_constructunit', ...this.getColumnSearchProps('requisition_constructunit'),width:110,},
        // { title: '钢号', dataIndex: 'requisition_steelnumber',  ...this.getColumnSearchProps('requisition_steelnumber'),width:80,},
        { title: '焊接方法', dataIndex: 'requisition_weldingmethod', width:110,},
        // { title: '厚度', dataIndex: 'requisition_density', ...this.getColumnSearchProps('requisition_density'),width:80,},
        { title: '完工日期', dataIndex: 'requisition_complete_date', width:110,},
        { title: '检测标准', dataIndex: 'requisition_testingstandard', width:110,},
        { title: '合格级别', dataIndex: 'requisition_qualificationlevel', width:110,},
        { title: '焊缝数量', dataIndex: 'requisition_totalnumber', width:110,},
        { title: '一级状态', key: 'state1',width:110, render: (record) => <span><Badge status={record.firstStatus} />{record.requisition_firstexam}</span> },
        { title: '二级状态', key: 'state2',width:110, render: (record) => <span><Badge status={record.secondStatus}/>{record.requisition_secondexam}</span> },
        { title: '三级状态', key: 'state3',width:110, render: (record) => <span><Badge status={record.thirdStatus} />{record.requisition_thirdexam}</span> },
        { title: '操作', key: 'operation', width:110,render: (record) => <a onClick={()=>this.showDrawer(record.requisition_id)}>审核申请单</a> },
        { title: '删除', key: 'delete', width:110,render: (record) =>
            <Popconfirm
                title="确定要删除该申请单吗？"
                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                onConfirm={()=>this.deleteRequisition(record.requisition_id,record.requisition_number)}
                okText="确定删除"
                cancelText="取消"
            >
                <a href="#">删除申请单</a>
            </Popconfirm>},
    ];


    render() {
        console.log(this.state.requisitionList)
        console.log(this.state.current_product_name)
        return (
            <div>
            <br></br>
                {/* eslint-disable-next-line react/jsx-pascal-case */}
                <Requisition_manage RequisitionList={this}/>
                {/*<PictureManage tiaozhuan={this.tiaozhuan}/>*/}
                <div style={{width:"700px"}}>
                <Steps size={"default"} current={2}>
                    <Steps.Step icon={<Icon type="database" />} title="查看信息" />
                    <Steps.Step icon={<Icon type="folder-open" />} title="产品类别" description={this.state.current_product_name}/>
                    <Steps.Step title="申请单" description={"总数:"+this.state.requisitionList.length}/>
                </Steps></div>
                <br/>
                <strong><font size={4}>产品:</font></strong><font size={4}>&ensp;{this.state.current_product_name}</font>
                <br/>
                <br/>
                <br/>
                <Table
                className="components-table-demo-nested"
                columns={this.columns}
                expandedRowRender={this.expandedRowRender}
                dataSource={this.state.requisitionList}
                rowKey="requisition_id"
                pagination={true}
                scroll={{
                    x: 1200,
                    y: 600,
                  }}
                />

            </div>
    );

    }
}



export default RequisitionList;