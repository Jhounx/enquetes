import React, {useEffect, useState, useContext} from "react";
import {useNavigate} from 'react-router-dom'
import axios from "../../axios";
import mainContext from '../../context/main'

export default function User() {
  let navigate = useNavigate()
  const [password, setPassword] = useState("")
  const [oldPassword, setOldPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const { setPopup } = useContext(mainContext)
  const [enquetes, setEnquetes] = useState([])

  useEffect(()=>{
    (async () =>{
      try { 
        const response = await axios("/enquetes/me")
        if (JSON.stringify(response.data) == "{}") return
        setEnquetes(response.data)
      } catch (e) { 
        setPopup("erro ao carregar suas enquetes", "error")
      }
    })().then()
  }, [])

  const changePassword = async () => { 
    const updateData = {password, oldPassword, repeatPassword}
    if (password != repeatPassword)  return setPopup("Senhas não coincidem!", "error")
    try {
      await axios.put("/user/me", updateData)
      setPopup("Senha alterada com sucesso!")
    } catch (e) { 
      const message = e.response.data.error
      setPopup(message, "error")
    }
  }

  return (
    <div className="w-full flex flex-col md:flex-row overflow-auto gap-y-6 py-10">
      <div className="flex justify-center w-full items-center">
        <div className=" rounded-sm bg-zinc-800 w-11/12  text-white px-6 py-16 border border-zinc-700 ">
          <h1 className="text-3xl mb-8">Reset Password</h1>
          <div className="flex flex-col gap-y-5">
            <input
              type="text"
              placeholder="New Password"
              value={password}
              onClick={v=>setPassword(v.target.value)}
              className="w-full bg-transparent border-2 rounded-sm px-3 py-2 border-zinc-500"
            />
            <input
              type="text"
              value={repeatPassword}
              placeholder="Repeat New Password"
              onClick={v=>repeatPassword(v.target.value)}
              className="w-full bg-transparent border-2 rounded-sm px-3 py-2 border-zinc-500"
            />
            <input
              type="text"
              value={oldPassword}
              placeholder="Old Password"
              onClick={v=>setOldPassword(v.target.value)}
              className="w-full bg-transparent border-2 rounded-sm px-3 py-2 border-zinc-500"
            />
            <button className="bg-orange-500 text-white py-2 font-bold  rounded-sm" onClick={changePassword}>
              Reset Password
            </button>
          </div>
        </div>
      </div>
      <div className="lg:h-full flex justify-center w-full items-center">
        <div className=" rounded-sm bg-zinc-800 w-11/12  overflow-auto text-white border border-zinc-700 text-xs flex flex-col">
            <div className="flex">
                <div className="grow flex justify-center items-center font-bold py-2">
                    Titulo
                </div>
                <div className="grow flex justify-center items-center font-bold">
                    Start at
                </div>
            </div>
            <div className="h-96 w-full flex flex-col overflow-y-auto">
              {
                enquetes.map((v,i)=>{
                  return (
                  <button className="flex bg-transparent" key={i} onClick={e=>{navigate(`/enquete/edit/${v["id"]}`)}}>
                      <div className="overflow-x-auto w-1/2 flex justify-center items-center font-bold py-2 ">
                          {v["title"]}
                      </div>
                      <div className="overflow-x-auto w-1/2 flex justify-center items-center font-bold py-2">
                          {new Date(v["startAt"]).toLocaleString()}
                      </div>
                  </button>
                  )
                })
              }
            </div>
            <button className="py-2 text-sm" onClick={v=>navigate("/enquete/create")}>Criar Enquete</button>
        </div>
      </div>
    </div>
  );
}
