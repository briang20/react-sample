import React, {Component} from 'react';
import {MultiSelect} from '@progress/kendo-react-dropdowns';

export function MultiSelectCell({options}) {
    return class extends Component {
        options = [];

        constructor(props) {
            super(props);
            this.options = options.concat(this.options);
        }

        handleChange = (e) => {
            this.props.onChange({
                dataItem: this.props.dataItem,
                field: this.props.field,
                syntheticEvent: e.syntheticEvent,
                value: e.target.value
            });
        }

        render() {
            const {dataItem, field} = this.props;
            const dataValue = dataItem[field] == null ? '' : dataItem[field];
            const selectableOptions = this.options;

            return (
                <td>
                    <MultiSelect
                        style={{width: "100%"}}
                        onChange={this.handleChange}
                        disabled={!dataItem.inEdit}
                        data={selectableOptions}
                        value={dataValue}
                        textField="text"
                        dataItemKey="value"
                    />
                </td>
            );
        }
    }
}