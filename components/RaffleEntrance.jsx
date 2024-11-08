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
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  let entranceFeeUpdate = "0";

  const [alertMessage, setAlertMessage] = useState("");

  const { data: hash, isPending, writeContract } = useWriteContract();

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

  useEffect(() => {
    if (isConfirmed) {
      window.location.reload();
    }
  }, [isConfirmed]);

  const handleEnterRaffle = async () => {
    try {
      await writeContract({
        abi,
        address: raffleAddress,
        functionName: "enterRaffle",
        value: ethers.parseUnits(entranceFeeUpdate, "ether"),
      });
    } catch (error) {
      if (error instanceof BaseError) {
        setAlertMessage(
          error.shortMessage || "An error occurred. Please try again."
        );
      } else {
        setAlertMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  // Function to truncate address for mobile view
  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

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

  // Generate blockchain explorer link based on chainId
  const getExplorerLink = (hash) => {
    const explorerUrls = {
      1: "https://etherscan.io/tx/",
      5: "https://goerli.etherscan.io/tx/",
      8453: "https://basescan.org/tx/",
      84532: "https://sepolia.basescan.org/tx/",
      // Add more network URLs as needed
    };
    return explorerUrls[chainId] ? `${explorerUrls[chainId]}${hash}` : null;
  };

  return (
    <div className="p-4 sm:p-8 font-satoshi font-semibold text-base sm:text-lg text-gray-700 text-center">
      {alertMessage && (
        <div className="p-3 mb-4 bg-red-100 text-red-600 rounded-md">
          {alertMessage}
        </div>
      )}
      {raffleAddress ? (
        <div className="space-y-3 sm:space-y-5">
          <div>
            <span className="orange_gradient text-base sm:text-lg">
              Current Jackpot: {calculateJackpotTotal(EntranceFee, Players)} ETH
            </span>
          </div>
          <div className="text-center">
            {Players && MaxPlayers && Players.length >= MaxPlayers ? (
              <div className="text-red-500 text-sm sm:text-base">
                Raffle is full. No more entries allowed.
              </div>
            ) : (
              <button
                className="w-full sm:w-auto px-4 py-2 sm:px-5 sm:py-2.5 text-base sm:text-lg bg-primary-orange rounded-full text-white hover:bg-orange-600 transition duration-300"
                onClick={handleEnterRaffle}
                disabled={isPending}
              >
                {isPending ? (
                  <div className="animate-spin spinner-border h-6 w-6 sm:h-8 sm:w-8 border-b-2 rounded-full mx-auto"></div>
                ) : (
                  <div>Enter Raffle</div>
                )}
              </button>
            )}
            <br />
            {hash && (
              <div className="text-xs sm:text-sm break-words">
                <span className="font-bold">Transaction Hash:</span>{" "}
                <span className="block sm:inline">{hash}</span>
              </div>
            )}

            {!isConfirmed && hash && (
              <div className="text-xs sm:text-sm text-blue-500 mt-2 break-words">
                Check your transaction status on the blockchain explorer:{" "}
                <a
                  href={getExplorerLink(hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline break-words"
                  style={{ wordBreak: "break-all" }}
                >
                  View Transaction
                </a>
              </div>
            )}

            {isConfirming && (
              <div className="text-xs sm:text-sm">
                Waiting for confirmation...
              </div>
            )}
            {isConfirmed && (
              <div className="text-xs sm:text-sm">Transaction confirmed.</div>
            )}
          </div>
          <div className="text-center font-inter text-sm sm:text-md text-gray-600">
            <span>Entrance Fee:</span> {ethers.formatEther(EntranceFee || "0")}{" "}
            ETH
          </div>
          <div className="text-center">
            <span className="font-bold text-base sm:text-lg">
              Current Players:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-3">
              {Players &&
                Players.map((player, index) => (
                  <div
                    key={index}
                    className="p-2 sm:p-2.5 rounded-md text-sm sm:text-base"
                    style={{ backgroundColor: getRandomColor() }}
                  >
                    <span className="block sm:hidden">
                      {truncateAddress(player)}
                    </span>
                    <span className="hidden sm:block">{player}</span>
                  </div>
                ))}
            </div>
          </div>
          <div className="text-center">
            <span className="font-bold text-base sm:text-lg">
              Most Recent Winner:
            </span>{" "}
            <span className="block sm:hidden text-sm sm:text-base">
              {truncateAddress(RecentWinner)}
            </span>
            <span className="hidden sm:block text-sm sm:text-base">
              {RecentWinner}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-8 font-inter text-sm sm:text-md text-gray-500 text-center">
          <p>Connect your wallet to see the entrance fee.</p>
        </div>
      )}
    </div>
  );
};

export default RaffleEntrance;
