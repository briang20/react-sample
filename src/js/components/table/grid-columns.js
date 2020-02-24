import React from 'react';
import {GridColumn} from '@progress/kendo-react-grid';

export function GridColumns(columns, editField) {
    return Object.keys(columns).map((column) => {
        return (
            <GridColumn key={column} {...columns[column]}/>
        );
    });
}