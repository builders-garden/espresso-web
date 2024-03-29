"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { Checkout } from "../../../lib/firebase/interfaces";
import { Button, Spinner } from "@nextui-org/react";
import PayButton from "../../../components/pay-button";

export default function CheckoutPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { login, user } = usePrivy();
  const [loading, setLoading] = useState(true);

  const [checkout, setCheckout] = useState<Checkout>();
  const fetchCheckout = async () => {
    const response = await fetch(`/api/checkouts/${id}`);
    const data = await response.json();
    setCheckout(data);
  };

  console.log(user);
  useEffect(() => {
    fetchCheckout();
    setLoading(false);
  }, []);

  return (
    <>
      <div className="flex min-h-screen min-w-full">
        <div className="flex bg-white flex-1 p-6 justify-center items-center">
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col">
              {loading && <Spinner />}
              {checkout?.items.map((item, index) => (
                <div
                  className={`flex flex-row space-x-16 justify-between items-center p-4 rounded-lg ${
                    index % 2 === 0 ? "bg-gray-100/70" : ""
                  }`}
                  id={"i-" + item.item.id}
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
            {!user && (
              <Button
                className="bg-violet-600 hover:bg-violet-700 py-3 px-6 text-white rounded-lg"
                onClick={login}
              >
                Connect your wallet
              </Button>
            )}
            {user && (
              <div className="mt-6 flex flex-col justify-center text-center space-y-4">
                <PayButton
                  description={"test tx"}
                  payeeAddress={checkout!.shop?.address!}
                  payerAddress={user.wallet?.address!}
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
          </div>
        </div>
      </div>
    </>
  );
}
