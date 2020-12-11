import React from "react";
import saveLogo from "../../icons/save.svg";
import AppTemplate from "../ui/AppTemplate";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { checkIsOver, MAX_CARD_CHARS } from "../../utils/helpers";

export default class CreateImagery extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         imageryText: "",
      };
   }

   checkHasInvalidCharCount() {
      if (
         this.state.imageryText.length > MAX_CARD_CHARS ||
         this.state.imageryText.length === 0
      ) {
         return true;
      } else return false;
   }

   setImageryText(e) {
      this.setState({ imageryText: e.target.value });
   }

   render() {
      return (
         <div>
            <div
               className="bg-success w=100 lead d-none justify-content-center fixed-top"
               id="overlay-success"
            >
               <img src="icons/success.svg" width="32px" alt="" />
               <p className="d-inline py-4 ml-2">Card created!</p>
            </div>

            <div
               className="bg-danger w=100 lead d-none justify-content-center fixed-top"
               id="overlay-error"
            >
               <img src="/icons/error.svg" width="32px" alt="" />
               <p className="d-inline py-4 ml-2">
                  Oops! Our bad. Please try again.
               </p>
            </div>
            <AppTemplate>
               <p className="text-center lead text-muted my-2">
                  {" "}
                  Add memorable imagery
               </p>
               <div className="card">
                  <div className="card-body bg-primary lead">
                     <textarea
                        rows="6"
                        id="imageryText"
                        autoFocus={true}
                        onChange={(e) => this.setImageryText(e)}
                     ></textarea>
                  </div>
               </div>
               <div className="card">
                  <div className="card-body bg-secondary lead">
                     <textarea rows="6" id="answerText"></textarea>
                  </div>
               </div>

               <p className="float-right mt-2 mb-5 text-muted" id="char-count">
                  <span
                     className={classnames({
                        "text-danger": checkIsOver(
                           this.state.imageryText,
                           MAX_CARD_CHARS
                        ),
                     })}
                  >
                     Top:{""}
                     {this.state.imageryText.length}/{MAX_CARD_CHARS}
                  </span>
               </p>
               <div className="clearfix"></div>

               <Link to="create-answer" className="btn btn-link" id="back-card">
                  Back to answer
               </Link>

               <button
                  className={classnames(
                     "btn btn-primary btn-lg ml-4 float-right",
                     {
                        disabled: this.checkHasInvalidCharCount(),
                     }
                  )}
                  id="save-card"
               >
                  <img
                     src={saveLogo}
                     width="20px"
                     style={{ marginBottom: "3px", marginRight: "4px" }}
                     alt=""
                  />
                  Save
               </button>
            </AppTemplate>
         </div>
      );
   }
}
