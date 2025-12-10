function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const container = document.getElementById("cartItems");
    container.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {
        container.innerHTML += `
        <div class="cart-item fade-in" style="margin-bottom:30px;">
            <img src="${item.image}" width="120">
            <h3>${item.name}</h3>
            <p>€${item.price}</p>
            <button onclick="removeItem(${index})">Remove</button>
        </div>
        `;
        total += Number(item.price);
    });

    document.getElementById("total").innerText = "€" + total;
}

function removeItem(i) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(i, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

async function checkout() {
    const res = await fetch("/api/pay", { method: "POST" });
    const { url } = await res.json();
    window.location.href = url;
}

loadCart();
