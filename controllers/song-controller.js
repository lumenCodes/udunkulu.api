const cloudinary = require('../config/cloudinary');
const { Song } = require('../models/song');
const { Artist } = require('../models/artist');
const { Album } = require('../models/album');
const { deleteFile, secondsToMinute } = require('../services/song-service');
const _ = require('lodash');

// const dir = path.join(__dirname, 'uploads/songs');
// console.log(dir);

exports.upload = async (req, res) => {
  // check if a file was parsed by multer
  // if req has property 'file' then it definitely has file.path
  if (!('file' in req)) {
    return res.status(404).send({
      success: false,
      message: 'no file found, please attached a file'
    });
  }

  // get artist info
  const artist = await Artist.findById(req.params.artistId);
  if (!artist) return res.status(404).send({ success: false, message: 'artist not found' });

  // get album info
  const album = await Album.findById(req.params.id);
  if (!album) return res.status(404).send({ success: false, message: 'album not found' });

  // upload to cloudinary
  const response = await cloudinary.uploads(req.file.path);
  // song duration/length in minute string
  const songDuration = await secondsToMinute(response.duration);

  const songData = {
    title: req.file.originalname,
    duration: songDuration,
    url: response.secure_url,
    cloudinary: response,
    artist: artist._id,
    album: album._id
  };

  const song = new Song(songData);

  await song.save();

  await deleteFile(req.file);
  // return

  res.status(201).send({
    success: true,
    message: 'file uploaded',
    data: song
  });
};

/**
 * List/Fetch all songs
 */
exports.list = async (req, res) => {
  const songs = await Song.find();
  if (_.isEmpty(songs)) return res.status(404).send({ success: false, message: 'songs not found' });

  res.status(200).send({ status: true, message: 'success: song list', data: songs });
};

/**
 * Retrieve a song || play a song
 */
exports.detail = async (req, res) => {
  const song = await Song.findById(req.params.id); // .populate('artist');
  if (!song) return res.status(404).send({ success: false, message: 'song not found' });

  res.status(200).send({ success: true, message: 'success', data: song });
};
