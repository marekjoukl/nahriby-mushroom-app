/**
 * Project: ITU - Mushroom app
 * Author: Marek Joukl (xjoukl00)
 * Date: 15.12. 2024
 */

import { Outlet } from "react-router-dom";
import PageNav from "./PageNav";

function AppLayout() {
  return (
    <>
      <div className="min-h-screen bg-green-950 text-white">
        <Outlet />
        <PageNav />
      </div>
    </>
  );
}

export default AppLayout;
