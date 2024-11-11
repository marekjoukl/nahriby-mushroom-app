import { Outlet } from "react-router-dom";
import PageNav from "./PageNav";

function AppLayout() {
  return (
    <>
      <div className="bg-green-950 min-h-screen text-white">
        <Outlet />
        <PageNav />
      </div>
    </>
  );
}

export default AppLayout;
