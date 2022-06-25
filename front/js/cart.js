// Get cart of products from local storage.
let getCart = JSON.parse(localStorage.getItem("cart"));

// API request to display details of selected products.
function requestApi() {
    if(getCart == null) {
        alert("Merci d'ajouter au moins un produit dans le panier !");
    } else {
        for(let product of getCart) {
            fetch(`http://localhost:3000/api/products/${product.id}`)
            .then(function(res) {
                if (res.ok) {
                    return res.json();
                }
            })
            .then(function(productApi) {  
                displayProducts(product, productApi);
                totalPrice(productApi);
            })
            .catch((err) => {
                console.log("Une erreur est survenue lors de la requête de l'api :" + err);
            });
        };
    };
};
requestApi();

// Display products present in the cart.
function displayProducts(product, productApi) {
    
    let displayCart = document.getElementById("cart__items");

    let productDisplay = document.createElement("article");
    productDisplay.classList.add("cart__item");
    productDisplay.setAttribute("data-id", product.id);
    productDisplay.setAttribute("data-color", product.color);
    displayCart.appendChild(productDisplay); 
        
    let productItemImage = document.createElement("div");
    productItemImage.classList.add("cart__item__img");
    productDisplay.appendChild(productItemImage);

    let productImage = document.createElement("img");
    productImage.src = productApi.imageUrl; 
    productImage.alt = productApi.altTxt;     
    productItemImage.appendChild(productImage);

    let productItemContent = document.createElement("div");
    productItemContent.classList.add("cart__item__content");
    productDisplay.appendChild(productItemContent);

    let productItemDescription = document.createElement("div");
    productItemDescription.classList.add("cart__item__content__description");
    productItemContent.appendChild(productItemDescription);

    let productName = document.createElement("h2");
    productItemDescription.appendChild(productName);
    productName.textContent = productApi.name;  

    let productColor = document.createElement("p");
    productItemDescription.appendChild(productColor);
    productColor.textContent = product.color;   

    let productPrice = document.createElement("p");
    productItemDescription.appendChild(productPrice);
    productPrice.textContent = productApi.price + "€";  

    let productItemSettings = document.createElement("div");
    productItemSettings.classList.add("cart__item__content__settings");
    productItemContent.appendChild(productItemSettings);

    let productItemQuantity = document.createElement("div");
    productItemQuantity.classList.add("cart__item__content__settings__quantity");
    productItemSettings.appendChild(productItemQuantity);

    let quantities = document.createElement("p");
    productItemQuantity.appendChild(quantities);
    quantities.textContent = product.quantity;

    let productInput = document.createElement("input");      
    productInput.classList.add("itemQuantity");  
    productInput.setAttribute("type", "number");
    productInput.setAttribute("name", "itemQuantity");
    productInput.setAttribute("value", productInput.value);
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

    let deleteProducts = document.getElementsByClassName("deleteItem");
    for(let product of deleteProducts) {
        product.addEventListener("click", removeProduct);
    };

    modifyQuantity(productApi);
};

// Calculation of the total number of products.
function totalQuantity() {
    let totalQuantity = document.getElementById("totalQuantity");
    let displayQuantity = 0;
    for(let product of getCart) {
        displayQuantity += parseInt(product.quantity);
    }
    totalQuantity.textContent = displayQuantity;
};
totalQuantity();

// Calculation of the total price of the products.
function totalPrice(productApi) {
    
    let totalPrice = document.getElementById("totalPrice");
    let displayAmount = 0;
    for(let product of getCart) {
        displayAmount  += product.quantity * productApi.price;
        totalPrice.textContent = displayAmount;
    };
};

// Modify the quantity of products.
function modifyQuantity(productApi) {
    
    let newQuantity = document.querySelectorAll(".itemQuantity");
    
    for (let i = 0; i < newQuantity.length; i++){

        newQuantity[i].addEventListener("mouseenter", (e) => { // Get the displayed quantity value to increment or decrement.
            e.preventDefault();
            newQuantity[i].value = newQuantity[i].previousElementSibling.textContent;
        });

        newQuantity[i].addEventListener("mouseout", (e) => { // Keep null until the element is hovered over by a pointing device (a mouse for example).
            e.preventDefault();
            newQuantity[i].value = null;
        });

        newQuantity[i].addEventListener("change", (e) => {  //Select element to modify according to its id and its color.
            e.preventDefault();  

            if(newQuantity[i].value <= 0 || newQuantity[i].value > 100) { // Don't allow numbers outside the range 1-100.
                alert("Saissez un chiffre compris entre 1 et 100 !");
            } else if(newQuantity[i].value >= 1 || newQuantity[i].value <= 100) {                
                let modifyQuantity = e.target.closest("article");
                let newQuantityValue = newQuantity[i].valueAsNumber;
                let displayQuantity = newQuantity[i].previousElementSibling;
                const foundProduct = getCart.find(product => product.id == modifyQuantity.dataset.id && product.color == modifyQuantity.dataset.color);
                foundProduct.quantity = newQuantityValue; // The value of the new quantity is assigned to the one in the local storage.
                displayQuantity.textContent = newQuantityValue; // The value of the new quantity entered is assigned to the displayed quantity.  
            };

            totalPrice(productApi);
            totalQuantity();             
            saveCart();
        });
    }; 
};



// Deleting products from the cart.
function removeProduct(e) {  
           
    let deleted = e.target.closest("article");

    getCart = getCart.filter(product => 
        product.id !== deleted.dataset.id && product.color !== deleted.dataset.color 
        || product.id == deleted.dataset.id && product.color !== deleted.dataset.color); 
    
    saveCart(); 
    totalQuantity();      
    alert("Produit retiré du panier !")
    location.reload();    
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
    if(getCart == null || getCart == 0) {   // Check if there are products in the basket before order validation.
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
            alert("Une erreur est survenue lors de la requête :" +" "+ err);
        });
    };
});
