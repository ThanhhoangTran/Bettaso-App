
import {login, logout} from './login';
import {showPassword, smoothScroll} from './animation'
import {fetchData} from './fetch';
import {loadGallery} from './store'
import {bookCart} from './stripe'
import {showAlert} from './notify';
// import './chat'
let loginForm = document.querySelector('.form--login');
let btnLogout = document.querySelector('.btn-logout');
let store_gallerys = document.querySelectorAll('.recommend__gellery li');
let formComment = document.querySelector('.blog_detail_form');
let sumViewCart = document.querySelector('.view-cart span');
let local = JSON.parse(localStorage.getItem('cards')) || [];
let viewCart = document.querySelector('.cart');
let cartFinal= document.querySelector('.cart_final');
let cartTotal = document.querySelector('.cart_final-total');
let bookNow = document.querySelector('.book-now');
let mePage = document.querySelector('.me');
sumViewCart.textContent = local.length;
$(window).on("load",function(){
     $(".loader-wrapper").fadeOut("slow");
    $("body").addClass("loaded");
});
// window.addEventListener('load', function(e){
//     document.querySelector('.loader-wrapper').classList.add('fadeOut');
//     document.body.classList.add('loaded');
// })
if(bookNow){
    bookNow.addEventListener('click', function(e){
        e.preventDefault();
        smoothScroll('.recommend', 2000);
    });
}
if(loginForm){
    loginForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        let email = document.querySelector('.form--login #email').value;
        let password = document.querySelector('.form--login #password').value;
        login(email, password);
    })
    showPassword('#password', '.eye-open', '.eye-close');
}
if(btnLogout){
    btnLogout.addEventListener('click', function(e){
        logout();
    });
}
if(formComment) {
    let to;
    let comment = document.querySelector('#comment');
    document.querySelectorAll('.comment_box a').forEach(el=>{
        el.addEventListener('click', function(e){
            to = e.target.dataset.replies;
            let name = e.target.closest('.comment_box').querySelector('h4').textContent;
            comment.focus();
            comment.value = `@${name} `;
        })
    })
    formComment.addEventListener('submit', function(e){
        e.preventDefault();
        let post = formComment.dataset.post;
        let data = {
            comment: comment.value,
            to
        }
        fetchData(`/api/posts/${post}/comments`, data, "POST", ()=>{
            location.reload();
        });
    })
}
if(store_gallerys){
    loadGallery();
    let span = document.querySelector('.represent');
    let list_icon = document.querySelector('.list-icon');
    if(list_icon){
        list_icon.addEventListener('click', function(e){
            document.querySelector('.recommend__gellery ul').classList.toggle('hidden');
        });
    }
    store_gallerys.forEach(item=>{
        item.addEventListener('click', function(e){
            for(let i = 0; i<store_gallerys.length; i++){
                store_gallerys[i].classList.remove('active');
            }
            this.classList.add('active');
            span.textContent = this.textContent;
            const data = this.dataset.gallery;
            loadGallery(data);
        })
    })
}

let alert = document.querySelector('body').dataset.alert;
if (alert) {
  console.log(alert);
  showAlert('success', alert, 7000);
}
   
let orderButtons = document.querySelectorAll('.recommend_box-item_header button');
if(orderButtons){
    orderButtons.forEach(el=>{
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
    })
}
const updateCart = ()=>{
    local.forEach(el=>{
        el.number = el.number || 1;
        let tr = `
        <tr data-item='${JSON.stringify(el)}'>
            <td>
                <a class="remove-item"><i class="fa-solid fa-trash-can"></i></a>    
            </td>
            <td class="table-image">
                <img src="/images/foods/${el.images[0]}" />
            </td>
            <td class="control-mobile">
                <a href="" class="item-name">${el.name}</a>
                $<span class="price">${el.price}</span>
                <div>
                    <button class="decrease">-</button>
                    <input class="quantity-number" value="${el.number}" type="text"/>
                    <button class="increase">+</button>
                </div>
            </td>
            <td>
                <a href="" class="item-name">${el.name}</a>
            </td>
            <td>
                $<span class="price">${el.price}</span>
            </td>
            <td>
                <button class="decrease">-</button>
                <input class="quantity-number" value="${el.number}" type="text"/>
                <button class="increase">+</button>
            </td>
            <td>
                $<span class="price-total">${el.number ? (el.number * el.price).toFixed(2): el.price}</span>
            </td>
        </tr>
        `
        viewCart.querySelector('.table_heading').insertAdjacentHTML('afterend', tr)
    })
    sumViewCart.textContent = local.length;
}
if(viewCart){
    let discountFinal = document.querySelector('.cart_final-discount');
    let final = document.querySelector('.cart_final-final');
    let applyCoupon = document.querySelector('.apply_btn');
    updateCart();
    function updateTotal(){
        let total = local.reduce((pre, cur)=>{
            return pre + cur.number * cur.price;
        }, 0).toFixed(2);
        cartTotal.textContent = total;
        final.textContent = (+total - +discountFinal.textContent).toFixed(2)
    };
    updateTotal();
    viewCart.querySelectorAll('.remove-item').forEach(el=>{
        el.addEventListener('click', function(e){
            e.target.closest('tr').remove();
        });
    });
    viewCart.querySelectorAll('.decrease').forEach(el=>{
        el.addEventListener('click', function(e){
          let quantity = e.target.closest('tr').querySelector('.quantity-number');
          if(quantity.value!=0){
              quantity.value = quantity.value - 1;
              let price =  e.target.closest('tr').querySelector('.price');
              e.target.closest('tr').querySelector('.price-total').textContent = (quantity.value * price.textContent).toFixed(2);
          }
        })
    })
    viewCart.querySelectorAll('.increase').forEach(el=>{
        el.addEventListener('click', function(e){
            let quantity = e.target.closest('tr').querySelector('.quantity-number');
            if(quantity.value < 100){
                quantity.value = +quantity.value + 1;
                let price =  e.target.closest('tr').querySelector('.price');
                e.target.closest('tr').querySelector('.price-total').textContent = (quantity.value * price.textContent).toFixed(2);
            }
        })
    });
    viewCart.querySelector('.cart-update').addEventListener('click', function(e){
        const hideAlert = () => {
            const el = document.querySelector('.alert');
            if (el) el.parentElement.removeChild(el);
        };
        hideAlert();
        try {
            local = [];
            viewCart.querySelectorAll('.cart_list tr').forEach((el, index)=>{
                if(index != 0){
                    let data = JSON.parse(el.dataset.item);
                    data.number = +el.querySelector('.quantity-number').value;
                    local.push(data);
                }
            });
            sumViewCart.textContent = local.length;
            localStorage.setItem('cards', JSON.stringify(local));
            const markup = `<div class='alert alert--success'>Updated Cart Successfully</div>`;
            document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
            window.setTimeout(hideAlert, 2000);
        }
        catch(err){
            const markup = `<div class='alert alert--error'>Something Was Wrong When Updating Cart</div>`;
            document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
            window.setTimeout(hideAlert, 2000);
        }
        updateTotal();
    });
    viewCart.querySelector('.btn-checkout').addEventListener('click', function(e){
        if(local.length!=0){
          
                bookCart(local, discountFinal.dataset.coupon || null, {});
        }
    })
    if(applyCoupon) {
        applyCoupon.addEventListener('click',function(e){
            let inputCode = applyCoupon.closest('.cart_coupon').querySelector('input');
            fetchData(`/api/coupons/applyCoupon/${inputCode.value}`,'','GET', (res)=>{
                showAlert("success", "Apply Coupon Success");
                const coupon = res.data.data.data;
                discountFinal.textContent = (coupon.discount).toFixed(2);
                discountFinal.dataset.coupon = coupon.code;
                updateTotal();
            }, (error)=>{
                showAlert('error', error.response.data.message);
                discountFinal.textContent = 0;
            })
        })
    }
}
if(mePage){
    let changeAvatarBtn = document.querySelector('#changeAva');
    const applyChangeBtn = document.querySelector('.btn-change');
    applyChangeBtn.addEventListener('click', function(e){
        const form = new FormData();
        const name = document.querySelector('#firstname').value +' '+ document.querySelector('#lastname').value
        form.append('photo', changeAvatarBtn.files[0]);
        form.append('name', name);
        form.append('gmail', document.querySelector('#gmail').value);
        form.append('phone', document.querySelector('#phone').value);
        form.append('isSendMail', document.querySelector('#receiveEmail').checked);
        fetchData('/api/users/updateMe', form, 'POST', (res)=>{
            this.previousSibling.classList.add('me_status--success')
            if(document.querySelector('#pushNotifi').checked){
                showAlert('success', res.data.message);
            }
            window.setTimeout(()=>{
                location.reload(true);
            }, 2000)
        }, (err)=>{
            showAlert('error', err.response.data.message);
        });
    })
    changeAvatarBtn.addEventListener('change', function(e){
        this.closest('.me_right-avatar').querySelector('img').src = URL.createObjectURL(this.files[0]);
    })
}
let menu = document.querySelector('.menu');
let nav = document.querySelector('.nav');
if(menu){
    let hambuger = document.querySelector('.hambuger');
    menu.addEventListener('click', function(e){
        nav.classList.add('showMenu');
    })
    hambuger.addEventListener('click', function(e){
        nav.classList.remove('showMenu')
    })
}
if(location.href.indexOf('?payment=success')>=0){
    //remove cart=>
    localStorage.removeItem('cards');
    sumViewCart.textContent = 0;
    window.history.pushState({}, null, "/")
}