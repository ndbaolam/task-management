const User = require('../models/user.model');

module.exports.requireAuth = async (req, res, next) => {
  try {
    if(req.headers.authorization){
      const token = req.headers.authorization.split(' ')[1];

      const user = await User.findOne({
        token: token,
        deleted: false
      }).select('-password -token');

      if(!user){
        res.json({
          code: 400,
          message: "Token không hợp lệ"
        });
      } else {
        res.locals.user = user;
        next();
      }
    } else {
      res.json({
        code: 400,
        message: "Vui lòng gửi thêm token"
      });
    }
  } catch (error) {
    res.json(error);
  }
}