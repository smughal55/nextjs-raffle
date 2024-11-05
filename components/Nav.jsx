import { ConnectButton } from "@rainbow-me/rainbowkit";

const Nav = () => (
  <div
    className="flex-between w-full mb-16 pt-3"
    style={{
      display: "flex",
      justifyContent: "space-between",
      padding: 12,
    }}
  >
    <ConnectButton />
  </div>
);

export default Nav;
