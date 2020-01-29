// src/js/components/contacts.js

import React from 'react';

const Contacts = ({ contacts }) => {
    return (
        <div>
            <center><h1>Contact List</h1></center>
            {contacts.map((contact) => (
                <div role="row">
                    <div>
                        <input className="usa-input" id="name" type="text" defaultValue={contact.name}></input>
                        <input className="usa-input" id="email" type="text" defaultValue={contact.email}></input>
                        <input className="usa-input" id="catchPhrase" type="text" defaultValue={contact.catchPhrase}></input>
                    </div>
                </div>
            ))}
        </div>
    )
};

export default Contacts