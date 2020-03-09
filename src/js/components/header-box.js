import React from 'react';
import {Link} from "react-router-dom";

export function BuildHeader(text) {
    return (<header className="usa-header usa-header--basic">
        <div className="usa-nav-container">
            <div className="usa-navbar">
                <div className="usa-logo" id="basic-logo">
                    <Link to={'/'}>
                        <em className="usa-logo__text"><a href="/" title={text} aria-label={text}>{text}</a>
                        </em>
                    </Link>
                </div>
            </div>
        </div>
    </header>);
}