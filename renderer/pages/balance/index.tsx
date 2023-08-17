import { ipcRenderer } from "electron"
import { useEffect, useState } from "react"

interface balancedType {
  mnemonic: string,
  balance: string
}

export default function Balance() {
  const [data,setData] = useState<[] | balancedType[]>([]);
  useEffect(()=>{
    ipcRenderer.invoke('get-balanced').then((balanced:balancedType[]) => {
      setData(balanced)
    });

  },[])
  return (
    <div className="concurrent flex flex-col gap-2 p-5">
      {data.map((element,index)=>(
        <div className="flex gap-5" key={element.mnemonic + index}>
          <h1>{element.mnemonic}</h1>
          <p>{element.balance}</p>
        </div>
      ))} 
    </div>
  )
}