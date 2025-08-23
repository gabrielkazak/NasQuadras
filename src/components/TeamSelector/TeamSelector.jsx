import { useEffect, useState } from 'react'

const TeamSelector = ({ onCancel, onConfirm }) => {
  const [teams, setTeams] = useState([])
  const [targetTeam, setTargetTeam] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('/api/teams');
        const result = await response.json();
        setTeams(result);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTeams();
  }, []);
  
  return (
    <div className="border-2 border-slate-400 w-fit h-fit pb-4 rounded-2xl px-4 flex flex-col items-center justify-center bg-gray-900">
      <div className="text-center mt-8">
        <p className="text-3xl mb-4 text-amber-50">Escolha seu time</p>
      </div>
      <div className="teams grid sm:grid-cols-6 grid-cols-3 gap-2">
        {teams.map((team) => (
          <div
            key={team.name}
            className={`size-20 border-2 rounded-2xl flex items-center justify-center cursor-pointer transition-colors ${
              targetTeam === team.name ? 'border-amber-500' : 'border-amber-50'
            }`}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = team.color1;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
            onClick={() => setTargetTeam(team.name)}
          >
            <img
              src={team.logoUrl}
              alt={team.name}
              className="max-h-16"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center mt-4 gap-3 w-full">
        <button 
          className="w-full h-10 text-black rounded bg-gray-200 hover:bg-gray-400 transition-colors"
          onClick={onCancel}
        >
          Voltar
        </button>
        <button 
          className="w-full h-10 text-black rounded bg-amber-500 hover:bg-amber-200 transition-colors"
          disabled={!targetTeam}
          onClick={() => onConfirm(targetTeam)}
        >
          Confirmar
        </button>
      </div>
    </div>
  )
}

export default TeamSelector
