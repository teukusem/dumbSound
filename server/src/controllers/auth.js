const { user } = require("../../models");

const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ============= REGISTER =============
exports.register = async (req, res) => {
  const data = req.body;

  // skema pengecekan inputan
  const schema = joi.object({
    email: joi.string().email().min(6).required(),
    password: joi.string().min(3).required(),
    name: joi.string().min(3).required(),
    gender: joi.string().min(3).required(),
    phone: joi.string().min(3).required(),
    address: joi.string().min(3).required(),
    subscribe: joi.boolean(),
  });

  // jika validasi tidak memenuhi
  const { error } = schema.validate(req.body);

  // jika tidak memenuhi
  if (error) {
    return res.status(400).send({
      error: {
        status: "Validation Failed",
        message: error.details[0].message,
      },
    });
  }

  try {
    // Cek Email
    const checkEmail = await user.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (checkEmail) {
      return res.status(401).send({
        status: "failed",
        message: "Email telah terdaftar",
      });
    }

    // bcrypt email enkripsi password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Tambah user ke database
    const newUser = await user.create({
      ...data,
      subscribe: false,
      status: "customers",
      password: hashedPassword,
    });

    // Generate token
    const token = jwt.sign({ id: newUser.id }, process.env.TOKEN_KEY);

    res.status(201).send({
      status: "Success",
      message: "Register success",
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        subscribe: newUser.subscribe,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

// ============== LOGIN ===============
exports.login = async (req, res) => {
  //Validation
  const schema = joi.object({
    email: joi.string().min(5).required(),
    password: joi.string().min(5).required(),
  });

  // skema pengecekan inputan
  const { error } = schema.validate(req.body);

  // jika tidak memenuhi
  if (error) {
    res.status(400).send({
      message: error.details[0].message,
    });
  }

  try {
    // Mencari Email
    const userExist = await user.findOne({
      where: {
        email: req.body.email.toLowerCase(),
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    // Check Email
    if (!userExist) {
      return res.status(400).send({
        status: "failed",
        message: "Email belum terdaftar",
      });
    }

    // Check Password
    const isValid = await bcrypt.compare(req.body.password, userExist.password);
    if (!isValid) {
      return res.status(400).send({
        status: "failed",
        message: "Password Salah",
      });
    }

    // membuat token
    const token = jwt.sign({ id: userExist.id }, process.env.TOKEN_KEY);

    res.status(200).send({
      status: "Success",
      message: "Berhasil Login",
      data: {
        id: userExist.id,
        name: userExist.name,
        email: userExist.email,
        status: userExist.status,
        transaction: userExist.transaction,
        subscribe: userExist.subscribe,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

// ============= CHECK USER ================
exports.checkAuth = async (req, res) => {
  try {
    const id = req.user.id;

    const dataUser = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!dataUser) {
      return res.status(404).send({
        status: "Failed",
      });
    }

    res.status(200).send({
      status: "success",
      data: {
        user: {
          id: dataUser.id,
          name: dataUser.name,
          email: dataUser.email,
          status: dataUser.status,
          transaction: dataUser.transaction,
          subscribe: dataUser.subscribe,
          // image: dataUser.image
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: "Server Error",
    });
  }
};
