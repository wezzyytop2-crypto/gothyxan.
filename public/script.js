async function loadProducts() {
    const params = new URLSearchParams(window.location.search);
    const gender = params.get("gender");

    const res = await fetch(`/api/products?gender=${gender}`);
    const items = await res.json();

    const grid = document.getElementById("productGrid");
    grid.innerHTML = "";

    items.forEach(item => {
        grid.innerHTML += `
          <div class="card fade-in">
              <img src="${item.image}">
              <h3>${item.name}</h3>
              <p>€${item.price}</p>
              <button onclick='addToCart(${JSON.stringify(item)})'>Add to cart</button>
          </div>
        `;
    });

    reveal();
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
}

function reveal() {
    document.querySelectorAll(".fade-in").forEach(el => {
        el.classList.add("visible");
    });
}

if (document.getElementById("productGrid")) loadProducts();
