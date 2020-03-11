import React from 'react';
import {Link} from "react-router-dom";

export function BuildHeader(text, currentPath = '/') {
    return (<>
            <div className="usa-overlay"></div>
            <header
                className="usa-header usa-header--basic">
                <div
                    className="usa-nav-container">
                    <div
                        className="usa-navbar">
                        <div
                            className="usa-logo"
                            id="basic-logo">
                            <Link to={currentPath}>
                                <em
                                    className="usa-logo__text"> {text} </em>
                            </Link>
                        </div>
                    </div>
                    <nav aria-label="Primary navigation" className="usa-nav">
                        <ul className="usa-nav__primary usa-accordion">
                            <li className="usa-nav__primary-item">
                                <Link to={'/users'}><span>Users</span></Link>
                            </li>
                            <li className="usa-nav__primary-item">
                                <Link to={'/groups'}><span>Groups</span></Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    );
}