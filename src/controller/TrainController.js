const fakeTrain = require('../../fake-train');

const placePassengers = (req, res) => {
    // POST http://localhost:8000/api

    let request = req.body;

    let vagons = request.Tren.Vagonlar; // array
    let passangerCount = request.RezervasyonYapilacakKisiSayisi; // int
    let permDiffVagons = request.KisilerFarkliVagonlaraYerlestirilebilir; // true or false

    let vagonsCount = vagons.length;

    if (vagonsCount == 0) {
        res.status(400).json({ message: 'There is no vagons found' });
        return;
    }

    if (passangerCount == 0) {
        res.status(400).json({
            message: 'There is no passgenser for appoinment',
        });
    }

    let allVagonsFreeSeat = getAllFreeSeats(vagons);

    let data = placePassenger(
        vagons,
        passangerCount,
        permDiffVagons,
        allVagonsFreeSeat
    );

    res.status(200).json({
        RezervasyonYapilabilir: data.RezervasyonYapilabilir,
        YerlesimAyrinti: data.YerlesimAyrinti,
    });
};

const placePassenger = (
    vagons,
    passangerCount,
    permDiffVagons,
    allVagonsFreeSeat
) => {
    let yerlesimAyrinti = [];
    rezervasyonYapilabilir = false;

    if (allVagonsFreeSeat < passangerCount) {
        return {
            RezervasyonYapilabilir: rezervasyonYapilabilir,
            YerlesimAyrinti: yerlesimAyrinti,
        };
    }

    vagons.forEach((vagon) => {
        let freeSeat =
            Math.floor((vagon.Kapasite * 7) / 10) - vagon.DoluKoltukAdet;
        if (!checkVagonAbleToOnlineAppointment(vagon)) {
            if (permDiffVagons) {
                if (passangerCount - freeSeat >= 0 && passangerCount > 0) {
                    yerlesimAyrinti.push({
                        VagonAdi: vagon.Ad,
                        KisiSayisi: freeSeat,
                    });
                    passangerCount -= freeSeat;
                } else if (
                    passangerCount - freeSeat <= 0 &&
                    passangerCount > 0
                ) {
                    yerlesimAyrinti.push({
                        VagonAdi: vagon.Ad,
                        KisiSayisi: passangerCount,
                    });
                }
            } else {
                if (freeSeat >= passangerCount) {
                    yerlesimAyrinti.push({
                        VagonAdi: vagon.Ad,
                        KisiSayisi: passangerCount,
                    });
                }
            }
        }
    });

    yerlesimAyrinti.length
        ? (rezervasyonYapilabilir = true)
        : (rezervasyonYapilabilir = false);

    return {
        RezervasyonYapilabilir: rezervasyonYapilabilir,
        YerlesimAyrinti: yerlesimAyrinti,
    };
};

const getAllFreeSeats = (vagons) => {
    let allFreeSeats = 0;
    vagons.forEach((vagon) => {
        let KapasiteYuzdeYetmis = Math.floor((vagon.Kapasite * 7) / 10);
        if (KapasiteYuzdeYetmis > vagon.DoluKoltukAdet) {
            let freeSeat = KapasiteYuzdeYetmis - vagon.DoluKoltukAdet;
            if (freeSeat > 0) {
                allFreeSeats += freeSeat;
            }
        }
    });

    return allFreeSeats;
};

const checkVagonAbleToOnlineAppointment = (vagon) => {
    if ((vagon.Kapasite * 7) / 10 >= vagon.DoluKoltukAdet) {
        return false;
    }
    return true;
};

const getTrainInformation = (req, res) => {
    res.status(200).json(fakeTrain);
};

module.exports = {
    placePassengers,
    getTrainInformation,
};
