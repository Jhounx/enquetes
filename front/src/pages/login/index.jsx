import React, { useState, useContext } from "react";
import axios from "../../axios";
import mainContext from '../../context/main'

export default function Login() {
  const {setLogin, setPopup} = useContext(mainContext)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const logar = async ()=> { 
    try { 
      const response = await axios.post("/user/login", {username, password})
      setPopup("Logado com sucesso", "")
      setLogin(true)
    } catch (e) { 
      setPopup(e.response.data.error, "error")
      setPassword("")
    }
  }

  return (
    <div className="w-full h-5/6 flex justify-center items-center">
      <div className=" rounded-sm bg-zinc-800 w-11/12 md:w-8/12 lg:w-1/2 xl:w-1/3 text-white px-6 py-16 border border-zinc-700 ">
        <h1 className="text-3xl mb-8">Login</h1>
        <div className="flex flex-col gap-y-5">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-transparent border-2 rounded-sm border-zinc-500 px-3 py-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-2 rounded-sm border-zinc-500 px-3 py-2"
          />
          <button className="bg-orange-500 text-white py-2 font-bold  rounded-sm" onClick={logar}>
            Logar
          </button>
        </div>
      </div>
    </div>
  );
}
