import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { Navigate, RouterProvider, createBrowserRouter, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ReactFlowProvider } from "reactflow";
import Home from "src/pages/Home";
import ReactWorkFlowComponent from "src/pages/ReactFlow";
import Register from "src/pages/Register";
import TriggerWorkFlow from "src/pages/TriggerWorkFlow";
import { getValueFromLS } from "src/utils/LocalStorage";
import { KEY_FOR_STORING_USER_DETAILS } from "src/utils/LocalStoragekey";
import "./App.css";
import { SocketProvider } from "./Provider/SocketProvider";
import store from "./store";

export const queryClient = new QueryClient();
const RequiredAuth = ({ children }) => {
  const token = getValueFromLS(KEY_FOR_STORING_USER_DETAILS)?.token;
  // console.log({ token });
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
        <Home />
      </RequiredAuth>
    ),
  },

  {
    path: "/workflow",
    element: (
      <RequiredAuth>
        {" "}
        <ReactWorkFlowComponent />
        {/* </SocketProvider> */}
      </RequiredAuth>
    ),
  },
  {
    path: "/trigger-workflow",
    element: (
      <RequiredAuth>
        <TriggerWorkFlow />
      </RequiredAuth>
    ),
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastContainer />
    <SocketProvider>
      {/* <FilterDataProvider> */}
      <Provider store={store}>
        <ReactFlowProvider>
          <App />
        </ReactFlowProvider>
      </Provider>
      {/* </FilterDataProvider> */}
    </SocketProvider>
  </React.StrictMode>
);
