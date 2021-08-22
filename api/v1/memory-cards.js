// The memory-cards resouce
const express = require("express");
const router = express.Router();
const db = require("../../db");
const selectAllCards = require("../../queries/selectAllCards");
const validateJwt = require("../../utils/validateJwt");
const insertMemoryCard = require("../../queries/insertMemoryCard");
const updateMemoryCard = require("../../queries/updateMemoryCard");
const deleteMemoryCardById = require("../../queries/deleteMemoryCardById");

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
         return res.status(200).json(camelCaseMemoryCards);
      })
      .catch((err) => {
         console.log(err);
         return res.status(400).json(err);
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
         const dbError = `${err.code} ${err.sqlMessage}`;
         res.status(400).json({ dbError });
      });
});

// @route   Post api/v1/memory-cards/:id
// @desc    Post all memory cards for a user by search terms
// @access  Private

router.put("/:id", validateJwt, (req, res) => {
   const id = req.params.id;
   const user = req.user;
   const {
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
   console.log("memory card", memoryCard);
   db.query(updateMemoryCard, [memoryCard, id])
      .then((dbRes) => {
         // success
         console.log("Updated memory card in te db:", dbRes);
         // return with a status response
         return res.status(200).json({ success: "card created" });
      })
      .catch((err) => {
         console.log(err);
         const dbError = `${err.code} ${err.sqlMessage}`;
         return res.status(400).json({ dbError });
      });
});

// @route   Delete api/v1/memory-cards/:id
// @desc    Delete all memory cards for a user by search terms
// @access  Private

router.delete("/:id", validateJwt, (req, res) => {
   const id = req.params.id;
   db.query(deleteMemoryCardById, id)
      .then(() => {
         return res.status(200).json({ success: "card deleted" });
      })
      .catch((err) => {
         console.log(err);
         const dbError = `${err.code} ${err.sqlMessage}`;
         return res.status(500).json({ dbError });
      });
});

module.exports = router;
