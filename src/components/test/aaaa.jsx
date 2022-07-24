import React, { Component } from 'react';



class Aa extends Component {

    constructor(props){
        super(props);
        this.state = {
            test: 'ceshi',

            msg: '我是父类的消息',
        };
    }

    render() {
        return (
            <h1>1111</h1>

        );
    }
}

export default Aa;
