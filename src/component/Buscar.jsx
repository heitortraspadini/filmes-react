import React from "react";

const Buscar = ({termoBuscar, setTermoBuscar}) => {
    return (
        <div className="text-white text-3xl">
            <img src="busca.svg" alt="" />
            <input 
                type="text" 
                placeholder="Busque em milhares de filmes"
                value={termoBuscar}
                onChange={(e) => setTermoBuscar(e.target.value)}
            />
            </div>

    )
}
export default Buscar;