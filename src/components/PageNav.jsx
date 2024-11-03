import { NavLink } from "react-router-dom";
import { LuHome } from "react-icons/lu";
import { MdMap } from "react-icons/md";
import { IoBookOutline } from "react-icons/io5";
import { TbMushroom } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";

function PageNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-bg-secondary p-2 text-white">
      <ul className="flex justify-around py-2">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "flex flex-col items-center text-navbar-active"
                : "flex flex-col items-center text-white"
            }
          >
            <span>
              <LuHome />
            </span>
            <span>Home</span>
          </NavLink>
        </li>
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
            to="/articles"
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
            to="/browse"
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
            to="/profile"
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
