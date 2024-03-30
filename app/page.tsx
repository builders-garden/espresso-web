"use client";

import { Link } from "@nextui-org/react";

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen min-w-full">
        <div className="flex flex-col flex-1 p-6 justify-center items-center space-y-8">
          <div className="flex flex-col flex-1 p-6 justify-center items-center space-y-4">
            <div className="text-6xl text-center font-black">Espresso ☕️</div>
            <div className="text-2xl text-center font-semibold">
              Selling goods in crypto has never been easier.
            </div>
          </div>
          <div className="flex flex-col flex-1 p-6 justify-center items-center space-y-4">
            <div className="flex flex-row justify-between space-x-4">
              <Link href="https://www.youtube.com/watch?v=Rg5apXr-K50">
                Watch our demo 🎥
              </Link>
            </div>
            <div className="flex flex-row space-x-2">
              <p>Github:</p>
              <Link href="https://github.com/builders-garden/espresso-web">
                Webapp
              </Link>
              <Link href="https://github.com/builders-garden/espresso-app">
                App
              </Link>
              <Link href="https://github.com/builders-garden/espresso-smart-contracts">
                Smart Contracts
              </Link>
            </div>
            <div className="flex flex-row space-x-2">
              <p>Made with ❤️ by</p>
              <Link href="https://builders.garden">builders garden</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
