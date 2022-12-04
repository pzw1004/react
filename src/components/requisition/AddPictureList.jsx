// import { Upload, Button, Icon, message } from 'antd';
// import reqwest from 'reqwest';
// import React,{Component} from "react";
// import { Tree } from 'antd';
// import { Select } from 'antd';
// import axios from "axios";
//
// const { Option } = Select;
//
//
//
// function onBlur() {
//     console.log('blur');
// }
//
// function onFocus() {
//     console.log('focus');
// }
//
// function onSearch(val) {
//     console.log('search:', val);
// }
// const { TreeNode, DirectoryTree } = Tree;
//
// class AddPictureList extends Component {
//
//     constructor(props) {
//         super(props);
//         this.state = {
//             requisitionTree: [],
//             requisitionFile: [],
//             fileList: [],
//             uploading: false,
//             selectRequisition_id: '',
//         };
//     }
//
//
//      onChange=(value)=>{
//
//         console.log(`selected ${value}`);
//
//         this.setState({
//             selectRequisition_id: value,
//         })
//
//     };
//
//
//     componentWillMount() {
//         this.getFileList();
//         this.getFile();
//     }
//
//     getFileList=()=>{
//
//         let api = global.AppConfig.serverIP + '/getRequisitionFileList';
//         axios.post(api)
//             .then((response)=> {
//                 console.log(response);
//                 console.log(JSON.stringify(response.data));
//                 this.setState({
//                     requisitionTree: response.data,
//                 })
//             })
//             .catch( (error)=> {
//                 console.log(error);
//             });
//     };
//
//     getFile=()=>{
//
//         let api = global.AppConfig.serverIP + '/getRequisitionFile';
//         axios.post(api)
//             .then((response)=> {
//                 console.log(response);
//                 console.log(JSON.stringify(response.data));
//                 this.setState({
//                     requisitionFile: response.data,
//                 })
//             })
//             .catch( (error)=> {
//                 console.log(error);
//             });
//     };
//
//     handleUpload = () => {
//         const { fileList } = this.state;
//         const formData = new FormData();
//         fileList.forEach(file => {
//             //formData.append('files[]', file);
//             formData.append('uploadFile', file);
//         });
//
//         this.setState({
//             uploading: true,
//         });
//
//         // You can use any AJAX library you like
//
//         // this.uploadFileList(formData);
//
//         reqwest({
//             url: global.AppConfig.serverIP + '/uploadFileList/'+ this.state.selectRequisition_id,
//             method: 'post',
//             processData: false,
//             contentType: false,
//             data: formData,
//             success: () => {
//                 this.setState({
//                     fileList: [],
//                     uploading: false,
//                 });
//                 message.success('已经全部导入成功！');
//                 this.getFileList();
//             },
//             error: () => {
//                 this.setState({
//                     uploading: false,
//                 });
//                 message.error('upload failed.');
//             },
//         });
//     };
//
//     //用axios传递有点问题,暂时留下代码，不用
//     uploadFileList=(formData)=>{
//         let api = global.AppConfig.serverIP + '/uploadFileList';
//         axios.post(api,formData)
//             .then((response)=> {
//                 console.log(response);
//                 console.log(JSON.stringify(response.data));
//                 this.setState({
//                     //requisitionTree: response.data,
//                     uploading: false,
//                 });
//                 message.success('upload successfully.');
//                 //this.getFileList();
//             })
//             .catch( (error)=> {
//                 console.log(error);
//             });
//     };
//
//     onSelect = (keys, event) => {
//         console.log('Trigger Select', keys, event);
//     };
//
//     onExpand = () => {
//         console.log('Trigger Expand');
//     };
//
//
//     render() {
//         const { uploading, fileList } = this.state;
//         const props = {
//             onRemove: file => {
//                 this.setState(state => {
//                     const index = state.fileList.indexOf(file);
//                     const newFileList = state.fileList.slice();
//                     newFileList.splice(index, 1);
//                     return {
//                         fileList: newFileList,
//                     };
//                 });
//             },
//             beforeUpload: file => {
//                 this.setState(state => ({
//                     fileList: [...state.fileList, file],
//                 }));
//                 return false;
//             },
//             fileList,
//         };
//
//
//         return (
//             <div>
//                 <DirectoryTree multiple defaultExpandAll onSelect={this.onSelect} onExpand={this.onExpand}>
//                     {this.state.requisitionTree.map((item,key)=>{
//                         console.log(JSON.stringify(item));
//                        return(
//                            <TreeNode title={item.requisition_number} key={key}>
//                                {item.pictures.map((item,key)=>{
//                                    return <TreeNode title={item.picture_number} key={item.picture_id} isLeaf />
//                                })}
//                            </TreeNode>
//                        )
//                     })
//                     }
//                 </DirectoryTree>
//                 <br/>
//                 <Select
//                     showSearch
//                     style={{ width: 200 }}
//                     placeholder="选择要导入的申请单"
//                     optionFilterProp="children"
//                     onChange={this.onChange}
//                     onFocus={onFocus}
//                     onBlur={onBlur}
//                     onSearch={onSearch}
//                     filterOption={(input, option) =>
//                         option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
//                     }
//                 >
//                     {this.state.requisitionFile.map((item,key)=>{
//                         return(
//                             <Option value={item.requisition_id}>{item.requisition_number}</Option>
//                         )
//                     })}
//                 </Select>
//                 <br/>
//                 <Upload
//                     accept="image/*"
//                     multiple="multiple"
//                     {...props}>
//                     <Button>
//                         <Icon type="upload" /> 选择导入图片
//                     </Button>
//                 </Upload>
//                 <Button
//                     type="primary"
//                     onClick={this.handleUpload}
//                     disabled={fileList.length === 0}
//                     loading={uploading}
//                     style={{ marginTop: 16 }}
//                 >
//                     {uploading ? '正在导入' : '开始导入'}
//                 </Button>
//
//             </div>
//         );
//     }
//
// }
// export default AddPictureList;


import {Upload, Button, Icon, message, Modal, Progress} from 'antd';
import reqwest from 'reqwest';
import React, {Component} from "react";
import {Tree} from 'antd';
import {Select} from 'antd';
import axios from "axios";
import {PlusOutlined, UploadOutlined} from '@ant-design/icons';
import './AddPictureList.css'
const {Option} = Select;

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function onBlur() {
    console.log('blur');
}

function onFocus() {
    console.log('focus');
}

function onSearch(val) {
    console.log('search:', val);
}

const {TreeNode, DirectoryTree} = Tree;


let allfilelens = 0;


class AddPictureList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lens: 0,
            donef: 0,
            requisitionTree: [],
            requisitionFile: [],
            fileList: [],
            fileList2: [],
            fileList3: [],
            uploading: false,
            selectRequisition_id: '',
            percent: '',
        };
    }


    onChange = (value) => {

        console.log(`selected ${value}`);

        this.setState({
            selectRequisition_id: value,
        })

    };


    componentWillMount() {
        this.getFileList();
        this.getFile();
    }

    getFileList = () => {

        let api = global.AppConfig.serverIP + '/getRequisitionFileList';
        axios.post(api)
            .then((response) => {
                console.log(response);
                console.log(JSON.stringify(response.data));
                this.setState({
                    requisitionTree: response.data,
                })
            })
            .catch((error) => {
                console.log(error);
            });
    };

    getFile = () => {

        let api = global.AppConfig.serverIP + '/getRequisitionFile';
        axios.post(api)
            .then((response) => {
                console.log(response);
                console.log(JSON.stringify(response.data));
                this.setState({
                    requisitionFile: response.data,
                })
            })
            .catch((error) => {
                console.log(error);
            });
    };

    handleUpload = () => {
        const {fileList,fileList2,fileList3} = this.state;
        const formData = new FormData();
        fileList.forEach(file => {
            //formData.append('files[]', file);
            formData.append('uploadFile', file)//射线
        });
        fileList2.forEach(file => {
            //formData.append('files[]', file);
            formData.append('uploadFile2', file) //涡流
        });
        fileList3.forEach(file => {
            //formData.append('files[]', file);
            formData.append('uploadFile3', file) //超声
        });
        console.log(fileList2.length)
        console.log(fileList3.length)
        console.log(fileList.length)
        this.setState({
            uploading: true,
            lens: fileList.length
        });

        // You can use any AJAX library you like

        // this.uploadFileList(formData);
        let loaded = 0
        axios({
            onUploadProgress: (progressEvent) => {
                console.log(progressEvent)
                loaded = loaded + 1
                console.log(loaded)
                this.setState({
                    percent: parseInt((progressEvent.loaded /progressEvent.total) * 100 - Math.random()*10-4)
                })
            },
            url: global.AppConfig.serverIP + '/uploadFileList/' + this.state.selectRequisition_id,
            method: 'post',
            processData: false,
            contentType: false,
            data: formData,
            //
            // success: () => {
            //     this.setState({
            //         fileList: [],
            //         uploading: false,
            //     });
            //     message.success('已经全部导入成功！');
            //     this.getFileList();
            // },
            // error: () => {
            //     this.setState({
            //         uploading: false,
            //     });
            //     message.error('upload failed.');
            // },
        }).then((response) => {
            this.setState({
                uploading: false,
            });
            this.setState({
                percent: 100
            })
            message.success('已经全部导入成功！');
            // this.getFileList();
        }).catch((error) => {
            this.setState({
                uploading: false,
            });
            message.error('upload failed.');
        });
    };

    //用axios传递有点问题,暂时留下代码，不用
    uploadFileList = (formData) => {
        let api = global.AppConfig.serverIP + '/uploadFileList';
        axios.post(api, formData)
            .then((response) => {
                console.log(response);
                console.log(JSON.stringify(response.data));
                this.setState({
                    //requisitionTree: response.data,
                    uploading: false,
                });
                message.success('upload successfully.');
                //this.getFileList();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    onSelect = (keys, event) => {
        console.log('Trigger Select', keys, event);
    };

    onExpand = () => {
        console.log('Trigger Expand');
    };


    render() {


        const {uploading, fileList, fileList2, fileList3} = this.state;

        // const event = info.event;
        // if(event){
        //     let percent = Math.floor((event.loaded/event.total)*100)
        //     this.setState({
        //         percent: percent
        //     })
        // }

        const props = {
            listType: 'picture',
            onRemove: file => {
                console.log(file)
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    console.log(index)
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    console.log(newFileList)
                    return {
                        fileList: newFileList,
                    };
                });

            },
            beforeUpload: file => {
                console.log(file)
                file.url = global.AppConfig.tiffPicsIP + "0//" + file.name;//预览图片保存的地址

                this.setState(state => ({
                        fileList: [...state.fileList, file],
                    }
                ));
                console.log(this.state.fileList)
                return false;
            },
            onChange: ({file, fileList}) => {
                let d = this.state.donef

                if (file.status == "done") {
                    console.log("done")
                    this.setState({
                        donef: d + 1
                    })
                }
                console.log(file);

            },
            fileList,
            defaultFileList: fileList,
        };
        const props2 = {
            listType: 'picture',
            onRemove: file => {
                console.log(file)
                this.setState(state => {
                    const index = state.fileList2.indexOf(file);
                    console.log(index)
                    const newFileList = state.fileList2.slice();
                    newFileList.splice(index, 1);
                    console.log(newFileList)
                    return {
                        fileList2: newFileList,
                    };
                });

            },
            beforeUpload: file => {
                console.log(file)
                file.url = global.AppConfig.tiffPicsIP + "0//涡流//" + file.name;//预览图片保存的地址

                this.setState(state => ({
                        fileList2: [...state.fileList2, file],
                    }
                ));
                console.log(this.state.fileList2)
                return false;
            },
            onChange: ({file, fileList}) => {
                let d = this.state.donef

                if (file.status == "done") {
                    console.log("done")
                    this.setState({
                        donef: d + 1
                    })
                }
                console.log(file);

            },
            fileList2,
            defaultFileList: fileList2,
        };
        const props3 = {
            listType: 'picture',
            onRemove: file => {
                console.log(file)
                this.setState(state => {
                    const index = state.fileList3.indexOf(file);
                    console.log(index)
                    const newFileList = state.fileList3.slice();
                    newFileList.splice(index, 1);
                    console.log(newFileList)
                    return {
                        fileList3: newFileList,
                    };
                });

            },
            beforeUpload: file => {
                console.log(file)
                file.url = global.AppConfig.tiffPicsIP + "0//超声//" + file.name;//预览图片保存的地址

                this.setState(state => ({
                        fileList3: [...state.fileList3, file],
                    }
                ));
                console.log(this.state.fileList)
                return false;
            },
            onChange: ({file, fileList}) => {
                let d = this.state.donef

                if (file.status == "done") {
                    console.log("done")
                    this.setState({
                        donef: d + 1
                    })
                }
                console.log(file);

            },
            fileList3,
            defaultFileList: fileList3,
        };


        return (
            <div>
                <DirectoryTree multiple defaultExpandAll onSelect={this.onSelect} onExpand={this.onExpand}>
                    {this.state.requisitionTree.map((item, key) => {
                        // console.log(JSON.stringify(item));
                        return (
                            <TreeNode title={item.requisition_number} key={key}>
                                {item.pictures.map((item, key) => {
                                    return <TreeNode title={item.picture_number} key={item.picture_id} isLeaf/>
                                })}
                            </TreeNode>
                        )
                    })
                    }
                </DirectoryTree>
                <br/>
                <Select
                    showSearch
                    style={{width: 200}}
                    placeholder="选择要导入的申请单"
                    optionFilterProp="children"
                    onChange={this.onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {this.state.requisitionFile.map((item, key) => {
                        return (
                            <Option value={item.requisition_id}>{item.requisition_number}</Option>
                        )
                    })}
                </Select>
                <Button
                    type="primary"
                    onClick={this.handleUpload}
                    disabled={fileList.length === 0}
                    loading={uploading}
                    style={{marginTop: 16}}
                >
                    {uploading ? '正在导入' : '开始导入'}
                </Button>
                <Progress percent={this.state.percent}></Progress>
                <br/>
                <div className="uploadDiv">
                <Upload  {...props}
                        multiple="picture">
                    <Button>
                        <UploadOutlined/> 上传射线图片
                    </Button>
                </Upload>
            </div>
                <div className="uploadDiv2">
                <Upload {...props2}
                        multiple="picture">
                    <Button>
                        <UploadOutlined/> 上传涡流图片
                    </Button>
                </Upload>
                </div>
                <div className="uploadDiv3">
                <Upload {...props3}
                        multiple="picture">
                    <Button>
                        <UploadOutlined/> 上传相控阵图片
                    </Button>
                </Upload>

                </div>
            </div>
        );
    }

}

export default AddPictureList;