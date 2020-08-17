const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");

//El usuario puede consultar las playas a las que ha ido:

async function getUserPhotos(req, res, next) {
    let connection;

    try {
        connection = await getConnection();

        const { id } = req.params;
        console.log(id);
        console.log(req.auth.id);

        //comprobamos que el usuario se corresponde:

        if (Number(id) !== req.auth.id && req.auth.role !== "admin") {
            throw generateError(
                "No tienes permisos para ver las fotos de este usuario",
                403
            );
        }
        //hacemos la consulta, 
        const [result] = await connection.query(
            `
        SELECT photos.*, beaches.name
FROM photos, beaches
WHERE beaches.id = photos.id_beach AND id_user = ?
ORDER BY beaches.name
    `,
            [id]
        );
        //si no hubiera aún ninguna foto
        if (result.length === 0) {
            throw generateError(`Aún no has subido ninguna foto`, 404)
        }

        res.send({
            status: "ok",
            data: result,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
}

module.exports = getUserPhotos;
