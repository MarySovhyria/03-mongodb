const fs = require('fs/promises')
const path = require('path');
const { nanoid } = require('nanoid');


const contactsPath = path.resolve("models", "contacts.json");

const listContacts = async () => {
    const data = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
}

const getContactById = async (contactId) => {
  const contacts = await listContacts();
    const result = contacts.find(item => item.id === contactId);
    return result || null;
}

const removeContact = async (contactId) => {
   const contacts = await listContacts();
    const indexToRemove = contacts.findIndex(item => item.id === contactId);
    if (indexToRemove == -1) {
       return null;
    }
    const [result] = contacts.splice(indexToRemove, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return result;
}

const addContact = async (data) => {
   const contacts = await listContacts(); 
    const newContacts = {
         id: nanoid(),
        ...data,
    }
    contacts.push(newContacts);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContacts;
}

const updateContactById = async (contactId, data) => {
    const contacts = await listContacts();
    const index = contacts.findIndex(item => item.id === contactId);
    if (index === -1) {
        return null;
    }
    contacts[index] = { ...contacts[index], ...data };
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts[index];
}


module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactById,
}
