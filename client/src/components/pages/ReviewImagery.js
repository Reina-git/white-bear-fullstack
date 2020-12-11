import React from "react";
import AppTemplate from "../ui/AppTemplate";
import { Link } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import actions from "../../store/actions";

class ReviewImagery extends React.Component {
   constructor(props) {
      super(props);

      if (props.queue.cards.length === 0) {
         axios
            .get(
               "https://raw.githubusercontent.com/Reina-git/white-bear-mpa/main/src/mock-data/memory-cards.json"
            )
            .then((res) => {
               // handle success
               console.log(res);
               props.dispatch({
                  type: actions.STORE_QUEUED_CARDS,
                  payload: res.data,
               });
            })
            .catch((error) => {
               // handle error
               console.log(error);
            });
      }
      if (props.queue.index > props.queue.cards.length) {
         this.props.history.push("/review-empty");
      }
   }

   goToPrevCard() {
      this.props.dispatch({ type: actions.DECREMENT_QUEUE_INDEX });
      this.props.history.push("/review-answer");
   }
   render() {
      const memoryCard = this.props.queue.cards[this.props.queue.index];
      console.log("memoryCard", this.props.queue);
      return (
         <AppTemplate>
            <div className="card">
               <div className="card">
                  <div className="card-body bg-primary lead">
                     {memoryCard && memoryCard.imagery}
                  </div>
               </div>
               <div className="d-inline mt-5">
                  {this.props.queue.index > 0 && (
                     <button
                        className="btn btn-link"
                        onClick={() => {
                           this.goToPrevCard();
                        }}
                     >
                        Previous Card
                     </button>
                  )}

                  <div className="float-right">
                     <Link
                        to="/review-answer"
                        className="btn btn-outline-primary"
                     >
                        Show answer
                     </Link>
                  </div>
               </div>
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
export default connect(mapStateToProps)(ReviewImagery);
