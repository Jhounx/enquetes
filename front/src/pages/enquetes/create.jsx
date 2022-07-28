import React, { useState, useContext } from "react";
import DateTimePicker from 'react-datetime-picker';
import mainContext from '../../context/main'
import axios from "../../axios";
import { useNavigate } from 'react-router-dom'

export default function Create() {
  let navigate = useNavigate()
  const { setPopup } = useContext(mainContext)
	const [options, setOptions] = useState([])
	const [titulo, setTitulo] = useState("")
	const [descricao, setDescricao] = useState("")
	const [option, setOption] = useState("")
  const [startAt, setStartAt] = React.useState(new Date());
  const [endAt, setEndAt] = React.useState(new Date());

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

  const criar = async () => { 
    if (options.length < 3) {
      return setPopup("O numero de opções minima é 3!", "error")
    }

    const createData = {
      title: titulo,
      description: descricao,
      startAt: Math.floor(startAt.getTime() /1000),
      endAt: Math.floor(endAt.getTime() /1000),
      opcoes: options
    }
    
    try { 
      const response = await axios.post("/enquete", createData)
      setPopup("Enquete criada com sucesso", "")
      navigate(`/enquete/${response.data.enqueteId}`)
    } catch (e) { 
      const message = e.response.data.error
      setPopup(message, "error")
    }
  }

  return (
    <div className="w-full h-5/6 flex items-center justify-center">
      <div className=" rounded-sm bg-zinc-800 w-11/12 md:w-8/12 lg:w-1/2 xl:w-1/3 text-white px-6 py-16 border border-zinc-700 ">
        <h1 className="text-3xl mb-8">Criar Enquete</h1>
        <div className="flex flex-col gap-y-5">
          <input
            type="text"
            placeholder="Titulo"
						value={titulo}
            maxLength={30}
						onChange={e=>{setTitulo(e.target.value)}}
            className="w-full bg-transparent border-2 rounded-sm border-zinc-500 px-3 py-2"
          />
          <input
            type="text"
            placeholder="Descricao"
						value={descricao}
						onChange={e=>{setDescricao(e.target.value)}}
            maxLength={160}
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
              className="w-3/4 border-2 bg-transparent border-r-0 px-3 py-2 border-zinc-500"
              placeholder="Option"
            />
            <button className="w-1/4" onClick={add}>Add</button>
          </div>
          <div className="flex gap-2">
						{
							options.map((v,i)=> { 

								return (<button className="p-2 rounded-lg text-base border-orange-700 border-2 px-3 py-2 bg-transparent" key={i} onClick={(v=>{remove(i)})}>{v}</button>)
							})
						}
					</div>
          <button className="bg-orange-500 text-white py-2 font-bold  rounded-sm" onClick={criar}>
            Criar!
          </button>
        </div>
      </div>
    </div>
  );
}
