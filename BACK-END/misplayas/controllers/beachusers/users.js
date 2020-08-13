const { getConnection } = require("../../db");

async function listUsers(req, res, next) {
    let connection;

    try {
        connection = await getConnection();
        // Sacamos las posibles opciones del querystring:
        //  search: para listar solo las entradas que contengan su valor en name o municipality
        //  order: para ordernar el listado por voteAverage, municipality, province o name
        //  direction: para la dirección de la ordenación desc o asc
        const { order, direction } = req.query;

        // Proceso la dirección de orden
        const orderDirection =
            (direction && direction.toLowerCase()) === "desc" ? "DESC" : "ASC";

        // Proceso el campo de orden
        let orderBy;
        switch (order) {
            case "registration_date":
                orderBy = "registration_date";
                break;
            case "name":
                orderBy = "name";
                break;


            default:
                orderBy = "id";

        }

        // Ejecuto la query en base a si existe querystring de search o no



        let queryResults = await connection.query(
            `
        SELECT users.id, users.name, users.role, users.email, users.registration_date, users.image, COUNT(reservations.id) AS Nºreservas, SUM(reservations.places) AS Nºplazas, MAX(reservations.date) AS ultima_reserva
FROM users
LEFT JOIN reservations ON users.id = reservations.id_user
GROUP BY users.id
        
        ORDER BY ${orderBy} ${orderDirection}`
        );


        // Extraigo los resultados reales del resultado de la query
        const [result] = queryResults;

        // Mando la respuesta
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

module.exports = listUsers;