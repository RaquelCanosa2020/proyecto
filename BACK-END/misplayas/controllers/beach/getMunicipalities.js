const { getConnection } = require("../../db");


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
        next(error);
    } finally {
        if (connection) connection.release();
    }
}

module.exports = getMunicipalities;