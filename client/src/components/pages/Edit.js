import React from "react";
import SaveLogo from "../../icons/save.svg";
import AppTemplate from "../ui/AppTemplate";
import { Link } from "react-router-dom";
import toDisplayDate from "date-fns/format";
import classnames from "classnames";
import { connect } from "react-redux";
import { checkIsOver, MAX_CARD_CHARS } from "../../utils/helpers";
import isEmpty from "lodash/isEmpty";
import actions from "../../store/actions";
import axios from "axios";

class Edit extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         answerText: this.props.editableCard.card.answer,
         imageryText: this.props.editableCard.card.imagery,
         isDisplayingDelete: false,
      };
   }

   showDelete() {
      this.setState({ isDisplayingDelete: !this.state.isDisplayingDelete });
   }
   checkHasInvalidCharCount() {
      if (
         this.state.answerText.length > MAX_CARD_CHARS ||
         this.state.answerText.length === 0 ||
         this.state.imageryText.length > MAX_CARD_CHARS ||
         this.state.imageryText.length === 0
      ) {
         return true;
      } else return false;
   }

   setImageryText(e) {
      this.setState({ imageryText: e.target.value });
   }

   setAnswerText(e) {
      this.setState({ answerText: e.target.value });
   }

   saveCard() {
      if (!this.checkHasInvalidCharCount()) {
         // put into db
         const memoryCard = { ...this.props.editableCard.card };
         memoryCard.answer = this.state.answerText;
         memoryCard.imagery = this.state.imageryText;
         axios
            .put(`/api/v1/memory-cards/${memoryCard.id}`, memoryCard)
            .then((res) => {
               console.log("memory card updated");

               const cards = [...this.props.queue.cards];
               cards[this.props.queue.index] = memoryCard;

               this.props.dispatch({
                  type: actions.UPDATE_QUEUED_CARDS,
                  payload: cards,
               });

               // display success overlay
               this.props.history.push(this.props.editableCard.prevRoute);
            })
            .catch((err) => {
               const { data } = err.response;
               console.log(data);
               // display error overlay
               // hide error overlay after 5 seconds
               // stay on page
            });
      } else {
         console.log("invalid char count");
      }
   }

   deleteCard() {
      const memoryCard = { ...this.props.editableCard.card };
      // query db to delete card
      axios
         .delete(`/api/v1/memory-cards/${memoryCard.id}`)
         .then((res) => {
            console.log(res.data);
            const deletableCard = this.props.editableCard.card;
            const cards = [...this.props.queue.cards];
            const filteredCards = cards.filter((card) => {
               return card.id !== deletableCard.id;
            });
            this.props.dispatch({
               type: actions.UPDATE_QUEUED_CARDS,
               payload: filteredCards,
            });
            //   TODO display success overlay
            if (this.props.editableCard.prevRoute === "/review-answer") {
               if (filteredCards[this.props.queue.index] === undefined) {
                  this.props.history.push("/review-empty");
               } else {
                  this.props.history.push("/review-imagery");
               }
            }
            if (this.props.editableCard.prevRoute === "/all-cards") {
               this.props.history.push("/all-cards");
            }
         })
         .catch((err) => {
            console.log(err.response.data);
            // TODO: Display error overlay
         });
   }

   // changeRoute(prevRoute) {
   //    if (prevRoute === "/review-answer") {
   //       return "/review-imagery";
   //    }
   // }

   render() {
      return (
         <AppTemplate>
            <p className="text-center lead text-muted my-2">Edit card</p>
            {isEmpty(this.props.editableCard) === false && (
               <>
                  {" "}
                  <div id="edit-cards-total">
                     <div className="card">
                        <div className="card-body bg-primary lead">
                           <textarea
                              rows="4"
                              id="edit-imagery-input"
                              defaultValue={
                                 this.props.editableCard.card.imagery
                              }
                              onChange={(e) => this.setImageryText(e)}
                           ></textarea>
                        </div>
                     </div>
                     <div className="card">
                        <div className="card-body bg-secondary lead">
                           <textarea
                              rows="4"
                              id="edit-answer-input"
                              defaultValue={this.props.editableCard.card.answer}
                              onChange={(e) => this.setAnswerText(e)}
                           ></textarea>
                        </div>
                     </div>
                  </div>
                  <div
                     className="float-right mt-2 mb-5 text-muted d-flex"
                     id="Top-Bottom-Counter"
                  >
                     <p className="float-right mt-2 mb-5 text-muted">
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
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <span
                           className={classnames({
                              "text-danger": checkIsOver(
                                 this.state.answerText,
                                 MAX_CARD_CHARS
                              ),
                           })}
                        >
                           Bottom: {this.state.answerText.length}/
                           {MAX_CARD_CHARS}
                        </span>
                     </p>
                  </div>
                  <div className="clearfix"></div>
                  <Link
                     to={this.props.editableCard.prevRoute}
                     className="btn btn-link"
                  >
                     Discard changes
                  </Link>
                  <div className="float-right">
                     <button
                        id="edit-save-card"
                        className={classnames("btn btn-primary ml-4", {
                           disabled: this.checkHasInvalidCharCount(),
                        })}
                        onClick={() => {
                           this.saveCard();
                        }}
                     >
                        <img
                           src={SaveLogo}
                           alt=""
                           width="20px"
                           style={{ marginBottom: "5px", marginRight: "4px" }}
                        />
                        Save
                     </button>
                  </div>
                  <div className="clearfix"></div>
                  <p className="text-center lead text-muted mt-5 mb-3">
                     Card properties
                  </p>
                  <div className="row">
                     <div className="col-3 mt-2">
                        <p className="text-muted">Created on:</p>
                     </div>
                     <div className="col-9 mt-2">
                        <p>
                           {toDisplayDate(
                              this.props.editableCard.card.createdAt,
                              "MMM. d, yyyy"
                           )}
                        </p>
                     </div>
                     <div className="col-3 mt-2">
                        <p className="text-muted">Last attempt:</p>
                     </div>
                     <div className="col-9 mt-2">
                        <p>
                           {toDisplayDate(
                              this.props.editableCard.card.lastAttemptAt,
                              "MMM. d, yyyy"
                           )}
                        </p>
                     </div>
                     <div className="col-3 mt-2">
                        <p className="text-muted">Next attempt:</p>
                     </div>
                     <div className="col-9 mt-2">
                        <p>
                           {toDisplayDate(
                              this.props.editableCard.card.nextAttemptAt,
                              "MMM. d, yyyy"
                           )}
                        </p>
                     </div>
                     <div className="col-3 mt-2">
                        <p className="text-muted">Consecutives:</p>
                     </div>
                     <div className="col-9 mt-2">
                        <p>
                           {
                              this.props.editableCard.card
                                 .totalSuccessfulAttempts
                           }
                        </p>
                     </div>
                  </div>
                  <div className="row">
                     <div className="col-12 mt-3">
                        <div className="custom-control custom-checkbox">
                           <input
                              type="checkbox"
                              className="custom-control-input"
                              id="showDelete"
                              name="showDelete"
                              checked={this.state.isDisplayingDelete}
                              value={!this.state.isDisplayingDelete}
                              onChange={() => {
                                 this.showDelete();
                              }}
                           />
                           <label
                              className="custom-control-label"
                              htmlFor={"showDelete"}
                           >
                              Show delete button
                           </label>
                        </div>

                        <div className="mt-4 mb-3">
                           {this.state.isDisplayingDelete && (
                              <>
                                 <button
                                    className="btn btn-outline-danger"
                                    id="delete-button"
                                    onClick={() => {
                                       this.deleteCard();
                                    }}
                                 >
                                    Delete this card
                                 </button>
                              </>
                           )}
                        </div>
                     </div>
                  </div>
               </>
            )}
         </AppTemplate>
      );
   }
}
function mapStateToProps(state) {
   return {
      editableCard: state.editableCard,
      queue: state.queue,
   };
}
export default connect(mapStateToProps)(Edit);
