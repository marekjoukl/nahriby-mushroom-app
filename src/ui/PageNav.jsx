/**
 * Project: ITU - Mushroom app
 * Author: Marek Joukl (xjoukl00)
 * Date: 15.12. 2024
 */

import { NavLink } from "react-router-dom";
import { MdMap } from "react-icons/md";
import { IoBookOutline } from "react-icons/io5";
import { TbMushroom } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { useUserId } from "../contexts/UserContext";

function PageNav() {
  const userId = useUserId(); // Get the user ID from the context

  return (
    <nav className="fixed bottom-0 left-0 h-16 w-full bg-bg-secondary p-2 text-white">
      <ul className="flex justify-around py-2">
        <li>
          <NavLink
            to="/map"
            className={({ isActive }) =>
              isActive
                ? "flex flex-col items-center text-navbar-active transition-transform duration-100 hover:opacity-80"
                : "flex flex-col items-center text-white transition-transform duration-100 hover:opacity-80"
            }
          >
            <span>
              <MdMap />
            </span>
            <span>Map</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/recipes"
            className={({ isActive }) =>
              isActive
                ? "flex flex-col items-center text-navbar-active transition-transform duration-100 hover:opacity-80"
                : "flex flex-col items-center text-white transition-transform duration-100 hover:opacity-80"
            }
          >
            <span>
              <IoBookOutline />
            </span>
            <span>Recipes</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/mushrooms"
            className={({ isActive }) =>
              isActive
                ? "flex flex-col items-center text-navbar-active transition-transform duration-100 hover:opacity-80"
                : "flex flex-col items-center text-white transition-transform duration-100 hover:opacity-80"
            }
          >
            <span>
              <TbMushroom />
            </span>
            <span>Atlas</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/user/${userId}`} // Dynamic user ID in the URL
            className={({ isActive }) =>
              isActive
                ? "flex flex-col items-center text-navbar-active transition-transform duration-100 hover:opacity-80"
                : "flex flex-col items-center text-white transition-transform duration-100 hover:opacity-80"
            }
          >
            <span>
              <CgProfile />
            </span>
            <span>Profile</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;
