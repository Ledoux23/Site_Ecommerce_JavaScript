// This snippet sends an HTTP GET request to the web service located at http://localhost:3000/api/products.
/* Call of the then() function to retrieve the result of the query in json format, having previously checked that the query went
 well with res.ok. This json result being also a Promise, we return it and retrieve its true value in the following then() function.*/
const displayProducts = async () => {

    await fetch("http://localhost:3000/api/products")

    .then(function(res) {
        if(res.ok) {
            return res.json();
        }
    })

    .then(function(products) {
        
        let productItems = document.getElementById("items");

        for(let product of products) {
            
            let linkProduct = document.createElement("a");
            productItems.appendChild(linkProduct);
            linkProduct.href = `./product.html/${product._id}`;
            
            linkProduct.addEventListener("click", () => {
                linkProduct.href = `./product.html?id=${product._id}`;
            })

            let cardProduct = document.createElement("article");
            linkProduct.appendChild(cardProduct);
            
            let imageProduct = document.createElement("img");
            imageProduct.src = `${product.imageUrl}`;
            imageProduct.alt = `${product.altTxt}`;
            cardProduct.appendChild(imageProduct);

            let productHeading = document.createElement("h3");
            productHeading.classList.add("productName");
            cardProduct.appendChild(productHeading);
            productHeading.textContent = `${product.name}`;

            let productText = document.createElement("p");
            productText.classList.add("productDescription");
            cardProduct.appendChild(productText);
            productText.textContent = `${product.description}`;
        }
    })

    .catch(function(err) {
        alert("Une erreur est survenue :" + err);
    });
};
displayProducts();