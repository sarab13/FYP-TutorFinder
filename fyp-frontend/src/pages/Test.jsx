import { useState } from "react";
 
import StripeCheckout from "react-stripe-checkout";
 
import axios from "axios";
 
 
 
function Test1() {
 

 
  const [product] = useState({
    name: "Sample Book",
    price: 120,
    description: "This is a sample book",
  });
 
  async function handleToken(token, addresses) {
    const response = await axios.post(
      "http://localhost:3000/checkout",
      { token, product }
    );
 
    console.log(response.status)
 
    if (response.status === 200) {
console.log("sucess")    } else {
      console.log("failure")
    }
  }
 
  return (
    <div className="App">
      <div className="container">
        <br />
        <br />
        <h1 className="text-center">Stripe Checkout</h1>
        <br />
        <h2 className="text-center">Product Info</h2>
        <h3 className="text-center">Product Name: {product.name}</h3>
        <h3 className="text-center">Product Price: {product.price}</h3>
        <h3 className="text-center">
          Product Description: {product.description}
        </h3>
        <br />
        <div className="form-group container">
          <StripeCheckout
            className="center"
            stripeKey="pk_test_51LPIPuIilE8N6gbW5nT5MVVlRmTOkAz2TzCorb8n6g7ejf0U74H7FJKxZ9xirGc0N0KprjzBv29NvSmhK4pEStXu00B5v7NqRb"
            token={handleToken}
            amount={product.price * 100}
            name="Sample Book"
            email="sara@gmail.com"
            //billingAddress
            //shippingAddress
          />
        </div>
      </div>
    </div>
  );
}
 
export default Test1;
 