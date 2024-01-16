const fs = require('fs/promises');
const path = require('path')
const HttpError = require('../helpers/HttpError')
const { contactAddSchema, contactUpdateSchema, contactUpdateFavoriteSchema, Contact } = require('../models/ContactsModel.js')

const avatarPath = path.resolve("public", "avatars");

const getAll = async (req, res, next) => {
    const { _id: owner } = req.user;
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        const result = await Contact.find({ owner }, "-createdAt -updatedAt", { skip, limit}).populate("owner", "username"); 
        res.json(result)
    } catch (error) {
       next(error)
    }
}

const getById = async (req, res, next) => {
     const { _id: owner } = req.user;
     try {
         const { contactId } = req.params;
         const result = await Contact.findById({owner, contactId});
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
         
         const { _id: owner } = req.user;
         const { path: oldPath, filename } = req.file;
         console.log(req.file)
        const newPath = path.join(avatarPath, filename);
        await fs.rename(oldPath, newPath);
        const avatar = path.join('avatars', filename)
        const result = await Contact.create({ ...req.body, avatar, owner });

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
         const { _id: owner } = req.user;
         const { contactId } = req.params;
         const result = await Contact.findByIdAndUpdate({contactId, owner}, req.body);
         if (!result) {
             throw HttpError(404, "Not found");
         }

         res.json(result);
     }
     catch (error) {
         next(error);
     }
 }

const updateStatusContact = async (req, res, next) => {
    try {
         const { error } = contactUpdateFavoriteSchema.validate(req.body);
         if (error) {
              throw HttpError(400, error.message);
         }
         const { contactId } = req.params;
        const result = await Contact.findByIdAndUpdate({owner, contactId}, req.body);
        if (!result) {
            throw HttpError(404, "Not found")
        }
        res.json(result)
    } catch (error) {
        next(error);
     }
 }
 const deleteById = async (req, res, next) => {
     try {
         const { contactId } = req.params;
         const result = await Contact.findByIdAndDelete({owner, contactId});
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
    updateStatusContact,
    deleteById

}