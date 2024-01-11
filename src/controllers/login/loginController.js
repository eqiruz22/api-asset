import LoginRepository from "../../repository/login/loginRepo.js";

const auth = new LoginRepository();

export const loginUser = async (req, res, next) => {
  const item = {
    user: req.body.username,
    pass: req.body.password,
  };
  try {
    const data = await auth.login(item.user, item.pass);
    return res.status(200).json({
      result: data,
    });
  } catch (error) {
    console.log(error);
    if (error.message.includes("wrong")) {
      return res.status(400).json({
        error: error.message,
      });
    }
    return res.status(500).json({
      error: error,
    });
  }
};
