import React, { Component } from 'react';
import { Table, Modal, Divider} from 'antd';
import { Resizable, } from 'react-resizable';
import './table.css'
import axios from "axios";
import '../../config/config'
import { Redirect,Link } from "react-router-dom";
import Member_add from './member_add/member_add'
import saveLoginInfo from '../../utils/saveLogInfo'

const confirm = Modal.confirm;

const ResizeableTitle = (props) => {
    const { onResize, width, ...restProps } = props;

    if (!width) {
        return <th {...restProps} />;
    }

    return (
        <Resizable width={width} height={0} onResize={onResize}>
            <th {...restProps} />
        </Resizable>
    );
};
class MemberList extends Component {

    constructor(props) {

        super(props);
        this.state = {
            columns: [{
                title: '编号',
                dataIndex: 'member_number',
                width: 200,
            }, {
                title: '姓名',
                dataIndex: 'member_name',
                width: 100,
            }, {
                title: '性别',
                dataIndex: 'member_sex',
                width: 100,
            }, {
                title: '注册时间',
                dataIndex: 'member_jointime',
                width: 100,
            }, {
                title: '用户名',
                dataIndex: 'member_username',
                width: 100,
            }, {
                title: '密码',
                dataIndex: 'member_password',
                width: 100,
            }, {
                title: '操作',
                // key: 'action',
                width: 100,
                render: (text,record) => (
                    <div>
                        <a href={`/app/memberUpdate/${record.member_id}`}  >更改</a>
                        <Divider type="vertical" />
                        <a href="javascript:;"  onClick={()=>this.showDeleteConfirm(record.member_id)}>删除</a>
                    </div>
                ),
            }],

            test:  1111,
            memberList:[],
        };
    }



    showDeleteConfirm=(member_id)=>{
        confirm({
            title: '确定要删除吗',
            content: ' ',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: (()=>this.deleteMember(member_id)),
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    deleteMember=(member_id)=>{
            let api = global.AppConfig.serverIP+'/deleteMember?member_id='+member_id;
            axios.post(api)
        .then((response)=> {
            console.log(response);
            console.log(JSON.stringify(response.data));

            this.setState({
                              memberList: response.data,
                          })
        })
        .catch( (error)=> {
            console.log(error);
        });
    }


    components = {
        header: {
            cell: ResizeableTitle,
        },
    };



    componentWillMount() {

        let api = global.AppConfig.serverIP+'/getMemberList';

        axios.get(api)
            .then((response)=> {
                console.log(response);
                console.log(JSON.stringify(response.data));

                this.setState({
                    memberList: response.data,
                })
            })
            .catch( (error)=> {
                console.log(error);
            });
    }



    handleResize = index => (e, {size}) => {
        this.setState(({columns}) => {
            const nextColumns = [...columns];
            nextColumns[index] = {
                ...nextColumns[index],
                width: size.width,
            };
            return {columns: nextColumns};
        });
    };



    render()
    {
        saveLoginInfo('查看了人员列表');
        if(JSON.parse(sessionStorage.getItem("temp_user")).member_role !== 1){
            return <Redirect to="/app"/>;
        }

        const columns = this.state.columns.map((col, index) => ({
            ...col,
            onHeaderCell: column => ({
                column,
                width: column.width,
                onResize: this.handleResize(index),
               // key: index
            }),
        }));

        return (
            <div className="tableList" >
                <Member_add MemberList={this}/>
                <br/><br/>
                <Table
                    bordered
                    components={this.components}
                    columns={columns}
                    dataSource={this.state.memberList}
                    rowKey="member_id"
                />

            </div>
        );
    }
}



export default MemberList;
