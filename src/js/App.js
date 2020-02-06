import React, {Component} from 'react';
import {connect} from "react-redux";
import '../css/uswds-theme.scss';
import '../css/App.css';
import Table from './components/table';
import TableColumn from './components/table-column';
import {addContact, clearContacts, changeSearchFilter, getContacts} from "./actions/index";
import {getCurrentSearchFilter} from "./selectors/index";

function mapDispatchToProps(dispatch) {
    return {
        addContact: function (contact) {
            dispatch(addContact(contact))
        },
        changeSearchFilter: function (filter) {
            dispatch(changeSearchFilter(filter))
        },
        clearContacts: function () {
            dispatch(clearContacts())
        },
        getContacts: function () {
            dispatch(getContacts())
        },
    };
}

const mapStateToProps = state => {
    return {
        currentSearchFilter: getCurrentSearchFilter(state)
    };
};

class ConnectedApp extends Component {
    constructor(props) {
        super(props);
        this.handleTextChange = this.handleTextChange.bind(this);
    }

    componentDidMount() {
        this.props.getContacts();
    }

    renderHeader() {
        return (
            <div className="usa-header">
                <h2>Contacts Page</h2>
            </div>
        );
    }

    handleTextChange(event) {
        const target = event.currentTarget;
        this.props.changeSearchFilter(target.value);
    }

    render() {
        return (
            <div className={"usa-content"}>
                {this.renderHeader()}
                <input type={"text"} className={"usa-input"} name={"filter"} placeholder={"Search"}
                       data-testid={"search-filter"}
                       value={this.props.currentSearchFilter}
                       onChange={this.handleTextChange}/>
                <p></p>
                <Table title="Contacts" editable="false">
                    <TableColumn field="id" title="User ID"/>
                    <TableColumn field="name" title="Name"/>
                    <TableColumn field="username" title="Username"/>
                    <TableColumn field="email" title="Email"/>
                    <TableColumn field="website" title="URL"/>
                    <TableColumn title="Select" type="checkbox"/>
                </Table>
                <button id={"backToTop"}><a href="#top" id={"topText"}>Top</a></button>
            </div>
        );
    }
}

const App = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedApp);

export default App;
