import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

var Parse = require('parse').Parse;
var parseApplicationId = 'VYN-BO';
var parseJavaScriptKey = 'js-key';
var parseMasterKey = 'PZ/Fc_YwK:d5[Szp';

Parse.serverURL = "http://api.valueyournetwork.com/parse";
Parse.initialize(parseApplicationId, parseJavaScriptKey, parseMasterKey);

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            password: '',
            login: 'sasha',
            label: 'Login',
            list_of_reports: []
        };
    };

    componentDidMount() {
        var _this = this;

        // displaying data only if user exists
        if (Parse.User.current()) {
            this.getReport(function (items) {
                _this.setState({
                    list_of_reports: items
                });
                var data = _this.state.list_of_reports.map(function (item) {
                    return {
                        reportID: item.id,
                        createdAt: item.get('createdAt').toString()
                    }
                });
                _this.props.fetch(data);
            });

            this.setState({label: 'logout'});
        } else {
            this.setState({label: 'login'});
        }
    };

    // handling login button
    handleOpen = () => {
        // check if user exist
        if (Parse.User.current()) {
            // making logout and depend of it change button title
            Parse.User.logOut().then(function () {
                console.log('success');
            }, function (error) {
                console.log('error');
            });

            this.setState({label: 'login'})
        }
        else {
            this.setState({open: true, list_of_reports: []});
        }
    };

    // get all reports from Parse
    getReport = (callback)=> {
        var _this = this;
        // fetching reports
        var query = new Parse.Query('Report');
        query.limit(10000);
        query.include('campaign');
        query.find({
            success: function (report) {
                _this.setState({
                    list_of_reports: report
                });
                callback(report);
            },
            error: function (error) {
                console.error('getReports() error', error);
                callback(null, error);
            }
        });
        return true;
    };

    // sending user credentials and compare them with those which are in database
    handleSend = () => {
        var _this = this;
        // making login sent username and password
        Parse.User.logIn(this.state.login, this.state.password, {
            success: function () {
                _this.setState({label: 'logout'});
                // call this function to display data immediately after login
                _this.getReport(function (items) {
                    _this.setState({
                        list_of_reports: items
                    });
                    var data = items.map(function (item) {
                        return {
                            reportID: item.id,
                            createdAt: item.get('createdAt').toString()
                        }
                    });
                    _this.props.fetch(data);
                });
            },
            error: function (user, error) {
                console.log(user + error);
                return false;
            }
        });

        this.setState({
            password: '',
            open: false
        });
    };

    handleClose = () => {
        this.setState({open: false});
    };

    render() {
        const styles = {
            title: {
                cursor: 'pointer',
                color: '#fff'
            },
            textPosition: {
                textAlign: "center"
            },

            rowIntention: {
                "marginLeft": "10%"
            }
        };

        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                label="login"
                primary={true}
                keyboardFocused={true}
                onClick={this.handleSend}
            />
        ];

        return (
            <div>
                <FlatButton label={this.state.label} style={styles.title} onClick={this.handleOpen}/>
                <Dialog
                    style={styles.textPosition}
                    title="Enter your password"
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    <div style={styles.textPosition}>
                        <TextField
                            style={styles.rowIntention}
                            ref='password'
                            hintText="Password"
                            floatingLabelText="Password"
                            value={this.state.password}
                            onChange={e => this.setState({password: e.target.value})}>
                            <input type="password"/>
                        </TextField>
                    </div>

                </Dialog>

            </div>
        )
    }
}

Login.propTypes = {
    fetch: React.PropTypes.func,
};
