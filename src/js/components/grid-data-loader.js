import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {connect} from "react-redux";
import {toODataString} from '@progress/kendo-data-query';
import {getContacts} from '../actions/index';

function mapDispatchToProps(dispatch) {
    return {
        getContacts: function () {
            return dispatch(getContacts())
        }
    };
}

class ConnectedDataLoader extends Component {
    state = {
        lastSuccess: '',
        pending: ''
    };

    requestDataIfNeeded() {
        const {getContacts} = this.props;

        if (this.state.pending || toODataString(this.props.dataState) === this.state.lastSuccess) {
            return;
        }

        this.setState({
            ...this.state,
            pending: toODataString(this.props.dataState)
        });
        getContacts()
            .then(res => {
                if (res === 'SUCCESS') {
                    this.setState({
                        lastSuccess: this.state.pending,
                        pending: ''
                    });

                    if (toODataString(this.props.dataState) === this.state.lastSuccess) {
                        this.props.onDataRecieved.call(undefined);
                    } else {
                        this.requestDataIfNeeded();
                    }
                }
            });
    }

    render() {
        this.requestDataIfNeeded();
        return this.state.pending && <LoadingPanel/>;
    }
}


class LoadingPanel extends Component {
    render() {
        const loadingPanel = (
            <div className="k-loading-mask">
                <span className="k-loading-text">Loading</span>
                <div className="k-loading-image"></div>
                <div className="k-loading-color"></div>
            </div>
        );

        const gridContent = document && document.querySelector('.k-grid-content');
        return gridContent ? ReactDOM.createPortal(loadingPanel, gridContent) : loadingPanel;
    }
}

export default connect(null, mapDispatchToProps)(ConnectedDataLoader);

