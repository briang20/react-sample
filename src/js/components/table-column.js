import React, {Component} from 'react';
import {connect} from "react-redux";
import {addSelectedItem, changeSorting, clearSelectedItems} from "../actions/index";
import {getCurrentSortMethod, getSelectedItemsList, getContactsList} from "../selectors/index";

function mapDispatchToProps(dispatch) {
    return {
        changeSorting: function (sortFn) {
            dispatch(changeSorting(sortFn))
        },
        addSelectedItem: function (item) {
            dispatch(addSelectedItem(item))
        },
        clearSelectedItems: function () {
            dispatch(clearSelectedItems())
        },
    };
}

const mapStateToProps = state => {
    return {
        currentSortMethod: getCurrentSortMethod(state),
        contacts: getContactsList(state),
        selectedItems: getSelectedItemsList(state),
    };
}

class ConnectedTableColumn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            field: "",
            type: "text",
            ascending: null
        };
        if (props.field != null) this.state.title = this.state.field = props.field;
        if (props.title != null) this.state.title = props.title;
        if (props.type != null) this.state.type = props.type;
        this.handleClick = this.handleClick.bind(this);
        this.handleCheckboxChanged = this.handleCheckboxChanged.bind(this);
    }

    handleClick(event) {
        const {ascending} = this.state;
        let sortType = "";
        if (ascending === false) {
            this.setState({
                title: this.state.title,
                field: this.state.field,
                type: this.state.type,
                ascending: true
            });
            sortType = "asc_by_" + this.state.field;
        } else {
            this.setState({
                ascending: false
            });
            sortType = "dsc_by_" + this.state.field;
        }

        this.props.changeSorting(sortType);
    }

    handleCheckboxChanged(event) {
        const target = event.currentTarget;
        let checked = target.checked;
        if (checked === false)
            this.props.clearSelectedItems();
        else
            for (let contact of this.props.contacts)
                this.props.addSelectedItem(contact);
    }

    render() {
        const {title, type} = this.state;
        if (type === "checkbox") {
            let isAllChecked = false;
            if (this.props.contacts.length > 0)
                isAllChecked = this.props.contacts.length === this.props.selectedItems.length;
            return (
                <div id={"table-cell"} className={"usa-checkbox"}>
                    <input type="checkbox" id="selectAll" className={"usa-checkbox__input"} name="selection"
                           value="selectAll" checked={isAllChecked}
                           data-testid={"select-all-rows"}
                           tabIndex={1}
                           onChange={(event) => this.handleCheckboxChanged(event)}/>
                    <label htmlFor="selectAll">{title}</label>
                </div>
            );
        } else {
            return (
                <div data-testid={"column-" + this.state.field} name={title} id={"table-cell"}
                     onClick={this.handleClick}>{title}</div> //TODO: set this to the same style as "usa-table th"?
            );
        }
    }
}

const TableColumn = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedTableColumn);

export default TableColumn;