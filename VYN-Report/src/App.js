import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import '../node_modules/bootstrap/dist/css/bootstrap.css'
import '../node_modules/react-dropzone-component/styles/filepicker.css'
import '../node_modules/dropzone/dist/min/dropzone.min.css'
import './App.css'

import Login from './Login';
import Report from './Report';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reports: [],
            campaigns:[]
        }
    };

    getChildContext = () => {
        return {muiTheme: getMuiTheme(baseTheme)};
    };

    // callback function witch fetch Reports from Login component
    fetchReport = (report)=> {
        this.setState({reports: report});
    };

    // callback function witch fetch Campaign from Login component
    fetchCampaign = (campaign)=> {
        this.setState({campaigns: campaign});
    };

    render() {
        return (
            <div>
                <AppBar
                    iconElementRight={<Login fetch={this.fetchReport} fetchCampaign={this.fetchCampaign}/>}
                />
                <Report report={this.state.reports} campaign={this.state.campaigns}/>
            </div>
        );
    }
}

App.childContextTypes = {
    muiTheme: React.PropTypes.object
};
