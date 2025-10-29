import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PaymentSuccessAndUpdateUser from "../../../../components/payment/PaymentSuccess";

export async function generateMetadata() {
  return {
    title: "Payment Success | Shothik AI",
    description: "This is Bkash payment page",
  };
}

export default function PaymentSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Payment Successful</h1>
      <p className="mt-4 mb-8 text-base">
        Thank you for your payment.
      </p>
      <Button asChild size="lg">
        <Link href="/?utm_source=internal">
          Go to Home
        </Link>
      </Button>

      <PaymentSuccessAndUpdateUser />
    </div>
  );
}
