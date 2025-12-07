
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LandingPage } from "@/landing/LandingPage";
import { App } from "./App";
const router=createBrowserRouter([
 {path:"/",element:<LandingPage/>},
 {path:"/app",element:<App/>}
]);
export function AppRouter(){ return <RouterProvider router={router}/> }
