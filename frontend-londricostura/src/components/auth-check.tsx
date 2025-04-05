'use client';
import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Login from '@/app/Login/page';

// ReactNode é o tipo correto para elementos filhos no React
interface AuthCheckProps {
  children: ReactNode;
}

export default function AuthCheck({ children }: AuthCheckProps) {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      router.push('/Login');
    }
  }, [router]);

  // pra evitar o flick 
  /*if (!localStorage.getItem('access_token')) {
    console.log('Token não encontrado, redirecionando para a página de login');
    return <Login />;
  }*/

  return <>{children}</>;
}