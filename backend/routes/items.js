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

const { isAuth } = require('../middleware/auth');

router.get('/', getItems);
router.post('/create', isAuth, upload.single("image"), createItem);
router.get('/my-items', isAuth, getUserItems);
router.get('/user/:userId', getUserItems);
router.get('/:id', getItem);
router.delete('/:id', isAuth, deleteItem);

module.exports = router;
