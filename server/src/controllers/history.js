const { history } = require("../../models");

exports.addHistory = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    await history.create(data);

    res.send({
      status: "success",
      message: "Add History transaction Success ",
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getHistorys = async (req, res) => {
  try {
    const historyData = await history.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      message: "Get historys success",
      data: {
        historys: historyData,
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

exports.getHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const historyData = await history.findOne({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: "User Successfully Get Detail",
      data: {
        history: historyData,
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
