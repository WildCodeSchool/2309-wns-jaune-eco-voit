import React from 'react'

export const Login = () => {
  return (
    <div>
        <form >
        <h1 className="font-bold text-lg mb-8">Connexion</h1>
        <div>
          <input type="text" name="email" placeholder="Indiquez votre email" />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Indiquez votre mot de passe"
          />
        </div>
        <input type="submit" />
        <div>
          
        </div>

        </form> 
    </div>
  )
}
