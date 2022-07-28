import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "../../axios";
import mainContext from "../../context/main";
import Loading from "../../components/loading";

export default function Enquetes() {
  const { setPopup, login } = useContext(mainContext);
  const { id } = useParams();
  const [enqueteData, setEnqueteData] = useState();

  const votar = async (opcaoId) => {
    if (!login)
      return setPopup("É necessario estar logado para votar!", "error");
    try {
      await axios.put(`/enquete/${id}/votar`, { opcaoId });
      setPopup("Voto registrado!");
    } catch (e) {
      const message = e.response.data.error;
      setPopup(message, "error");
    }
  };

  useEffect(() => {
    const interval = setInterval(()=>{
      (async () => {
    
        const resp = await axios.get(`/enquete/${id}`);
        if (JSON.stringify(resp.data) == "{}") return;
        setEnqueteData(resp.data);
      })().then();
    }, 1500)

    return ()=>clearInterval(interval)
  }, []);

  if (!enqueteData) {
    return <Loading />;
  }

  return (
    <div className="w-full h-5/6 flex justify-center items-center">
      <div className="relative rounded-sm bg-zinc-800 w-11/12 md:w-8/12 lg:w-1/2 xl:w-1/3 px-6 py-16 border max-h-full overflow-y-auto border-zinc-700 gap-y-4 flex flex-col">
        <h1 className="text-3xl">{enqueteData["title"]}</h1>
        <p>{enqueteData["description"]}</p>
        <div className="flex flex-col gap-y-3">
          <p>
            <b>Opções:</b>
          </p>
          {enqueteData["opcoes"].map((v, i) => (
            <button
              className="py-2 rounded-md flex justify-center relative disabled:opacity-50 hover:bg-orange-500"
              key={i}
              onClick={() => votar(v["opcaoId"])}
              disabled={!enqueteData["available"]}
            >
              {v["opcao_str"]}
              <div className="absolute right-3">{v["num_votos"]}</div>
            </button>
          ))}
        </div>
        <div className=" w-full flex justify-between px-3 text-xs">
          <div>{new Date(enqueteData["startAt"]).toLocaleString()}</div>
          <div>até</div>
          <div>{new Date(enqueteData["endAt"]).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
