export const getContactsState = store => store.contacts;
export const getUserGroupsState = store => store.groups;

export const getContactsList = store => getContactsState(store) ? getContactsState(store).contacts : [];
export const getUserGroupsList = store => getUserGroupsState(store) ? getUserGroupsState(store).groups : [];