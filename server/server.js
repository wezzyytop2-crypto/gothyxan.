const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const stripe = require("stripe")("YOUR_STRIPE_SECRET_KEY");

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use("/admin", express.static(path.join(__dirname, "../admin")));

// DB
const dbFile = path.join(__dirname, "db.sqlite");
const db = new sqlite3.Database(dbFile);
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price REAL,
        gender TEXT,
        category TEXT,
        image TEXT
    )`);
});

// Get products
app.get("/api/products", (req,res)=>{
    const gender = req.query.gender;
    db.all("SELECT * FROM products WHERE gender=?",[gender], (err, rows)=>{
        if(err) return res.json([]);
        res.json(rows);
    });
});

// Add product (admin)
app.post("/api/admin/add-product", (req,res)=>{
    const {name, price, gender, category, image} = req.body;
    db.run("INSERT INTO products (name, price, gender, category, image) VALUES (?, ?, ?, ?, ?)",
        [name, price, gender, category, image], function(err){
            if(err) return res.json({success:false});
            res.json({success:true});
        });
});

// Payment (Stripe checkout)
app.post("/api/pay", async (req,res)=>{
    const cart = req.body.cart || [];
    const line_items = cart.map(item=>({
        price_data: {
            currency: "eur",
            product_data: { name: item.name },
            unit_amount: Math.round(item.price*100)
        },
        quantity: 1
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/success.html`,
        cancel_url: `${req.protocol}://${req.get('host')}/cart.html`,
    });

    res.json({ url: session.url });
});

app.listen(3000, ()=>console.log("Server running on http://localhost:3000"));
