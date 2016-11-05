import React, {Component} from 'react';

import ReactDataGrid from 'react-data-grid';
import {Toolbar, Data} from 'react-data-grid/addons';
var Selectors = Data.Selectors;

var Parse = require('parse').Parse;
var parseApplicationId = 'VYN-BO';
var parseJavaScriptKey = 'js-key';
var parseMasterKey = 'PZ/Fc_YwK:d5[Szp';

Parse.serverURL = "http://api.valueyournetwork.com/parse";
Parse.initialize(parseApplicationId, parseJavaScriptKey, parseMasterKey);

import AddReport from './AddReport'

var columns = [
    {
        key: 'name',
        name: 'Name',
        sortable: true,
        filterable: true
    },
    {
        key: 'token',
        name: 'Reference',
        sortable: true,
        filterable: true
    }
];

export default class Report extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reports: [],
            rows: [],
            filters: {},
            sortColumn: null,
            sortDirection: null,
            showComponent: false,
            campaigns: []
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            reports: nextProps.report,
            rows: nextProps.report,
            campaigns: nextProps.campaign
        });
    }

    handleAddReport = ()=> {
        this.setState({
            showComponent: true
        });
    };

    backButton = (res)=> {
        this.setState({
            showComponent: res
        })
    };

    // REACT DATA GRID BUILD-IN METHODS
    getRows = ()=> {
        return Selectors.getRows(this.state);
    };

    getSize = () => {
        return this.getRows().length;
    };

    rowGetter = (rowIdx)=> {
        var rows = this.getRows();
        return rows[rowIdx];
    };

    handleGridSort = (sortColumn, sortDirection)=> {
        var state = Object.assign({}, this.state, {sortColumn: sortColumn, sortDirection: sortDirection});
        this.setState(state);
    };

    handleFilterChange = (filter)=> {
        var newFilters = Object.assign({}, this.state.filters);
        if (filter.filterTerm) {
            newFilters[filter.column.key] = filter;
        } else {
            delete newFilters[filter.column.key];
        }
        this.setState({filters: newFilters});
    };

    onClearFilters = () => {
        this.setState({filters: {}});
    };

    render() {

        var grid, addReportButt, AddReportComp = '';

        // even if user exist but report are empty show AddReport button
        if (Parse.User.current()) {
            addReportButt = <button className="btn btn-primary add-report" onClick={this.handleAddReport}> Add new Report </button>;
            // add report view
            AddReportComp = <AddReport campReports={this.state.reports} handleBack={this.backButton} campainsList={this.state.campaigns}/>;
        }

        if (this.state.reports.length) {
            grid = <ReactDataGrid
                onGridSort={this.handleGridSort}
                columns={columns}
                rowGetter={this.rowGetter}
                rowsCount={this.getSize()}
                minHeight={500}
                toolbar={<Toolbar enableFilter={true}/>}
                onAddFilter={this.handleFilterChange}
                onClearFilters={this.onClearFilters}/>;
        }
        return (
            <div className="table-position">
                {addReportButt}
                {this.state.showComponent ? AddReportComp : [grid]}
            </div>
        )
    }
}
