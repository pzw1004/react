import React,{Component} from "react";
import {Statistic, Row, Col, Button, Select, } from 'antd';
import axios from "axios";

const { Option } = Select;
class Statistics extends Component{

    constructor(props){
        super(props);
        this.state={
            requisitionList:[],
            requisition_numberNum:0,
            requisition_numberList:[],
            requisition_samplenumberNum:0,
            requisition_samplenumberList:[],
            requisition_structurenameNum:0,
            requisition_structurenameList:[],
            requisition_constructunitNum:0,
            requisition_constructunitList:[],
            requisition_weldingmethodNum:0,
            requisition_weldingmethodList:[],
            requisition_steelnumberNum:0,
            requisition_steelnumberList:[],

            picture_thicknessNum:0,
            picture_thicknessList:[],
            picture_teststandardNum:0,
            picture_teststandardList:[],
            picture_qualifylevelNum:0,
            picture_qualifylevelList:[],
            picture_testmethodNum:0,
            picture_testmethodList:[],
        }
    }

    requisition_samplenumber=(value)=>{
        console.log(value);
        let api = global.AppConfig.serverIP+'/getRequisitionPictureNumBySamplenumber/'+encodeURIComponent(value);
        axios.get(api)
            .then((response)=>{
                console.log(response);
                this.setState({
                    requisition_samplenumberNum: response.data,
                })
            })
            .catch( (error) =>{
                console.log(error);
            });
    };

    requisition_numberOnChange=(value)=>{
        console.log(value);
        let api = global.AppConfig.serverIP+'/getRequisitionPictureNumByNumber/'+encodeURIComponent(value);
        axios.get(api)
            .then((response)=>{
                console.log(response);
                this.setState({
                    requisition_numberNum: response.data,
                })
            })
            .catch( (error) =>{
                console.log(error);
            });
    };

    requisition_structurenameOnChange=(value)=>{
        console.log(value);
        let api = global.AppConfig.serverIP+'/getRequisitionPictureNumByStructurename/'+encodeURIComponent(value) ;
        axios.get(api)
            .then((response)=>{
                console.log(response);
                this.setState({
                    requisition_structurenameNum: response.data,
                })
            })
            .catch( (error) =>{
                console.log(error);
            });
    };

    requisition_constructunitOnChange=(value)=>{
        console.log(value);
        let api = global.AppConfig.serverIP+'/getRequisitionPictureNumByConstructunit/'+encodeURIComponent(value);
        axios.get(api)
            .then((response)=>{
                console.log(response);
                this.setState({
                    requisition_constructunitNum: response.data,
                })
            })
            .catch( (error) =>{
                console.log(error);
            });
    };

    requisition_steelnumberOnChange=(value)=>{
        console.log(value);
        let api = global.AppConfig.serverIP+'/getRequisitionPictureNumBySteelnumber/'+encodeURIComponent(value);
        axios.get(api)
            .then((response)=>{
                console.log(response);
                this.setState({
                    requisition_steelnumberNum: response.data,
                })
            })
            .catch( (error) =>{
                console.log(error);
            });
    };

    requisition_weldingmethodOnChange=(value)=>{
        console.log(value);
        let api = global.AppConfig.serverIP+'/getRequisitionPictureNumByWeldingmethod/'+encodeURIComponent(value);
        axios.get(api)
            .then((response)=>{
                console.log(response);
                this.setState({
                    requisition_weldingmethodNum: response.data,
                })
            })
            .catch( (error) =>{
                console.log(error);
            });
    };

    countPictureThicknessNumber=(value)=>{
        console.log(value);
        let api = global.AppConfig.serverIP+'/countPictureThicknessNumber/'+encodeURIComponent(value);
        axios.get(api)
            .then((response)=>{
                console.log(response);
                this.setState({
                    picture_thicknessNum: response.data,
                })
            })
            .catch( (error) =>{
                console.log(error);
            });
    };

    countPictureTeststandardNumber=(value)=>{
        console.log(value);
        let api = global.AppConfig.serverIP+'/countPictureTeststandardNumber?picture_teststandard='+encodeURIComponent(value);
        axios.get(api)
            .then((response)=>{
                console.log(response);
                this.setState({
                    picture_teststandardNum: response.data,
                })
            })
            .catch( (error) =>{
                console.log(error);
            });
    };

    countPictureQualifylevelNumber=(value)=>{
        console.log(value);
        let api = global.AppConfig.serverIP+'/countPictureQualifylevelNumber/'+encodeURIComponent(value);
        axios.get(api)
            .then((response)=>{
                console.log(response);
                this.setState({
                    picture_qualifylevelNum: response.data,
                })
            })
            .catch( (error) =>{
                console.log(error);
            });
    };

    countPictureTestmethodNumber=(value)=>{
        console.log(value);
        let api = global.AppConfig.serverIP+'/countPictureTestmethodNumber/'+encodeURIComponent(value);
        axios.get(api)
            .then((response)=>{
                console.log(response);
                this.setState({
                    picture_testmethodNum: response.data,
                })
            })
            .catch( (error) =>{
                console.log(error);
            });
    };




    getRequisitionList=()=>{
        let api = global.AppConfig.serverIP+'/getRequisitionList';
        axios.get(api)
            .then((response)=>{
                console.log(response);
                this.setState({
                    requisitionList: response.data,
                })
            })
            .catch( (error) =>{
                console.log(error);
            });
    };

    getPictureListByDistinctTestmethod=()=>{
        let api = global.AppConfig.serverIP+'/getPictureListByDistinctTestmethod';
        axios.get(api)
            .then((response)=>{
                console.log(response);
                this.setState({
                    picture_testmethodList: response.data,
                })
            })
            .catch( (error) =>{
                console.log(error);
            });
    };


    getPictureListByDistinctQualifylevel=()=>{
        let api = global.AppConfig.serverIP+'/getPictureListByDistinctQualifylevel';
        axios.get(api)
            .then((response)=>{
                console.log(response);
                this.setState({
                    picture_qualifylevelList: response.data,
                })
            })
            .catch( (error) =>{
                console.log(error);
            });
    };

    getPictureListByDistinctTeststandard=()=>{
        let api = global.AppConfig.serverIP+'/getPictureListByDistinctTeststandard';
        axios.get(api)
            .then((response)=>{
                console.log(response);
                this.setState({
                    picture_teststandardList: response.data,
                })
            })
            .catch( (error) =>{
                console.log(error);
            });
    };

    getPictureListByDistinctThickness=()=>{
        let api = global.AppConfig.serverIP+'/getPictureListByDistinctThickness';
        axios.get(api)
            .then((response)=>{
                console.log(response);
                this.setState({
                    picture_thicknessList: response.data,
                })
            })
            .catch( (error) =>{
                console.log(error);
            });
    };


    getRequisitionListByDistinctSamplenumber=()=>{
        let api = global.AppConfig.serverIP+'/getRequisitionListByDistinctSamplenumber';
        axios.get(api)
            .then((response)=>{
                console.log(response);
                this.setState({
                    requisition_samplenumberList: response.data,
                })
            })
            .catch( (error) =>{
                console.log(error);
            });
    };

    getRequisitionListByDistinctStructurename=()=>{
        let api = global.AppConfig.serverIP+'/getRequisitionListByDistinctStructurename';
        axios.get(api)
            .then((response)=>{
                console.log(response);
                this.setState({
                    requisition_structurenameList: response.data,
                })
            })
            .catch( (error) =>{
                console.log(error);
            });
    };

    getRequisitionListByDistinctNumber=()=>{
        let api = global.AppConfig.serverIP+'/getRequisitionListByDistinctNumber';
        axios.get(api)
            .then((response)=>{
                console.log(response);
                this.setState({
                    requisition_numberList: response.data,
                })
            })
            .catch( (error) =>{
                console.log(error);
            });
    };

    getRequisitionListByDistinctConstructunit=()=>{
        let api = global.AppConfig.serverIP+'/getRequisitionListByDistinctConstructunit';
        axios.get(api)
            .then((response)=>{
                console.log(response);
                this.setState({
                    requisition_constructunitList: response.data,
                })
            })
            .catch( (error) =>{
                console.log(error);
            });
    };

    getRequisitionListByDistinctWeldingmethod=()=>{
        let api = global.AppConfig.serverIP+'/getRequisitionListByDistinctWeldingmethod';
        axios.get(api)
            .then((response)=>{
                console.log(response);
                this.setState({
                    requisition_weldingmethodList: response.data,
                })
            })
            .catch( (error) =>{
                console.log(error);
            });
    };

    getRequisitionListByDistinctSteelnumber=()=>{
        let api = global.AppConfig.serverIP+'/getRequisitionListByDistinctSteelnumber';
        axios.get(api)
            .then((response)=>{
                console.log(response);
                this.setState({
                    requisition_steelnumberList: response.data,
                })
            })
            .catch( (error) =>{
                console.log(error);
            });
    };


    componentWillMount() {
        this.getRequisitionList();
        this.getPictureListByDistinctQualifylevel();
        this.getPictureListByDistinctTestmethod();
        this.getPictureListByDistinctTeststandard();
        this.getPictureListByDistinctThickness();

        this.getRequisitionListByDistinctNumber();
        this.getRequisitionListByDistinctSamplenumber();
        this.getRequisitionListByDistinctConstructunit();
        this.getRequisitionListByDistinctSteelnumber();
        this.getRequisitionListByDistinctStructurename();
        this.getRequisitionListByDistinctWeldingmethod();
    }


    render() {

        return(
            <div>
                <Row gutter={16}>
                    <Col span={6}>
                        <Select
                            showSearch
                            style={{ width: 150 }}
                            placeholder="统计来样编号个数"
                            onChange={this.requisition_samplenumber}
                        >
                            {this.state.requisition_samplenumberList.map((item,key)=>{
                                return(
                                    <Option value={item.requisition_samplenumber}>{item.requisition_samplenumber}</Option>
                                )
                            })}
                        </Select>
                        <Statistic title="来样编号" value={this.state.requisition_samplenumberNum} />
                    </Col>
                    <Col span={6}>
                        <Select
                            showSearch
                            style={{ width: 150 }}
                            placeholder="统计工程编号个数"
                            onChange={this.requisition_numberOnChange}
                        >
                            {this.state.requisition_numberList.map((item,key)=>{
                                return(
                                    <Option value={item.requisition_number}>{item.requisition_number}</Option>
                                )
                            })}
                        </Select>
                        <Statistic title="工程编号(图片数)" value={this.state.requisition_numberNum}  />
                    </Col>
                    <Col span={6}>
                        <Select
                            showSearch
                            style={{ width: 150 }}
                            placeholder="统计结构名称个数"
                            onChange={this.requisition_structurenameOnChange}
                        >
                            {this.state.requisition_structurenameList.map((item,key)=>{
                                return(
                                    <Option value={item.requisition_structurename}>{item.requisition_structurename}</Option>
                                )
                            })}
                        </Select>
                        <Statistic title="结构名称" value={this.state.requisition_structurenameNum}  />
                    </Col>
                    <Col span={6}>
                        <Select
                            showSearch
                            style={{ width: 150 }}
                            placeholder="统计施工单位个数"
                            onChange={this.requisition_constructunitOnChange}
                        >
                            {this.state.requisition_constructunitList.map((item,key)=>{
                                return(
                                    <Option value={item.requisition_constructunit}>{item.requisition_constructunit}</Option>
                                )
                            })}
                        </Select>
                        <Statistic title="施工单位" value={this.state.requisition_constructunitNum}  />
                    </Col>
                </Row>
                <br/>
                <Row gutter={16}>
                    <Col span={6}>
                        <Select
                            showSearch
                            style={{ width: 150 }}
                            placeholder="统计焊接方法个数"
                            onChange={this.requisition_weldingmethodOnChange}
                        >
                            {this.state.requisition_weldingmethodList.map((item,key)=>{
                                return(
                                    <Option value={item.requisition_weldingmethod}>{item.requisition_weldingmethod}</Option>
                                )
                            })}
                        </Select>
                        <Statistic title="焊接方法" value={this.state.requisition_weldingmethodNum}  />
                    </Col>
                    <Col span={6}>
                        <Select
                            showSearch
                            style={{ width: 150 }}
                            placeholder="统计钢号个数"
                            onChange={this.requisition_steelnumberOnChange}
                        >
                            {this.state.requisition_steelnumberList.map((item,key)=>{
                                return(
                                    <Option value={item.requisition_steelnumber}>{item.requisition_steelnumber}</Option>
                                )
                            })}
                        </Select>
                        <Statistic title="钢号" value={this.state.requisition_steelnumberNum} />
                    </Col>
                    <Col span={6}>
                        <Select
                            showSearch
                            style={{ width: 150 }}
                            placeholder="统计该厚度的图片数"
                            onChange={this.countPictureThicknessNumber}
                        >
                            {this.state.picture_thicknessList.map((item,key)=>{
                                return(
                                    <Option value={item.picture_thickness}>{item.picture_thickness}</Option>
                                )
                            })}
                        </Select>
                        <Statistic title="厚度" value={this.state.picture_thicknessNum}  />
                    </Col>

                    <Col span={6}>
                        <Select
                            showSearch
                            style={{ width: 150 }}
                            placeholder="统计检测标准个数"
                            onChange={this.countPictureTeststandardNumber}
                        >
                            {this.state.picture_teststandardList.map((item,key)=>{
                                return(
                                    <Option value={item.picture_teststandard}>{item.picture_teststandard}</Option>
                                )
                            })}
                        </Select>
                        <Statistic title="检测标准" value={this.state.picture_teststandardNum}  />
                    </Col>
                </Row>
                <br/>
                <Row gutter={16}>
                    <Col span={6}>
                        <Select
                            showSearch
                            style={{ width: 150 }}
                            placeholder="统计检测方法个数"
                            onChange={this.countPictureTestmethodNumber}
                        >
                            {this.state.picture_testmethodList.map((item,key)=>{
                                return(
                                    <Option value={item.picture_testmethod}>{item.picture_testmethod}</Option>
                                )
                            })}
                        </Select>
                        <Statistic title="检测方法" value={this.state.picture_testmethodNum} />
                    </Col>
                    <Col span={6}>
                        <Select
                            showSearch
                            style={{ width: 150 }}
                            placeholder="统计合格级别个数"
                            onChange={this.countPictureQualifylevelNumber}
                        >
                            {this.state.picture_qualifylevelList.map((item,key)=>{
                                return(
                                    <Option value={item.picture_qualifylevel}>{item.picture_qualifylevel}</Option>
                                )
                            })}
                        </Select>
                        <Statistic title="合格级别" value={this.state.picture_qualifylevelNum} />
                    </Col>


                </Row>
            </div>
        );
    }

}

export default Statistics;