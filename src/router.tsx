import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { App } from "./App";
import { LandingPage } from "./landing/LandingPage";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/app", element: <App /> }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
