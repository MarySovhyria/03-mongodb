const express = require('express')
const isValidId = require("../../midlewares/isValidId");
const upload = require("../../midlewares/upload.js")

const router = express.Router()
const contactsController = require('../../controllers/contacts-controller');
const authenticate = require('../../midlewares/authenticate.js')
const isEmptyBody = require('../../midlewares/isEmptyBody')

router.use(authenticate);

router.get('/', contactsController.getAll);

router.get('/:contactId', isValidId, contactsController.getById)

router.post('/', isEmptyBody, contactsController.add)

router.delete('/:contactId', isValidId, contactsController.deleteById)

router.put('/:contactId', isEmptyBody, isValidId, contactsController.updateById)

router.patch('/:contactId/favorite', isValidId, isEmptyBody, contactsController.updateById)

module.exports = router
