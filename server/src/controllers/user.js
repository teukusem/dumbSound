// Models
const { user, transaction } = require("../../models");

// ============== GET USERS ========================
exports.getUsers = async (req, res) => {
  try {
    const users = await user.findAll({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    // ? code dibawah disimpan, barangkali bisa dipakai
    // data = JSON.parse(JSON.stringify(data));

    // data = data.map((item) => {
    //   return {
    //     ...item,
    //     profile: {
    //       image: process.env.FILE_PATH + item?.profile?.image
    //     }
    //   }
    // })

    res.status(200).send({
      status: "Success",
      message: "Get Users Success",
      data: {
        users,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

// get User
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;

    let data = await user.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    res.status(200).send({
      status: "Success",
      message: `Get User ${id} Success `,
      user: data,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

// ============== UPDATE USER ========================
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const data = await user.update(req.body, {
      where: { id },
    });

    console.log(data);

    res.status(200).send({
      status: "Success",
      message: `Update User id: ${id} Success `,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

// ============== DELETE USER ==================
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await user.destroy({
      where: { id },
    });

    res.status(200).send({
      status: "Success",
      message: `Delete User id: ${id} Success `,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      status: "Delete Failed",
      message: "Server Error",
    });
  }
};
