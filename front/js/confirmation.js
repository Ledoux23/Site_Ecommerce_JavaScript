// Get product id from url.
const queryStringId = window.location.search;
const searchParams = new URLSearchParams(queryStringId);
const confirmationId = searchParams.get("id"); 

// Display the order number.
const orderConfirmation = document.getElementById("orderId");
orderConfirmation.textContent = confirmationId;