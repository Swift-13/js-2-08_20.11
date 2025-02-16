//сыылка на картинку для корзины
const cartImage = 'https://placehold.it/100x80'

//каталог
class Product {
    constructor (product) {
        this.title = product.title
        this.id = product.id
        this.img = product.img
        this.price = product.price
    }
    render () {
        return `<div class="product-item" data-id="${this.id}">
                    <img src="${this.img}" alt="Some img">
                    <div class="desc">
                        <h3>${this.title}</h3>
                        <p>${this.price} ₽</p>
                        <button class="buy-btn" 
                        data-id="${this.id}"
                        data-title="${this.title}"
                        data-image="${this.img}"
                        data-price="${this.price}">Купить</button>
                    </div>
                </div>`
    }
}

class Products {
    constructor (block) {
        this.products = []
        this.block = `.${block}`
        this._init ()
    }
    _init () {
        const url_users ='https://raw.githubusercontent.com/Legrank/js-2-08_20.11/master/students/Dmitriy%20Brizhak/project/jsonDATA/catalogData.json'
        fetch (url_users)
            .then (d => d.json())
            .then (d => this.products = d.map( item => new Product (item)))
            .then (() => this.render ())
        
    }
    render () {
        document.querySelector (this.block).innerHTML = this.products.map(item => item.render ()).join('') 
    }
}

//корзина
class CartItem {
    constructor (product,cartImage) {
        this.title= product.dataset ['title'],
        this.id= +product.dataset['id'],
        this.img= cartImage,
        this.price= +product.dataset['price'],
        this.quantity= 1
    }
    productPrice () {
        return this.quantity * this.price
    }
    render () {
        return `<div class="cart-item" data-id="${this.id}">
            <div class="product-bio">
                <img src="${this.img}" alt="Some image">
                <div class="product-desc">
                    <p class="product-title">${this.title}</p>
                    <p class="product-quantity">Quantity: ${this.quantity}</p>
                    <p class="product-single-price">₽${this.price} each</p>
                </div>
            </div>
            <div class="right-block">
                <p class="product-price">${this.productPrice ()}</p>
                <button class="del-btn" data-id="${this.id}">&times;</button>
            </div>
        </div>`
    }
}

class Cart {
    constructor (block) {
        this.userCart = []
        this.block = `.${block}`
    }
    addProduct (product) {
        let find = this.userCart.find (element => element.id === +product.dataset['id'])
        if (!find) {    
            this.userCart.push (new CartItem(product,cartImage))
        }  else {
            find.quantity++
        }
        this.render ()
    }
    removeProduct (product) {
        let findID =  this.userCart.findIndex(element => element.id === +product.dataset['id'])
        if (this.userCart[findID].quantity > 1) {
            this.userCart[findID].quantity--
        } else {
            this.userCart.splice(findID, 1)          
            //document.querySelector(`.cart-item[data-id="${productId}"]`).remove()
        }
        this.render ()
    }
    render () {
        document.querySelector (this.block).innerHTML = this.userCart.map(item => item.render ()).join('') 
    }
}

const catalog = new Products ('products')
const cart = new Cart (`cart-block`)

//кнопка скрытия и показа корзины
document.querySelector('.btn-cart').addEventListener('click', () => {
    document.querySelector('.cart-block').classList.toggle('invisible');
});
//кнопки удаления товара (добавляется один раз)
document.querySelector('.cart-block').addEventListener ('click', (evt) => {
    if (evt.target.classList.contains ('del-btn')) {
        cart.removeProduct (evt.target);
    }
})
//кнопки покупки товара (добавляется один раз)
document.querySelector('.products').addEventListener ('click', (evt) => {
    if (evt.target.classList.contains ('buy-btn')) {
        cart.addProduct (evt.target);
    }
})
