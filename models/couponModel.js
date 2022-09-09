const mongoose = require('mongoose');
const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    discount: {
        type: Number,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now()
    },
    startDate: Date,
    endDate: {
        type: Date,
        validate: {
            validator: function(val){
                return val.getTime() > this.startDate.getTime();
            },
            message: 'End day of discount code must be greater than the start date'
        }
    },
    limits: {
        type: Number,
        default: 10,
        min: 0
    }
});
const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;