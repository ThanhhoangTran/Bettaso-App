import axios from 'axios';
import { showAlert } from './notify';
const stripe = Stripe('pk_test_51LPRMzJd69UbnP03qwhwOY0Bnf7mauj1Ifu8VR2XZqBiwVB2dLJtPlWTJxiuRiDmuSPAtB3YVw4si77rWABwnJmQ00FAIa5aiT')

export const bookCart = async (carts, discount, shipping)=>{
    try {
        let session;
        if(discount){
            session = await axios({
                url: `/api/bookings/checkout`,
                method: 'POST',
                data: {
                    carts,
                    discount,
                    shipping
                }
            })
        }
        else {
            session = await axios({
                url: `/api/bookings/checkout`,
                method: 'POST',
                data: {
                    carts,
                    shipping
                }
            })

        }
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id,
        });
    }
    catch(error){
        showAlert('error', error.response.data.message);
    }
}
