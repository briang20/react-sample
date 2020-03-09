import React, {Component} from 'react';
import {connect} from "react-redux";
import {GridWithState as Grid} from "../components/table/table";
import {ColumnMenu} from "../components/table/gird-column-menu";
import {GridColumns} from "../components/table/grid-columns";
import {deleteContacts, getContacts, getUserGroups, postContacts, putContacts} from "../actions";
import {getUserGroupsList} from "../selectors";
import {BuildHeader} from "../components/header-box";

const mapDispatchToProps = dispatch => {
    return {
        getContacts: function () {
            return dispatch(getContacts())
        },
        postContacts: function (opts) {
            return dispatch(postContacts(opts))
        },
        putContacts: function (opts) {
            return dispatch(putContacts(opts))
        },
        deleteContacts: function (opts) {
            return dispatch(deleteContacts(opts))
        },
        getUserGroups: function () {
            return dispatch(getUserGroups())
        }
    };
};

const mapStateToProps = state => {
    return {
        groups: getUserGroupsList(state)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(class GroupsTable extends Component {
    editField = "inEdit";
    selectedField = "selected";
    columns = [
        {title: '#', field: 'value', width: '75px', filter: 'numeric', editable: false, columnMenu: ColumnMenu},
        {title: 'Name', field: 'text', editor: 'text', required: true, columnMenu: ColumnMenu}
    ];
    GridColumns = GridColumns(this.columns, this.editField);
    state = {
        dataState: {take: 10, skip: 0},
        groups: [...this.props.groups]
    };

    onToolbarClick = (event) => {
        switch (event.value) {
            case 'refresh': {
                this.props.getContacts()
                    .then(res => {
                        if (event.callback && typeof event.callback === 'function')
                            event.callback.call(undefined, res.data);
                    });
                break;
            }
            case 'delete-selected': {
                this.props.deleteContacts(event.dataItem);
                break;
            }
            default:
                break;
        }
    };

    onDataChange = (event) => {
        switch (event.value) {
            case 'add': {
                return this.props.postContacts(event.dataItem);
            }
            case 'update': {
                return this.props.putContacts(event.dataItem);
            }
            case 'remove': {
                return this.props.deleteContacts(event.dataItem);
            }
            default:
                break;
        }
    };

    render() {
        const data = this.props.groups;
        return (
            <>
                {BuildHeader('Groups Table')}
                <div className={"usa-section"}>
                    <main className={"usa-layout-docs__main usa-prose usa-layout-docs"}
                          id={"main-content"}>
                        <div className={"usa-content overflow-x-auto overflow-y-auto"}>
                            <Grid className={"usa-table"}
                                  editable={true}
                                  sortable={true}
                                  pageable={true}
                                  pageSize={10}
                                  data={data}
                                  onClick={this.onToolbarClick}
                                  onChange={this.onDataChange}
                                  fetchData={this.props.getUserGroups}
                                  editField={this.editField}
                                  selectedField={this.selectedField}
                                  idField={'value'}
                                  columns={this.columns}
                            >
                                {this.GridColumns}
                            </Grid>
                        </div>
                    </main>
                </div>
            </>
        );
    }
});