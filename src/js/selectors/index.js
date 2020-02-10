export const getContactsState = store => store.contacts;
export const getSortingState = store => store.currentSortMethod;
export const getCurrentSearchFilter = store => store.currentSearchFilter;
export const getCurrentSelectedItemState = store => store.currentSelectedItems;
export const getReplayState = store => store.replayBuffer;
export const getContactsList = store => getContactsState(store) ? getContactsState(store) : [];
export const getSelectedItemsList = store => getContactsList(store).filter(checked => checked.selected);
export const getCurrentSelectedItemList = store => getCurrentSelectedItemState(store) ? getCurrentSelectedItemState(store) : [];
export const getReplayList = store => getReplayState(store) ? getReplayState(store) : [];