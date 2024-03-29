"use client";

import { useEffect, useState } from "react";
import { Checkout } from "../../../lib/firebase/interfaces";
import { Button, Spinner } from "@nextui-org/react";
import PayButton from "../../../components/pay-button";
import { PaymentStatus, shortenAddress } from "../../../lib/utils";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function CheckoutPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    PaymentStatus.ERROR
  );
  const [message, setMessage] = useState<string>("");
  const [checkout, setCheckout] = useState<Checkout>();
  const fetchCheckout = async () => {
    const response = await fetch(`/api/checkouts/${id}`);
    const data = await response.json();
    setCheckout(data);
  };

  useEffect(() => {
    fetchCheckout();
    setLoading(false);
  }, []);

  return (
    <>
      <div className="flex min-w-full">
        <div className="flex flex-col bg-white flex-1 p-6 space-y-16 justify-center items-center">
          {address && (
            <div className="flex flex-row justify-between space-x-2">
              <p>Logged in with </p>
              <div className="font-semibold">{shortenAddress(address!)}</div>
            </div>
          )}
          <div className="flex flex-col justify-center text-center space-y-4">
            <p className="text-lg font-semibold">Order #{id}</p>
          </div>
          <div className="flex-1 flex flex-col justify-end space-y-8">
            <div className="flex flex-col">
              {loading && (
                <div className="flex flex-col space-y-4">
                  <Spinner />
                  <p>Loading payment details...</p>
                </div>
              )}
              {checkout?.items.map((item, index) => (
                <div
                  className={`flex flex-row space-x-16 justify-between items-center p-4 rounded-lg ${
                    index % 2 === 0 ? "bg-gray-100/70" : ""
                  }`}
                  id={"i-" + item.item.name}
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
            </div>
            {!isConnected && (
              <div className="flex flex-col justify-center">
                <ConnectButton />
              </div>
            )}
            {isConnected &&
              checkout &&
              (paymentStatus === PaymentStatus.INITIAL ||
                paymentStatus === PaymentStatus.ERROR) && (
                <div className="mt-6 flex flex-col justify-center text-center space-y-4">
                  <PayButton
                  setMessage={setMessage}
                    checkout={checkout!}
                    setPaymentStatus={setPaymentStatus}
                    description={"test tx"}
                    payeeAddress={checkout!.shop?.walletAddress!}
                    payerAddress={address!}
                    amount={
                      checkout?.items.reduce(
                        (acc, item) => acc + item.item.price * item.quantity,
                        0
                      ) || 0
                    }
                  />
                  <Button
                    className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                    size="lg"
                    radius="sm"
                    fullWidth
                  >
                    Buy Now Pay Later ⚡️
                  </Button>
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
            {message && (
              <div className="mt-6 flex flex-col justify-center text-center space-y-4">
                <p>{message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
