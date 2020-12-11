import React from "react";
import SaveLogo from "../../icons/save.svg";
import AppTemplate from "../ui/AppTemplate";
import { Link } from "react-router-dom";
import memoryCards from "../../mock-data/memory-cards";
import toDisplayDate from "date-fns/format";
import classnames from "classnames";
import { connect } from "react-redux";
import {
   checkIsOver,
   MAX_CARD_CHARS,
   safelyParseJson,
} from "../../utils/helpers";
import isEmpty from "lodash/isEmpty";
import without from "lodash/without";
import actions from "../../store/actions";

const memoryCard = memoryCards[2];
class Edit extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         answerText: memoryCard.answer,
         imageryText: memoryCard.imagery,
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

   deleteCard() {
      if (this.props.editableCard.prevRoute === "/review-answer") {
         this.deleteCardFromStore();
      }
      if (this.props.editableCard.prevRoute === "/all-cards") {
         this.props.history.push("/all-cards");
      }
   }

   deleteCardFromStore() {
      const deletedCard = this.props.editableCard.card;
      const cards = this.props.queue.cards;
      const filteredCards = without(cards, deletedCard);
      console.log(filteredCards);
      this.props.dispatch({
         type: actions.STORE_QUEUED_CARDS,
         payload: filteredCards,
      });
      if (filteredCards[this.props.queue.index] === undefined) {
         this.props.history.push("/review-empty");
      } else {
         this.props.history.push("/review-imagery");
      }
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
                     <Link
                        to={this.props.editableCard.prevRoute}
                        id="edit-save-card"
                        className={classnames("btn btn-primary ml-4", {
                           disabled: this.checkHasInvalidCharCount(),
                        })}
                     >
                        <img
                           src={SaveLogo}
                           alt=""
                           width="20px"
                           style={{ marginBottom: "5px", marginRight: "4px" }}
                        />
                        Save
                     </Link>
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
