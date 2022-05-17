//Catch data I need from the api.
fetch("http://localhost:3000/api/products")
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
//Using a URLSearchParams object in a for...of structure to display the selected product.  
  .then(function(data) {
    const queryStringId = window.location.search;
    const searchParams = new URLSearchParams(queryStringId);
    const targetId = searchParams.get("id");   

    for (let product of data) {
  
        if(targetId === product._id) {
            
            const productTarget = document.querySelector(".item__img");
            let imageProduct = document.createElement("img");
            imageProduct.src = product.imageUrl;
            imageProduct.alt = product.altTxt;
            productTarget.appendChild(imageProduct);

            let productName = document.getElementById("title");
            productName.textContent = product.name;

            let productPrice = document.getElementById("price");
            productPrice.textContent = product.price;   
            
            let productDescription = document.getElementById("description");
            productDescription.textContent = product.description;
            
            let selectProductColors = document.getElementById("colors");
            let allProductColors = product.colors;         
// Using the for...of loop to dynamically embed color options.
            for(let productColor of allProductColors) {   
              let optionColorSelected = document.createElement("option");
              selectProductColors.appendChild(optionColorSelected);
              optionColorSelected.textContent = `${productColor}`;
              optionColorSelected.value = `${productColor}`;
            }
        } 
    }
  })

  .catch(function(err) {
    // An error occured
  });
