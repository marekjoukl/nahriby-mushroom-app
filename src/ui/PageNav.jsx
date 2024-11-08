import { NavLink } from "react-router-dom";
import { MdMap } from "react-icons/md";
import { IoBookOutline } from "react-icons/io5";
import { TbMushroom } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";

function PageNav() {
  return (
    <nav className="fixed bottom-0 left-0 h-16 w-full bg-bg-secondary p-2 text-white">
      <ul className="flex justify-around py-2">
        <li>
          <NavLink
            to="/map"
            className={({ isActive }) =>
              isActive
                ? "flex flex-col items-center text-navbar-active"
                : "flex flex-col items-center text-white"
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
                ? "flex flex-col items-center text-navbar-active"
                : "flex flex-col items-center text-white"
            }
          >
            <span>
              <IoBookOutline />
            </span>
            <span>Read</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/mushrooms"
            className={({ isActive }) =>
              isActive
                ? "flex flex-col items-center text-navbar-active"
                : "flex flex-col items-center text-white"
            }
          >
            <span>
              <TbMushroom />
            </span>
            <span>Browse</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/user"
            className={({ isActive }) =>
              isActive
                ? "flex flex-col items-center text-navbar-active"
                : "flex flex-col items-center text-white"
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
