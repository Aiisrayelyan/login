"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const [user, setUser] = useState<{ name: string, surname: string, login: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/login');
    }
  }, [router]);

  if (!user) {
    return null;
  }

  return (
    <main className="p-4 px-6 mx-6">
      <h1 className="is-size-3">Profile</h1>
      <div className="box">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Surname:</strong> {user.surname}</p>
        <p><strong>Username:</strong> {user.login}</p>
      </div>
    </main>
  );
}
