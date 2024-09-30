import React, { useState } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { useSession } from "next-auth/react";
import { Professor } from "@/lib/types";

import { handleCreatePaymentRecord } from "@/lib/actions";

interface RazorpayPaymentProps {
  amount: number;
  onSuccess: () => void;
  onFailure: () => void;
  professorId: number;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RazorpayPayment({
  amount,
  onSuccess,
  onFailure,
  professorId,
}: RazorpayPaymentProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/razorpayOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        throw new Error("Failed to create Razorpay order");
      }

      const order = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Library Application",
        description: "Payment for scheduling a meeting",
        order_id: order.id,
        handler: async function (response: any) {
          if (response.razorpay_payment_id) {
            await handleCreatePaymentRecord(
              session?.user.id!,
             professorId,
              response.razorpay_payment_id
            );
            onSuccess();
          }
        },
        modal: {
          ondismiss: function () {
            onFailure();
          },
        },
        prefill: {
          name: "Student Name",
          email: "student@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error initiating Razorpay payment:", error);
      onFailure();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <Button onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : `Pay ₹${amount}`}
      </Button>
    </>
  );
}
