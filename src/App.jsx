import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Error from "./ui/Error";
import Map, { loader as locationsLoader } from "./features/map/Map";
import Mushrooms, {
  loader as mushroomsLoader,
} from "./features/mushrooms/Mushrooms";

// ******************** USER ******************** //
import User, { 
  loader as userLoader 
} from "./features/user/User";
import UserEdit, {
  loader as editUserLoader,
  action as editUserAction,
} from "./features/user/UserEdit";
import UserSaved, {
  loader as savedUserLoader,
} from "./features/user/UserSaved";
import UserSavedCategory, {
  loader as savedCategoryUserLoader,
} from "./features/user/UserSavedCategory";

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
import CreateComment, {
  action as createCommentAction,
} from "./features/map/CreateComment";
import EditLocation, {
  loader as editLocationLoader,
  action as editLocationAction,
} from "./features/map/EditLocation";

import MushroomForm from "./features/mushrooms/MushroomForm";
import { UserProvider } from "./contexts/UserContext";

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
        action: createCommentAction,
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
        path: "/user/:id",
        element: <User />,
        loader: userLoader,
      },
      {
        path: "/user/:id/edit",
        element: <UserEdit />,
        loader: editUserLoader,
        action: editUserAction,
      },
      {
        path: "/user/:id/saved",
        element: <UserSaved />,
        loader: savedUserLoader,
      },
      {
        path: "/user/:id/saved/:category",
        element: <UserSavedCategory />,
        loader: savedCategoryUserLoader,
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
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;
