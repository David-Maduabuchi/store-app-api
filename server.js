import express from 'express'
import bodyParser from 'body-parser';
import cors from 'cors';
import stripe from 'stripe';
import knex from 'knex'
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';

import handleSignin from './controllers/signin.js';
import handleCheckout from './controllers/checkout.js';
import handleRegister from './controllers/register.js';
import addToCart from './databaseFns/addToCart.js';
import getCartItems from './databaseFns/getCartItems.js';
import reduceQuantity from './databaseFns/reduceQuantity.js';
import deleteitem from './databaseFns/deleteCartItem.js';
import deleteAll from './databaseFns/deleteAll.js';
import addQuantity from './databaseFns/addQuantity.js';

const app = express();
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors({ origin: true, credentials: true }))

const stripeKey = stripe("sk_test_51OY4oHFpIbLv69oWgWy6ZGyP1NUI81zEisbANOl1kfJRadaSfIN1TUVs2KRarAO6jN9H2VdAmulvNcQs4LASAGir00BRTP1qqy");
const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1', //this is the same thing as home, local host 
    port: 5432,
    user: 'postgres',
    password: 'cookies',
    database: 'store-app'
  }
});


app.get("/", (req, res) => { res.send("Server is Online") })

app.post("/checkout", (req, res, next) => { handleCheckout(req, res, next, stripeKey) })

app.post("/register", (req, res) => { handleRegister(req, res, db, bcrypt, jwt) });

app.post("/signin", (req, res) => { handleSignin(req, res, db, bcrypt, jwt) })

app.post('/store-api/cart/add', (req, res) => { addToCart(req, res, db) })

app.get('/store-api/cart/:userId', (req, res) => { getCartItems(req, res, db) });

app.post('/store-api/cart/remove', (req, res) => { reduceQuantity(req, res, db) })

app.post('/store-api/cart/delete', (req, res) => { deleteitem(req, res, db) });

app.post('/store-api/cart/delete-all', (req, res) => { deleteAll(req, res, db) })

app.post('/store-api/cart/add-quantity', (req, res) => { addQuantity(req, res, db) })

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`)
})