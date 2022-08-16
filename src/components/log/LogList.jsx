import React,{Component} from "react";
import { Table, Input, Button, Icon } from 'antd';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import axios from "axios";
import '../../config/config'


class LogList extends Component {

    constructor(props) {
        super(props);

        this.state = {

        filteredInfo: null,
        sortedInfo: null,
        logdata: [],
        searchText: '',

    };
    }
    handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };

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
                textToHighlight={text.toString()}
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

    componentWillMount() {
        //moment 函数引入解决时间戳解析问题
        //moment(1552994863000).format("YYYY-MM-DD HH:mm:ss")
        let api = global.AppConfig.serverIP + '/getLogList';

        axios.get(api)
            .then((response)=>{
                console.log(response);
                let tempData = response.data;
                for ( var i = 0; i <tempData.length; i++){
                    tempData[i].log_time = moment(tempData[i].log_time).format("YYYY-MM-DD HH:mm:ss");
                }
                this.setState({
                    logdata: tempData,
                })

            })
            .catch( (error) =>{
                console.log(error);
            });

    }

    render() {
        const columns = [{
            title: '时间',
            dataIndex: 'log_time',
            key: 'log_time',
            ...this.getColumnSearchProps('log_time'),
        }, {
            title: '操作人员',
            dataIndex: 'log_operator',
            key: 'log_operator',
            ...this.getColumnSearchProps('log_operator'),
        }, {
            title: '操作',
            dataIndex: 'log_operation',
            key: 'log_operation',
            ...this.getColumnSearchProps('log_operation'),
        }];
        return (
            <div>
                <div className="table-operations">
                </div>
                <Table
                    columns={columns}
                    dataSource={this.state.logdata}
                    // onChange={this.handleChange}
                    // rowKey="log_id"
                />
            </div>
        );
    }
}

export default LogList;