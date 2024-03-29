import Moralis from "moralis";
import { MOCK_SABLIER_NFT_COLLATERAL } from "./constants";

export interface NFT {
  amount: string;
  token_id: string;
  token_address: string;
  contract_type: string;
  owner_of: string;
  last_metadata_sync: string;
  last_token_uri_sync: string;
  metadata: string;
  block_number: string;
  block_number_minted: string;
  name: string;
  symbol: string;
  token_hash: string;
  token_uri: string;
  minter_address: string;
  verified_collection: boolean;
  possible_spam: boolean;
  collection_logo: null | string;
  collection_banner_image: null | string;
}

export const getNFTs = async (
  address: string
): Promise<{ tokenId: string; image: string }[]> => {
  try {
    await Moralis.start({
      apiKey: process.env.MORALIS_API_KEY,
    });

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
