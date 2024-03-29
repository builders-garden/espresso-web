import Moralis from "moralis";
import {
  ESPRESSO_BNPL_CONTRACT_ADDRESS_BASE_SEPOLIA,
  MOCK_SABLIER_NFT_COLLATERAL,
} from "./constants";

let isMoralisInitialized = false;
const startMoralis = async () => {
  if (isMoralisInitialized) return Moralis;
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });
  isMoralisInitialized = true;
  return Moralis;
};

export const getNFTs = async (
  address: string
): Promise<{ tokenId: string; image: string }[]> => {
  try {
    await startMoralis();

    const res = await Moralis.EvmApi.nft.getWalletNFTs({
      chain: "0x14a34",
      format: "decimal",
      mediaItems: false,
      tokenAddresses: [MOCK_SABLIER_NFT_COLLATERAL],
      address: address,
    });
    if (res.raw.result?.length === 0) return [];
    return res.raw.result.map((r) => ({
      tokenId: r.token_id,
      image: JSON.parse(r.metadata!).image,
    }));
  } catch (e) {
    console.error(e);
    return [];
  }
};

export interface BorrowedEvent {
  borrower: string;
  deadline: string;
  loanId: string;
  amount: string;
  collateralNftAddress: string;
  collateralTokenId: string;
}

export const getLoans = async (address: string) => {
  await startMoralis();
  const response = await Moralis.EvmApi.events.getContractEvents({
    chain: "0x14a34",
    order: "DESC",
    address: ESPRESSO_BNPL_CONTRACT_ADDRESS_BASE_SEPOLIA,
    topic: "0xf80d1a1260678941818980e5b9c92f3c58c2c7dbd64e47f9a53f7ceda9f83a15",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "borrower",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "deadline",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "loanId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "collateralNftAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "collateralTokenId",
          type: "uint256",
        },
      ],
      name: "Borrowed",
      type: "event",
    },
  });
  if (!response.raw.result || response.raw.result.length === 0) return [];
  return response.raw.result
    ?.filter(
      (r) =>
        (r.data as BorrowedEvent).borrower.toLowerCase() ===
        address.toLowerCase()
    )
    .map((r) => r.data as BorrowedEvent);
};
