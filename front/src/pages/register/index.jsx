import React, { useState, useContext } from "react";
import axios from "../../axios";
import { useNavigate } from 'react-router-dom'
import mainContext from '../../context/main'

export default function Register() {
  let navigate = useNavigate()
  const { setPopup } = useContext(mainContext)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const Regist = async () => { 
    if (password != repeatPassword) { 
      setRepeatPassword("") 
      setPopup("Senhas nao coincidem", "error")
      return 
    }

    try { 
      const response = await axios.post("/user", {username, password, repeatPassword})
      setPopup("Usuario criado com sucesso!", "")
      navigate("/login")

    } catch (e) {
      const message = e.response.data.error
      setPopup(message, "error")
    }
  }

  return (
    <div className="w-full h-5/6 flex justify-center items-center">
      <div className="relative rounded-sm bg-zinc-800 w-11/12 md:w-8/12 lg:w-1/2 xl:w-1/3 2xl:w-1/4 text-white px-6 py-16 border border-zinc-700 ">
        <h1 className="text-3xl font-bold mb-8">Register</h1>
        <div className="flex flex-col gap-y-5">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={30}
            minLength={3}
            className="w-full bg-transparent border-2 rounded-sm border-zinc-500 px-3 py-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            maxLength={30}
            minLength={6}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-2 rounded-sm border-zinc-500 px-3 py-2"
          />
          <input
            type="password"
            placeholder="Repeat Password"
            value={repeatPassword}
            maxLength={30}
            minLength={6}
            onChange={(e) => setRepeatPassword(e.target.value)}
            className="w-full bg-transparent border-2 rounded-sm border-zinc-500 px-3 py-2"
          />
          <button className="bg-orange-500 text-white py-2 font-bold  rounded-sm" onClick={Regist}>
            Registrar
          </button>
        </div>
      </div>
    </div>
  );
}
