import { Outlet } from "react-router-dom";
import PageNav from "./PageNav";

function AppLayout() {
  return (
    <>
      <Outlet />
      <PageNav />
    </>
  );
}

export default AppLayout;
