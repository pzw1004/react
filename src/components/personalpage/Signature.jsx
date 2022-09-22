import { Upload, Button, Icon, message, Modal } from 'antd';
import reqwest from 'reqwest';
import React,{Component} from "react";
import { Tree } from 'antd';
import { Select } from 'antd';
import axios from "axios";
import { PlusOutlined ,UploadOutlined } from '@ant-design/icons';
const { Option } = Select;


function onBlur() {
    console.log('blur');
}

function onFocus() {
    console.log('focus');
}

function onSearch(val) {
    console.log('search:', val);
}
const { TreeNode, DirectoryTree } = Tree;


class Signature extends Component {

    constructor(props) {
        super(props);
        this.state = {
            requisitionTree: [],
            requisitionFile: [],
            fileList: [],
            uploading: false,
            member_id: JSON.parse(sessionStorage.getItem("temp_user")).member_id,
            member_name: JSON.parse(sessionStorage.getItem("temp_user")).member_name,
        };
    }







    handleUpload = () => {
        const { fileList } = this.state;
        const formData = new FormData();
        fileList.forEach(file => {
            //formData.append('files[]', file);
            formData.append('uploadFile', file);
        });
        console.log(this.state.member_id);
        this.setState({
            uploading: true,
        });

        // You can use any AJAX library you like

        // this.uploadFileList(formData);

        reqwest({
            
            url: global.AppConfig.serverIP + '/uploadSignature/'+ this.state.member_id,
            method: 'post',
            processData: false,
            contentType: false,
            data: formData,
            success: () => {
                this.setState({
                    fileList: [],
                    uploading: false,
                });
                message.success('电子签名上传成功！');
            },
            error: () => {
                this.setState({
                    uploading: false,
                });
                message.error('upload failed.');
            },
        });
    };

    //用axios传递有点问题,暂时留下代码，不用
    uploadFileList=(formData)=>{
        let api = global.AppConfig.serverIP + '/uploadFileList';
        axios.post(api,formData)
            .then((response)=> {
                console.log(response);
                console.log(JSON.stringify(response.data));
                this.setState({
                    //requisitionTree: response.data,
                    uploading: false,
                });
                message.success('upload successfully.');
                //this.getFileList();
            })
            .catch( (error)=> {
                console.log(error);
            });
    };


    render() {




        const { uploading, fileList } = this.state;



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
                file.url = global.AppConfig.tiffPicsIP+ "0//"+file.name;//预览图片保存的地址

                this.setState(state => ({
                    fileList: [...state.fileList, file],
                }
                ));
                console.log(this.state.fileList)
                return false;
            },
            fileList,
        };
               
               

        return (
            <div>

                <Upload {...props}
                        multiple="multiple">
                    <Button>
                        <UploadOutlined /> 选择要上传的电子签名
                    </Button>
                </Upload>
                <Button
                    type="primary"
                    onClick={this.handleUpload}
                    disabled={fileList.length === 0}
                    loading={uploading}
                    style={{ marginTop: 16 }}
                >
                    {uploading ? '正在导入' : '开始导入'}
                </Button>

            </div>
        );
    }

}
export default Signature;