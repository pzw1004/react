import React, { Component } from 'react';
import { Router, Route,Switch} from "react-router-dom";
import history from '../components/common/history'

import App from '../components/common/App';
import Login from '../components/common/Login'
import Home from '../components/common/Home'
import NoMatch from '../components/common/Nomatch'
import PrintReport from "../components/requisition/printResult/PrintReport";
import PrintReportForSingleImage from "../components/requisition/printResultForSingleImage/PrintReportForSingleImage";

class MRoute extends Component {

    render() {
        return(
            <Router history={history}>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route path="/app" component={App} />
                    <Route path="/login" component={Login}/>
                    <Route path="/printReport/:requisition_id" component={PrintReport} />
                    <Route path="/printReportForSingleImage/:picture_id/:display" component={PrintReportForSingleImage} />
                    <Route component={NoMatch}/>
                </Switch>
            </Router>
        )
    }
}

export default MRoute;