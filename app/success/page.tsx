"use client"

import React from "react";
import { SuccessComponent } from "@/components/SuccessComponent";
import { useSearchParams } from "next/navigation";

const SuccessPage: React.FC = () => {
  const { get } = useSearchParams();
  const sessionId = get("session_id");

  return (
    <div>
      <SuccessComponent sessionId={sessionId} />
    </div>
  );
}

export default SuccessPage;
