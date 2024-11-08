import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Error from "./ui/Error";
import Map, { loader as locationsLoader } from "./features/map/Map";
import Mushrooms, {
  loader as mushroomsLoader,
} from "./features/mushrooms/Mushrooms";
import User, { loader as userLoader } from "./features/user/User";
import Recipes, { loader as recipesLoader } from "./features/recepies/Recipes";
import RecipeDetail, {
  loader as recipeDetailLoader,
} from "./features/recepies/RecipeDetail";
import RecipeAdd from "./features/recepies/RecipeAdd";
import AppLayout from "./ui/AppLayout";
import LocationDetail, {
  loader as locationDetailLoader,
} from "./features/map/LocationDetail";
import CreateLocation, {
  action as createLocationAction,
} from "./features/map/CreateLocation";
import CreateComment from "./features/map/CreateComment";
import EditLocation, {
  loader as editLocationLoader,
  action as editLocationAction,
} from "./features/map/EditLocation";
import MushroomForm from "./features/mushrooms/MushroomForm";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true, // This makes / (root) route to the Map page
        element: <Map />,
        loader: locationsLoader,
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
        path: "/map/:id/edit",
        element: <EditLocation />,
        loader: editLocationLoader,
        action: editLocationAction,
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
        loader: mushroomsLoader,
      },
      {
        path: "/mushrooms/mushroomForm",
        element: <MushroomForm />,
      },
      // ******************** USER ******************** //
      {
        path: "/user",
        element: <User />,
        loader: userLoader,
      },
      // ******************** RECIPES ******************** //
      {
        path: "/recipes",
        element: <Recipes />,
        loader: recipesLoader,
      },
      {
        path: "/recipes/:id",
        element: <RecipeDetail />,
        loader: recipeDetailLoader,
      },
      {
        path: "/recipes/add",
        element: <RecipeAdd />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
