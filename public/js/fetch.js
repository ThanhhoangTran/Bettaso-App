import axios from 'axios';
import {showAlert} from './notify'
export const fetchData = async(url, data, method, control, handle)=>{
    try {
        const res = await axios({
            url,
            data,
            method
        });
        if(res.data.status== 'success'){
            control(res);
        }
    }
    catch(error){
        handle(error);
    }
}