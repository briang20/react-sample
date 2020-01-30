export const getContactsState = store => store.contacts
export const getContactsList = store => getContactsState(store) ? getContactsState(store) : []