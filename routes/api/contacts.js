const express = require('express')

const router = express.Router()
const contactsController = require('../../controllers/contacts-controller');
const isEmptyBody = require('../../midlewares/isEmptyBody')

router.get('/', contactsController.getAll);

router.get('/:contactId', contactsController.getById)

router.post('/', isEmptyBody, contactsController.add)

router.delete('/:contactId', contactsController.deleteById)

router.put('/:contactId', isEmptyBody, contactsController.updateById)

module.exports = router
