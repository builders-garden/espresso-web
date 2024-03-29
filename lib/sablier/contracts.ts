import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { ESPRESSO_BNPL_ABI } from "./espresso-abi";
import { ESPRESSO_BNPL_CONTRACT_ADDRESS_BASE_SEPOLIA } from "../constants";

export const getAddressToRepayLoan = async (loanId: string) => {
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });
  const address = await publicClient.readContract({
    address: ESPRESSO_BNPL_CONTRACT_ADDRESS_BASE_SEPOLIA,
    abi: ESPRESSO_BNPL_ABI,
    functionName: "s_idToWrapper",
    args: [BigInt(loanId)],
  });
  return address;
};
