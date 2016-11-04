import React, {Component} from 'react';

import ReactDataGrid from 'react-data-grid';
import {Toolbar, Data} from 'react-data-grid/addons';
var Selectors = Data.Selectors;

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
            reports: this.props.report,
            rows: this.props.report,
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

    handleAddReport=()=>{
        this.setState({
            showComponent: true
        });
    };

    backButton=(res)=>{
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
            addReportButt = <button
                    className="btn btn-primary add-report"
                    onClick={this.handleAddReport}>
                    Add new Report
                </button>;
            AddReportComp = <AddReport campReports={this.state.reports} handleBack={this.backButton} campainsList={this.state.campaigns}/>;
        }
        return (
            <div className="table-position">
                {this.state.showComponent ? AddReportComp: [addReportButt,grid]}
            </div>
        )
    }
}
