export const getContactsState = store => store.contacts;
export const getSortingState = store => store.sorter;
export const getCurrentSelectedItemState = store => store.contacts;

export const getCurrentSortMethod = store => getSortingState(store) ? getSortingState(store).currentSortMethod : 'default';
export const getCurrentSearchFilter = store => getSortingState(store) ? getSortingState(store).currentSearchFilter : '';
export const getContactsList = store => getContactsState(store) ? getContactsState(store).contacts : [];
export const getSelectedItemsList = store => getContactsList(store).filter(checked => checked.selected);
export const getCurrentSelectedItemList = store => getCurrentSelectedItemState(store) ? getCurrentSelectedItemState(store).currentSelectedItems : [];
export const getReplayList = store => getContactsState(store) ? getContactsState(store).replayBuffer : [];