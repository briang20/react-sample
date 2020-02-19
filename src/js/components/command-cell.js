import React from 'react';
import {GridCell} from '@progress/kendo-react-grid';

export function CommandCell({edit, remove, add, update, discard, cancel, editField}) {
    return class extends GridCell {
        render() {
            const {dataItem} = this.props;
            const inEdit = dataItem[editField];
            const isNewItem = dataItem.id === undefined;

            return inEdit ? (
                <td className="k-command-cell">
                    <button
                        className="k-button k-grid-save-command"
                        onClick={() => isNewItem ? add(dataItem) : update(dataItem)}
                        data-testid={isNewItem ? "final-add-row" : "final-update-row"}
                    >
                        {isNewItem ? 'Add' : 'Update'}
                    </button>
                    <button
                        className="k-button k-grid-cancel-command"
                        onClick={() => isNewItem ? discard(dataItem) : cancel(dataItem)}
                        data-testid={isNewItem ? "final-discard-row" : "final-cancel-row"}
                    >
                        {isNewItem ? 'Discard' : 'Cancel'}
                    </button>
                </td>
            ) : (
                <td className="k-command-cell">
                    <button
                        className="k-primary k-button k-grid-edit-command"
                        onClick={() => edit(dataItem)}
                        data-testid={"edit-row"}
                    >
                        Edit
                    </button>
                    <button
                        className="k-button k-grid-remove-command"
                        onClick={() => remove(dataItem)}
                        data-testid={"remove-row"}
                    >
                        Remove
                    </button>
                </td>
            );
        }
    }
}