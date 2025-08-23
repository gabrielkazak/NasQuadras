import React, { useState} from 'react';
import './Login.css'

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

const Login = () => {

  const [formData, setFormData] = useState({
      username: "",
      password: "",
    });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  const handleFormSubmit = async () => {
    if(formData.password == "" || formData.username == ""){
      setErrorMessage("Todos os campos são obrigatórios");
      return;
    }
    
    try{
      const response = await fetch('/api/login', {
        method:"POST",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify(formData),
      })

      const result = await response.json();

      if(response.ok){
        localStorage.setItem('id', result.id);
        localStorage.setItem('name', result.username);
        localStorage.setItem('favoritePlayers', result.favoritePlayers);
        localStorage.setItem('favoriteTeam', result.favTeam);
        window.location.href = "/";
      }
    }catch(error){
      console.error(error);
      setErrorMessage("Usuário ou senha incorretos")
    }

  }


  return (
    <div className="login h-screen flex items-center justify-center flex-col text-amber-50">
      <div className="text-center mb-8">
        <p className="text-4xl font-black text-amber-500">Nas Quadras</p>
        <p className="text-gray-400 font-sans">Acesse a comunidade</p>
      </div>
        <div className="border-2 border-slate-400 w-fit h-fit rounded-2xl px-4 pb-4">
          <div className="text-center mt-8">
            <p className="text-3xl mb-4">Entrar na Conta</p>
            <p className="text-1xl mb-4 text-gray-400 font-sans font-bold">
              Reveja seus times e jogadores favoritos
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
              label="Senha"
              name="password"
              type="password"
              placeholder="12345678"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {errorMessage && <p className="text-red-500 text-center mt-2">{errorMessage}</p>}

          <button
            className="w-full h-10 mt-6 text-black cursor-pointer rounded bg-amber-500 hover:bg-amber-200 transition-colors"
            onClick={() => handleFormSubmit()}
          >
            Entrar
          </button>
          <p className="text-center mt-4">
            Não tem uma conta? <a className="text-amber-500 hover:border-b-2 border-amber-500" href="/register">Cadastre-se</a>
          </p>
        </div>
      </div>
  )
}

export default Login