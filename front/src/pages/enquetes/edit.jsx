import React, { useEffect, useState, useContext } from "react";
import {useParams, useNavigate} from 'react-router-dom'
import DateTimePicker from 'react-datetime-picker';
import mainContext from '../../context/main'
import axios from "../../axios";
import Loading from "../../components/loading";

export default function Edit() {
  const navigate = useNavigate()
  const {id} = useParams()
  const { setPopup } = useContext(mainContext)
	const [options, setOptions] = useState([])
	const [titulo, setTitulo] = useState("")
	const [descricao, setDescricao] = useState("")
	const [option, setOption] = useState("")
  const [startAt, setStartAt] = useState(new Date())
  const [endAt, setEndAt] = useState(new Date())

	const add = () => {
		if (option.trim() == "") return 
		let opt = [...options]
		opt.push(option)
		setOption("")
		setOptions(opt)
	}

	const remove = (id) => { 
		let opt = [...options]
		opt.splice(id, 1)
		setOptions(opt)
	}

  useEffect(()=>{
    (async ()=> { 
        const resp = await axios.get(`/enquete/${id}`)
        const data = resp.data
        setTitulo(data.title)
        setDescricao(data.description)
        setOptions(data.opcoes.map(v=>v["opcao_str"]))
        setStartAt(new Date(data.startAt))
        setEndAt(new Date(data.endAt))
    })().then()
  }, [])

  const edit = async () => {
    if (options.length < 3) {
      return setPopup("O numero de opções minima é 3!", "error")
    }

    const editData = {
      title: titulo,
      description: descricao,
      startAt: Math.floor(startAt.getTime() /1000),
      endAt: Math.floor(endAt.getTime() /1000),
      opcoes: options
    }

    try { 
      const response = await axios.put(`/enquete/${id}`, editData)
      setPopup("Enquete editada com sucesso", "")
      navigate(`/enquete/${id}`)
    } catch (e) { 
      const message = e.response.data.error
      setPopup(message, "error")
    }
  }

  if (options.length ==0) {
    return <Loading />
  }

  return (
    <div className="w-full h-5/6 flex items-center justify-center">
      <div className=" rounded-sm bg-zinc-800 w-11/12 md:w-8/12 lg:w-1/2 xl:w-1/3 text-white px-6 py-16 border border-zinc-700 ">
        <h1 className="text-3xl mb-8">Editar Enquete</h1>
        <div className="flex flex-col gap-y-5">
          <input
            type="text"
            placeholder="Titulo"
						value={titulo}
						onChange={e=>{setTitulo(e.target.value)}}
            className="w-full bg-transparent border-2 rounded-sm border-zinc-500 px-3 py-2"
          />
          
          <input
            type="text"
            placeholder="Descricao"
						value={descricao}
						onChange={e=>{setDescricao(e.target.value)}}
            maxLength={160}
            minLength={3}
            className="w-full bg-transparent border-2 rounded-sm border-zinc-500 px-3 py-2"
          />
          <div className="w-full flex flex-col relative">
            <p className="absolute text-white font-bold z-20 bg-zinc-800" style={{left:10, top: -10}}>Começa em:</p>
            <DateTimePicker  className="border-2 border-zinc-500 px-3 py-2 rounded-sm" format="dd/MM/y h:mm:ss a" onChange={setStartAt}  value={startAt}/>
          </div>
          <div className="w-full flex flex-col relative">
            <p className="absolute text-white font-bold z-20 bg-zinc-800" style={{left:10, top: -10}}>Termina em:</p>
            <DateTimePicker  className="border-2 border-zinc-500 px-3 py-2 rounded-sm" format="dd/MM/y h:mm:ss a" onChange={setEndAt}  value={endAt}/>
          </div>
          <div className="flex w-full flex-row overflow-auto rounded-sm">
            <input
              type="text"
							value={option}
							onChange={e=>{setOption(e.target.value)}}
              className="w-3/4 border-2 bg-transparent border-zinc-500 px-3 py-2 border-r-0"
              placeholder="Option"
              maxLength={30}
              minLength={1}
            />
            <button className="w-1/4 " onClick={add}>Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
						{
							options.map((v,i)=> { 

								return (<button className="p-2 rounded-lg text-base border-orange-700 border-2 bg-transparent" key={i} onClick={(v=>{remove(i)})}>{v}</button>)
							})
						}
					</div>
          <button className="bg-orange-500 text-white py-2 font-bold  rounded-sm" onClick={edit}>
            Editar!
          </button>
          <button className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white py-2 font-bold  rounded-sm">
            Deletar Enquete
          </button>
        </div>
      </div>
    </div>
  );
}
