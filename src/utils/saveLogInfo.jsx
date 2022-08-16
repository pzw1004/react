    // 定义一个全局函数，处理用户的登录以及操作信息
    import '../config/config'
    import axios from "axios";

    let roleList;

    function saveLoginInfo(operation) {
        let member_role = JSON.parse(sessionStorage.getItem("temp_user")).member_role;
        let member_name = JSON.parse(sessionStorage.getItem("temp_user")).member_name;
        // alert(getNowFormatDate());
        getRoleListAndSave(member_role,member_name,operation);
        //alert(roleList);

}


    /**使用axios 将用户的操作信息发送到后端
     * */
    function postLogInfo(roleList,member_role,member_name,operation) {


            let temp_role;
            for(let i = 0; i < roleList.length; i++)
            {
                if(roleList[i].role_id === member_role){
                    temp_role = roleList[i].role_nameHY;
                    // alert(roleList[i].role_nameHY)
                }
            }

            // alert(operation)
            let api = global.AppConfig.serverIP + '/saveLogInfo?member_role=' + temp_role+'&member_name='+ member_name+'&operation='+operation;
            axios.post(api)
                .then((response)=> {
                    console.log(response);
                    console.log(JSON.stringify(response.data));

                })
                .catch( (error)=> {
                    console.log(error);
                });

}

    function  getRoleListAndSave(member_role,member_name,operation){

        let api = global.AppConfig.serverIP + '/getRoleList' ;
        axios.post(api)
            .then((response)=> {
             console.log(JSON.stringify(response.data));
             // alert(JSON.stringify(response.data));
             roleList = response.data;
             postLogInfo(roleList,member_role,member_name,operation);
        })
        .catch( (error)=> {
             console.log(error);
        });

    }

    //得到当前的系统时间
    function getNowFormatDate() {
        let date = new Date();
        let seperator1 = "-";
        let seperator2 = ":";
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        let strHours = date.getHours();
        let strMinutes = date.getMinutes();
        let strSeconds = date.getSeconds();

        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        if (strHours >= 0 && strHours <= 9) {
            strHours = "0" + strHours;
        }
        if (strMinutes >= 0 && strMinutes <= 9) {
            strMinutes = "0" + strMinutes;
        }
        if (strSeconds >= 0 && strSeconds <= 9) {
            strSeconds = "0" + strSeconds;
        }

        let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + strHours + seperator2 + strMinutes
            + seperator2 + strSeconds;
        return currentdate;
    }


export default saveLoginInfo;