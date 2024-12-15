/**
 * Project: ITU - Mushroom app
 * Authors: Marek Joukl (xjoukl00),
 *          Aurel Strigáč (xstrig00), 
 *          Igor Mikula (xmikul74), 
 *          Ondrej Kožányi (xkozan01)
 * Date: 15.12. 2024
 */

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Error from "./ui/Error";
import Map, { loader as locationsLoader } from "./features/map/Map";
import Mushrooms, {
  loader as mushroomsLoader,
} from "./features/mushrooms/Mushrooms";

// ******************** USER ******************** //
import User, { loader as userLoader } from "./features/user/User";
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

import RecipeAdd , {
  action as recipeAddAction,
} from "./features/recepies/RecipeAdd";

import RecipeEdit, {
  loader as recipeEditLoader,
} from "./features/recepies/RecipeEdit";

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
} from "./features/map/EditLocation";

import MushroomForm, {
  loader as mushroomsFormLoader,
  action as mushroomsFormAction,
} from "./features/mushrooms/MushroomForm";
import { UserProvider } from "./contexts/UserContext";
import MushroomDetail, {
  loader as mushroomDetailLoader,
} from "./features/mushrooms/MushroomDetail";
import { Toaster } from "react-hot-toast";

// Define the router with Root as the root element
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
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
        loader: mushroomsFormLoader,
        action: mushroomsFormAction,
      },
      {
        path: "/mushrooms/mushroomForm/:id",
        element: <MushroomForm />,
        loader: mushroomsFormLoader,
        action: mushroomsFormAction,
      },
      {
        path: "/mushrooms/mushroomDetail/:id",
        element: <MushroomDetail />,
        loader: mushroomDetailLoader,
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
        action: recipeAddAction,
      },
      {
        path: "/recipes/:id/edit",
        element: <RecipeEdit />,
        loader: recipeEditLoader,
      },
    ],
  },
]);

function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
      <Toaster />
    </UserProvider>
  );
}

export default App;
