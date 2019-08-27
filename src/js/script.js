/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  class Product{
    constructor(id, data){
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.initAcordion();

      console.log('thisProduct' , thisProduct);
    }

    renderInMenu(){
      const thisProduct = this;

      /* generate HTML based on template */
      const generatedHTML = templates.menuProduct(thisProduct.data);

      /* create element using utilis.createElementFromHTML */
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);

      /* find menu container */
      const menuContainer = document.querySelector(select.containerOf.menu0);

      /* add element to menu */
      menuContainer.appendChild(thisProduct.element);
    }

    initAcordion(){
      const thisProduct = this;

    /* find the clickable trigger (the element should react to clicking ) */
    const trigger = thisProduct.querySelector('select.menuProduct.clickable');
    document.getElementById("myBtn").onclick = displayDate;  // Czy to jest ten drugi człon tego kodu?

    /* START: click event listener to trigger */
    const buttonClicked = thisProduct.querySelector(select.menuProduct.clickable);
    buttonClicked.addEventListener('click' , function(event){
      console.log('clicked');

      /* prevent default */
      event.preventDefault();

      /* toogle active class on element of thisProduct */
      thisProduct.element.classList.toogle('active');

      /* find all active product */
      const activeProdcuts = document.querySelectorAll('article.product.acitve');

      /* START LOOP: for each active product */
      for(let active of activeProdcuts){

        /* START if the active product isn't the element of thisProduct */
        if(thisProduct.element != ".active");

        /*  remove class active for the active product */
        acitve.classList.remove('active');

        /* END: if the active product isn't the element of thisProduct */
       if (thisProduct.element != ".active")
          break;
        /* END LOOP: for each active product */
        }

    /* END click event listener to trigger */
    });
    }
  }


  const app = {
    initMenu: function(){
      const thisApp = this;
      console.log('thisApp.data' , thisApp.data);

      for(let productData in thisApp.data.product){
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    initData: function(){
      const thisApp = this;

      thisApp.data = dataSource;
    },

    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
    },
  };

  app.init();
}
