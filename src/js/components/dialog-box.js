import React from "react";
import {Dialog, DialogActionsBar} from "@progress/kendo-react-dialogs";

export function ModalDialog(dialogs, callback) {
    let title = '';
    let question = '';
    let action = null;
    if (dialogs.length > 0) {
        title = dialogs[0].title;
        question = dialogs[0].question;
        action = dialogs[0];
    }

    return (<div>
        {(action !== null) && <Dialog title={title}
                                      onClose={() => {
                                          if (callback && typeof callback === 'function') callback.call(undefined, action, 'close')
                                      }}>
            <p style={{margin: "25px", textAlign: "center"}}>{question}</p>
            <DialogActionsBar>
                <button className="k-button"
                        onClick={() => {
                            if (callback && typeof callback === 'function') callback.call(undefined, action, 'yes')
                        }}>Yes
                </button>
                <button className="k-button"
                        onClick={() => {
                            if (callback && typeof callback === 'function') callback.call(undefined, action, 'no')
                        }}>No
                </button>
            </DialogActionsBar>
        </Dialog>
        }
    </div>);
}