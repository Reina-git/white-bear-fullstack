// The queue resource
const express = require("express");
const router = express.Router();
const validateJwt = require("../../utils/validateJwt");
const upload = require("../../upload");

// @route      POST api/v1/test-user
// @desc       Create a new test user in the test users resource
// @access     Private
router.post("/", validateJwt, (req, res) => {
   upload.single("profile-photo")(req, res, (err) => {
      if (!req.file && !err) {
         const errorMessage = "Please choose a file to upload.";
         return res.status(400).json({ uploadError: errorMessage });
      } else if (!req.file && err) {
         return res.status(400).json({ uploadError: err.message });
      } else {
         const profile = {
            handle: req.body.handle,
            profilePhotoUrl: req.file.location,
         };
         return res.status(200).json(profile);
      }
   });
});

module.exports = router;
