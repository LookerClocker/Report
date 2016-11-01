import React, {Component} from 'react';

import AppBar from 'material-ui/AppBar';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Login from './Login';

// import injectTapEventPlugin from 'react-tap-event-plugin';
// injectTapEventPlugin();

class App extends Component {

    getChildContext = () => {
        return {muiTheme: getMuiTheme(baseTheme)};
    };

    render() {
        return (
            <AppBar
                iconElementRight={<Login/>}
            />
        );
    }
}

App.childContextTypes = {
    muiTheme: React.PropTypes.object
};

export default App;
