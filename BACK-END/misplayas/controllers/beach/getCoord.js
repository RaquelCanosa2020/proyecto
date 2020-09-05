const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");


async function getCoord(req, res, next) {
    let connection;

    try {
        connection = await getConnection();

        const { id } = req.params;

        console.log("buscando info playa", id);

        //hago la consulta a la bd:

        const [result] = await connection.query(
            `
      SELECT coordX, coordY
      FROM location
      WHERE id=?
    `,
            [id]
        );
        const X = result[0].coordX.replace(",", ".");
        const Y = result[0].coordY.replace(",", ".");

        const x = (X.split(" ")).join("");
        const y = (Y.split(" ")).join("");

        const coordinates = x + "+" + y;


        res.send({
            status: "ok",
            data: coordinates
        });
    } catch (error) {
        throw generateError(
            "No se pudo acceder a la ubicación de esta playa",
            400
        );
    } finally {
        if (connection) connection.release();
    }
}

module.exports = getCoord;