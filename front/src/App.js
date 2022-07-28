import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Navbar from "./components/navbar";
import Register from "./pages/register";
import Enquetes from "./pages/enquetes";
import User from "./pages/user";
import Not_found from "./pages/404";
import Create from "./pages/enquetes/create";
import Context from "./context/main";
import Edit from "./pages/enquetes/edit";
import Redirect from './components/redirect'
import axios from "./axios";

export default function App() {
  const [login, setLogin] = useState(false);
  const [popupType, setPopupType] = useState("")
  const [visible, setVisible] = useState(false)
  const [popupMsg, setPopupMsg] = useState("")
  const setPopup = (msg, type) => { 
    setPopupType(type)
    setPopupMsg(msg)
    setVisible(true)
    setTimeout(() => {
      setVisible(false)
    }, 3000);
  }

  useEffect(()=>{
    (async () =>{
      try {
        await axios.get("/user")
        setLogin(true)
      } catch (e) { 
        setLogin(false)
      }
    })().then()
  }, [])

  return (
    <Context.Provider value={{login, setLogin, setPopup}}>
      <div className={`absolute right-10 top-20 z-50 text-white ${visible ? "opacity-100" : "opacity-0"} delay-300 transition ease-in-out px-10 ${popupType == "error" ? "bg-red-500" : "bg-green-600"} py-4 rounded-md`}>
        <b>{popupMsg}</b>
      </div>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={login ? <Redirect /> :<Login />} />
          <Route exact path="/regist" element={login ? <Redirect /> :<Register />} />
          <Route exact path="/enquete/:id" element={<Enquetes />} />
          {login && (
            <>
              <Route exact path="/user" element={<User />} />
              <Route exact path="/enquete/create" element={<Create />} />
              <Route exact path="/enquete/edit/:id" element={<Edit />} />
            </>
          )}
          <Route path="*" element={<Not_found />} />
        </Routes>
      </Router>
    </Context.Provider>
  );
}
