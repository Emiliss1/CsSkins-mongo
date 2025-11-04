import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./components/main";
import OpenCase from "./components/openCase";
import SignUp from "./components/auth/signUp";
import SignIn from "./components/auth/signIn";
import Inventory from "./components/inventory";
import AdminPanel from "./components/adminPanel";
import { BanErr } from "./components/auth/banErr";
import Profile from "./components/profile";
import Market from "./components/market/market";
import Trade from "./components/trade/trade";
import TradeCreateOffer from "./components/trade/trade-create-offer";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="case/:id" element={<OpenCase />}></Route>
          <Route path="signup" element={<SignUp />}></Route>
          <Route path="signin" element={<SignIn />}></Route>
          <Route path="inventory" element={<Inventory />}></Route>
          <Route path="admin" element={<AdminPanel />}></Route>
          <Route path="banned" element={<BanErr />}></Route>
          <Route path="profile" element={<Profile />}></Route>
          <Route path="market" element={<Market />}></Route>
          <Route path="trade" element={<Trade />}></Route>
          <Route
            path="trade-offer/:username"
            element={<TradeCreateOffer />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
