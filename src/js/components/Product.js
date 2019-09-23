import {select, classNames, templates} from './settings.js';
import utils from './utils.js';
import AmountWidget form './components/AmountWidget.js';


class Product {
  constructor(id, data){
    const thisProduct = this;

    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAcordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();

    console.log('thisProduct' , thisProduct);
  }

  renderInMenu(){
    const thisProduct = this;

    const generatedHTML = templates.menuProduct(thisProduct.data);
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);

    const menuContainer = document.querySelector(select.containerOf.menu);
    menuContainer.appendChild(thisProduct.element);
  }

  getElements(){
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }

  initAcordion(){
    const thisProduct = this;

    const trigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.accordionTrigger.addEventListener('click' , function(event){
      console.log('clicked');
      event.preventDefault();
      thisProduct.element.classList.toggle('active');

      const activeProdcuts = document.querySelectorAll('article.product.active');
      for(let active of activeProdcuts){
        if(active != thisProduct.element) {
          active.classList.remove('active');
        }
      }
    });
  }

  initOrderForm() {
    const thisProduct = this;

    thisProduct.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisProduct.processOrder();
    });

    for(let input of thisProduct.formInputs){
      input.addEventListener('change', function(){
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }

  processOrder() {
    const thisProduct = this;
    console.log('processOrder', thisProduct);

    const formData = utils.serializeFormToObject(thisProduct.form);
    console.log('formData' , formData);

    thisProduct.params = {};

    /* set variable price to equal thisProduct.data.price */
    let price = thisProduct.data.price;
    console.log('price:', price);

    for(let paramId in thisProduct.data.params){

      const param = thisProduct.data.params[paramId];
      console.log('Params:', param, thisProduct.data.params[paramId]);

      for (let optionId in param.options) {

        const option = param.options[optionId];
        const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;

        console.log('Przed zmiana', price);

        if (optionSelected && !option.default) {
          price = price + option.price;
        } else if (!optionSelected && option.default) {
          price = price - option.price;
        }

        const image = thisProduct.imageWrapper.querySelector('.' + paramId +'-' + optionId);

        let classActive = classNames.menuProduct.imageVisible;

        if(optionSelected){
          if(!thisProduct.params[paramId]){
            thisProduct.params[paramId] = {
              label: param.label,
              options:{}
            };
          }
          thisProduct.params[paramId].options[optionId] = option.label;
          if(image) image.classList.add(classActive);
        } else{
          if(image) image.classList.remove(classActive);
        }

      }
    }
    /* multiply price by amount*/
    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

    /* set the contents of thisProduct.priceElem to be the value of variable price */
    thisProduct.priceElem.innerHTML = thisProduct.price;
  }


  initAmountWidget(){
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function() {
      thisProduct.processOrder();
    });
  }

  addToCart(){
    const thisProduct = this;

    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;

    //app.cart.add(thisProduct);

    const event = new CustomEvent('add-to-cart' , {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });

    thisProduct.element.dispatchEvent(event);
  }

//end prodcut
}

export default Product;
