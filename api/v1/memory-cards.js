// The memory-cards resouce
const express = require("express");
const router = express.Router();
const db = require("../../db");
const selectAllCards = require("../../queries/selectAllCards");
const validateJwt = require("../../utils/validatejwt");
const insertMemoryCard = require("../../queries/insertMemoryCard");

// @route GET api/v1/memory-cards
// @desc    GET all memory cards for a user by search terms
// @access Private
router.get("/", validateJwt, (req, res) => {
   console.log(req.query);
   const { searchTerm, order } = req.query;
   const userId = req.user.id;
   let constructedSearchTerm;
   if (searchTerm === "" || searchTerm === undefined) {
      constructedSearchTerm = "%%";
   } else {
      constructedSearchTerm = `%${searchTerm}%`;
   }
   console.log(constructedSearchTerm);
   /* https://www.npmjs.com/package/mysql#escaping-query-values */
   db.query(selectAllCards, [
      userId,
      constructedSearchTerm,
      constructedSearchTerm,
      { toSqlString: () => order },
   ])
      .then((memoryCards) => {
         const camelCaseMemoryCards = memoryCards.map((memoryCard) => {
            return {
               id: memoryCard.id,
               imagery: memoryCard.imagery,
               answer: memoryCard.answer,
               userId: memoryCard.user_id,
               createdAt: memoryCard.created_at,
               nextAttemptAt: memoryCard.nextAttempt_at,
               lastAttemptAt: memoryCard.lastAttempt_at,
               totalSuccessfulAttempts: memoryCard.total_successful_attempts,
               level: memoryCard.level,
            };
         });
         res.json(camelCaseMemoryCards);
      })
      .catch((err) => {
         console.log(err);
         res.status(400).json(err);
      });
});

// @route   Post api/v1/memory-cards
// @desc    Post all memory cards for a user by search terms
// @access  Private
router.post("/", validateJwt, (req, res) => {
   const user = req.user;
   const {
      id,
      imagery,
      answer,
      createdAt,
      nextAttemptAt,
      lastAttemptAt,
      totalSuccessfulAttempts,
      level,
   } = req.body;
   const memoryCard = {
      id,
      imagery,
      answer,
      user_id: user.id,
      created_at: createdAt,
      nextAttempt_at: nextAttemptAt,
      lastAttempt_at: lastAttemptAt,
      total_successful_attempts: totalSuccessfulAttempts,
      level,
   };
   console.log(memoryCard);
   db.query(insertMemoryCard, memoryCard)
      .then((dbRes) => {
         // success
         console.log("created memory card in te db:", dbRes);
         // return with a status response
         return res.status(200).json({ success: "card created" });
      })
      .catch((err) => {
         console.log(err);
         dbError = `${err.code} ${err.sqlMessage}`;
         res.status(400).json({ dbError });
      });
});

module.exports = router;
