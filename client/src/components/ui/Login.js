import React from "react";
import classnames from "classnames";
import hash from "object-hash";
import { v4 as getUuid } from "uuid";
import { withRouter } from "react-router-dom";
import { EMAIL_REGEX } from "../../utils/helpers";
import orderBy from "lodash/orderBy";
import axios from "axios";
import actions from "../../store/actions";
import { connect } from "react-redux";

class Login extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         isDisplayingInputs: false,
         emailError: "",
         passwordError: "",
         hasEmailError: false,
         hasPasswordError: false,
      };
   }

   showInputs() {
      this.setState({
         isDisplayingInputs: true,
      });
   }
   async setEmailState(emailInput) {
      const lowerCasedEmailInput = emailInput.toLowerCase();

      if (emailInput === "") {
         this.setState({
            emailError: "Please enter your email address.",
            hasEmailError: true,
         });
      } else if (EMAIL_REGEX.test(lowerCasedEmailInput) === false) {
         this.setState({
            emailError: "Please enter a valid email address.",
            hasEmailError: true,
         });
      } else {
         this.setState({ emailError: "", hasEmailError: false });
      }
   }

   async setPasswordState(passwordInput, emailInput) {
      console.log(passwordInput);
      if (passwordInput === "") {
         this.setState({
            passwordError: "Please enter a password.",
            hasPasswordError: true,
         });
      } else {
         this.setState({ passwordError: "", hasPasswordError: false });
      }
   }

   async validateAndLoginUser() {
      const emailInput = document.getElementById("email-input").value;
      const passwordInput = document.getElementById("password-input").value;
      await this.setEmailState(emailInput);
      await this.setPasswordState(passwordInput, emailInput);
      if (
         this.state.hasEmailError === false &&
         this.state.hasPasswordError === false
      ) {
         const user = {
            id: getUuid(),
            email: emailInput,
            password: hash(passwordInput),
            createdAt: Date.now(),
         };
         console.log("created user object", user);
         axios
            .get(
               "https://raw.githubusercontent.com/Reina-git/white-bear-mpa/main/src/mock-data/user.json"
            )
            .then((res) => {
               // handle success
               const currentUser = res.data;
               console.log(currentUser);
               this.props.dispatch({
                  type: actions.UPDATE_CURRENT_USER,
                  payload: res.data,
               });
            })
            .catch((error) => {
               // handle error
               console.log(error);
            });
         this.props.history.push("/create-answer");
      }
   }

   render() {
      return (
         <div className="col-12 col-lg-5">
            <div className="card card-body-padding mt-9 d-flex justify-content-center">
               <h2>Welcome back</h2>

               <p className="mt-3">
                  Log in with your email address and password.
               </p>
               <p className="text-muted mt-3 lead">Email address</p>

               <div className="input-group mb-3 mt-2">
                  <input
                     type="text"
                     aria-label="Sizing example input"
                     className={classnames({
                        "form-control": true,
                        "mb-2": true,
                        "is-invalid": this.state.hasEmailError,
                     })}
                     aria-describedby="inputGroup-sizing-default"
                     id="email-input"
                  />
               </div>
               {this.state.hasEmailError && (
                  <p className="text-danger lead mt-2" id="email-error">
                     {this.state.emailError}
                  </p>
               )}

               <p className="text-muted mt-3 lead">Password</p>

               <div className="input-group mb-3 mt-2">
                  <input
                     type="text"
                     aria-label="Sizing example input"
                     id="password-input"
                     aria-describedby="inputGroup-sizing-default"
                     className={classnames({
                        "form-control": true,
                        "mb-2": true,
                        "is-invalid": this.state.hasPasswordError,
                     })}
                  />
               </div>

               {this.state.passwordError !== "" && (
                  <p className="lead mt-2 text-danger" id="password-error">
                     {this.state.passwordError}
                  </p>
               )}

               <button
                  to="/create-answer"
                  className="btn btn-success btn-block mt-5"
                  id="letsGoButton"
                  onClick={() => {
                     this.validateAndLoginUser();
                  }}
               >
                  Login
               </button>
            </div>
         </div>
      );
   }
}

function mapStateToProps(state) {
   return {};
}
export default withRouter(connect(mapStateToProps)(Login));
