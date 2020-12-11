import React from "react";
import LogoLanding from "../../images/logo-landing.png";
import SignUp from "../ui/SignUp";
import Login from "../ui/Login";

export default function Landing() {
   return (
      <div className="background-image">
         <div className="container">
            <div className="row">
               <div className="col-12 ml-6 mt-6">
                  <img src={LogoLanding} className="mt-n5" alt="night sky" />
                  <h1 className="d-inline text-brand ml-3 mt-4">White Bear</h1>
               </div>
            </div>
            <div className="row">
               <SignUp />
               <Login />
            </div>
         </div>
      </div>
   );
}
