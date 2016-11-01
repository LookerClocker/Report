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

export default class Password extends Component {
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

        if (Parse.User.current()) {

            this.getReport(function (items) {
                _this.setState({
                    list_of_reports: items
                });
            });

            this.setState({label: 'logout'});
        } else {
            this.setState({label: 'login'});
        }
    };

    handleOpen = () => {

        if (Parse.User.current()) {

            Parse.User.logOut().then(function () {
                console.log('success');
            }, function (error) {
                console.log('error');
            });

            this.setState({label: 'login'})
        }
        else {
            this.setState({open: true,list_of_reports: []});
        }
    };

    getReport = (callback)=> {
        var _this = this;
        // NOW IM GOING TO FETCH REPORTS
        var query = new Parse.Query('Campaign');
        query.limit(10000);
        query.include('user');
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

    handleSend = () => {

        var _this = this;

        Parse.User.logIn(this.state.login, this.state.password, {
            success: function () {
                _this.setState({label: 'logout'});
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
        console.log('campaigns', this.state.list_of_reports);
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
                    title="Enter your credentials"
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
