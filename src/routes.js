import { Routes, Route } from "react-router-dom";
import HomePage from "./App";
import TransactionPage from "./Transaction";

function RoutesPage() {
  return (
    <Routes>
      <Route exact path="/" element={<HomePage />} />
      <Route
        path="/transactions/:transactionId"
        element={<TransactionPage />}
      />
    </Routes>
  );
}

export default RoutesPage;
