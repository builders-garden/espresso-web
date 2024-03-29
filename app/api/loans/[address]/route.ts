import { NextResponse } from "next/server";
import { getLoans } from "../../../../lib/moralis";

export const GET = async (
  _req: NextResponse,
  { params: { address } }: { params: { address: string } }
) => {
  const loans = await getLoans(address as string);
  return NextResponse.json(loans);
};
