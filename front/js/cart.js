// Get cart of products from local storage.
let getCart = JSON.parse(localStorage.getItem("cart"));
let price, imageUrl, altTxt, heading;     // Simplified syntax for creating variables (with null value).
let cartDetails = [];

// Get data from API to complete product details to display.
const fetchCart = async () => {
    if(getCart == null) {
        alert("Merci d'ajouter au moins un produit dans le panier !");
    } else {
        for(let product of getCart) {
            await fetch(`http://localhost:3000/api/products/${product.id}`)
            .then(function(res) {
                if (res.ok) {
                    return res.json();
                }
            })
            .then(function(data) {             // Retrieves values ​​in the variables declared above;    
                price = data.price;
                imageUrl = data.imageUrl;
                altTxt = data.altTxt;
                heading = data.name;
            })
            product.price = price;          // Modification of the object with addition of new elements (objectName.keyElt = valueElt).
            product.imageUrl = imageUrl;
            product.altTxt = altTxt;
            product.name = heading;
            cartDetails.push(product);      // Push the result into the empty array created at the beginning.
        } 
    };
};

// Display of products present in the cart.
const displayProducts = async () => {

    await fetchCart();
    
    let displayCart = document.getElementById("cart__items");   // Get the cart display tag from the DOM.

    for(let product of cartDetails) {  

        let productDisplay = document.createElement("article");
        productDisplay.classList.add("cart__item");
        productDisplay.setAttribute("data-id",`${product.id}`);
        productDisplay.setAttribute("data-color",`${product.color}`);
        displayCart.appendChild(productDisplay); 
            
        let productItemImage = document.createElement("div");
        productItemImage.classList.add("cart__item__img");
        productDisplay.appendChild(productItemImage);

        let productImage = document.createElement("img");
        productImage.src = `${product.imageUrl}`; 
        productImage.alt = `${product.altTxt}`;     
        productItemImage.appendChild(productImage);

        let productItemContent = document.createElement("div");
        productItemContent.classList.add("cart__item__content");
        productDisplay.appendChild(productItemContent);
    
        let productItemDescription = document.createElement("div");
        productItemDescription.classList.add("cart__item__content__description");
        productItemContent.appendChild(productItemDescription);
    
        let productName = document.createElement("h2");
        productItemDescription.appendChild(productName);
        productName.textContent = `${product.name}`;  
    
        let productColor = document.createElement("p");
        productItemDescription.appendChild(productColor);
        productColor.textContent = `${product.color}`;   
    
        let productPrice = document.createElement("p");
        productItemDescription.appendChild(productPrice);
        productPrice.textContent = `${product.price} €`;  

        let productItemSettings = document.createElement("div");
        productItemSettings.classList.add("cart__item__content__settings");
        productItemContent.appendChild(productItemSettings);

        let productItemQuantity = document.createElement("div");
        productItemQuantity.classList.add("cart__item__content__settings__quantity");
        productItemSettings.appendChild(productItemQuantity);
    
        let quantities = document.createElement("p");
        productItemQuantity.appendChild(quantities);
        quantities.textContent = `${product.quantity}`;
    
        let productInput = document.createElement("input");      
        productInput.classList.add("itemQuantity");  
        productInput.setAttribute("type", "number");
        productInput.setAttribute("name", "itemQuantity");
        productInput.setAttribute("value", `${productInput.value}`);
        productInput.setAttribute("min", "1");
        productInput.setAttribute("max", "100");
        productItemQuantity.appendChild(productInput);    
        
        let deleteItemProduct = document.createElement("div");
        deleteItemProduct.classList.add("cart__item__content__settings__delete");
        productItemSettings.appendChild(deleteItemProduct);
    
        let deleteProduct = document.createElement("p");  
        deleteItemProduct.appendChild(deleteProduct);
        deleteProduct.classList.add("deleteItem");
        deleteProduct.textContent = "Supprimer";
    };
    modifyQuantity();
    deleteProduct();
};

// Calculation of the total number of products.
const totalQuantity = async () => {
    await displayProducts();
    let totalNumber = document.getElementById("totalQuantity");
    let number = 0;
    for(let product of cartDetails) {
      number += parseInt(product.quantity);
    }
    totalNumber.textContent = number;
};

// Calculation of the total price of the products.
const totalPrice = async () => {
    await totalQuantity();
    let getTotalPrice = document.getElementById("totalPrice");
    let total = 0;
    for(let product of cartDetails) {
      total += product.quantity * product.price;
    }
    getTotalPrice.textContent = total;
};
totalPrice();

// Modify the quantity of products.
function modifyQuantity() {

    let newQuantity = document.querySelectorAll(".itemQuantity");

    for (let i = 0; i < newQuantity.length; i++){
        newQuantity[i].addEventListener("change", (e) => {  //Select element to modify according to its id and its color.
            e.preventDefault();
            if(newQuantity[i].value <= 0 || newQuantity[i].value > 100) { // Don't allow numbers outside the range 1-100.
                alert("Saissez un chiffre compris entre 1 et 100 !")
            } else if(newQuantity[i].value >= 1 || newQuantity[i].value <= 100) {
                // let displayQuantity = getCart[i].quantity; 
                let productColor = getCart[i].color;
                let productId = getCart[i].id;
                let newQuantityValue = newQuantity[i].valueAsNumber;
                let displayQuantity = newQuantity[i].previousElementSibling;
                const foundProduct = getCart.find(p => p.color == productColor && p.id == productId);
                foundProduct.quantity = newQuantityValue; // The value of the new quantity is assigned to the one in the local storage.
                displayQuantity.textContent = newQuantityValue; // The value of the new quantity entered is assigned to the displayed quantity.
                // Hide some items like price to avoid keeping them in local storage.
                for(let product of getCart) {
                    delete product.price;
                    delete product.imageUrl;
                    delete product.altTxt;
                    delete product.heading;
                };
            };
            saveCart();
        });
    }; 
};

// Deleting products from the cart.
function deleteProduct() {
    let deleteButton = document.querySelectorAll(".deleteItem");
    for (let j = 0; j < deleteButton.length; j++){
        deleteButton[j].addEventListener("click", (e) => { //Select element to delete according to its id and its color.
            e.preventDefault();            
            let idToDelete = getCart[j].id;
            let colorToDelete = getCart[j].color;
            getCart = getCart.filter(p => p.id !== idToDelete || p.color !== colorToDelete);
            // Hide some items like price to avoid keeping them in local storage.
            for(let product of getCart) {
                delete product.price;
                delete product.imageUrl;
                delete product.altTxt;
                delete product.heading;
            };
            saveCart();
            alert("Produit supprimé du panier !");
            location.reload();
        })
    }
};

// Save items with new quantities into local storage.
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(getCart));
}; 

// Retrieves various input fields to verify user data compliance.
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const address = document.getElementById("address");
const city = document.getElementById("city");
const email = document.getElementById("email");
let valueFirstName, valueLastName, valueAddress, valueCity, valueEmail; 

// Retrieve and analyze the first name entered by the user in the form. Display an error message if necessary.
firstName.addEventListener("input", function(e) {
    valueFirstName;
    if(e.target.value.length == 0) { 
        firstNameErrorMsg.innerHTML = ""; 
        valueFirstName = null;                        
    } else if (e.target.value.length < 2 || e.target.value.length > 30) {
        firstNameErrorMsg.innerHTML = "Prénom doit contenir entre 2 et 30 caractères !";
        valueFirstName = null;                     
    }                                              
    if(e.target.value.match(/^[a-z A-Z]{2,30}$/)) {
        firstNameErrorMsg.innerHTML = ""; 
        valueFirstName = e.target.value;
    }
    if(!e.target.value.match(/^[a-z A-Z]{2,30}$/) && e.target.value.length >= 2 && e.target.value.length <= 30) { 
        firstNameErrorMsg.innerHTML = "Prénom n'admet pas de caractère spécial, d'accent ou de chiffre !"; 
        valueFirstName = null;
    }
});

// Retrieve and analyze the last name entered by the user in the form. Display an error message if necessary.
lastName.addEventListener("input", function(e) {
    valueLastName;
    if(e.target.value.length == 0) {
        lastNameErrorMsg.innerHTML = ""; 
        valueLastName = null;                         
    } else if (e.target.value.length < 2 || e.target.value.length > 30) { 
        lastNameErrorMsg.innerHTML = "Nom doit contenir entre 2 et 30 caractères !"; 
        valueLastName = null;
    }                                              
    if(e.target.value.match(/^[a-z A-Z]{2,30}$/)) {
        lastNameErrorMsg.innerHTML = "";   
        valueLastName = e.target.value;
    }
    if(!e.target.value.match(/^[a-z A-Z]{2,30}$/) && e.target.value.length >= 2 && e.target.value.length <= 30) { 
        lastNameErrorMsg.innerHTML = "Nom n'admet pas de caractère spécial, d'accent ou de chiffre !"; 
        valueLastName = null;
    }
});

// Retrieve and analyze the address entered by the user in the form. Display an error message if necessary.
address.addEventListener("input", function(e) {
    valueAddress;
    if(e.target.value.length == 0) {
        addressErrorMsg.innerHTML = ""; 
        valueAddress = null;                        
    } else if (e.target.value.length < 3 || e.target.value.length > 30) { 
        addressErrorMsg.innerHTML = "Adresse doit contenir entre 3 et 30 caractères !";
        valueAddress = null;
    }                                              
    if(e.target.value.match(/^[0-9]{1,3} [a-z A-Z]{3,30}$/)) {
        addressErrorMsg.innerHTML = "";
        valueAddress = e.target.value;
    }
    if(!e.target.value.match(/^[0-9]{1,3} [a-z A-Z]{3,30}$/) && e.target.value.length >= 3 && e.target.value.length <= 30) { 
        addressErrorMsg.innerHTML = "Adresse commence par un à trois chiffres suivis d'un espace et des lettres, et n'admet pas de caractère spécial ou d'accent !"; 
        valueAddress = null;
    }
});

// Retrieve and parse the city name entered by the user in the form. Display an error message if necessary.
city.addEventListener("input", function(e) {
    valueCity;
    if(e.target.value.length == 0) {
        cityErrorMsg.innerHTML = ""; 
        valueCity = null;                        
    } else if (e.target.value.length < 3 || e.target.value.length > 25) { 
        cityErrorMsg.innerHTML = "Ville doit contenir entre 3 et 25 caractères !";
        valueCity = null;
    }                                              
    if(e.target.value.match(/^[a-z A-Z]{3,25}$/)) {
        cityErrorMsg.innerHTML = "";
        valueCity = e.target.value;
    }
    if(!e.target.value.match(/^[a-z A-Z]{3,25}$/) && e.target.value.length >= 3 && e.target.value.length <= 25) { 
        cityErrorMsg.innerHTML = "Ville n'admet que des lettres. Pas de chiffre, de caractère spécial ou d'accent !"; 
        valueCity = null; 
    }
});

// Retrieve and parse the email entered by the user in the form. Display an error message if necessary.
email.addEventListener("input", function(e) {
    valueEmail;
    if(e.target.value.length == 0) {  
        emailErrorMsg.innerHTML = "";
        valueEmail = null;                                                                  
    } else if(e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        emailErrorMsg.innerHTML = ""; 
        valueEmail = e.target.value; 
    }
    if(!e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) && !e.target.value.length == 0) {
        emailErrorMsg.innerHTML = "Email saisi incorrect ! Ex : masociete@yahoo.fr";
        valueEmail = null;
    }
});

// An addEventListener to save and send data to the server.
const sendOrder = document.getElementById("order");
sendOrder.addEventListener("click", (e) => {
    e.preventDefault(); 
    if(getCart == null || getCart == 0 || cartDetails == []) {   // Check if there are products in the basket before order validation.
        alert("Merci d'ajouter au moins un produit dans le panier !");
    } else {   
        const productsId = [];      // Retrieve in an array the IDs of products saved in local storage.
        let saveProducts = JSON.parse(localStorage.getItem("cart"));
        for(let product of saveProducts) {
            productsId.push(product.id);
        }
        // Create an order object (containing contact object and productsId array) to send to the server.
        const order = {
            contact : {
                firstName: valueFirstName,
                lastName: valueLastName,
                address: valueAddress,
                city: valueCity,
                email: valueEmail
            },
            products: productsId
        };
        
        // API request with POST method and order object.
        fetch("http://localhost:3000/api/products/order", {
            method: "POST",    
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(order),
        })
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(data) {
            if(data !== undefined) {
                localStorage.clear();  
                // document.location.href retrieves url of current page and assigns it that of the confirmation page + orderId returned by the server.                        
                document.location.href = "./confirmation.html?id=" + data.orderId; 
            } else {                                                                
                alert("Bien vouloir compléter tout d'abord le formulaire !")
            }
        })
        .catch(function(err) {
            alert("Une erreur est survenue :" +" "+ err);
        });
    };
});
