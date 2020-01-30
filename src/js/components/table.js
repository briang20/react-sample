// src/js/components/table.js

import React, { Component } from 'react';
import { connect } from "react-redux";
import { addContact } from "../actions/index";

function mapDispatchToProps(dispatch) {
    return {
        addContact: contact => dispatch(addContact(contact))
    };
  }

export class TableColumn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            field: ""
        };
        if (props.field != null) this.state.title = this.state.field = props.field;
        if (props.title != null) this.state.title = props.title;
    }
    render() {
        const { title } = this.state;
        return (
            <h5>{title}</h5> // TODO: set this to the same style as "usa-table th"
        );
    }
}

class ConnectedTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: ""
        };
        if (props.title != null) this.state.title = props.title;
    }
    render() {
        const { title } = this.state;
        let colCount = React.Children.count(this.props.children);
        //TODO: render the rows of data using the dynamic columns we have
        return (
            <div>
                <div className="usa-table">
                    <caption>{title}</caption>
                    {this.props.children}
                </div>
                <p>{colCount} cols</p>
            </div>
        );
    }

    // return (
    // <div className="usa-table">
    //     <Grid 
    //         data={contacts}
    //         pageable={true}
    //         sortable={true}
    //         className=".column">
    //         <GridColumn field="name" />
    //         <GridColumn className=".column" field="email" />
    //         <GridColumn className=".column" field="catchPhrase" />
    //     </Grid>
    // </div>
    // );
}

const Table = connect(
    null,
    mapDispatchToProps
)(ConnectedTable);

export default Table;