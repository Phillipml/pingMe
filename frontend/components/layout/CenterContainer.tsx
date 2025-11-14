import React, { ReactNode } from "react";

export default function CenterContainer({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-[1400px] h-auto p-4 mx-auto">
        <div className="flex flex-col justify-center items-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 w-full lg:w-1/2">
      {children}
      </div>
    </div>
  );
}


