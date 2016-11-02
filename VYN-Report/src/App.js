import React, {Component} from 'react';

import AppBar from 'material-ui/AppBar';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Login from './Login';
import Report from './Report';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reports: 'some text'
        }
    };

    getChildContext = () => {
        return {muiTheme: getMuiTheme(baseTheme)};
    };

    fetchReport = (report)=> {
        this.setState({reports: report})
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

export default App;
