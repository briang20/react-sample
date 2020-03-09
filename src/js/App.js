import React, {Component} from 'react';
import '@progress/kendo-theme-default/dist/all.css';
import '../css/uswds-theme.scss';
import '../css/App.css';
import {defaultRoutes} from "./routes";
import {Link} from "react-router-dom";

class App extends Component {
    render() {
        return (
            <>
                <a className="usa-skipnav" href="#main-content">Skip to main content</a>
                {defaultRoutes}
                <footer className={"usa-footer usa-footer--slim"}>
                    <div className={"grid-container usa-footer__return-to-top"}>
                        <a href={"#top"}>Return to top</a>
                    </div>
                </footer>
            </>
        );
    }
}

export default App;
