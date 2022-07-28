import React, {useContext} from "react";
import {GiHamburgerMenu} from 'react-icons/gi'
import { Link } from 'react-router-dom'
import Context from "../../context/main";
import axios from "../../axios";

export default function Navbar() {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  const {login, setLogin,setPopup} = useContext(Context)
  const logout = async () => { 
    try {   
      await axios.get("/user/logout")
      setLogin(false)
    } catch (e) { 
      setPopup("Error para deslogar")
    }
  }
  return (
    <>
      <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 mb-3">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link
              className="text-md font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
              to={"/"}
            >
              Enquetes
            </Link>
            <button
              className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <GiHamburgerMenu size={24}/>
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center" +
              (navbarOpen ? " flex" : " hidden")
            }
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto w-full md:w-auto md:gap-x-10 gap-y-2 ">
            
              <li className="nav-item">
              
              <Link
                  className={`px-3 py-2 ${login ? "flex" : "hidden"}  justify-center items-center text-sm uppercase font-bold leading-snug text-white hover:opacity-75`}
                  to={"/user"}
                >
                  Painel
                </Link>
              <Link
                  className={`px-3 py-2 ${login ? "hidden" : "flex"}  justify-center items-center text-sm uppercase font-bold leading-snug text-white hover:opacity-75`}
                  to={"/login"}
                >
                  Login
                </Link>
              </li>
              <li className="nav-item  ">
                <Link
                  className={`px-3 py-2 ${login ? "hidden" : "flex"}  justify-center items-center text-sm uppercase font-bold leading-snug text-white hover:opacity-75`}
                  to={"/regist"}
                >
                  Registrar
                </Link>
              </li>
              <li className="nav-item">
            <a onClick={logout} className={`px-3 py-2 ${login ? "flex" : "hidden"} cursor-pointer justify-center items-center text-sm uppercase font-bold leading-snug text-white hover:opacity-75`}>
                Sair
              </a>
            </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}