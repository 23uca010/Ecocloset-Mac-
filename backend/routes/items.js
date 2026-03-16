const express = require('express');
const router = express.Router();
const { 
  getItems, 
  createItem, 
  getItem, 
  deleteItem,
  getUserItems
} = require('../controllers/itemController');
const multer = require('multer');
const path = require('path');

// Multer configuration for item images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
})
const upload = multer({ storage: storage })

router.get('/', getItems);
router.post('/create', upload.single("image"), createItem);
router.get('/user/:userId', getUserItems);
router.get('/:id', getItem);
router.delete('/:id', deleteItem);

module.exports = router;
