import axios from 'axios';
import { showAlert } from './notify';
let sumViewCart = document.querySelector('.view-cart span');
let local = JSON.parse(localStorage.getItem('cards')) || [];
export const loadGallery = async (type = 'bugger') => {
  try {
    const res = await axios({
      url: `/api/foods?type=${type}`,
      method: 'GET',
    });
    if (res.data.status == 'success') {
      const list = [...res.data.data.data];
      paginationShow(list, 8);
    }
  } catch (error) {
    // showAlert('error', error.response.data.message);
  }
};

export const paginationShow = (data, elNum) => {
  let table = document.querySelector('.recommend_container .recommend_box');
  const num = Math.ceil(data.length / elNum);
  let pagination = document.querySelector('.recommend_container .pagination');
  let pagi_item = document.querySelectorAll(
    '.recommend_container .pagination--item'
  );
  let box_item = table.querySelectorAll(
    '.recommend_container .recommend_box .recommend_box-item'
  );
  if (pagi_item) {
    for (let i = 0; i < pagi_item.length; i++) {
      pagi_item[i].remove();
    }
    for (let g = 0; g < box_item.length; g++) {
      box_item[g].remove();
    }
  }

  const showTable = (food) => {
    return `
        <div class="recommend_box-item" data-item='${JSON.stringify(food)}'>
            <div class="recommend_box-item_header">
                <img src='./images/foods/${food.images[0]}' alt="" />
                <button><i class="fa-solid fa-cart-plus"></i>Add To Cart</button>
            </div>
            <div class="recommend_box-item_content">
                <div>
                    <h3>${food.name}</h3>
                    <label>$${food.price}</label>
                </div>
                <p>${food.description}</p>
            </div>
        </div>
        `;
  };

  for (let i = 0; i < num; i++) {
    let item = document.createElement('li');
    item.setAttribute('class', 'pagination--item');
    item.textContent = i + 1;
    item.addEventListener('click', (e) => {
      let li = document.querySelectorAll(
        '.recommend_container .recommend_box-item'
      );
      let pagi = document.querySelectorAll(
        '.recommend_container .pagination li'
      );
      pagi.forEach((el) => el.classList.remove('active'));
      for (let z = 0; z < li.length; z++) {
        li[z].remove();
      }
      item.classList.add('active');
      let content = data
        .slice(i * elNum, (i + 1) * elNum)
        .map((el) => showTable(el))
        .join('');
      table.insertAdjacentHTML('beforeend', content);
      let recommendBottons = document.querySelectorAll(
        '.recommend_box-item button'
      );
      recommendBottons.forEach( el => {
        let value = JSON.parse(el.closest('.recommend_box-item').dataset.item);
        let icon = el.querySelector('i');
        let ordered = local.findIndex((el) => el._id == value._id);
        if (ordered >= 0) {
          icon.classList.add('fa-check');
        } else {
          icon.classList.remove('fa-check');
        }
        el.addEventListener('click', function (e) {
          if (icon.classList.contains('fa-check')) {
            icon.classList.remove('fa-check');
            local = local.filter((el) => el._id !== value._id);
          } else {
            e.target.querySelector('i').classList.add('fa-check');
            local.push(value);
          }
          localStorage.setItem('cards', JSON.stringify(local));
          sumViewCart.textContent = local.length;
        });
      });
    });
    if (i == 0) {
      item.classList.add('active');
      let content = data
        .slice(i, elNum)
        .map((el) => showTable(el))
        .join('');
      table.insertAdjacentHTML('beforeend', content);
      let recommendBottons = document.querySelectorAll(
        '.recommend_box-item button'
      );
      recommendBottons.forEach(el => {
        let value = JSON.parse(el.closest('.recommend_box-item').dataset.item);
        let icon =  el.querySelector('i');
        let ordered = local.findIndex(el=>el._id == value._id);
        if(ordered>=0){
            icon.classList.add('fa-check');
        }
        else {
            icon.classList.remove('fa-check');
        }
        el.addEventListener('click', function(e){
            if(icon.classList.contains('fa-check')){
                icon.classList.remove('fa-check');
                local = local.filter(el=>el._id !== value._id);
            }
            else {
                e.target.querySelector('i').classList.add('fa-check')
                local.push(value);
            }
            localStorage.setItem('cards', JSON.stringify(local));
            sumViewCart.textContent = local.length;
        })
      });
    }
    pagination.appendChild(item);
  }
};
