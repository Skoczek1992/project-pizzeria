import { settings, select, classNames, templates} from '../settings.js';
import utils from '../utils.js';
import CartProduct from './CartProduct.js';

class Cart{
  constructor(element){
    const thisCart = this;

    thisCart.products = [];
    thisCart.getElements(element);
    thisCart.initActions();
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    //console.log('new Cart' ,thisCart);
  }

  getElements(element){
    const thisCart = this;

    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = document.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = document.querySelector(select.cart.productList);
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);

    thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];

    for(let key of thisCart.renderTotalsKeys){
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
    }

  }

  initActions(){
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click' , function(){
      thisCart.dom.wrapper.classList.toggle(classNames.menuProduct.wrapperActive);
    });

    thisCart.dom.productList.addEventListener('updated', function(){
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function(){
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('sumbit', function(event){
      event.preventDefault();
      thisCart.sendOrder();
    });

  }//end initActions

  sendOrder(){
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.order;

    const payload = {
      address: 'test',
      totalPrice: thisCart.totalPrice,
      totalNumber: thisCart.totalNumber,
      subtotalPrice: thisCart.subtotalPrice,
      deliveryFee: thisCart.deliveryFee,
      products: [],
    };

    for(let product of thisCart.products){
      product.getData();
      return payload.products.push();
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function(response) {
        return response.json();
      })
      .then(function(parsedResponse) {
        console.log('parsedResponse', parsedResponse);
      });
  }


  add(menuProduct){
    const thisCart = this;
    console.log('adding prodcut' , menuProduct);

    const generatedHTML = templates.cartProduct(menuProduct);
    console.log('generatedHTML:', generatedHTML);

    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    console.log('generatedDOM:', generatedDOM);

    const cartContainer = document.querySelector(select.containerOf.cart);
    console.log('cartContainer', cartContainer);

    thisCart.dom.productList.appendChild(generatedDOM);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));

    thisCart.update();

  }

  update(){
    const thisCart = this;

    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;

    for(let product of thisCart.products){
      thisCart.subtotalPrice + product.price;
      thisCart.totalNumber + product.amount;
    }

    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;

    for(let key of thisCart.renderTotalsKeys){
      for(let elem of thisCart.dom[key]){
        elem.innerHTML = thisCart[key];
      }
    }

  }//end update

  remove(cartProduct){
    const thisCart = this;

    const index = thisCart.products.indexOf(cartProduct);
    thisCart.products.splice(index, 1);

    const removeDOM = cartProduct.dom.wrapper;
    removeDOM.remove();

    thisCart.update();

  }//end remove
}//end cart


export default Cart;
