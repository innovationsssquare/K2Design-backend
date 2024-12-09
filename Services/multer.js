// config/multer.js
const multer = require('multer');

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

module.exports = upload;
// const cloudinary = require('./cloudinary');

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'K2-design', 
//     allowed_formats: ['jpg', 'jpeg', 'png'],
//   },
// });

// const upload = multer({ storage: storage });

// module.exports = upload;
