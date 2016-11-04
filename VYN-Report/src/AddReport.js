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

var row = [];

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
            file: '',
            reportName: '',
            startDate: {},
            endDate: {},
            clickedCampaign: [],
            token: ''
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
        row.push(value);
        this.setState({
            value: value,
            clickedCampaign: row
        });
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

    handleImageChange = (e)=> {
        e.preventDefault();

        var reader = new FileReader();
        var file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
        };

        reader.readAsDataURL(file)
    };

    handlerStartDate = (event, date)=> {
        this.setState({
            startDate: date
        });
    };

    handlerEndDate = (event, date)=> {
        this.setState({
            endDate: date
        });
    };

    handleAddReport = ()=> {
        var token = Math.random().toString(36).substr(2);

        var ReportClass = Parse.Object.extend('Report');
        var report = new ReportClass();

        report.set('name', this.state.reportName);
        report.set('startDate', this.state.startDate);
        report.set('endDate', this.state.endDate);
        report.set('campaign',this.state.clickedCampaign.map(function(camp){
            return {"__type":"Pointer","className":"Campaign","objectId":camp}
        }));
        var name='logo.jpg';
        var parseFile = new Parse.File(name, this.state.file);

        console.log('parsefile->',parseFile);

        parseFile.save().then(function(){
            console.log('file has send');
        },function(error){
            console.log('the file could not been saved', error);
        });

        report.set('logo', parseFile);
        report.set('token', token);

        report.save(null, {
            success: function (report) {
                console.log(report);
            }
        }, {
            error: function (error) {
                console.log(error);
            }
        });
    };

    render() {

        console.log('file', this.state.file);

        var {imagePreviewUrl} = this.state;
        var imagePreview = null;
        if (imagePreviewUrl) {
            imagePreview = (<img className="img-preview" src={imagePreviewUrl} alt="text"/>);
        }

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
                            floatingLabelText="Name"
                            value={this.state.reportName}
                            onChange={e=> this.setState({reportName: e.target.value})}>
                            <input type="text"/>
                        </TextField>
                    </div>

                    <div className="col-md-9 dropdown-position">
                        <DropDownMenu className="dropdown-width" value={this.state.value} onChange={this.handleChange}>
                            {menuIcons}
                        </DropDownMenu>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <DatePicker
                            hintText="Chose start date" mode="landscape"
                            onChange={this.handlerStartDate}
                        />
                    </div>
                    <div className="col-md-3">
                        <DatePicker
                            onChange={this.handlerEndDate}
                            hintText="Chose end date" mode="landscape"
                        />
                    </div>
                </div>
                <div className="row image-row">
                    <div className="col-sm-3 col-md-3">
                        <input className="filebutt-width custom-file-input btn btn-primary" type="file"
                               onChange={this.handleImageChange}/>
                        {imagePreview}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-offset-8 col-md-3 dropdown-position">
                        <button
                            className="btn btn-primary"
                            onClick={this.handleAddReport}>
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