import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { listReservations, listTable, unSeatingTable } from "../utils/api";
import { previous, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsList from "../reservations/ReservationsList";
import TableList from "../tables/TableList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ todayDate }) {
  const history = useLocation();

  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesErrors] = useState(null);
  const [date, setDate] = useState(() => {
    if(history.search) {
      return history.search.slice(6,16);
    }
    return todayDate;
  });
  
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesErrors(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTable(abortController.signal)
      .then(setTables)
      .catch(setTablesErrors)
    return () => abortController.abort();
  };

  const previousButtonHandler = () => {
    setDate(previous(date.toString()));
  };

  const todayButtonHandler = () => {
    setDate(todayDate);
  };

  const nextButtonHandler = () => {
    setDate(next(date.toString()));
  };
  
  function finishButtonHandler(table_id) {
    if(window.confirm("Is this table ready to seat new guests?\nThis cannot be undone.")) {
      setTablesErrors(null);
      unSeatingTable(table_id, { reservation_id: null })
        .then(() => loadDashboard())
        .catch(setTablesErrors)
    };
  };

  const list = reservations.map((reservation) => (
    <ReservationsList
      key={reservation.reservation_id}
      reservation={reservation}
    />
  ));
  
  const listTables = tables.map((table) => (
    <TableList
      key={table.table_id}
      table={table}
      unSeatingHandler={finishButtonHandler}
    />
  ));

  return (
    <main>
      <h1>Dashboard</h1>
      <button onClick={previousButtonHandler}>Previous</button>
      <button onClick={todayButtonHandler}>Today</button>
      <button onClick={nextButtonHandler}>Next</button>
      <button onClick={nextButtonHandler}>Select</button>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <section>{list}</section>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Tables</h4>
      </div>
      <div>{listTables}</div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      {JSON.stringify(tables)}
      {JSON.stringify(reservations)}
    </main>
  );
}

export default Dashboard;
