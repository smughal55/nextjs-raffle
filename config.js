import { http, createConfig } from "wagmi";
import { mainnet, baseSepolia } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet, baseSepolia],
  connectors: [coinbaseWallet()],
  transports: {
    [mainnet.id]: http(),
    [baseSepolia.id]: http(),
  },
});
