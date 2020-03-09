import React, {Component} from 'react';
import {connect} from "react-redux";
import {GridWithState as Grid} from "../components/table/table";
import {ColumnMenu} from "../components/table/gird-column-menu";
import {MultiSelectCell} from "../components/table/multi-select-cell";
import {GridColumns} from "../components/table/grid-columns";
import {deleteUsers, getUsers, postUsers, putUsers} from "../actions";
import {getContactsList, getUserGroupsList} from "../selectors";
import {BuildHeader} from "../components/header-box";
import {getGroups} from "../actions/group-actions";

const mapDispatchToProps = dispatch => {
    return {
        getContacts: function () {
            return dispatch(getUsers())
        },
        postContacts: function (opts) {
            return dispatch(postUsers(opts))
        },
        putContacts: function (opts) {
            return dispatch(putUsers(opts))
        },
        deleteContacts: function (opts) {
            return dispatch(deleteUsers(opts))
        },
        getUserGroups: function () {
            return dispatch(getGroups())
        }
    };
};

const mapStateToProps = state => {
    return {
        contacts: getContactsList(state),
        groups: getUserGroupsList(state)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(class UserTable extends Component {
    editField = "inEdit";
    selectedField = "selected";
    GroupsCell = null;
    columns = [
        {title: '#', field: 'id', width: '75px', filter: 'numeric', editable: false, columnMenu: ColumnMenu},
        {title: 'Name', field: 'name', editor: 'text', required: true, columnMenu: ColumnMenu},
        {title: 'Username', field: 'username', required: true, columnMenu: ColumnMenu},
        {title: 'Email', field: 'email', required: true, columnMenu: ColumnMenu},
        {title: 'URL', field: 'website', columnMenu: ColumnMenu},
        {title: 'Groups', field: 'groups', required: true, cell: this.GroupsCell}
    ];
    GridColumns = GridColumns(this.columns, this.editField);
    state = {
        dataState: {take: 10, skip: 0},
        groups: [...this.props.groups]
    };

    componentDidMount() {
        this.props.getUserGroups()
            .then(res => {
                this.updateGroups();
            });
    }

    updateGroups() {
        this.GroupsCell = MultiSelectCell({options: this.props.groups, textField: 'name', dataField: 'id'});

        let columns = this.columns.map(item => {
            if (item.field === 'groups') {
                return {title: 'Groups', field: 'groups', cell: this.GroupsCell}
            }
            return item
        });
        this.GridColumns = GridColumns(columns, this.editField);
        this.setState({
            groups: [...this.props.groups]
        });
    }

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
        const data = this.props.contacts;
        return (
            <>
                {BuildHeader('Users Table')}
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
                                  fetchData={this.props.getContacts}
                                  editField={this.editField}
                                  selectedField={this.selectedField}
                                  idField={'id'}
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