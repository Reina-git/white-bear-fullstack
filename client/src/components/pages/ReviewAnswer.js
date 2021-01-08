import React from "react";
import thumbsUpIcon from "../../icons/thumbs-up.svg";
import AppTemplate from "../ui/AppTemplate";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import actions from "../../store/actions";
import axios from "axios";

class ReviewAnswer extends React.Component {
   constructor(props) {
      super(props);
      if (this.props.queue.cards.length === 0) {
         this.props.history.push("/review-empty");
      }
   }

   updateCardWithNeedsWork(memoryCard) {
      const newMemoryCard = { ...memoryCard };
      newMemoryCard.totalSuccessfulAttempts = 0;
      newMemoryCard.lastAttemptAt = Date.now();
      // db PUT
      axios
         .put(`/api/v1/memory-cards/${newMemoryCard.id}`, newMemoryCard)
         .then((res) => {
            console.log("memory card updated");
            // display success overlay
            this.goToNextCard();
         })
         .catch((err) => {
            const { data } = err.response;
            console.log(data);
            // display error overlay
            // hide error overlay after 5 seconds
            // stay on page
         });
   }

   updateCardWithGotIt(memoryCard) {
      const newMemoryCard = { ...memoryCard };
      newMemoryCard.totalSuccessfulAttempts += 1;
      newMemoryCard.lastAttemptAt = Date.now();
      // db PUT
      axios
         .put(`/api/v1/memory-cards/${newMemoryCard.id}`, newMemoryCard)
         .then((res) => {
            console.log("memory card updated");
            // display success overlay
            this.goToNextCard();
         })
         .catch((err) => {
            const { data } = err.response;
            console.log(data);
            // display error overlay
            // hide error overlay after 5 seconds
            // stay on page
         });
   }

   goToNextCard() {
      if (this.props.queue.index === this.props.queue.cards.length - 1) {
         this.props.dispatch({ type: actions.INCREMENT_QUEUE_INDEX });
         this.props.history.push("/review-empty");
      } else {
         this.props.dispatch({ type: actions.INCREMENT_QUEUE_INDEX });
         this.props.history.push("/review-imagery");
      }
   }
   storeEditableCard() {
      console.log("Store EDITABLE CARD");
      const memoryCard = this.props.queue.cards[this.props.queue.index];
      this.props.dispatch({
         type: actions.STORE_EDITABLE_CARD,
         payload: {
            card: memoryCard,
            prevRoute: "/review-answer",
         },
      });
   }

   render() {
      const memoryCard = this.props.queue.cards[this.props.queue.index];
      console.log(memoryCard);
      return (
         <AppTemplate>
            <div className="mb-5">
               <div className="card">
                  <div className="card-body bg-primary lead">
                     {memoryCard && memoryCard.imagery}
                  </div>
               </div>
               <div className="card">
                  <div className="card-body bg-secondary lead">
                     {memoryCard && memoryCard.answer}
                  </div>
               </div>
            </div>

            <Link
               to="/edit"
               className="btn btn-link"
               onClick={() => {
                  this.storeEditableCard(memoryCard);
               }}
            >
               Edit
            </Link>
            <div className="float-right">
               <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                     this.updateCardWithNeedsWork(memoryCard);
                  }}
               >
                  Needs work
               </button>
               <button
                  className="btn btn-primary ml-4"
                  onClick={() => {
                     this.updateCardWithGotIt(memoryCard);
                  }}
               >
                  <img
                     src={thumbsUpIcon}
                     width="20px"
                     style={{ marginBottom: "5px", marginRight: "4px" }}
                     alt=""
                  />
                  Got it
               </button>
            </div>
         </AppTemplate>
      );
   }
}
function mapStateToProps(state) {
   return {
      queue: state.queue,
   };
}
export default connect(mapStateToProps)(ReviewAnswer);
