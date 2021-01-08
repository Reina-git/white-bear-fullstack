import React from "react";
import classnames from "classnames";
import { v4 as getUuid } from "uuid";
import jwtDecode from "jwt-decode";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import actions from "../../store/actions";

class SignUp extends React.Component {
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

   async validateAndCreateUser() {
      const emailInput = document.getElementById("sign-up-email-input").value;
      const passwordInput = document.getElementById("sign-up-password-input")
         .value;
      // create user obj
      const user = {
         id: getUuid(),
         email: emailInput,
         password: passwordInput,
         createdAt: Date.now(),
      };
      axios
         .post("/api/v1/users", user)
         .then((res) => {
            const authToken = res.data;
            localStorage.setItem("authToken", authToken);
            const user = jwtDecode(authToken);
            this.props.dispatch({
               type: actions.UPDATE_CURRENT_USER,
               payload: user,
            });
            axios.defaults.headers.common["x-auth-token"] = authToken;
            this.props.history.push("/create-answer");
         })
         .catch((err) => {
            const data = err.response.data;
            console.log(data);
            const { emailError, passwordError } = data;
            if (emailError !== "") {
               this.setState({ hasEmailError: true, emailError: emailError });
            } else {
               this.setState({ hasEmailError: false, emailError });
            }
            if (passwordError !== "") {
               this.setState({
                  hasPasswordError: true,
                  passwordError: passwordError,
               });
            } else {
               this.setState({ hasPasswordError: false, passwordError });
            }
         });
   }

   render() {
      return (
         <div className="col-12 col-lg-5">
            <div className="card card-body-padding mt-9 d-flex justify-content-center">
               <h2>Nice to meet you</h2>
               <p>Sign up for White Bear. Free forever.</p>
               <div id="sign-up-card">
                  {this.state.isDisplayingInputs && (
                     <>
                        <p className="text-success mt-3">
                           Let's get you signed up
                        </p>

                        <p className="text-muted mt-3 lead">Email address</p>

                        <div className="input-group mb-3 mt-2">
                           <input
                              type="text"
                              id="sign-up-email-input"
                              className={classnames({
                                 "form-control": true,
                                 "mb-2": true,
                                 "is-invalid": this.state.hasEmailError,
                              })}
                              aria-label="Sizing example input"
                              aria-describedby="inputGroup-sizing-default"
                           />
                        </div>

                        {this.state.hasEmailError && (
                           <p
                              className="text-danger lead mt-2"
                              id="sign-up-email-error"
                           >
                              {this.state.emailError}
                           </p>
                        )}

                        <p className="text-muted mt-3 lead">
                           Create a password
                        </p>
                        <p className="text-muted lead">
                           Must be at least 9 characters.
                        </p>
                        <div className="input-group mb-3 mt-2">
                           <input
                              type="text"
                              id="sign-up-password-input"
                              aria-label="Sizing example input"
                              aria-describedby="inputGroup-sizing-default"
                              className={classnames({
                                 "form-control": true,
                                 "mb-2": true,
                                 "is-invalid": this.state.hasPasswordError,
                              })}
                           />
                        </div>

                        {this.state.passwordError !== "" && (
                           <p
                              className="lead mt-2 text-danger"
                              id="sign-up-password-error"
                           >
                              {this.state.passwordError}
                           </p>
                        )}

                        <button
                           to="/create-answer"
                           className="btn btn-success btn-block mt-5"
                           id="letsGoButton"
                           onClick={() => {
                              this.validateAndCreateUser();
                           }}
                        >
                           Let's go!
                        </button>
                     </>
                  )}
                  {!this.state.isDisplayingInputs && (
                     <button
                        className="btn btn-success btn-block d-flex justify-content-center mt-5"
                        onClick={() => {
                           this.showInputs();
                        }}
                     >
                        Sign up
                     </button>
                  )}
               </div>
            </div>
         </div>
      );
   }
}
function mapStateToProps(state) {
   return {};
}
export default withRouter(connect(mapStateToProps)(SignUp));
