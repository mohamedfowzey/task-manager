import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TodosList from "./TodosList";



export default function App() {
  const routes = createBrowserRouter([
    { path: "/", element: <><TodosList /></> },
  ]);
  return <RouterProvider router={routes} />;
}
