import { useEffect, useState } from 'react';
import Header from '../Header/Header';
import './Roster.css';

const Roster = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([null, null, null, null, null]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [rosterName, setRosterName] = useState("");
  const [userRosters, setUserRosters] = useState([]);
  const [selectedRosterId, setSelectedRosterId] = useState(null);

  const positions = ["PG", "SG", "SF", "PF", "C"];
  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchPlayers = async () => {
      const team = localStorage.getItem('favoriteTeam');
      if (!team) return;

      try {
        const response = await fetch(`/api/players/team/${encodeURIComponent(team)}`);
        if (!response.ok) throw new Error('Erro na requisição');
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error("Erro ao buscar jogadores:", error);
      }
    };
    fetchPlayers();
  }, []);

  useEffect(() => {
    const fetchUserRosters = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`/api/roster/${userId}`);
        if (!response.ok) throw new Error("Erro ao buscar rosters");
        const data = await response.json();
        setUserRosters(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserRosters();
  }, [userId]);

 
  useEffect(() => {
    const fetchRosterPlayers = async () => {
      if (!selectedRosterId) return;
      try {
        const response = await fetch(`/api/roster/players/${selectedRosterId}`);
        if (!response.ok) throw new Error("Erro ao buscar jogadores do roster");
        const data = await response.json();
        
        const playersMap = JSON.parse(data.players);
        const newSelectedPositions = [null, null, null, null, null];

        await Promise.all(
          Object.entries(playersMap).map(async ([index, personId_nba]) => {
            try {
              const playerResponse = await fetch(`/api/players/${personId_nba}`);
              if (!playerResponse.ok) throw new Error("Erro ao buscar jogador");
              const playerData = await playerResponse.json();
              newSelectedPositions[index] = playerData;
            } catch (err) {
              console.error(`Erro ao buscar jogador ${personId_nba}:`, err);
            }
          })
      );

      setSelectedPositions(newSelectedPositions);

    } catch (error) {
      console.error(error);
    }
  };

  fetchRosterPlayers();
}, [selectedRosterId]);


  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 2) {
      try {
        const response = await fetch(`/api/players/search?name=${encodeURIComponent(term)}`);
        if (!response.ok) throw new Error('Erro na busca');
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Erro na busca:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const playersToShow = searchTerm.length > 2 ? searchResults : players;

  const handlePlayerClick = (player) => {
    setSelectedPositions((prev) => {
      const newSelected = [...prev];
      const alreadySelected = newSelected.some(slot => slot && slot.full_name === player.full_name);
      if (alreadySelected) return newSelected;
      const emptyIndex = newSelected.findIndex(slot => slot === null);
      if (emptyIndex !== -1) newSelected[emptyIndex] = player;
      return newSelected;
    });
  };

  const handlePlayerExit = (index) => {
    setSelectedPositions((prev) => {
      const newSelected = [...prev];
      newSelected[index] = null;
      return newSelected;
    });
  };

  const handleSaveRoster = async () => {
    if (!rosterName.trim()) {
      alert("Dê um nome para seu elenco antes de salvar!");
      return;
    }

    const playersObj = {};
    selectedPositions.forEach((player, index) => {
      if (player) playersObj[index] = player.personId_nba;
    });

    const rosterData = {
      rosterName,
      userId,
      players: JSON.stringify(playersObj)
    };

    try {
      const response = await fetch('/api/roster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rosterData),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Erro ao salvar elenco');
      alert("Elenco salvo com sucesso!");
      setRosterName("");
      setSelectedPositions([null, null, null, null, null]);
      window.location.reload();
    } catch (error) {
      console.error("Erro ao salvar elenco:", error);
      alert("Erro ao salvar elenco. Tente novamente.");
    }
  };

  const handleDeleteRoster = async () => {
  if (!selectedRosterId) {
    alert("Selecione um roster para excluir!");
    return;
  }

  if (!window.confirm("Tem certeza que deseja excluir este elenco?")) return;

  try {
    const response = await fetch(`/api/roster/delete/${selectedRosterId}`, {
      method: "DELETE",
      credentials: "include"
    });

    if (!response.ok) throw new Error("Erro ao excluir elenco");

    alert("Elenco excluído com sucesso!");
  
    const updatedRosters = userRosters.filter(r => r.id !== selectedRosterId);
    setUserRosters(updatedRosters);

    if (updatedRosters.length > 0) {
      setSelectedRosterId(updatedRosters[0].id);
    } else {
      setSelectedRosterId(null);
    }

    setSelectedPositions([null, null, null, null, null]);
    window.location.reload();

  } catch (error) {
    console.error("Erro ao excluir elenco:", error);
    alert("Erro ao excluir elenco. Tente novamente.");
  }
};

const handleUpdateRoster = async () => {
  if (!selectedRosterId) {
    alert("Selecione um roster para atualizar!");
    return;
  }

  if (!rosterName.trim()) {
    alert("Dê um nome para seu elenco antes de atualizar!");
    return;
  }

  const playersObj = {};
  selectedPositions.forEach((player, index) => {
    if (player) playersObj[index] = player.personId_nba;
  });

  const rosterData = {
    rosterName,
    userId,
    players: JSON.stringify(playersObj)
  };

  try {
    const response = await fetch(`/api/roster/update/${selectedRosterId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rosterData),
      credentials: 'include'
    });

    if (!response.ok) throw new Error('Erro ao atualizar elenco');

    alert("Elenco atualizado com sucesso!");
    setUserRosters(prev => prev.map(r => r.id === selectedRosterId ? { ...r, rosterName } : r));
    window.location.reload();

  } catch (error) {
    console.error("Erro ao atualizar elenco:", error);
    alert("Erro ao atualizar elenco. Tente novamente.");
  }
};




  return (
    <section className="roster-container min-h-screen flex items-center justify-center flex-col pt-20">
      <Header />
      <p className="text-4xl text-amber-50 mb-2 text-center">Monte seu próprio elenco:</p>

      <select
        className="mb-4 p-2 border rounded text-white border-white bg-black"
        value={selectedRosterId || ""}
        onChange={(e) => setSelectedRosterId(e.target.value)}
      >
        <option value="">Escolha um roster existente</option>
        {userRosters.map((r) => (
          <option key={r.id} value={r.id}>{r.rosterName}</option>
        ))}
      </select>

      <div className='flex w-full justify-center flex-col md:flex-row  gap-5'>
        {/* Lista da esquerda */}
        <div className='w-full md:w-120 h-120 bg-white rounded-lg p-5 flex flex-col'>
          <input 
            type="text" 
            placeholder="Buscar jogador da liga..." 
            value={searchTerm}
            onChange={handleSearch}
            className="mb-4 p-2 border rounded"
          />
          <div className='overflow-y-auto grid grid-cols-2 gap-3'>
            {playersToShow.map((player) => (
              <div
                key={player.id}
                className='mb-5 p-3 border-b border-gray-300 flex flex-col items-center cursor-pointer hover:bg-gray-100 rounded-4xl'
                onClick={() => handlePlayerClick(player)}
              >
                <img src={player.headshot_url} alt="" />
                <p className='text-1xl text-amber-950 text-center'>{player.full_name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className='h-120 w-full md:w-1/2 bg-black overflow-y-auto rounded-lg p-5'>
          <h2 className='text-2xl text-amber-50 mb-5'>Jogadores Selecionados:</h2>
          <div className="grid grid-cols-1 gap-4">
            {positions.map((pos, index) => (
              <div key={pos} className='p-3 bg-gray-900 rounded flex items-center gap-3 text-white'>
                <span className='w-12 font-bold'>{pos}:</span>
                {selectedPositions[index] ? (
                  <div className='flex justify-between w-full items-center'>
                    <div className='flex items-center gap-3'>
                      <img src={selectedPositions[index].headshot_url} alt="" className="w-20 h-15" />
                      <span>{selectedPositions[index].full_name}</span>
                    </div>
                    <button 
                      className='text-red-500 rounded-full border-2 border-red-500 size-8 cursor-pointer hover:text-black' 
                      onClick={() => handlePlayerExit(index)}
                    >
                      X
                    </button>
                  </div>
                ) : (
                  <span className='text-gray-400'>Vazio</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2 flex-col md:flex-row">
        <input 
          type="text" 
          placeholder="Nome do elenco..." 
          value={rosterName}
          onChange={(e) => setRosterName(e.target.value)}
          className="p-2 border-2 border-white text-white placeholder:text-white rounded w-64"
        />
        <button 
          onClick={handleSaveRoster}
          className='border-2 border-amber-500 text-white p-2 cursor-pointer rounded'
        >
          Salvar Elenco
        </button>
        <button
          onClick={handleDeleteRoster}
          className='border-2 border-red-500 text-white p-2 cursor-pointer rounded'
        >
          Excluir Elenco
        </button>
        <button 
          onClick={handleUpdateRoster}
          className='text-white p-2 border-2 border-gray-500 cursor-pointer rounded'
        >
          Atualizar Elenco
        </button>
      </div>
    </section>
  );
};

export default Roster;
