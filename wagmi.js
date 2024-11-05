import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
  baseSepolia,
} from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "raffle",
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    baseSepolia,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
      ? [baseSepolia]
      : []),
  ],
  //ssr: true,
});
//+40733631603
