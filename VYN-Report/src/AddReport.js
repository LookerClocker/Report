import React, {Component} from 'react';

import TextField from 'material-ui/TextField';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import DatePicker from 'material-ui/DatePicker';

var Parse = require('parse').Parse;
var parseApplicationId = 'VYN-BO';
var parseJavaScriptKey = 'js-key';
var parseMasterKey = 'PZ/Fc_YwK:d5[Szp';

Parse.serverURL = "http://api.valueyournetwork.com/parse";
Parse.initialize(parseApplicationId, parseJavaScriptKey, parseMasterKey);

export default class AddReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            parentCampaign: this.props.campainsList,    // include campaigns parse objects
            campaignWithName: [],                       // include only campaign`s parent name
            campaignWithNameId: [],                     // include campaigns id witch have parentCampaign
            value: 1,
        };
    }

    componentDidMount() {
        this.setState({
            // get only those campaigns which have ParentCampaign in Parse
            campaignWithName: this.props.campainsList.filter(function (n) {
                return n.parentCamp !== null
            }).map(function (item) {
                return item.parentCamp;
            }),

            // get only those campaign id which has ParentCampaign in Parse and put them into dropdown value
            campaignWithNameId: this.props.campainsList.filter(function (n) {
                return n.parentCamp !== null;
            }).map(function (item) {
                return item.id;
            })
        })
    };

    clickBack = ()=> {
        this.props.handleBack(false);
    };

    getChildContext = () => {
        return {muiTheme: getMuiTheme(baseTheme)};
    };

    handleChange = (event, index, value) => {
        this.setState({value: value});
    };

    // pushed menu items. only campaigns with NOT empty ParentName and those id.
    dropdownMenuItems = ()=> {
        var row = [];

        for (var i = 0; i <= this.state.campaignWithNameId.length; i++) {
            var itemId = this.state.campaignWithNameId[i],
                itemName = this.state.campaignWithName[i];

            row.push(
                <MenuItem key={itemId} value={itemId} primaryText={itemName}/>
            );
        }
        return row;
    };

    render() {

        var menuIcons = this.dropdownMenuItems();

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">Add new Report</div>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <TextField
                            ref='name'
                            hintText="Name"
                            floatingLabelText="Name">
                            <input type="text"/>
                        </TextField>
                    </div>

                    <div className="col-md-9 dropdown-position">
                        <DropDownMenu className="dropdown-width" value={this.state.value}  onChange={this.handleChange}>
                            {menuIcons}
                        </DropDownMenu>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <DatePicker hintText="Chose start date" mode="landscape" />
                    </div>
                    <div className="col-md-3">
                        <DatePicker hintText="Chose end date" mode="landscape" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-offset-8 col-md-3 dropdown-position">
                        <button
                            className="btn btn-primary">
                            Add Report
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <button
                            className="btn btn-primary"
                            onClick={this.clickBack}>
                            Back
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

AddReport.childContextTypes = {
    muiTheme: React.PropTypes.object
};