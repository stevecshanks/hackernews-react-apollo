import React, { useState } from "react";
import { AUTH_TOKEN } from "../constants";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

function Login({ history }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [login] = useMutation(LOGIN_MUTATION);
  const [signup] = useMutation(SIGNUP_MUTATION);

  const saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token);
  };

  const buttonOnClick = async () => {
    const mutation = isLogin ? login : signup;

    const { data } = await mutation({
      variables: { email, password, name },
    });

    const { token } = isLogin ? data.login : data.signup;
    saveUserData(token);
    history.push(`/`);
  };

  return (
    <div>
      <h4 className="mv3">{isLogin ? "Login" : "Sign Up"}</h4>
      <div className="flex flex-column">
        {!isLogin && (
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            type="text"
            placeholder="Your name"
          />
        )}
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="text"
          placeholder="Your email address"
        />
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          placeholder="Choose a safe password"
        />
      </div>
      <div className="flex mt3">
        <div className="pointer mr2 button" onClick={buttonOnClick}>
          {isLogin ? "login" : "create account"}
        </div>
        <div className="pointer button" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "need to create an account?" : "already have an account?"}
        </div>
      </div>
    </div>
  );
}

export default Login;
