
const contactsService = require('../models/contacts');
const HttpError = require('../helpers/HttpError')
const { contactAddSchema, contactUpdateSchema } = require('../schemas/contact-schemas')

const getAll = async (req, res, next) => {
    try {
        const result = await contactsService.listContacts(); 
        res.json(result)
    } catch (error) {
       next(error)
    }
}

const getById = async (req, res, next) => {
    try {
         const { contactId } = req.params;
        const result = await contactsService.getContactById(contactId);
        if (!result) {
           throw HttpError(404, "Not found")
        }
         res.json(result);
    } catch (error) {
       next(error)
    }
}

const add = async (req, res, next) => {
    try {
        const { error } = contactAddSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }
        const result = await contactsService.addContact(req.body);

        res.status(201).json(result)

    } catch (error) {
        next(error)
    }
}

const updateById = async (req, res, next) => {
    try {
        const { error } = contactUpdateSchema.validate(req.body);
        if (error) {
             throw HttpError(400, error.message);
        }
        const { contactId } = req.params;
        const result = await contactsService.updateContactById(contactId, req.body);
        if (!result) {
            throw HttpError(404, "Not founds");
        }

        res.json(result);
    }
    catch (error) {
        next(error);
    }
}
const deleteById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const result = await contactsService.removeContact(contactId);
        if (!result) {
           throw HttpError(404, `Not found`)
        }
        return res.json({
            message: "contact deleted"
        }
            
         )


    } catch (error) {
        next(error)
    }
}



module.exports = {
    getAll,
    getById,
    add,
    updateById,
    deleteById

}