const factoryController = require('./factoryController');
const catchAsync = require('../utils/catchAsync');
const Coupon = require('../models/couponModel');
const AppError = require('../utils/appError');
exports.getCoupon = factoryController.getOne(Coupon);
exports.getAllCoupon = factoryController.getAll(Coupon);
exports.createCoupon = factoryController.createOne(Coupon);
exports.deleteCoupon = factoryController.deleteOne(Coupon);
exports.updateCoupon = factoryController.updateOne(Coupon);
exports.applyCoupon = catchAsync(async(req, res, next)=>{
    const coupon = await Coupon.findOne({code: req.params.code});  
    if(!coupon) {
        return next(new AppError("Can't find a coupon in database"), 400);
    }
    res.status(200).json({
        status: "success",
        data: {
            data: coupon
        }
    })
});