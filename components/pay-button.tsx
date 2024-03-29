import { Button } from "@nextui-org/react";
import { useCreateAndPayRequest } from "../lib/hooks/use-create-and-pay-request";
import { parseUnits } from "viem";
import { BASE_USDC_ADDRESS } from "../lib/constants";
import { Checkout } from "../lib/firebase/interfaces";
import { PaymentStatus } from "../lib/utils";

export type PayButtonProps = {
  description: string;
  payeeAddress: string;
  payerAddress: string;
  amount: number;
  checkout: Checkout;
  setPaymentStatus: (status: PaymentStatus) => void;
  setMessage: (message: string) => void;
};

export default function PayButton({
  setMessage,
  checkout,
  description,
  payeeAddress,
  payerAddress,
  amount,
  setPaymentStatus,
}: PayButtonProps) {
  const {
    mutate: createAndPayRequest,
    isPending: isCreateAndPayPending,
    isSuccess: isCreateAndPaySuccess,
  } = useCreateAndPayRequest({
    onSuccess() {
      console.log("Request created and paid");
      setPaymentStatus(PaymentStatus.SUCCESS);
    },
    onError(error: any) {
      console.error(error);
      setMessage("Error creating request\n" + error.message);
      setPaymentStatus(PaymentStatus.ERROR);
    },
  });

  const onPayRequest = async () => {
    setPaymentStatus(PaymentStatus.PENDING);
    createAndPayRequest({
      checkout,
      payerAddress: payerAddress,
      amount: amount,
      setMessage,
      requestParams: {
        payerIdentity: payerAddress,
        payeeIdentity: payeeAddress,
        signerIdentity: payerAddress,
        paymentAddress: payeeAddress,
        expectedAmount: Number(parseUnits(amount.toString(), 6)),
        currencyAddress: BASE_USDC_ADDRESS,
        reason: description,
      },
    });
  };

  const isPending = isCreateAndPayPending;
  const isSuccess = isCreateAndPaySuccess;
  return (
    <Button
      isLoading={isPending}
      isDisabled={isPending || isSuccess}
      color="primary"
      size="lg"
      radius="sm"
      fullWidth
      onClick={onPayRequest}
    >
      Pay
    </Button>
  );
}
