import React from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import UserTable from "../views/user-table";
import GroupsTable from "../views/groups-table";
import logo from "../../images/logo.svg";

export const defaultRoutes = (
    <Switch>
        <Route exact path={"/"} component={UserTable}/>
        <Route path={'/users'} component={UserTable}/>
        <Route path={"/groups"} component={GroupsTable}/>
        <Route path={'/test'} render={() => (
            <>
                <img src={logo} className={"App-logo"} alt={"logo"}/>
                <h1 className={"App-title"}>Welcome</h1>
            </>)}/>
    </Switch>
);