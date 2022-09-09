const multer = require('multer');
const sendMail = require('../utils/sendMail');
const User = require('../models/userModel');
const factory = require('./factoryController');
exports.createUser = factory.createOne(User);
exports.getUser = factory.getOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.getAllUser = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
//user-id-14021804
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/images/users')
    },
    filename: function(req, file, cb){
        const ext = file.mimetype.split('/')[1];
        const time = new Date().getTime();
        cb(null, `user-${req.user._id}-${time}.${ext}`);
    }
});
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppError('Not an image! Please upload only images', 400), false);
    }
}
exports.uploadUserPhoto = multer({storage: storage, fileFilter: multerFilter}).single('photo');
exports.updateMe = async (req, res, next)=>{
    if(req.file){
        await User.findByIdAndUpdate(req.user._id, {
            name: req.body.name,
            photo: req.file.filename,
            email: req.body.gmail,
            phone:req.body.phone
        })
    }
    else {
        await User.findByIdAndUpdate(req.user._id, {
            name: req.body.name,
            email: req.body.gmail,
            phone:req.body.phone
        })
    }
    if(req.body.isSendMail == 'true'){
        const url = `${req.protocol}://${req.get('host')}/me`;
        await sendMail({user: req.user, subject: 'Change information your account', text: 'You have change information in bettaso website. Please confirm a changes!', template: 'welcome', url });
    }
    res.status(200).json({
        status: 'success',
        message: "Upload success full"
    })
}
