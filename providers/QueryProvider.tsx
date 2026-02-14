import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos até considerar dados obsoletos
      gcTime: 1000 * 60 * 10, // 10 minutos no cache
      refetchOnWindowFocus: true, // Atualiza quando a janela ganha foco
      refetchOnMount: true, // Atualiza quando o componente monta
      refetchOnReconnect: true, // Atualiza quando reconecta à internet
      retry: 3, // Tenta 3 vezes em caso de erro
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 2,
      retryDelay: 1000,
    },
  },
});

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};