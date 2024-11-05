import RaffleEntrance from "@components/RaffleEntrance";

const Home = () => {
  return (
    <div>
      <section className="w-full flex-center flex-col">
        <h1 className="head_text text-center">
          Have Fun & Win
          <br className="max-md:hidden" />
          <span className="orange_gradient">Blockchain Raffle</span>
        </h1>
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
