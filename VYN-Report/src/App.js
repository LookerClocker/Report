import React, {Component} from 'react';

import AppBar from 'material-ui/AppBar';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import '../node_modules/bootstrap/dist/css/bootstrap.css'
import './App.css'

import Login from './Login';
import Report from './Report';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reports: []
        }
    };

    getChildContext = () => {
        return {muiTheme: getMuiTheme(baseTheme)};
    };

    // callback function witch fetch Reports from Login component
    fetchReport = (report)=> {
        this.setState({reports: report});
    };

    render() {
        return (
            <div>
                <AppBar
                    iconElementRight={<Login fetch={this.fetchReport}/>}
                />
                <Report report={this.state.reports}/>
            </div>
        );
    }
}

App.childContextTypes = {
    muiTheme: React.PropTypes.object
};
