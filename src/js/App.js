import React, {Component} from 'react';
import {connect} from "react-redux";
import {GridWithState} from "./components/table/table";
import '@progress/kendo-theme-default/dist/all.css';
import '../css/uswds-theme.scss';
import '../css/App.css';
import {
    getContacts,
    clearSelectedItems,
    postContacts,
    putContacts,
    deleteContacts,
    addSelectedItem,
    removeSelectedItem,
    modifyContact,
    getUserGroups
} from "./actions/index";
import {
    getContactsList,
    getCurrentSearchFilter,
    getCurrentSelectedItemList,
    getReplayList,
    getUserGroupsList
} from "./selectors/index";
import {ColumnMenu} from "./components/table/gird-column-menu";
import {DropDownCell} from "./components/table/drop-down-cell";
import {MultiSelectCell} from "./components/table/multi-select-cell";
import {GridColumns} from "./components/table/grid-columns";

function mapDispatchToProps(dispatch) {
    return {
        clearSelectedItems: function () {
            dispatch(clearSelectedItems())
        },
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
        addSelectedItem: function (item) {
            dispatch(addSelectedItem(item))
        },
        removeSelectedItem: function (item) {
            dispatch(removeSelectedItem(item))
        },
        modifyContact: function (contact, newContact) {
            dispatch(modifyContact(contact, newContact))
        },
        getUserGroups: function () {
            return dispatch(getUserGroups())
        }
    };
}

const mapStateToProps = state => {
    return {
        contacts: getContactsList(state),
        groups: getUserGroupsList(state)
    };
};

class ConnectedApp extends Component {
    editField = "inEdit";
    selectedField = "selected";
    YesNoCell = DropDownCell({
        options: [
            {text: 'yes', value: true},
            {text: 'no', value: false}
        ]
    });
    GroupsCell = null;
    columns = [
        {title: '#', field: 'id', width: '75px', filter: 'numeric', editable: false, columnMenu: ColumnMenu},
        {title: 'Name', field: 'name', editor: 'text', columnMenu: ColumnMenu},
        {title: 'Username', field: 'username', columnMenu: ColumnMenu},
        {title: 'Email', field: 'email', columnMenu: ColumnMenu},
        {title: 'URL', field: 'website', columnMenu: ColumnMenu},
        {title: 'Groups', field: 'groups', cell: this.GroupsCell}
    ];
    GridColumns = GridColumns(this.columns, this.editField);
    state = {
        dataState: {take: 10, skip: 0},
        groups: [...this.props.groups]
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getUserGroups()
            .then(res => {
                this.updateGroups();
            });
    }

    updateGroups() {
        this.GroupsCell = MultiSelectCell({options: this.props.groups});

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
                        if (event.callback)
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
                this.props.postContacts(event.dataItem);
                break;
            }
            case 'update': {
                this.props.putContacts(event.dataItem);
                break;
            }
            case 'remove': {
                //TODO: confirm delete
                this.props.deleteContacts(event.dataItem);
                break;
            }
            default:
                break;
        }
    };

    render() {
        const data = this.props.contacts;
        return (
            <>
                <a className="usa-skipnav" href="#main-content">Skip to main content</a>

                <header className="usa-header usa-header--basic">
                    <div className="usa-nav-container">
                        <div className="usa-navbar">
                            <div className="usa-logo" id="basic-logo">
                                <em className="usa-logo__text"><a href="/" title="Home" aria-label="Home">Users
                                    Lookup</a></em>
                            </div>
                        </div>
                    </div>
                </header>
                <div className={"usa-section"}>
                    <main className={"usa-layout-docs__main usa-prose usa-layout-docs"}
                          id={"main-content"}>
                        <div className={"usa-content"}>
                            <GridWithState className={"usa-table overflow-x-auto overflow-y-auto"}
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
                            >
                                {this.GridColumns}
                            </GridWithState>
                        </div>
                    </main>
                </div>
                <footer className={"usa-footer usa-footer--slim"}>
                    <div className={"grid-container usa-footer__return-to-top"}>
                        <a href={"#top"}>Return to top</a>
                    </div>
                </footer>
            </>
        );
    }
}

const App = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedApp);

export default App;
