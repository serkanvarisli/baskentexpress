const express = require('express');
const {
    placePassengers,
    getTrainInformation,
} = require('../controller/TrainController');

const router = express.Router();

router.route('/').post(placePassengers);

router.route('/').get((req, res) => {
    res.send(
        '<div style="margin-top:20%"><center><h1>Selamlar... Api Çalışıyor<h1/><center><div/>'
    );
});

router.route('/getTrainInformation').get(getTrainInformation);

module.exports = router;
