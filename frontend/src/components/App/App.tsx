import { Routes, Route } from "react-router-dom";
import { Header } from "../Header/Header";
import styles from "./styles.module.scss";
import { MapPage } from "../../pages/MapPage/MapPage";
import { IncidentsPage } from "../../pages/IncidentsPage/IncidentsPage";
import { EmployeesPage } from "../../pages/EmployeesPage/EmployeesPage";
import { ObjectsPage } from "../../pages/ObjectsPage/ObjectsPage";
import { CustomTypesPage } from "../../pages/TypesPage/CustomTypesPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Layout } from "../Layout/Layout";
import { RabPage } from "../../pages/RabPage/RabPage";

export const App = () => {
  return (
    <div className={styles.app}>
      <Header />
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route
          path="/objects"
          element={
            <Layout>
              <ObjectsPage />
            </Layout>
          }
        />
        <Route
          path="/incidents"
          element={
            <Layout>
              <IncidentsPage />
            </Layout>
          }
        />
        <Route
          path="/employees"
          element={
            <Layout>
              <EmployeesPage />
            </Layout>
          }
        />
        <Route
          path="/types"
          element={
            <Layout>
              <CustomTypesPage />
            </Layout>
          }
        />
        <Route
          path="/rab"
          element={
            <Layout>
              <RabPage />
            </Layout>
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </div>
  );
};
