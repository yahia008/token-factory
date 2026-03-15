import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  sepolia
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";



export const Config = getDefaultConfig({
  appName: 'TOKEN-FACTORY',
  projectId: 'dfee36695d56e01c8dc46b411476c5cf',
  chains: [sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});


