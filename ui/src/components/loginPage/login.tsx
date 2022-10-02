import "./login.css";
import React, { FormEvent, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators, State } from "../../state";
import { bindActionCreators } from "redux";

export const Login = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const { loginUser, logoutUser, signupUser } = bindActionCreators(
    actionCreators,
    dispatch
  );

  const currentUser = useSelector((state: State) => state.user);

  const loginMessage = () => {
    if (errorMsg !== "") {
      return <span className={"message error"}>{errorMsg}</span>;
    } else if (infoMsg !== "") {
      return <span className={"message success"}>{infoMsg}</span>;
    }
  };

  const handleSignIn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setInfoMsg("Success");
        setErrorMsg("");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        setErrorMsg(error.message);
        setInfoMsg("");
        // ..
      });
  };

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        loginUser(userCredential.user);
        setInfoMsg("Log in successfully");
        setErrorMsg("");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMsg(error.message);
        
        setInfoMsg("");
      });
  };

  return (
    <div className={"login"}>
      <form onSubmit={handleLogin}>
        <input
          type={"email"}
          placeholder={"email"}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type={"password"}
          placeholder={"password"}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type={"submit"}>Login</button>
        {loginMessage()}
      </form>
      <h1>{currentUser?.email}</h1>
    </div>
  );
};

// admin@gmail.com admin123
