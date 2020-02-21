import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {connect} from "react-redux";
import {toODataString} from '@progress/kendo-data-query';
import {getContacts} from '../actions/index';
import {Notification, NotificationGroup} from '@progress/kendo-react-notification';
import {Fade} from '@progress/kendo-react-animation'

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
        pending: '',
        error: false,
        errorMessage: 'Oops! Something went wrong ...'
    };

    requestDataIfNeeded() {
        const {fetchData} = this.props;

        if (this.state.pending || toODataString(this.props.dataState) === this.state.lastSuccess) {
            return;
        }

        this.setState({
            ...this.state,
            pending: toODataString(this.props.dataState)
        });

        fetchData.call(undefined)
            .then(res => {
                if (res.type === 'SUCCESS') {
                    this.setState({
                        lastSuccess: this.state.pending,
                        pending: ''
                    });

                    if (toODataString(this.props.dataState) === this.state.lastSuccess) {
                        this.props.onDataReceived.call(undefined, res.data);
                    } else {
                        this.requestDataIfNeeded();
                    }
                } else if (res.type === 'FAILURE') {
                    // Throw up a notification indicating an error occurred
                    const data = res.payload.message;
                    this.setState({error: true, errorMessage: data});
                }
            });
    }

    render() {
        this.requestDataIfNeeded();
        return (
            <>
                <NotificationGroup
                    style={{
                        right: 0,
                        bottom: 0,
                        alignItems: 'flex-start',
                        flexWrap: 'wrap-reverse'
                    }}
                >
                    <Fade enter={true} exit={true}>
                        {this.state.error && <Notification
                            type={{style: 'error', icon: true}}
                            closable={true}
                            onClose={() => this.setState({error: false})}
                        >
                            <span>{this.state.errorMessage}</span>
                        </Notification>}
                    </Fade>
                </NotificationGroup>
                {this.state.pending && <LoadingPanel container={this.props.container}/>}
            </>
        );
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

        const container = document && document.querySelector(this.props.container);
        return container ? ReactDOM.createPortal(loadingPanel, container) : loadingPanel;
    }
}

export default connect(null, mapDispatchToProps)(ConnectedDataLoader);

