// routes.js

import { createBrowserRouter } from "react-router-dom";
import App from '../App';
// import MainLayout from "../pages/MainLayout";
// import { ErrorPage } from "../pages/ErrorPage";

// Crear las rutas
const router = createBrowserRouter([
    {
        path: '/', // Ruta raíz que carga la aplicación principal
        element: <App />,
    }
]);

export default router;
