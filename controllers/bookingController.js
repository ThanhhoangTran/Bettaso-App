const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const catchAsync = require('../utils/catchAsync');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel')
const Coupon = require('../models/couponModel');
const factory = require('./factoryController');
exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
exports.getAllBooking = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
//carts = ['id', 'id']
exports.createCheckoutSession = catchAsync(async(req, res, next)=>{
    let coupon;
    const {carts} = req.body;
    const discount = await Coupon.findOne({code: req.body.discount});
    if(discount){
      coupon = await stripe.coupons.create({amount_off: discount.discount, duration: 'once', currency: 'usd'});
    }
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        shipping_address_collection: {
            allowed_countries: ['VN'],
        },
        metadata: {
          carts: JSON.stringify(carts.map(el=>({id: el.id, quantity: el.number})))
        },
        shipping_options: [
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {
                  amount: 0,
                  currency: 'usd',
                },
                display_name: 'Free shipping',
                // Delivers between 5-7 business days
                delivery_estimate: {
                  minimum: {
                    unit: 'hour',
                    value: 1,
                  },
                  maximum: {
                    unit: 'hour',
                    value: 2
                  },
                }
              }
            },
          ],
          line_items: [...carts.map(el=>({
            name: el.name,
            images: [
                `${req.protocol}://${req.get('host')}/images/foods/${el.images[0]}`
            ],
            description: el.description,
            currency: 'usd',
            quantity: el.number,
            amount: Math.round(el.price*100),
          }))],
          mode: 'payment',
          discounts: (()=>{
            if(coupon){
              return [{
                  coupon: coupon.id,
              }]
            }
            return undefined;
          })(),
          phone_number_collection: {
            enabled: true,
          },
          client_reference_id: (()=>{
            if(discount){
              return discount.id;
            }
            return undefined;
          })(),
          customer_email: req.user.email,
          success_url: `${req.protocol}://${req.get('host')}/?payment=success`,
          cancel_url: `${req.protocol}://${req.get('host')}/cart`,
    })
    res.status(200).json({
      session
    })
});

const createOrder = async (session) => {
  const user = await User.findOne({email: session.customer_email});
  const coupon = await Coupon.findById(session.client_reference_id);
  if(coupon){
    coupon.limits = coupon.limits - 1;
    await coupon.save();
  }
  const items = JSON.parse(session.metadata.carts);
  await Booking.create({
    user: user._id,
    addressShipping: {
     line: session.customer_details.address.line1 || session.customer_details.address.line2,
     city: session.customer_details.address.city,
     country: session.customer_details.address.country,
     postal: session.customer_details.address.postal_code
    },
    infoUserReceive: {
      name: session.customer_details.name,
      phone: session.customer_details.phone
    },
    price: session.amount_total,
    foods: items.map(el=>({food: el.id, quantity: el.quantity}))
  })
}
exports.webhookCheckout = catchAsync(async (req, res, next)=>{
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = await stripe.webhooks.constructEvent(req.body, signature, process.env.ENDPOINT_WEBHOOK_KEY);
  }
  catch(err){
    return res.status(400).send(`Webhook message: ${err.message}`);
  }
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      res.locals.alert = "Payment for Cart Successfully";
      await createOrder(session);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  res.status(200).json({
    received: true,
  });
})

exports.isCheckoutSuccess = (req, res, next)=>{
  const {payment} = req.query;
  if(payment == "success"){
    req.query.alert = "checkout"
  }
  return next();
}