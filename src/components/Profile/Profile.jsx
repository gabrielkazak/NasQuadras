import { useState, useEffect } from 'react';
import useTeam from '../../hooks/useTeam';
import Header from '../Header/Header';
import './Profile.css';
import PlayerCard from '../PlayerCard/PlayerCard';
import TeamSelector from '../TeamSelector/TeamSelector';

const Profile = () => {
  const [userData, setUserData] = useState({
    id: "",
    username: "",
    favoriteTeam: "",
    favoritePlayers: ""
  });

  const [players, setPlayers] = useState([]);
  const [changeTeam, setChangeTeam] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('id');
    const name = localStorage.getItem('name');
    const favoriteTeam = localStorage.getItem('favoriteTeam');
    const favoritePlayers = localStorage.getItem('favoritePlayers');

    if (!id || !name || !favoriteTeam || !favoritePlayers) {
      window.location.href = 'login';
      return;
    }

    setUserData({
      id,
      username: name,
      favoriteTeam,
      favoritePlayers
    });
  }, []);

  useEffect(() => {
    const fetchFavoritePlayers = async () => {
      if (!userData.favoritePlayers) return;

      let favoritePlayers = userData.favoritePlayers
        .split(',')
        .map(p => p.trim())
        .filter(p => p.length > 0);

      try {
        const responses = await Promise.all(
          favoritePlayers.map(player =>
            fetch(`/api/players/search?name=${encodeURIComponent(player)}`)
              .then(res => res.json())
          )
        );

        const results = responses.map(r => Array.isArray(r) ? r[0] : r);

        setPlayers(results.filter(Boolean));
      } catch (error) {
        console.error("Erro ao buscar jogadores favoritos:", error);
      }
    };

    fetchFavoritePlayers();
  }, [userData.favoritePlayers]);

  const { data: team, isLoading } = useTeam(userData.favoriteTeam);

  const handleConfirmTeam = async (newTeam) => {
    try {
      await fetch('/api/user/team', { 
        method:'PATCH', 
        body: JSON.stringify({ favoriteTeam:newTeam }), 
        headers: { 'Content-Type': 'application/json' },
        credentials:'include'
      });

    setUserData((prev) => ({ ...prev, favoriteTeam: newTeam }));
    localStorage.setItem("favoriteTeam", newTeam);
    setChangeTeam(false);
    window.location.reload;
    } catch(error){
      console.error(error);
    }
  }

  const handleExit = () => {
    localStorage.removeItem('id');
    localStorage.removeItem('name');
    localStorage.removeItem('favoriteTeam');
    localStorage.removeItem('favoritePlayers');
    window.location.href = 'login';
  }

  if (!userData.id) return null;

  return (
    <section className="home min-h-screen flex items-center justify-center relative overflow-hidden flex-col pb-50 px-5">
      <Header />
      <div className="mt-30 text-center">
        <div className='flex justify-between gap-5'>
          <p className="text-4xl text-amber-50">
            Olá <span className="text-amber-600">{userData.username}</span>
          </p>
          <button className='text-red-600 text-2xl cursor-pointer hover:text-red-900' onClick={()=>handleExit()}>DESLOGAR</button>
        </div>
        <div
          className="flex justify-center items-center flex-col mt-10 mb-15 p-10 rounded-2xl"
          style={{
            backgroundColor: ` ${!isLoading && team ? team.color1 : '#f59e0b'}`
          }}
        >
          {isLoading && <p className="text-amber-400">Carregando time...</p>}
          
          {!isLoading && team && !changeTeam && (
            <>
              <img src={team.logoUrl} className="size-20" alt={team.name} />
              <p className="text-2xl text-white">{team.name}</p>
              <button 
                className="bg-red-700 w-40 h-10 rounded mt-4 border-2 border-red-700 hover:bg-transparent hover:text-red-600 transition cursor-pointer"
                onClick={() => setChangeTeam(true)}
              >
                Deseja Alterar?
              </button>
            </>
          )}

          {changeTeam && (
            <TeamSelector 
              onCancel={() => setChangeTeam(false)}
              onConfirm={handleConfirmTeam}
            />
          )}
        </div>

        <p className="text-4xl text-amber-50 mt-4">Seus Jogadores Favoritos:</p>
        <div className="h-fit text-center flex flex-col items-center">
          <div className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
            {players != null &&
              players.map((player) => (
                <PlayerCard 
                  key={player.personId_nba} 
                  name={player.full_name} 
                  team={player.team} 
                  position={''} 
                  picture={player.headshot_url} 
                />
              ))
            }
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
