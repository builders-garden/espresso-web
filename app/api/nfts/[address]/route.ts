import { NextRequest, NextResponse } from "next/server";
import { getNFTs } from "../../../../lib/moralis";

export const GET = async (
  _req: NextRequest,
  {
    params: { address },
  }: {
    params: { address: string };
  }
) => {
  const nfts = await getNFTs(address);
  return NextResponse.json(nfts);
};
