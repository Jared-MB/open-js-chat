import { contactRequests } from 'src/db/schema/contactsRequests'
import { contacts } from 'src/db/schema/contacts'

export type ContactDto = typeof contacts.$inferSelect
export type CreateContactDto = typeof contacts.$inferInsert

export type ContactRequestDto = typeof contactRequests.$inferSelect