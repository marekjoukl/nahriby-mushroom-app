import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./ui/Homepage";
import Error from "./ui/Error";
import Map, { loader as locationsLoader } from "./features/map/Map";
import Mushrooms from "./features/mushrooms/Mushrooms";
import User from "./features/user/User";
import Recepies from "./features/recepies/Recepies";
import AppLayout from "./ui/AppLayout";
import LocationDetail, {
  loader as locationDetailLoader,
} from "./features/map/LocationDetail";
import CreateLocation, {
  action as createLocationAction,
} from "./features/map/CreateLocation";
import CreateComment from "./features/map/CreateComment";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "",
        element: <Homepage />,
      },
      // ******************** MAP ******************** //
      {
        path: "/map",
        element: <Map />,
        loader: locationsLoader,
      },
      {
        path: "/map/:id",
        element: <LocationDetail />,
        loader: locationDetailLoader,
      },
      {
        path: "/map/:id/createComment",
        element: <CreateComment />,
      },
      {
        path: "/map/createLocation",
        element: <CreateLocation />,
        action: createLocationAction,
      },
      // ******************** MUSHROOMS ******************** //
      {
        path: "/mushrooms",
        element: <Mushrooms />,
        //loader: mushroomsLoader,
      },
      // ******************** USER ******************** //
      {
        path: "/user",
        element: <User />,
      },
      // ******************** RECEPIES ******************** //
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
