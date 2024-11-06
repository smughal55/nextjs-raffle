import RaffleEntrance from "@components/RaffleEntrance";

const Home = () => {
  return (
    <div className="container mx-auto px-4">
      <section className="w-full flex-center flex-col">
        <p className="head_text text-center">
          Have Fun & Win
          <br />
          <span className="orange_gradient">Blockchain Raffle</span>
        </p>
        <p className="desc text-center">
          A provably fair raffle system built on the blockchain.
        </p>
      </section>
      <br />
      <RaffleEntrance />
    </div>
  );
};

export default Home;
