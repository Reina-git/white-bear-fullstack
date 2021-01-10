import React from "react";
import { Link } from "react-router-dom";
import EditIcon from "../../icons/edit.svg";
import actions from "../../store/actions";
import { connect } from "react-redux";

class MemoryCard extends React.Component {
   storeEditableCard(memoryCard) {
      console.log("Store EDITABLE CARD", memoryCard);
      this.props.dispatch({
         type: actions.STORE_EDITABLE_CARD,
         payload: {
            card: memoryCard,
            prevRoute: "/all-cards",
         },
      });
   }

   render() {
      const memoryCard = this.props.card;
      return (
         <div className="d-flex align-items-start mb-5">
            <div className="app-card flex-fill">
               <div className="card">
                  <div className="card-body bg-primary 16pt">
                     {this.props.card.imagery}
                  </div>
               </div>
               <div className="card">
                  <div className="card-body bg-secondary 16pt">
                     {this.props.card.answer}
                  </div>
               </div>
            </div>

            <Link
               to="/edit"
               className="btn btn-link ml-4 d-flex mt-n2"
               onClick={() => {
                  this.storeEditableCard(memoryCard);
               }}
            >
               <img
                  src={EditIcon}
                  className="d-inline"
                  style={{
                     marginBottom: "2px",
                     marginRight: "8px",
                  }}
                  width="20px"
                  alt=""
               />
               Edit
            </Link>
         </div>
      );
   }
}
function mapStateToProps(state) {
   return {};
}
export default connect(mapStateToProps)(MemoryCard);
