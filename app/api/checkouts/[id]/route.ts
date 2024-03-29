import { NextRequest, NextResponse } from "next/server";
import { getCheckout, getShop } from "../../../../lib/firebase/checkout";

export const GET = async (
  _req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  const checkout = await getCheckout(id);
  if (!checkout.exists())
    return NextResponse.json("Checkout not found", { status: 400 });
  const shop = await getShop(checkout.data().shopId);
  return NextResponse.json({
    id,
    ...checkout.data(),
    shop: shop.data(),
  });
};
