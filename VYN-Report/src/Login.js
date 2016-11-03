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
            list_of_reports: [],
            list_of_campaign: []

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
                // pass data to App after reloading page
                _this.fullFill(items);
            });

            this.getCampaign(function (items) {
                _this.setState({
                    list_of_campaign: items
                });
                // pass campaign data to App
                _this.fullFilCampaign(items);
            });

            this.setState({label: 'logout'});
        } else {
            this.setState({label: 'login'});
        }
    };

    // get all reports from Parse
    getReport = (callback)=> {
        var query = new Parse.Query('Report');
        query.limit(10000);
        query.include('campaign');
        query.find({
            success: function (report) {
                callback(report);
            },
            error: function (error) {
                console.error('getReports() error', error);
                callback(null, error);
            }
        });
        return true;
    };

    getCampaign = (callback)=> {
        var query = new Parse.Query('Campaign');
        query.limit(10000);
        query.find({
            success: function (camp) {
                callback(camp);
            },
            error: function (error) {
                console.error('getReports() error', error);
                callback(null, error);
            }
        });
        return true;
    };

    // handling login button
    handleOpen = () => {
        var _this = this;
        // check if user exist
        if (Parse.User.current()) {
            // making logout and depend of it change button title
            Parse.User.logOut().then(function () {
                console.log('success');
                _this.setState({list_of_reports: []});
                _this.props.fetch(_this.state.list_of_reports)
            }, function (error) {
                console.log('error');
            });

            this.setState({label: 'login'})
        }
        else {
            this.setState({open: true, list_of_reports: []});
        }
    };

    // forming campaign data to custom object and send them to App
    fullFilCampaign = (items)=> {
        var data = items.map(function (item) {
            return {
                id: item.id,
                parentCamp: item.get('ParentCampaign') ? item.get('ParentCampaign') : null
            }
        });
        // function declared in App component
        this.props.fetchCampaign(data)
    };

    // forming data to custom object and send them to App
    fullFill = (items)=> {
        var data = items.map(function (item) {
            return {
                reportID: item.id,
                createdAt: item.get('createdAt').toLocaleDateString()
            }
        });
        // function declared in App component
        this.props.fetch(data);
    };

    // sending user credentials and compare them with those which are in database
    handleSend = () => {
        var _this = this;
        // making login, sent username and password
        Parse.User.logIn(this.state.login, this.state.password, {
            success: function () {
                _this.setState({label: 'logout'});
                // call this function to display data immediately after login
                _this.getReport(function (items) {
                    _this.setState({
                        list_of_reports: items
                    });
                    // pass data to App
                    _this.fullFill(items);
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

    // close dialog with password
    handleClose = () => {
        this.setState({open: false});
    };

    // rendering table
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
