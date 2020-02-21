import React, {Component} from 'react';
import {DropDownList} from '@progress/kendo-react-dropdowns';

export function DropDownCell({options}) {
    return class extends Component {
        options = [
            {text: '(empty)', value: null}
        ];

        constructor(props) {
            super(props);
            this.options = options.concat(this.options);
        }

        handleChange = (event) => {
            this.props.onChange({
                dataItem: this.props.dataItem,
                field: this.props.field,
                syntheticEvent: event.syntheticEvent,
                value: event.target.value.value
            });
        }

        render() {
            const {dataItem, field} = this.props;
            const dataValue = dataItem[field] == null ? '' : dataItem[field];
            const selectableOptions = this.options;

            return (
                <td>
                    {dataItem.inEdit ? (
                        <DropDownList
                            style={{width: "100%"}}
                            onChange={this.handleChange}
                            value={selectableOptions.find(c => c.value === dataValue)}
                            data={selectableOptions}
                            textField="text"
                        />
                    ) : (
                        dataValue.toString()
                    )}
                </td>
            );
        }
    }
}