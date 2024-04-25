import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { Navigate, RouterProvider, createBrowserRouter, useLocation } from "react-router-dom";
import ReactWorkFlowComponent from "src/ReactFlow";
import Register from "src/Register";
import { KEY_FOR_STORING_TOKEN } from "src/utils/LocalStoragekey";
import "./App.css";
import { getValueFromLS } from "./utils/LocalStorage";

const queryClient = new QueryClient();
const RequiredAuth = (children) => {
  const token = getValueFromLS(KEY_FOR_STORING_TOKEN);
  let location = useLocation();

  if (!token) {
    return <Navigate to="/register" state={{ from: location }} replace />;
  }
  if (token) {
    return children;
  }
};

const router = createBrowserRouter([
  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "/",
    element: (
      <RequiredAuth>
        {" "}
        <ReactWorkFlowComponent />
      </RequiredAuth>
    ),
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />;
    </QueryClientProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
