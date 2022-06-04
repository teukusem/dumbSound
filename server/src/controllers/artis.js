const { artis } = require("../../models");

exports.addArtis = async (req, res) => {
  try {
    const { body } = req;

    const artisData = await artis.create(body);

    res.send({
      status: "success",
      message: "artis Successfully Add",
      data: artisData,
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getArtiss = async (req, res) => {
  try {
    const artiss = await artis.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      message: "User Successfully Get",
      data: {
        artiss,
      },
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};

// ================ GET ARTIS BY ID =============
exports.getArtis = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await artis.findOne({
      where: { id },
    });

    res.send({
      status: "success",
      message: `Get Artis ${id} Success`,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};

// ============= UPDATE ARTIS ==============
exports.updateArtis = async (req, res) => {
  const { id } = req.params;
  try {
    const { body } = req;
    console.log(body);
    const data = await artis.update(body, {
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: `Update Artis ${id} Success`,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
// ============= DELETE ARTIS ==============
exports.deleteArtis = async (req, res) => {
  const { id } = req.params;
  try {
    await artis.destroy({
      where: { id },
    });

    res.send({
      status: "success",
      message: `Delete Artis ${id} Success`,
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
