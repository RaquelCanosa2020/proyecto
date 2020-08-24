const axios = require("axios");

async function getMeteo(req, res, next) {


    try {
        const response = await axios.get(
            "http://servizos.meteogalicia.es/apiv3/findPlaces?types=beach&location=a_lanzada&API_KEY=" +
            `${process.env.METEOKEY}`
        );

        const id = await response.data.features[0].properties.id;

        console.log(response.data.features[0].properties);

        const response1 = await axios.get(
            "http://servizos.meteogalicia.es/apiv3/getNumericForecastInfo?startTime=2020-08-25T15:00:00&endTime=2020-08-25T16:00:00&locationIds=" +
            `${id}` +
            "&variables=temperature,sky_state&API_KEY=" +
            `${process.env.METEOKEY}`
        );
        const info =
            response1.data.features[0].properties.days[0].variables[0].values[0]
                .iconURL;
        const info2 =
            response1.data.features[0].properties.days[0].variables[1].values[0]
                .value;


        res.send({ estado: info, temperatura: info2 })
    } catch (error) {
        console.log(error)
    }


}

module.exports = getMeteo;