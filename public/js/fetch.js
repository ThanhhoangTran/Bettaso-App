import axios from 'axios';
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