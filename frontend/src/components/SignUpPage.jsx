import './NavBar'
import './LoginPage.css'
import { React, useState } from "react";
import axios from "../Api";
import { useNavigate } from "react-router-dom";

const SignUpPage = ()=>{
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleSignUp(e) {
    e.preventDefault(); //Prevent Reloading
    axios.post("/signup", {
      email: email,
      password: password,
    }, {withCredentials: true})
    .then((response) => {
      if (response.status === 200) {
        navigate("/");
      }
    })
    .catch((err) => {
        alert("Please Try Again!");
    });
  }
  return (
    <>
      <div className="center">
        <h1>Sign Up</h1>
        <form method="post">
          <div className="txt_field">
            <input
              type="text"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            ></input>

            <label>Email</label>
          </div>
          <div className="txt_field">
            <input
              type="password"
              required
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            ></input>

            <label>Password</label>
          </div>
          <div className="txt_field">
            <input
              id='confirm-password'
              type="password"
              required
              onChange={(e) => {
                document.getElementById('confirm-password').style.color = 'black';
                if (e.target.value !== password) {
                  document.getElementById('confirm-password').style.color = 'red';
                }
              }}
            ></input>

            <label>Confirm Password</label>
          </div>
          <button onClick={handleSignUp}>Submit</button>
          <div className="signup_link">
            Already signed up? <a href="/login">Login</a>
          </div>
        </form>
      </div>
    </>
  );
}

export default SignUpPage;
