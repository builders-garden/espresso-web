"use client";

import Portal from "../components/graphics/portal";

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen min-w-full">
        <div className="flex bg-privy-light-blue flex-1 p-6 justify-center items-center">
          <div>
            <div>
              <Portal style={{ maxWidth: "100%", height: "auto" }} />
            </div>
            <div className="mt-6 flex justify-center text-center">
              <button className="bg-violet-600 hover:bg-violet-700 py-3 px-6 text-white rounded-lg">
                Log in
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
