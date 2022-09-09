import axios from 'axios';
import {showAlert} from './notify'
export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/users/login',
      data: {
        email,
        password,
      },
      withCredentials: true,
    });
    if (res.data.status == 'success') {
    showAlert('success', 'You have loggin successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async ()=>{
  try {
    const res = await axios({
      url: '/api/users/logout',
      method: 'GET',
    });
    if(res.data.status == 'success'){
      location.reload(true);
      location.assign('/');
    }
  }
  catch(error){
    showAlert('error', error.response.data.message);
  }
}