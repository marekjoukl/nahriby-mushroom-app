import { BrowserRouter, Route, Routes } from "react-router-dom";
import Map from "./pages/Map";
import Articles from "./pages/Articles";
import User from "./pages/Profile";
import Homepage from "./pages/Homepage";
import Browse from "./pages/Browse";
import PageNotFound from "./pages/PageNotFound";
import PageNav from "./components/PageNav";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="map" element={<Map />} />
          <Route path="browse" element={<Browse />} />
          <Route path="profile" element={<User />} />
          <Route path="/" element={<Homepage />} />
          <Route path="articles" element={<Articles />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <PageNav />
      </BrowserRouter>
    </>
  );
}

export default App;
