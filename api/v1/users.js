// The users resouce
const express = require("express");
const router = express.Router();
const db = require("../../db");
const selectUser = require("../../queries/selectUser");
const { toJson, toSafeParse } = require("../../utils/helpers");

// @route   GET api/v1/use
// @desc    Get a valid user via email and password
// @access  Public

router.get("/", (req, res) => {
   db.query(selectUser("reinadu@gmail.com", "replace_me"))
      .then((dbRes) => {
         const user = toSafeParse(toJson(dbRes))[0];
         // const jsonRes = toJson(dbRes);
         // console.log(jsonRes);
         // const parsedRes = toSafeParse(jsonRes);
         // console.log(parsedRes);
         // const firstObj = parsedRes[0];
         // const user = firstObj;
         console.log(user);
         res.json(user);
      })
      .catch((err) => {
         console.log(err);
         res.status(400).json(err);
      });
});

module.exports = router;
