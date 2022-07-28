import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../axios'
import Loading from "../../components/loading";

export default function Home() {
  let navigate = useNavigate()
  const [enquetes, setEnquetes] = useState()


  useEffect(()=> {
    (async ()=>{
      try { 
        const enquetesResp = await axios.get("/enquetes")
        setEnquetes(enquetesResp.data)
      } catch (e) { 
        console.log(e)
      }
    })().then()
  },[])

  if (!enquetes) { 
    return (<Loading />)
  }

  return (
    <>
    <h1 className='text-center'>Lista de Enquetes</h1>
    <div className="w-full h-5/6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 overflow-y-auto align-middle gap-y-7 pt-5 px-3">
      {
        enquetes.map((v,i)=> {
          return (
            <div className='flex justify-center w-full max-h-72' key={i}>
              <div className=" rounded-md bg-zinc-800 w-11/12 border flex flex-col justify-between overflow-auto border-zinc-700  ">
                  <div className='h-full px-10 pt-10 pb-4 overflow-y-auto flex flex-col justify-between'>
                      <h1 className="text-3xl">{v["title"]}</h1>
                      <p className=''>{v["description"]}</p>
                      <div className='flex justify-between text-xs'>
                          <b>start: {new Date(v["startAt"]).toLocaleString()}</b>
                          <b>end: {new Date(v["endAt"]).toLocaleString()}</b>
                      </div>
                  </div>
                  <button className='w-full py-2 font-bold bg-orange-500 hover:bg-orange-700 transition ease-in-out' onClick={e=>{navigate(`/enquete/${v["id"]}`)}}>Participar</button>
              </div>
            </div>
          )
        })
      }
      
      
    </div>
    </>
  )
}
