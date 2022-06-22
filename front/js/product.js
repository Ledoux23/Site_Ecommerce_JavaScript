// Retrieve product id from url.
const queryStringId = window.location.search;
const searchParams = new URLSearchParams(queryStringId);
const targetId = searchParams.get("id");   

let productData = [];

// Retrieve details of the product whose id is in the url of the current page.
const fetchProduct = async () => {
  await fetch(`http://localhost:3000/api/products/${targetId}`)
  .then(function(res) {
      if (res.ok) {
        return res.json();
      }
  })
  .then(function(dataPromise) {
    productData = dataPromise;
  })   
};

// Display product in the product page.
const displayProduct = async () => {
  await fetchProduct();       
    const productTarget = document.querySelector(".item__img");
    let imageProduct = document.createElement("img");
    imageProduct.src = productData.imageUrl;
    imageProduct.alt = productData.altTxt;
    productTarget.appendChild(imageProduct);

    let productName = document.getElementById("title");
    productName.textContent = productData.name;

    let productPrice = document.getElementById("price");
    productPrice.textContent = productData.price;   
    
    let productDescription = document.getElementById("description");
    productDescription.textContent = productData.description;
    
    let selectProductColors = document.getElementById("colors");
    let ProductColors = productData.colors;         
    // Using the for...of loop to dynamically embed color options.
    for(let productColor of ProductColors) {   
      let optionColorSelected = document.createElement("option");
      selectProductColors.appendChild(optionColorSelected);
      optionColorSelected.textContent = `${productColor}`;
      optionColorSelected.value = `${productColor}`;
    } 
}
displayProduct();

// Save items into local storage.
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Check and recover cart/items from local storage. The value is null if there is not item.
function getCart() {
  let cart = localStorage.getItem("cart");
  if(cart == null) {
    return [];
  } else {
    return JSON.parse(cart);
  }
};

// Add products and change quantity to the cart.
function addProduct() {
  let selectColor = document.getElementById("colors");
  let selectQuantity = document.getElementById("quantity");
  if(selectColor.value != "" && selectQuantity.value >= 1 && selectQuantity.value <= 100) { // Choose a color and quantity before continuing.                     
    let product = { 
      color : `${selectColor.value}`,
      quantity : `${selectQuantity.value}`,
      id : targetId,
    };
    let cart = getCart();
    let foundProduct = cart.find(p => p.id == product.id && p.color == product.color);
    if(foundProduct != undefined) {
      let productQuantity = parseInt(foundProduct.quantity) + parseInt(product.quantity);
      if(productQuantity >= 1 && productQuantity <= 100) { // Only accept numbers in the range 1 to 100.
        foundProduct.quantity = productQuantity; 
      } else {
        alert("Vous pouvez seulement choisir entre 1 et 100 produits !");
      };
    } else {
      cart.push(product);
    }
    saveCart(cart);
  } else { 
    alert("Veuillez choisir une couleur et une quantité comprise entre 1 et 100 !");
  }
};

// An addEventListener event function to add and save elements to the local storage.           
const buttonToCart = document.getElementById("addToCart"); 
addToCart.addEventListener("click", () => {
  addProduct();
  let selectColor = document.getElementById("colors");
  let selectQuantity = document.getElementById("quantity");
  selectColor.value = "";
  selectQuantity.value = 0;
});
