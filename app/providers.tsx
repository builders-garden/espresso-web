"use client";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base } from "viem/chains";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";

const config = getDefaultConfig({
  appName: "Espresso",
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
  chains: [base],
  ssr: true,
});

const queryClient = new QueryClient();

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </NextUIProvider>
  );
}
