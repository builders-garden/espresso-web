import { Button } from "@nextui-org/react";
import { useWriteContract } from "wagmi";
import {
  BASE_SEPOLIA_USDC_ADDRESS,
  ESPRESSO_BNPL_CONTRACT_ADDRESS_BASE_SEPOLIA,
  MOCK_SABLIER_NFT_COLLATERAL,
} from "../lib/constants";
import { ESPRESSO_BNPL_ABI } from "../lib/sablier/espresso-abi";
import { baseSepolia } from "viem/chains";
import { createPublicClient, http } from "viem";
import { PaymentStatus } from "../lib/utils";

export type BNPLButtonProps = {
  amount: number;
  sablierTokenId: number;
  payeeAddress: string;
  setPaymentStatus: (isPending: PaymentStatus) => void;
};
export default function BNPLButton({
  setPaymentStatus,
  amount,
  sablierTokenId,
  payeeAddress,
}: BNPLButtonProps) {
  const { writeContractAsync } = useWriteContract();
  const buyNowPayLater = async () => {
    /*await writeContractAsync({
      address: MOCK_SABLIER_NFT_COLLATERAL,
      abi: SABLIER_ABI,
      functionName: "setApprovalForAll",
      args: [ESPRESSO_BNPL_CONTRACT_ADDRESS_BASE_SEPOLIA, true],
    });*/
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(),
    });

    setPaymentStatus(PaymentStatus.PENDING);
    const tx = await writeContractAsync({
      address: ESPRESSO_BNPL_CONTRACT_ADDRESS_BASE_SEPOLIA,
      abi: ESPRESSO_BNPL_ABI,
      functionName: "getLoanWithSablier",
      args: [
        BigInt(amount * 10 ** 6),
        BASE_SEPOLIA_USDC_ADDRESS,
        MOCK_SABLIER_NFT_COLLATERAL,
        BigInt(sablierTokenId),
        payeeAddress,
      ],
    });
    await publicClient.waitForTransactionReceipt({
      hash: tx as `0x${string}`,
    });
    setPaymentStatus(PaymentStatus.SUCCESS);
  };
  return (
    <Button
      onClick={buyNowPayLater}
      className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
      size="lg"
      radius="sm"
      fullWidth
    >
      Buy Now Pay Later ⚡️
    </Button>
  );
}
