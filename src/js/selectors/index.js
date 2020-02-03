export const getContactsState = store => store.contacts;
export const getContactsList = store => getContactsState(store) ? getContactsState(store) : [];
export const getSortingState = store => store.currentSortMethod;
export const getCurrentSearchFilter = store => store.currentSearchFilter;