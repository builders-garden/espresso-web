import { Button } from "@nextui-org/react";
import { useCreateAndPayRequest } from "../lib/hooks/use-create-and-pay-request";
import { parseUnits } from "viem";
import { BASE_USDC_ADDRESS } from "../lib/constants";

export type PayButtonProps = {
  description: string;
  payeeAddress: string;
  payerAddress: string;
  amount: number;
};

export default function PayButton({
  description,
  payeeAddress,
  payerAddress,
  amount,
}: PayButtonProps) {
  const {
    mutate: createAndPayRequest,
    isPending: isCreateAndPayPending,
    isSuccess: isCreateAndPaySuccess,
  } = useCreateAndPayRequest({
    onSuccess() {
      console.log("Request created and paid");
    },
    onError(error: any) {
      console.error(error);
    },
  });

  const onPayRequest = async () => {
    createAndPayRequest({
      payeeAddress: payeeAddress,
      payerAddress: payerAddress,
      amount: amount,
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
