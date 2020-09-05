const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");

async function getMunicipalities(req, res, next) {
    let connection;

    try {
        connection = await getConnection();


        const [result] = await connection.query(
            `
      SELECT DISTINCT beaches.municipality, beaches.province
      FROM beaches
      WHERE beaches.active = 1`

        );

        res.send({
            status: "ok",
            data: {
                info: result,

            },
        });
    } catch (error) {
        throw generateError(
            "No se pudo cargar la información de municipios",
            400
        );
    } finally {
        if (connection) connection.release();
    }
}

module.exports = getMunicipalities;