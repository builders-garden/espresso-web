import { Button } from "@nextui-org/react";
import { useWriteContract } from "wagmi";
import {
  BASE_SEPOLIA_USDC_ADDRESS,
  ESPRESSO_BNPL_CONTRACT_ADDRESS_BASE_SEPOLIA,
  MOCK_SABLIER_NFT_COLLATERAL,
} from "../lib/constants";
import { ESPRESSO_BNPL_ABI } from "../lib/sablier/abi";

export type BNPLButtonProps = {
  amount: number;
  sablierTokenId: number;
  payeeAddress: string;
};
export default function BNPLButton({
  amount,
  sablierTokenId,
  payeeAddress,
}: BNPLButtonProps) {
  const { data: hash, writeContractAsync } = useWriteContract();
  const buyNowPayLater = async () => {
    await writeContractAsync({
      address: ESPRESSO_BNPL_CONTRACT_ADDRESS_BASE_SEPOLIA,
      abi: ESPRESSO_BNPL_ABI,
      functionName: "getLoanWithSablier",
      args: [
        BigInt(amount),
        BASE_SEPOLIA_USDC_ADDRESS,
        MOCK_SABLIER_NFT_COLLATERAL,
        BigInt(sablierTokenId),
        payeeAddress,
      ],
    });
    console.log(hash);
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
