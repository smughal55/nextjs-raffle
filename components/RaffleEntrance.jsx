"use client";

import {
  BaseError,
  useReadContract,
  useWriteContract,
  useChainId,
  useAccount,
  useWaitForTransactionReceipt,
} from "wagmi";
import { abi, contractAddresses } from "@constants/index";
import { useEffect, useState } from "react";
import { ethers, BigNumber, parseEther } from "ethers";
import { writeContract } from "viem/actions";

const RaffleEntrance = () => {
  const { address, isConnecting, isDisconnected, isConnected } = useAccount();

  const chainId = useChainId();
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  let entranceFeeUpdate;
  //   console.log(isConnected);
  //   console.log(address);
  //   console.log(raffleAddress);
  //   console.log(chainId);

  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const { data: EntranceFee } = useReadContract({
    abi: abi,
    address: raffleAddress,
    functionName: "getEntranceFee",
  });

  const { data: RecentWinner } = useReadContract({
    abi: abi,
    address: raffleAddress,
    functionName: "getRecentWinner",
  });

  const { data: Players } = useReadContract({
    abi: abi,
    address: raffleAddress,
    functionName: "getPlayers",
  });

  const { data: MaxPlayers } = useReadContract({
    abi: abi,
    address: raffleAddress,
    functionName: "getMaxPlayers",
  });

  const { data: FeeBps } = useReadContract({
    abi: abi,
    address: raffleAddress,
    functionName: "getFeeBps",
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  if (isPending) {
    return (
      <div className="p-5 font-inter text-sm text-center text-gray-500">
        Loading...
      </div>
    );
  }

  //   if (error) {
  //     return (
  //       <div className="p-5 font-inter text-sm text-gray-500">
  //         Error: {error.message}
  //       </div>
  //     );
  //   }

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const calculateJackpotTotal = (entranceFee, players) => {
    if (!entranceFee || !players) return "0";
    entranceFeeUpdate = ethers.formatEther(entranceFee);
    let jackpotTotal = entranceFee * BigInt(players.length);
    const feeBps = FeeBps || 0;
    const fee = (jackpotTotal * feeBps) / 10000n;
    jackpotTotal -= fee;
    return ethers.formatEther(jackpotTotal.toString());
  };

  return (
    <div className="p-5 sm:p-10 font-satoshi font-semibold text-lg sm:text-xl text-gray-700 text-center">
      {raffleAddress ? (
        <div className="space-y-4 sm:space-y-6">
          <div>
            <span className="orange_gradient text-lg sm:text-xl">
              Current Jackpot: {calculateJackpotTotal(EntranceFee, Players)} ETH
            </span>
          </div>
          <div className="text-center">
            {Players && MaxPlayers && Players.length >= MaxPlayers ? (
              <div className="text-red-500">
                Raffle is full. No more entries allowed.
              </div>
            ) : (
              <button
                className="px-4 py-2 sm:px-6 sm:py-3 text-lg sm:text-xl bg-primary-orange rounded-full text-white hover:bg-orange-600 transition duration-300 w-full sm:w-auto"
                onClick={() =>
                  writeContract({
                    abi,
                    address: raffleAddress,
                    functionName: "enterRaffle",
                    value: ethers.parseUnits(entranceFeeUpdate, "ether"),
                  })
                }
                disabled={isPending}
              >
                {isPending ? (
                  <div className="animate-spin spinner-border h-8 w-8 sm:h-10 sm:w-10 border-b-2 rounded-full mx-auto"></div>
                ) : (
                  <div>Enter Raffle</div>
                )}
              </button>
            )}
            <br />
            {hash && <div>Transaction Hash: {hash}</div>}
            {isConfirming && <div>Waiting for confirmation...</div>}
            {isConfirmed && <div>Transaction confirmed.</div>}
          </div>
          <div className="text-center font-inter text-md sm:text-lg text-gray-600">
            <span>Entrance Fee:</span> {ethers.formatEther(EntranceFee || "0")}{" "}
            ETH
          </div>
          <div className="text-center">
            <span className="font-bold">Current Players:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mt-4">
              {Players &&
                Players.map((player, index) => (
                  <div
                    key={index}
                    className="p-2 sm:p-3 rounded-md"
                    style={{ backgroundColor: getRandomColor() }}
                  >
                    {player}
                  </div>
                ))}
            </div>
          </div>
          <div className="text-center">
            <span className="font-bold">Most Recent Winner:</span>{" "}
            {RecentWinner}
          </div>
        </div>
      ) : (
        <div className="p-5 sm:p-10 font-inter text-md text-gray-500 text-center">
          <p>Connect your wallet to see the entrance fee.</p>
        </div>
      )}
    </div>
  );
};

export default RaffleEntrance;
