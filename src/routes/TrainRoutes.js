const express = require('express');
const { placePassengers, getTrainInformation } = require('../controller/TrainController');

const router = express.Router();



router.route('/').post(placePassengers);

router.route('/').get((req, res) => {
    res.send('Get Hello World!');
});

router.route('/getTrainInformation').get(getTrainInformation);

module.exports = router;
