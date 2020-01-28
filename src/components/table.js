// src/components/table.js

import React from 'react';
import { process } from '@progress/kendo-data-query';
import { Grid, GridColumn } from '@progress/kendo-react-grid';


const Table = ({ contacts }) => {
    return (
    <div className="usa-table">
        <Grid 
            data={contacts}
            pageable={true}
            sortable={true}>
            <GridColumn field="name" />
            <GridColumn className=".column" field="email" />
            <GridColumn className=".column" field="catchPhrase" />
        </Grid>
    </div>
    );
}

export default Table;