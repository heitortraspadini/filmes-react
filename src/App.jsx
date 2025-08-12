import { useEffect, useState } from 'react'
import './App.css'
import Buscar from './component/Buscar.jsx'
import Spinner from './component/Spinner.jsx'
import Card from './component/Card.jsx'
import { useDebounce } from 'react-use'


const App = () => {
  const [termoBuscar, setTermoBuscar] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useDebounce(() => {
    setDebouncedTerm(termoBuscar);  
  }, 500, [termoBuscar]);

  const API_TOKEN = import.meta.env.VITE_TMDB_API_TOKEN;
  const API_URL_BASE = "https://api.themoviedb.org/3";
  const API_OPCOES = {
    method: "GET",
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_TOKEN}`
    }
  }
 
  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage('');
    try{
      const endpoint = query
        ? `${API_URL_BASE}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_URL_BASE}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPCOES)
      if(!response.ok){
        throw new Error(`Erro na requisição.`)
      }
 
      const data = await response.json();
 
      if(data.Response == "False"){
        setErrorMessage(data.Error || "Falha ao consultar filmes");
        setMovieList([]);
        return;
      }
 
      setMovieList(data.results || []);
     
    } catch (error) {
      console.error(`Erro ao buscar filmes: ${error}`);
      setErrorMessage(`Erro ao buscar filmes, favor tentar novamente mais tarde.`);
    } finally {
      setIsLoading(false);
    }
  }
 
  useEffect(() => {
    fetchMovies(debouncedTerm);
  },[debouncedTerm]);

  return(
    <main>
      <div className="pattern"/>
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Banner do Herói" />
          <h1>
            Encontre Os <span className="text-gradient">Filmes</span> Que Você Vai Gostar
          </h1>
        </header>
          <Buscar termoBuscar={termoBuscar} setTermoBuscar={setTermoBuscar}/>
          <h1 className='text-white'>{termoBuscar}</h1>
          <section className='all-movies'>
            <br></br><h2>Todos os filmes</h2><br></br>
            {IsLoading? (
              <Spinner/>
            ): errorMessage? (
            <p className='text-red-50'>{errorMessage}</p>
            ):(
              <ul>
                {movieList.map((movie) => (
                  <Card key={movie.id} movie={movie}/>
                ))}
              </ul>
            )
          }
          </section>
      </div>
    </main>
 
 
  )
}
 
export default App