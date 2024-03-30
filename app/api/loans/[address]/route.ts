import { NextRequest, NextResponse } from "next/server";
import { getLoans } from "../../../../lib/moralis";

export const GET = async (
  _req: NextRequest,
  { params: { address } }: { params: { address: string } }
) => {
  const loans = await getLoans(address as string);
  return NextResponse.json(loans);
};
