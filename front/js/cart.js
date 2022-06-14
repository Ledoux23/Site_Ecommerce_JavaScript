// Get cart from local storage.
let getCart = JSON.parse(localStorage.getItem("cart"));
let price;
let imageUrl;
let altTxt;
let heading;
let cartDetails = [];

// Get data from API to complete product details to display.
const fetchCart = async () => {
    if(getCart == null) {
        alert("Merci d'ajouter au moins un produit dans le panier !");  // Message d'alerte en cas de panier vide.
    } else {
        for(let product of getCart) {
            await fetch(`http://localhost:3000/api/products/${product.id}`)
            .then(function(res) {
                if (res.ok) {
                    return res.json();
                }
            })
            .then(function(data) {             // récupère les valeurs dans les variables déclarées plus haut;    
                price = data.price;
                imageUrl = data.imageUrl;
                altTxt = data.altTxt;
                heading = data.name;
            })
            product.price = price;          // modification de l'objet avec l'ajout de nouveaux éléments (nomObjet.cléElt = valeurElt).
            product.imageUrl = imageUrl;
            product.altTxt = altTxt;
            product.name = heading;
            cartDetails.push(product);      // on push le résultat dans le tableau vide créé au début.
        } 
    };
};

// Display of products in the cart.
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
        // Modify the quantity of products.
        productInput.addEventListener("change", () => {      // PB : possibilité de saisir des chiffres en dehors de 0 à 100, y compris les négatifs !  
            quantities.textContent = productInput.value;        // récupère la valeur saisie dans la valeur affichée.
            product.quantity = productInput.value;          // affecte la valeur saisie à la quantité pour l'actualiser.
            for(let p of getCart) {         // Enregistrer la quantitté modifiée dans le local storage.
                if(product.id === p.id && product.color === p.color) {
                    p.quantity = product.quantity;                      // Remplace la quantité du produit dans le local storage par la nouvelle quantité saisie.
                }                                                       // PB, le prix est également stocké dans le local storage (est-ce normal) ?
            }
            saveCart();  
        });      
        
        let deleteItemProduct = document.createElement("div");
        deleteItemProduct.classList.add("cart__item__content__settings__delete");
        productItemSettings.appendChild(deleteItemProduct);
    
        let deleteProduct = document.createElement("p");  
        deleteItemProduct.appendChild(deleteProduct);
        deleteProduct.textContent = "Supprimer";
        // Deleting products from the cart.
        let newCart = 0;                                    // Variable pour récupérer la nouvelle valeur du panier après suppression d'un élément.
        deleteProduct.addEventListener("click", () => {  
            for(let p of getCart) {  
                if(product.id === p.id) {                                   // Pour distinguer les produits ayant le même ID mais de couleurs différentes.
                    newCart = getCart.filter(p => p.color !== product.color);  
                    getCart = newCart;          // On affecte la nouvelle valeur du panier affiché à celui du local storage.          
                }
            }
            // getCart.filter(p =>  p.id !== product.id && p.color !== product.color);      // Problème : au clic sur l'élément, tous les autres du même ID 
            //     console.log(getCart);                                                    // sont supprimés, même quand ils sont de couleurs différentes.
            // getCart = newCart;          
            //     console.log(newCart);
            saveCart();                   
        })
    }
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

// Save items with new quantities into local storage.
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(getCart));
}; 

// Verification of compliance of user data.
const firstName = document.getElementById("firstName");     // Récupère les différents champs d'input.
const lastName = document.getElementById("lastName");
const address = document.getElementById("address");
const city = document.getElementById("city");
const email = document.getElementById("email");
let valueFirstName, valueLastName, valueAddress, valueCity, valueEmail; // Syntaxe simplifiée pour créer 5 variables(à valeur null à ce stade). 

// Retrieve and analyze the first name entered by the user in the form. Display an error message if necessary.
firstName.addEventListener("input", function(e) {
    valueFirstName;
    if(e.target.value.length == 0) { // la méthode target permet de cibler l'élément sur lequel l'évènement se produit.
        firstNameErrorMsg.innerHTML = ""; // On laisse vide parce que ce n'est pas encore une erreur.
        valueFirstName = null;            // S'assure que la valeur est null et qu'aucune donnée n'est conservée dans l'input.             
    } else if (e.target.value.length < 2 || e.target.value.length > 30) { // Vérifie s'il y a quand-même une valeur se trouvant hors de l'intervalle du nombre de caractères fixé dans la condition (3-25).
        firstNameErrorMsg.innerHTML = "Prénom doit contenir entre 2 et 30 caractères !"; // Message d'erreur 1.
        valueFirstName = null;                      // Notre RegExp est passé en paramètre à la méthode "match" de l'objet string.
    }                                              // ReGexp: prend les lettres miniscule et majiscule, l'espace, 2 à 30 caractères. Petit chapeau au début pour indiquer que ca commence ici.
    if(e.target.value.match(/^[a-z A-Z]{2,30}$/)) {   // Si ca match avec cette ReGexp, exécuter ce code.
        firstNameErrorMsg.innerHTML = ""; // Il n'y a pas d'erreur, c'est donc ce qu'on veut. Aussi cette façon d'utiliser l'ID et innerHTML fonctionne tout comme document.getElementById.
        valueFirstName = e.target.value;    // Puisque c'est l'effet recherchée, on récupère la valeur de l'input dans la variable.
    }
    if(!e.target.value.match(/^[a-z A-Z]{2,30}$/) && e.target.value.length >= 2 && e.target.value.length <= 30) { // "!" = différent de, donc ne doit pas matcher avec e.target.value.match(/^[a-z A-Z]{3,25}$/). 
        firstNameErrorMsg.innerHTML = "Prénom n'admet pas de caractère spécial, d'accent ou de chiffre !"; // Message d'erreur 2. 
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
        lastNameErrorMsg.innerHTML = "Nom doit contenir entre 2 et 30 caractères !"; // Message d'erreur 1.
        valueLastName = null;
    }                                              
    if(e.target.value.match(/^[a-z A-Z]{2,30}$/)) {   // Si ca match avec cette ReGexp, exécuter ce code.
        lastNameErrorMsg.innerHTML = "";    // Pas d'erreur, c'est ce qu'on veut.
        valueLastName = e.target.value;
    }
    if(!e.target.value.match(/^[a-z A-Z]{2,30}$/) && e.target.value.length >= 2 && e.target.value.length <= 30) { 
        lastNameErrorMsg.innerHTML = "Nom n'admet pas de caractère spécial, d'accent ou de chiffre !"; // Message d'erreur 2. 
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
    if(e.target.value.match(/^[0-9]{1,3} [a-z A-Z]{3,30}$/)) { // On commence par un à 3 chiffres, suivi d'un espace avant l'alphabet.
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
    if(e.target.value.match(/^[a-z A-Z]{3,25}$/)) { // On commence par un à 3 chiffres, suivi d'un espace avant l'alphabet.
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
        emailErrorMsg.innerHTML = "";                                       // Dans cette ReGex "w" est comme "word", c'est un mot.
        valueEmail = null;                                               // marche avec tout ce qu'il y a entre 2 et 4 lettres à la fin (.fr,.cm,.com, ...)                   
    } else if(e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) { // Comprendre et décrire cette RegEx pour pouvoir l'expliquer.
        emailErrorMsg.innerHTML = "";   // On est dans la bonne condition et
        valueEmail = e.target.value;    // on injecte la valeur dans la variable.
    }
    if(!e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) && !e.target.value.length == 0) { // Si différent de notre condition et le nombre de caractères différent de zéro.
        emailErrorMsg.innerHTML = "Email saisi incorrect ! Ex : masociete@yahoo.fr";
        valueEmail = null;
    }
});

// An addEventListener to save and send data to the server.
const sendOrder = document.getElementById("order");
sendOrder.addEventListener("click", (e) => {
    e.preventDefault();    
    // Récupère dans un array les ID des produits enregistrés dans local storage.
    const productsId = [];
    let saveProducts = JSON.parse(localStorage.getItem("cart"));
    for(let product of saveProducts) {
        productsId.push(product.id);
    }
    // Création d'un objet order (contenant l'objet contact et le tableau productsId) à envoyer au serveur.
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
    
    // Requête de l'API avec la méthode POST et l'objet order.
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
            localStorage.clear();   // Vide le local storage pour ne rien y conserver.                                  
            document.location.href = "./confirmation.html?id=" + data.orderId;  // document.location.href récupère l'url de la page et lui affecte
        } else {                                                                // celle de la page confirmation + orderId renvoyé par le serveur.
            alert("Bien vouloir compléter tout d'abord le formulaire !")
        }
    })
    .catch(function(err) {
        console.log(err);
        alert("Une erreur est survenue :" +" "+ err);
    });
});
