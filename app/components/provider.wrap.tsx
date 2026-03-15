"use client"
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

import { Config } from "../wagmi.config"

const queryClient = new QueryClient();

const Providers= ({children}:{children:React.ReactNode}) => {
  return (
    
    <WagmiProvider config={Config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default Providers