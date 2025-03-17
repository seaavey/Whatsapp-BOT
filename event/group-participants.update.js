import { jidNormalizedUser } from "@seaavey/baileys"
/**
 * Updates the contacts in the store based on the given update.
 *
 * @param {any} update - The update object containing the contacts. {
 *   id: string,
 *   participants: string[],
 *   action: "add" | "remove" | "promote" | "demote" | "revoked_membership_requests",
 * }
 *
 * @param {any} update - The update object containing the contacts.
 */
export const handleGroupEvent = ({ id, participants, action }, store) => {
  const metadata = store.groupMetadata[id]
  if (metadata) {
    switch (action) {
      case "add":
      case "revoked_membership_requests":
        metadata.participants.push(
          ...participants.map(participantId => ({
            id: jidNormalizedUser(participantId),
            admin: null
          }))
        )
        break
      case "demote":
      case "promote":
        for (const participant of metadata.participants) {
          const participantId = jidNormalizedUser(participant.id)
          if (participants.includes(participantId)) {
            participant.admin = action === "promote" ? "admin" : null
          }
        }
        break
      case "remove":
        metadata.participants = metadata.participants.filter(p => !participants.includes(jidNormalizedUser(p.id)))
        break
    }
  }
}
