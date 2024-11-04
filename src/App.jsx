import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./ui/Homepage";
import Error from "./ui/Error";
import Map, { loader as locationsLoader } from "./features/map/Map";
import Mushrooms from "./features/mushrooms/Mushrooms";
import User from "./features/user/User";
import Recepies from "./features/recepies/Recepies";
import AppLayout from "./ui/AppLayout";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "",
        element: <Homepage />,
      },
      {
        path: "/map",
        element: <Map />,
        loader: locationsLoader,
      },
      {
        path: "/map/:locationId",
        // element:
      },
      {
        path: "/map/:locationId/newComment",
        // element:
      },
      {
        path: "/map/newLocation",
        // element:
      },
      {
        path: "/mushrooms",
        element: <Mushrooms />,
        //loader: mushroomsLoader,
      },
      {
        path: "/user",
        element: <User />,
      },
      {
        path: "/recepies",
        element: <Recepies />,
        //loader: recepiesLoader,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
