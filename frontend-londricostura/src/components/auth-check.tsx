'use client';
import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// ReactNode é o tipo correto para elementos filhos no React
interface AuthCheckProps {
  children: ReactNode;
}

export default function AuthCheck({ children }: AuthCheckProps) {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      router.push('/');
    }
  }, [router]); 

  return <>{children}</>;
}