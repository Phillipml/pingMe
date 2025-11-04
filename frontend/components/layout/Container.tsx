import React, { ReactNode } from "react";

function Container({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-[1400px] h-auto p-4 mx-auto">
      {children}
    </div>
  );
}

export default Container;
