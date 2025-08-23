import React, { useState, useEffect } from 'react';
import './Register.css';

const InputField = ({ label, name, type = "text", placeholder, value, onChange }) => (
  <div className="mt-4">
    <p>{label}</p>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="mt-2 pl-4 border-2 border-gray-400 rounded h-8 w-full font-sans focus:outline-none focus:border-amber-500"
    />
  </div>
);

const Register = () => {

  const [registerStep, setRegisterStep] = useState("Form");
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    favoriteTeam: "",
    favoritePlayers:""
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

    if (registerStep === "Team" && teams.length === 0) {
      fetchTeams();
    }
  }, [registerStep, teams.length]);




  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };




  const verifyForm = () => {
    if (!formData.email || !formData.password || !formData.username || !confirmPassword) {
      setErrorMessage("Todos os campos são obrigatórios");
      return false;
    }
    return true;
  };




  const handleFormSubmit = async () => {
    if (formData.password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      setRegisterStep("Form");
      return;
    }
    if (formData.password.length < 8) {
      setErrorMessage("Senha deve ter no mínimo 8 dígitos.");
      setRegisterStep("Form");
      return;
    }
    if (!formData.favoriteTeam) {
      setErrorMessage("Escolha um time.");
      return;
    }

    try {
      const response = await fetch('/api/signin', {
        method: "POST",
        headers: { "Content-Type": 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('id', result.id);
        localStorage.setItem('name', result.username);
        localStorage.setItem('favoriteTeam', result.favTeam);
        localStorage.setItem('favoritePlayers', result.favoritePlayers);
        window.location.href = '/';
      } else {
        setErrorMessage(result.message || "Erro no registro");
        setRegisterStep("Form")
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Erro ao criar usuário: Nome de Usuario ou Email já cadastrados");
      setRegisterStep("Form");
    }
  };

  return (
    <div className="register sm:h-screen h-full flex items-center justify-center flex-col text-amber-50">
      <div className="text-center mb-8">
        <p className="text-4xl font-black text-amber-500">Nas Quadras</p>
        <p className="text-gray-400 font-sans">Faça parte da comunidade</p>
      </div>

      {registerStep === "Form" &&
        <div className="border-2 border-slate-400 w-fit h-fit rounded-2xl px-4 pb-4">
          <div className="text-center mt-8">
            <p className="text-3xl mb-4">Criar Conta</p>
            <p className="text-1xl mb-4 text-gray-400 font-sans font-bold">
              Tenha acesso aos jogadores e times da NBA
            </p>
          </div>
          <div className="input-fields mx-4">
            <InputField
              label="Username"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            <InputField
              label="Email"
              name="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
            />
            <InputField
              label="Senha"
              name="password"
              type="password"
              placeholder="12345678"
              value={formData.password}
              onChange={handleChange}
            />
            <InputField
              label="Confirme sua senha"
              name="confirmPassword"
              type="password"
              placeholder="12345678"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {errorMessage && <p className="text-red-500 text-center mt-2">{errorMessage}</p>}

          <button
            className="w-full h-10 mt-6 text-black cursor-pointer rounded bg-amber-500 hover:bg-amber-200 transition-colors"
             onClick={() => {if (verifyForm()) setRegisterStep("Team");}}
          >
            Próximo
          </button>
          <p className="text-center mt-4">
            Já tem uma conta? <a className="text-amber-500 hover:border-b-2 border-amber-500" href="/login">Faça login</a>
          </p>
        </div>
      }

      {registerStep === "Team" && teams.length > 0 &&
        <div className="border-2 border-slate-400 w-fit h-fit pb-4 rounded-2xl px-4 flex flex-col items-center justify-center">
          <div className="text-center mt-8">
            <p className="text-3xl mb-4">Escolha seu time</p>
          </div>
          <div className="teams grid sm:grid-cols-6 grid-cols-3 gap-2">
            {teams.map((team) => (
              <div
                key={team.name}
                className="size-20 border-2 border-amber-50 rounded-2xl flex items-center justify-center cursor-pointer transition-colors"
                style={{
                  background: formData.favoriteTeam === team.name
                    ? team.color1
                    : "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = team.color1;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    formData.favoriteTeam === team.name ? team.color1 : "transparent";
                }}
                onClick={() =>
                  setFormData(prev => ({ ...prev, favoriteTeam: team.name, favoritePlayers: "" }))
                }
              >
              <img
                src={team.logoUrl}
                alt={team.name}
                className="max-h-16"
              />
            </div>
          ))}

        </div>
        <div className='flex items-center mt-2 gap-3 w-full'>
          <button className="w-full h-10 text-black cursor-pointer rounded bg-gray-200 hover:bg-gray-400 transition-colors" onClick={() => setRegisterStep("Form")}>
            Voltar
          </button>
          <button className="w-full h-10 text-black cursor-pointer rounded bg-amber-500 hover:bg-amber-200 transition-colors" onClick={handleFormSubmit}>
            Confirmar
          </button>
        </div>
      </div>
      }
    </div>
  );
};

export default Register;
