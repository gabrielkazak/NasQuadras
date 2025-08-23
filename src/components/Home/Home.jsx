import { useState, useEffect } from 'react';
import Header from '../Header/Header';
import BestPlayers from '../BestPlayers/BestPlayers';
import './Home.css'

const Home = () => {
  const [userData, setUserData] = useState({
      id:"",
      username: "",
      favoriteTeam: "",
      favoritePlayers:""
    });

  useEffect(()=>{
    const id = localStorage.getItem('id');
    const name = localStorage.getItem('name');
    const favoriteTeam = localStorage.getItem('favoriteTeam');
    const favoritePlayers = localStorage.getItem('favoritePlayers');

    if(!id || !name || !favoritePlayers || !favoriteTeam){
      window.location.href = 'login';
      return;
    }

    setUserData({
      id: id,
      username: name,
      favoriteTeam: favoriteTeam,
      favoritePlayers: favoritePlayers
    })
  }, [])

  return (
    <>
    
    <section className="home min-h-screen flex items-center justify-center relative overflow-hidden flex-col">
      <Header></Header>
      <div className="absolute inset-0 opacity-100">
        <div className="absolute top-30 left-20 w-32 h-32 border-2 border-amber-500 rounded-full"></div>
        <div className="absolute bottom-40 right-32 w-24 h-24 border-2 border-amber-500 rounded-full"></div>
        <div className="absolute top-10/12 left-1/4 w-16 h-16 border border-amber-500 rounded-full"></div>
      </div>
      
      <div className="text-center z-10">
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-6xl md:text-8xl font-black text-amber-500">
            Nas Quadras
          </h1>
        </div>
        
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-8">
          Seu site de elencos e jogadores da{" "}
          <span className="text-orange-400 font-semibold">NBA </span>
          {userData.username}
        </p>
        
        <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full shadow-glow"></div>
      </div>
    </section>
    <BestPlayers/>
    </>
  );
}

export default Home