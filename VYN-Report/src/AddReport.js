import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import ReportConfirm from './SuccessDialog'
import DropzoneComponent from 'react-dropzone-component/lib/react-dropzone';

var Parse = require('parse').Parse;
var parseApplicationId = 'VYN-BO';
var parseJavaScriptKey = 'js-key';
var parseMasterKey = 'PZ/Fc_YwK:d5[Szp';

var imageCollection = [];
var row = [];
var imagesId = [];

Parse.serverURL = "http://api.valueyournetwork.com/parse";
Parse.initialize(parseApplicationId, parseJavaScriptKey, parseMasterKey);

// dropzone`s objects
var componentConfig = {
        iconFiletypes: ['.jpg', '.png', '.gif'],
        showFiletypeIcon: true,
        postUrl: '/uploadHandler'
    },
    djsConfig = {
        addRemoveLinks: true,
        acceptedFiles: 'image/jpeg,image/png,image/gif,application/pdf,application/txt',
        autoProcessQueue: false,
    },
    myDropzone,
    eventHandlers = {
        addedfile: function (file) {
            imageCollection.push(file);
        }
    };

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
            token: '',
            sentReport: false,
            fileName: '',
            collectionImages: [],
            collectionImagesId: []
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
            }),
            // full fill array from dropzone
            collectionImages: imageCollection
        });
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

    // read and load image
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

    // handling Datepicker with start date
    handlerStartDate = (event, date)=> {
        this.setState({
            startDate: date
        });
    };

    // handling Datepicker with end date
    handlerEndDate = (event, date)=> {
        this.setState({
            endDate: date
        });
    };

    // handling AddReport button, save data to the Parse
    handleAddReport = ()=> {
        var _this = this;
        var token = Math.random().toString(36).substr(2);

        var ScreenshotClass = Parse.Object.extend('Screenshots');
        var ReportClass = Parse.Object.extend('Report');
        var report = new ReportClass();

        // adding multiply images into Screenshots Class on Parse
        var imageName = '____image.png';

        for (var i = 0; i < this.state.collectionImages.length; i++) {

            var screenshot = new ScreenshotClass();
            var parseImage = new Parse.File(imageName, this.state.collectionImages[i]);

            parseImage.save().then(function () {
            }, function (error) {
                console.log('the file could not been saved', error);
            });

            screenshot.set('image', parseImage);
            screenshot.save(null, {
                success: function (screenshot) {
                    imagesId.push(screenshot.id);
                    _this.setState({
                        collectionImagesId: imagesId
                    });
                    report.set('screenshots', _this.state.collectionImagesId.map(function (image) {
                        return {"__type": "Pointer", "className": "Screenshots", "objectId": image}

                    }));
                },

            }, {
                error: function (error) {
                    console.log(error);
                }
            });
        }

        // Adding data into Report Class

        report.set('name', this.state.reportName);
        report.set('startDate', this.state.startDate);
        report.set('endDate', this.state.endDate);
        report.set('campaign', this.state.clickedCampaign.map(function (camp) {
            return {"__type": "Pointer", "className": "Campaign", "objectId": camp}
        }));
        report.set('token', token);

        var fileName = '____logo.png';
        var parseFile = new Parse.File(fileName, this.state.file);

        parseFile.save().then(function () {
        }, function (error) {
            console.log('the file could not been saved', error);
        });
        report.set('logo', parseFile);

        // save and send data to Parse
        report.save(null, {
            success: function (report) {
                // open 'success dialog' if data has send successfully
                if (report) {
                    _this.setState({
                        sentReport: true
                    });
                }
                console.log('REPORT HAS SENT->', report);
            },

        }, {
            error: function (error) {
                console.log(error);
            }
        });

    };

    initCallback = (dropzone)=> {
        myDropzone = dropzone;
    };

    removeFile = ()=> {
        if (myDropzone) {
            myDropzone.removeFile();
        }
    };

    render() {

        var {imagePreviewUrl} = this.state;

        if (imagePreviewUrl) {
            var imagePreview = <img className="img-preview" src={imagePreviewUrl} alt="text"/>
        }
        if (this.state.sentReport) {
            var reportConfirm = <ReportConfirm name={this.state.reportName}/>
        }

        var menuIcons = this.dropdownMenuItems();

        return (
            <div>
                {reportConfirm}
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
                    <div className="col-md-3">
                        <input className="custom-file-input btn btn-primary" type="file"
                               onChange={this.handleImageChange}/>
                        {imagePreview}
                    </div>
                    <hr/>
                </div>
                <div className="row">
                    <DropzoneComponent config={componentConfig}
                                       djsConfig={djsConfig}
                                       eventHandlers={eventHandlers}/>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <button
                            className="btn btn-primary"
                            onClick={this.clickBack}>
                            Back
                        </button>
                    </div>
                    <div className="add-report-mobile col-md-3 col-md-offset-2">
                        <button
                            className="btn btn-primary"
                            onClick={this.handleAddReport}>
                            Add Report
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