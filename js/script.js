const API = `https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses`;

class productList{
    constructor() {
        this.products = [];
        this.init();
    }
    init() {
        this._getProducts();
    }
    _getProducts(){
        fetch(`${API}/catalogData.json`)
            .then (result => {
                console.log(result);
                return result.json ();
            })
            .then (data => {
                console.log(data);
                this.products = [...data];
                console.log(this.products);
                this.render();
            })
            .catch (error => {
            console.log(error);
        })
    }
    render() {
        let listHtml = '' ;
        this.products.forEach(product => {
            const prodItem = new productItem(product.id_product, product.product_name, product.price);
            listHtml += prodItem.render();
        });
        document.querySelector('.products' ).insertAdjacentHTML('beforeEnd', listHtml);
    }
}

class productItem {
    constructor (id_product, product_name, price) {
        this.id_product = id_product;
        this.product_name = product_name;
        this.price = price;
    }
    render() {
        return `<div class="product-item">
                    <div></div>
                    <h3> ${this.product_name} </h3>
                    <h4> ${this.price} </h4>
                    <button id=${this.id_product} class='add'>Купить</button>
                </div>` ;
    }
    renderbasket(quantity) {
        return  `<div class="basket-item">
                    <div></div>
                    <h3> ${this.product_name} </h3>
                    <h4> Cтоимость: ${this.price*quantity} </h4>
                    <h4> Количество: ${quantity} </h4>
                    <button class='remove' data-id = '${this.id_product}'>удалить</button>
                </div>`
    }
}

const list = new productList();

class basket {
    constructor() {
        this.productsid = [];
    }
    addItem(id) {
        console.log(id);
        let flag = true;
        this.productsid.forEach((element)=> {
            if (element.id == id) {
                element.quantity += 1;
                flag = false;
            };
        })
        if (flag){
            this.productsid.push({id:id, quantity:1});
        }
        console.log(this.productsid);
    }
    removeItem(id){
        let index=0;
        this.productsid.forEach((basketItem, i) => {
            if (basketItem.id == id) {
                basketItem.quantity += -1;
            }
            if (basketItem.quantity == 0) {
                index = i;
            }
        })
        delete this.productsid[index];
        this.render();
    }
    render(){
        let listHtml = '<h2> Корзина </h2>' ;
        let summa = 0;
        this.productsid.forEach(basketItem => {
            list.products.forEach(listItem => {
                if (basketItem.id == listItem.id_product) {
                    const prodItem = new productItem(listItem.id_product, listItem.product_name, listItem.price);
                    listHtml += prodItem.renderbasket(basketItem.quantity);
                    summa += listItem.price*basketItem.quantity;
                }
            })
        });
        listHtml += `<h4 class='sum'> Итого: ${summa} </h4>`
        console.log(listHtml);
        document.querySelector('.basket' ).innerHTML = listHtml;
    }
}

const bask = new basket();

document.addEventListener('click', () => {
    let ev = [...event.target.classList];
    if (ev.indexOf( 'add' ) != -1) {
        bask.addItem(event.target.id);
    }
    if (event.target.id == 'basket') {
        bask.render();
    }
    if (ev.indexOf( 'remove' ) != -1) {
        bask.removeItem(event.target.dataset.id);
    }    
});


