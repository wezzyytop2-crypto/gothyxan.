async function addProduct() {
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const gender = document.getElementById("gender").value;
    const category = document.getElementById("category").value;
    const image = document.getElementById("image").value;

    if(!name || !price || !image) {
        alert("Please fill all fields!");
        return;
    }

    const res = await fetch("/api/admin/add-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, gender, category, image })
    });

    const data = await res.json();
    if(data.success) {
        alert("Product added!");
        document.getElementById("name").value = "";
        document.getElementById("price").value = "";
        document.getElementById("image").value = "";
    } else {
        alert("Error adding product!");
    }
}
