const express = require("express");

const {
  getBootcamp,
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  uploadFile,
  downloadFile,
} = require("../controllers/bootcamps");
const router = express.Router();
router
.route('/')
.get(getBootcamps)
.post(createBootcamp);

router
.route('/:id')
.get(getBootcamp)
.put(updateBootcamp)
.delete(deleteBootcamp);

router.route('/Upload')
.post(uploadFile);

router.route('/getfile/download')
.get(downloadFile);


module.exports = router;
