import "@styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import Nav from "@components/Nav";
import Providers from "@components/Providers";

export const metadata = {
  title: "Raffle",
  description: "Raffle Central",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="main">
            <div className="gradient" />
          </div>

          <main className="app">
            <Nav />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
