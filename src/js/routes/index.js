import React from 'react';
import {Route, Switch} from "react-router-dom";
import UserTable from "../views/user-table";
import GroupsTable from "../views/groups-table";

export const defaultRoutes = (
    <Switch>
        <Route exact path={"/"} component={UserTable}/>
        <Route path={'/users'} component={UserTable}/>
        <Route path={"/groups"} component={GroupsTable}/>
    </Switch>
);