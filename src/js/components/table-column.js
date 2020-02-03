import React, {Component} from 'react';
import {connect} from "react-redux";
import {changeSorting} from "../actions/index";
import {getSortingState} from "../selectors/index";

function mapDispatchToProps(dispatch) {
    return {
        changeSorting: function (sortFn) {
            dispatch(changeSorting(sortFn))
        }
    };
}

const mapStateToProps = state => {
    return {
        currentSortMethod: getSortingState(state)
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
    }

    handleClick(event) {
        const target = event.target;
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
        }
        else {
            this.setState({
                ascending: false
            });
            sortType = "dsc_by_" + this.state.field;
        }

        console.log(sortType)
        this.props.changeSorting(sortType);
    }

    render() {
        const {title, type} = this.state;
        if (type === "checkbox") {
            return (
                <div id={"table-cell"}>
                    <input type="checkbox" id="selectAll" name="selection" value="selectAll"/>
                    <label htmlFor="selectAll">{title}</label>
                </div>
            );
        } else {
            return (
                <div name={title} id={"table-cell"} onClick={this.handleClick}>{title}</div> //TODO: set this to the same style as "usa-table th"?
            );
        }
    }
}

const TableColumn = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedTableColumn);

export default TableColumn;