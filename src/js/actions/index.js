// src/actions/index.js

import { ADD_CONTACT } from "../constants/action-types";

export function addContact(payload) {
    return { type: ADD_CONTACT, payload }
}