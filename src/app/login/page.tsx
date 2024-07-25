"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const data = {
      login: formData.get('login'),
      password: formData.get('password'),
    };

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log(response.status)

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      if (result.message) {
        setMessage(result.message);
      }

      if (result.message === 'Login successful') {
        localStorage.setItem('user', JSON.stringify(result.user));
        console.log('test2');
        router.push('/profile');
      }
    } catch (error) {
      console.error('There was an error!', error);
      setMessage('An unexpected error occurred.');
    }
  };

  return (
    <main className="p-4 px-6 mx-6">
      <h1 className="is-size-3">Login</h1>
      <div className="columns">
        <div className="column is-two-fifths p-4">
          <form className="box" onSubmit={handleSubmit}>
            <div className="field my-4">
              <input 
                type="text" 
                className="input is-dark"
                placeholder="please enter your login"
                name="login"
              />
            </div>
            <div className="field my-4">
              <input 
                type="password" 
                className="input is-dark"
                placeholder="please enter your password"
                name="password"
              />
            </div>
            {message && <p className="has-text-danger">{message}</p>}
            <button className="button is-success" type="submit">Submit</button>
          </form>
        </div>
      </div>
    </main>
  );
}
