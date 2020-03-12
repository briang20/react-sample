import {
    CLEAR_USER_GROUPS,
    MODIFY_USER_GROUPS,
    REMOVE_USER_GROUPS,
    UPDATE_USER_GROUPS
} from "../constants/action-types";

export default function groups(state = {groups: []}, action) {
    switch (action.type) {
        case UPDATE_USER_GROUPS:
            return Object.assign({}, state, {
                groups: state.groups.concat(action.payload)
            });
        case REMOVE_USER_GROUPS:
            return Object.assign({}, state, {
                groups: state.groups.filter(group => group !== action.payload)
            });
        case MODIFY_USER_GROUPS:
            return Object.assign({}, state, {
                groups: state.groups.map(group => {
                    if (group.id === action.payload.id)
                        return action.payload;
                    return group;
                })
            });
        case CLEAR_USER_GROUPS:
            return Object.assign({}, state, {
                groups: []
            });
        default:
            return state;
    }
}