import React from "react";
import saveLogo from "../../icons/save.svg";
import AppTemplate from "../ui/AppTemplate";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { checkIsOver, MAX_CARD_CHARS } from "../../utils/helpers";
import { connect } from "react-redux";
import actions from "../../store/actions";
import axios from "axios";

// import actions from "../../store/actions";

class CreateImagery extends React.Component {
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
   async updateCreatableCard() {
      console.log("updating creatable card");
      const {
         id,
         answer,
         userId,
         createdAt,
         nextAttemptAt,
         lastAttemptAt,
         totalSuccessfulAttempts,
         level,
      } = this.props.creatableCard;
      await this.props.dispatch({
         type: actions.UPDATE_CREATABLE_CARD,
         payload: {
            id,
            answer,
            imagery: this.state.imageryText,
            userId,
            createdAt,
            nextAttemptAt, //
            lastAttemptAt,
            totalSuccessfulAttempts,
            level,
         },
      });
      // save to db - make an api call
      axios
         .post("/api/v1/memory-cards", this.props.creatableCard)
         .then((res) => {
            console.log("memory card created");
            // display success overlay
            // route to "/create-answer"
            this.props.dispatch({
               type: actions.UPDATE_CREATABLE_CARD,
               payload: {},
            });
            this.props.history.push("/create-answer");
         })
         .catch((err) => {
            const { data } = err.response;
            console.log(data);
            // display error overlay
            // hide error overlay after 5 seconds
            // stay on page
         });
      // go to create answer
   }

   render() {
      return (
         <div>
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
                     {this.props.creatableCard.answer}
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
                  onClick={() => {
                     this.updateCreatableCard();
                  }}
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

function mapStateToProps(state) {
   return { creatableCard: state.creatableCard };
}
export default connect(mapStateToProps)(CreateImagery);
