const cloudinary = require('./cloudinary');
const fs = require('fs');

const uploadFilesToCloudinary = async (files) => {
  const uploadPromises = files.map(async (file) => {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'K2-DESIGN',
    });

    // Remove the file from local storage after upload
    fs.unlinkSync(file.path);

    return result.secure_url;
  });

  return Promise.all(uploadPromises);
};

module.exports = uploadFilesToCloudinary;
