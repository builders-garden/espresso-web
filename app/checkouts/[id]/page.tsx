"use client";

import { useEffect, useState } from "react";
import { Checkout } from "../../../lib/firebase/interfaces";
import { Image, Spinner } from "@nextui-org/react";
import PayButton from "../../../components/pay-button";
import { PaymentStatus } from "../../../lib/utils";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import BNPLButton from "../../../components/bnpl-button";
import Link from "next/link";

export default function CheckoutPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(true);
  const [tokenId, setTokenId] = useState<string>();
  const [nfts, setNFTs] = useState<{ tokenId: string; image: string }[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    PaymentStatus.INITIAL
  );
  const [checkout, setCheckout] = useState<Checkout>();
  const fetchCheckout = async () => {
    const response = await fetch(`/api/checkouts/${id}`);
    const data = await response.json();
    setCheckout(data);
  };

  const fetchNFTs = async () => {
    if (!address) return;
    const response = await fetch(`/api/nfts/${address}`);
    const data = await response.json();
    setNFTs(data);
  };

  useEffect(() => {
    fetchCheckout();
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNFTs();
  }, [address]);

  return (
    <>
      <div className="flex min-w-full">
        <div className="flex flex-col bg-white flex-1 p-6 space-y-16 justify-center items-center">
          <div className="flex flex-col justify-center">
            <ConnectButton chainStatus={"full"} accountStatus={"full"} />
          </div>
          <div className="flex-1 flex flex-col justify-end space-y-8">
            <div className="flex flex-col">
              {loading && (
                <div className="flex flex-col space-y-4">
                  <Spinner />
                  <p>Loading order details...</p>
                </div>
              )}
              {checkout && (
                <div className="flex flex-col justify-start">
                  <div className="flex flex-col justify-center space-y-4 mb-8">
                    <p className="text-center text-2xl font-bold">
                      {checkout.shop?.name}
                    </p>
                  </div>
                  <div className="flex flex-col justify-start space-y-1 mb-4">
                    <p className="text-xl font-medium">Items in your order</p>
                    <p className="text-xs font-medium">#{id}</p>
                  </div>
                </div>
              )}
              {checkout?.items?.map((item, index) => (
                <div
                  className={`flex flex-row space-x-16 justify-between items-center p-4 rounded-lg ${
                    index % 2 === 0 ? "bg-gray-100/70" : ""
                  }`}
                  id={`${item.item.id}-${index}`}
                >
                  <div className="flex-1 flex flex-row space-x-2 items-center">
                    <p className="text-3xl">{item.item.emoji}</p>
                    <p className="flex-1 text-lg font-semibold">
                      {item.item.name}
                    </p>
                  </div>
                  <div className="flex flex-row items-center">
                    <p className="mr-4 text-grey-500">
                      {item.quantity} x ${item.item.price.toFixed(2)}
                    </p>
                    <p className="text-xl font-semibold">
                      ${(item.quantity * item.item.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              {checkout && (
                <div className="flex flex-row justify-between mt-4">
                  <p className="text-3xl font-bold">Total</p>
                  <p className="text-3xl font-bold">
                    $
                    {checkout.items
                      ?.reduce(
                        (acc, item) => acc + item.item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </p>
                </div>
              )}
            </div>
            {isConnected &&
              checkout &&
              (paymentStatus === PaymentStatus.INITIAL ||
                paymentStatus === PaymentStatus.ERROR) && (
                <div className="mt-6 flex flex-col justify-center text-center space-y-4">
                  <PayButton
                    checkout={checkout!}
                    setPaymentStatus={setPaymentStatus}
                    description={`Checkout with shop ${checkout!.shop?.name}`}
                    payeeAddress={checkout!.shop?.walletAddress!}
                    payerAddress={address!}
                    amount={
                      checkout?.items?.reduce(
                        (acc, item) => acc + item.item.price * item.quantity,
                        0
                      ) || 0
                    }
                  />
                  <BNPLButton
                    payerAddress={address!}
                    checkout={checkout!}
                    disabled={!nfts || nfts?.length === 0}
                    amount={
                      checkout?.items?.reduce(
                        (acc, item) => acc + item.item.price * item.quantity,
                        0
                      ) || 0
                    }
                    sablierTokenId={parseInt(tokenId!)}
                    setPaymentStatus={setPaymentStatus}
                    payeeAddress={checkout!.shop?.walletAddress!}
                  />

                  <div>
                    <p className="text-lg font-semibold">
                      {nfts?.length > 0
                        ? "Lock your stream, and we will pay for you"
                        : "No streams available to lock for payment"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {nfts.map((nft, index) => (
                      <div
                        className={`${
                          nft.tokenId === tokenId ? "" : "opacity-50"
                        }`}
                      >
                        <Image
                          onClick={() => setTokenId(nft.tokenId)}
                          id={`${nft.tokenId}-${index}`}
                          className="rounded-lg"
                          src={nft.image}
                          width={400}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            {isConnected && paymentStatus === PaymentStatus.PENDING && (
              <div className="mt-6 flex flex-col justify-center text-center space-y-4">
                <Spinner />
                <p>Processing payment...</p>
              </div>
            )}
            {isConnected && paymentStatus === PaymentStatus.SUCCESS && (
              <div className="mt-6 flex flex-col justify-center text-center items-center space-y-4">
                <CheckCircleIcon className="w-12 h-12 text-green-500" />
                <p className="text-xl font-bold">Payment successful!</p>
              </div>
            )}
            {isConnected && paymentStatus === PaymentStatus.ERROR && (
              <div className="mt-6 flex flex-col justify-center text-center space-y-4">
                <p className="text-red-500">
                  Payment failed, please try again.
                </p>
              </div>
            )}
            {isConnected && paymentStatus === PaymentStatus.SUCCESS && (
              <div className="flex flex-col justify-center text-center space-y-4">
                <Link className="text-primary" href={"/loans"}>
                  You can check here your loans
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
