export const getContactsState = store => store.contacts;
export const getContactsList = store => getContactsState(store) ? getContactsState(store) : [];
export const getSelectedItemsList = store => getContactsList(store).filter(checked => checked.selected);
export const getSortingState = store => store.currentSortMethod;
export const getCurrentSearchFilter = store => store.currentSearchFilter;
export const getCurrentSelectedItemState = store => store.currentSelectedItems;
export const getCurrentSelectedItemList = store => getCurrentSelectedItemState(store) ? getCurrentSelectedItemState(store) : [];