import React from 'react'

const Header = () => {
  return (
    <header className="flex justify-center md:justify-between items-center h-10 w-screen z-10 absolute top-10 px-20">
      <div>
        <p className='hidden md:block font-black text-amber-500 text-4xl'>Nas Quadras</p>
      </div>
      <ul className="flex">
        <li className="cursor-pointer">
          <a
            className="text-white text-2xl hover:text-amber-500 border-b-2 border-transparent hover:border-b-amber-500"
            href="/"
          >
            Home
          </a>
        </li>
        <li className="mx-10 cursor-pointer">
          <a
            className="text-white text-2xl hover:text-amber-500 border-b-2 border-transparent hover:border-b-amber-500"
            href="/roster"
          >
            Elencos
          </a>
        </li>
        <li className="cursor-pointer">
          <a
            className="text-white text-2xl hover:text-amber-500 border-b-2 border-transparent hover:border-b-amber-500"
            href="/profile"
          >
            Perfil
          </a>
        </li>
      </ul>
    </header>
  )
}

export default Header