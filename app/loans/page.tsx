"use client";

import { useEffect, useState } from "react";
import { shortenAddress } from "../../lib/utils";
import { http, useAccount, useWriteContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BorrowedEvent } from "../../lib/moralis";
import { Button, Spinner } from "@nextui-org/react";
import {
  BASE_SEPOLIA_USDC_ADDRESS,
  ESPRESSO_BNPL_CONTRACT_ADDRESS_BASE_SEPOLIA,
} from "../../lib/constants";
import { createPublicClient } from "viem";
import { baseSepolia } from "viem/chains";
import { ESPRESSO_BNPL_ABI } from "../../lib/sablier/espresso-abi";
import { ERC20_ABI } from "../../lib/sablier/erc20-abi";

export default function LoansPage() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [loans, setLoans] = useState<BorrowedEvent[]>([]);
  const { writeContractAsync } = useWriteContract();
  const fetchLoans = async () => {
    if (!address) return;
    const response = await fetch(`/api/loans/${address}`);
    const data = await response.json();
    setLoans(data);
  };

  useEffect(() => {
    setLoading(true);
    fetchLoans();
    setLoading(false);
  }, [address]);

  const repayLoan = async (loanId: string, amount: number) => {
    setPaymentLoading(true);
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(),
    });
    await writeContractAsync({
      address: BASE_SEPOLIA_USDC_ADDRESS,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [ESPRESSO_BNPL_CONTRACT_ADDRESS_BASE_SEPOLIA, BigInt(amount)],
    });
    const tx = await writeContractAsync({
      address: ESPRESSO_BNPL_CONTRACT_ADDRESS_BASE_SEPOLIA,
      functionName: "claimRepaidSablierCollateral",
      abi: ESPRESSO_BNPL_ABI,
      args: [BigInt(loanId)],
    });
    await publicClient.waitForTransactionReceipt({
      hash: tx as `0x${string}`,
    });
    setPaymentLoading(false);
  };

  return (
    <>
      <div className="flex min-w-full">
        <div className="flex flex-col bg-white flex-1 p-6 space-y-16 justify-center items-center">
          <div className="flex flex-col justify-center">
            <ConnectButton chainStatus={"full"} accountStatus={"full"} />
          </div>
          {loading && <Spinner size="lg" />}
          <div className="flex-1 flex flex-col justify-end space-y-8">
            {
              <div className="flex flex-col space-y-4">
                {loans.map((loan) => (
                  <div className="flex flex-col space-y-4 p-4 bg-white shadow-2xl rounded-lg">
                    <p className="text-lg font-semibold">Loan #{loan.loanId}</p>
                    <p>Amount borrowed: {parseFloat(loan.amount) / 10 ** 6}</p>
                    <p>
                      Deadline:{" "}
                      {new Date(
                        parseInt(loan.deadline) * 1000
                      ).toLocaleDateString()}
                    </p>
                    <p>Collateral: {loan.collateralTokenId}</p>
                    <p>
                      Collateral Address:{" "}
                      {shortenAddress(loan.collateralNftAddress)}
                    </p>
                    <Button
                      isLoading={paymentLoading}
                      color="primary"
                      onClick={() =>
                        repayLoan(loan.loanId, parseInt(loan.amount))
                      }
                    >
                      Repay Loan
                    </Button>
                  </div>
                ))}
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
}
