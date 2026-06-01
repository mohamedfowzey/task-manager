import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TodosList from "./TodosList";
import Login from "./Login";
import Register from "./Register";



export default function App() {
  const routes = createBrowserRouter([
    { path: "/", element: <><TodosList /></> },
    { path: "/login", element: <><Login /></> },
    { path: "/register", element: <><Register /></> },
  ]);
  return <>

  <RouterProvider router={routes} />
  </>;
}