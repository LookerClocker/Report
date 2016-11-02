import React, {Component} from 'react';

import ReactDataGrid from 'react-data-grid';
import {Toolbar, Data} from 'react-data-grid/addons';
var Selectors = Data.Selectors;

var columns = [
    {
        key: 'reportID',
        name: 'Report id',
        sortable: true,
        filterable: true
    },
    {
        key: 'createdAt',
        name: 'Created date',
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
            sortDirection: null
        };
    }

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
        console.log('state on Report Component', this.state.reports);
        console.log('props on Report Component', this.props.report);
        console.log('rows on Report Component', this.state.rows);
        return (
            <div>
                <ReactDataGrid
                    onGridSort={this.handleGridSort}
                    columns={columns}
                    rowGetter={this.rowGetter}
                    rowsCount={this.getSize()}
                    minHeight={500}
                    toolbar={<Toolbar enableFilter={true}/>}
                    onAddFilter={this.handleFilterChange}
                    onClearFilters={this.onClearFilters}/>
            </div>
        )
    }
}