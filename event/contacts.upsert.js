import { jidNormalizedUser } from "@seaavey/baileys"
/**
 * Updates the contacts in the store based on the given update.
 *
 * @param {any} update - The update object containing the contacts.
 * @param {any} store - The store object containing the contacts.
 * @returns {void}
 */
export const upsertContacts = (update, store) => {
  for (const contact of update) {
    const id = jidNormalizedUser(contact.id)
    if (store?.contacts) {
      store.contacts[id] = { ...contact, isContact: true }
    }
  }
}
