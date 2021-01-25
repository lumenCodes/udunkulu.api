const express = require('express');

const router = express.Router();
// const cloudinar = require('../config/cloudinary').
// const multer = require('multer');

// const upload = multer({ dest: 'uploads/songs' });
const upload = require('../config/multer');

const SongController = require('../controllers/song-controller');
const auth = require('../middlewares/authentication');
const permit = require('../middlewares/permission');

router.route('/').all()
  .get(SongController.playSong)
  .post([upload.upload.single('_song')], SongController.upload);

// router.route('/:id').all()
//   .get([permit.grant('readOwn', 'song')], SongController.detail)
//   .put([permit.grant('updateOwn', 'song')], SongController.update)
//   .delete([permit.grant('deleteAny', 'song')], SongController.delete);


module.exports = router;