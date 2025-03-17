/**
 * Updates the group metadata in the store based on the given updates.
 *
 * @param {any} updates - The updates object containing the group metadata.
 * @param {any} store - The store object containing the group metadata.
 */
export const updateGroupMetadata = (updates, store) => {
  for (const update of updates) {
    const id = update.id
    if (store.groupMetadata[id]) {
      store.groupMetadata[id] = {
        ...store.groupMetadata[id],
        ...update
      }
    }
  }
}
