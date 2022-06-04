const { music, artis } = require('../../models');

const cloudinary = require('../utils/cloudynary');

// ================ GET ALL MUSIC ======================
exports.musics = async (req, res) => {
  try {
    let musics = await music.findAll({
      include: {
        model: artis,
        as: 'artis',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      attributes: {
        exclude: ['createdAt'],
      },
      order: [['createdAt', 'DESC']],
    });

    musics = JSON.parse(JSON.stringify(musics));
    musics = musics.map((item) => {
      return {
        ...item,
        attache: process.env.PATH_FILE + item.attache,
        thumbnail: process.env.PATH_FILE + item.thumbnail,
      };
    });

    console.log(musics);

    res.send({
      status: 'success',
      message: 'User Successfully Get',
      data: {
        musics,
      },
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: 'failed',
      message: 'Server Error',
    });
  }
};

// ================ GET MUSIC ====================
exports.getMusic = async (req, res) => {
  const { id } = req.params;
  console.log('INI IDNYA :', id);
  try {
    let data = await music.findOne({
      where: { id },
    });

    data = JSON.parse(JSON.stringify(data));

    data = {
      ...data,
      attache: process.env.PATH_FILE + data.attache,
      thumbnail: process.env.PATH_FILE + data.thumbnail,
    };

    console.log(data);

    res.send({
      status: 'success',
      message: `Get Music ${id} Successfully Get`,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: 'failed',
      message: 'Server Error',
    });
  }
};

// ============= ADD MUSIC =================
exports.addMusic = async (req, res) => {
  try {
    const data = req.body;

    // const resultImage = await cloudinary.uploader.upload(req.files.imageSong[0].path, {
    //   folder: 'dumbplay_file',
    //   use_filename: true,
    //   unique_filename: false,
    // });

    // const resultSong = await cloudinary.uploader.upload(req.files.fileSong[0].path, {
    //   folder: 'dumbplay_file',
    //   use_filename: true,
    //   unique_filename: false,
    //   resource_type: 'raw',
    // });

    // console.log('Cloudinary: ', resultImage);
    // console.log('CloudinarySong: ', resultSong);

    const thumbnail = req.files?.imageSong[0]?.filename;
    const attache = req.files?.fileSong[0]?.filename;

    const dataUpload = {
      ...data,
      thumbnail,
      attache,
    };

    await music.create(dataUpload);

    res.send({
      status: 'success',
      message: 'Upload data Music success',
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: 'failed',
      message: 'Server Error',
    });
  }
};

// ============= UPDATE MUSIC ==============
exports.updateMusic = async (req, res) => {
  const { id } = req.params;
  try {
    const data = req.body;

    // Save image
    const resultImage = await cloudinary.uploader.upload(req.files.imageSong[0].path, {
      folder: 'dumbplay_file',
      use_filename: true,
      unique_filename: false,
    });

    // Save Song
    const resultSong = await cloudinary.uploader.upload(req.files.fileSong[0].path, {
      folder: 'dumbplay_file',
      use_filename: true,
      unique_filename: false,
      resource_type: 'raw',
    });

    console.log('Cloudinary: ', resultImage);
    console.log('CloudinarySong: ', resultSong);

    const thumbnail = resultImage.public_id;
    const attache = resultSong.public_id;

    const dataUpload = {
      ...data,
      thumbnail,
      attache,
    };

    console.log(dataUpload);

    await music.update(dataUpload, {
      where: { id },
    });

    res.send({
      status: 'success',
      message: `Updata data music ${id} success`,
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: 'failed',
      message: 'Server Error',
    });
  }
};

// ============= DELETE MUSIC ==============
exports.deleteMusic = async (req, res) => {
  const { id } = req.params;

  console.log('Ini IDnya: ', id);
  try {
    await music.destroy({
      where: { id },
    });

    res.send({
      status: 'success',
      message: `Delete Music ${id} success `,
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: 'failed',
      message: 'Server Error',
    });
  }
};
