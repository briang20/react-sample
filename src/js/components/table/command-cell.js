import React from 'react';
import {GridCell} from '@progress/kendo-react-grid';

export class CommandCell extends GridCell {
    buttonClick(event, command) {
        this.props.onChange({dataItem: this.props.dataItem, event, field: this.props.field, value: command});
    }

    render() {
        const {dataItem, rowType, field} = this.props;
        if (rowType !== "data") {
            return null;
        }

        const inEdit = dataItem[field];
        const isNewItem = dataItem.id === undefined;

        return inEdit ? (
            <td className="k-command-cell">
                <button
                    className="k-button k-grid-save-command"
                    onClick={(event) => isNewItem ? this.buttonClick(event, 'add') : this.buttonClick(event, 'update')}
                    data-testid={isNewItem ? "final-add-row" : "final-update-row"}
                >
                    {isNewItem ? 'Add' : 'Update'}
                </button>
                <button
                    className="k-button k-grid-cancel-command"
                    onClick={(event) => isNewItem ? this.buttonClick(event, 'discard') : this.buttonClick(event, 'cancel')}
                    data-testid={isNewItem ? "final-discard-row" : "final-cancel-row"}
                >
                    {isNewItem ? 'Discard' : 'Cancel'}
                </button>
            </td>
        ) : (
            <td className="k-command-cell">
                <button
                    className="k-primary k-button k-grid-edit-command"
                    onClick={(event) => this.buttonClick(event, 'edit')}
                    data-testid={"edit-row"}
                >
                    Edit
                </button>
                <button
                    className="k-button k-grid-remove-command"
                    onClick={(event) => this.buttonClick(event, 'remove')}
                    data-testid={"remove-row"}
                >
                    Remove
                </button>
            </td>
        );
    }
}