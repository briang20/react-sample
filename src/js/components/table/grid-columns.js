import React, {Component} from 'react';
import {GridColumn} from '@progress/kendo-react-grid';

export function GridColumns(columns, editField) {
    return Object.keys(columns).map((column) => {
        return (
            <GridColumn {...columns[column]}/>
        );
    });
}