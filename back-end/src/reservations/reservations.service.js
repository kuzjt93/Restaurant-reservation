const knex = require("../db/connection");

const table = "reservations";

function list(date) {
    return knex(table)
        .select("*")
        .where({"reservation_date" : date})
        .whereNot({"status": "finished"})
        .orderBy("reservation_time")
};

function read(reservation_id) {
    return knex(table)
        .select("*")
        .where({ "reservation_id": reservation_id})
        .first()
};

function create(newReservation) {
    return knex(table)
        .insert(newReservation)
        .returning("*")
        .then((arr) => arr[0])
};

function update(updateReservation) {
    return knex(table)
        .where({"reservation_id": updateReservation.reservation_id})
        .update(updateReservation, "*")
        .then((arr) => arr[0])
};

module.exports = {
    list,
    create,
    read,
    update,
};