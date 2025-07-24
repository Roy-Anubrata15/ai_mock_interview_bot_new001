'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Declare window.paypal for TypeScript
declare global {
  interface Window {
    paypal: any;
  }
}

const plans = [
  {
    id: 'single',
    name: 'Single Retake',
    price: '5.00',
    desc: '1 retake for this interview',
    paypalId: 'paypal-single',
  },
  {
    id: 'triple',
    name: 'Triple Retake',
    price: '12.00',
    desc: '3 retakes for this interview (save $3)',
    paypalId: 'paypal-triple',
  },
  {
    id: 'unlimited',
    name: 'Unlimited (30 days)',
    price: '25.00',
    desc: 'Unlimited retakes for 30 days',
    paypalId: 'paypal-unlimited',
  },
];

export default function PlansPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interviewId");
  const [paypalReady, setPaypalReady] = useState(false);

  useEffect(() => {
    // Load PayPal script only once
    if (typeof window !== "undefined" && !window.paypal) {
      const script = document.createElement("script");
      script.src = "https://www.paypal.com/sdk/js?client-id=sb&currency=INR";
      script.async = true;
      script.onload = () => setPaypalReady(true);
      document.body.appendChild(script);
    } else if (window.paypal) {
      setPaypalReady(true);
    }
  }, []);

  useEffect(() => {
    if (!paypalReady) return;
    plans.forEach((plan) => {
      const paypalDiv = document.getElementById(plan.paypalId);
      if (window.paypal && paypalDiv) {
        // Clear previous button if any
        paypalDiv.innerHTML = '';
        window.paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: plan.price,
                  },
                  description: `${plan.name} for Mock Interview`,
                },
              ],
            });
          },
          onApprove: (data: any, actions: any) => {
            return actions.order.capture().then(function (details: any) {
              if (interviewId) {
                router.push(`/interview/${interviewId}`);
              } else {
                router.push("/");
              }
            });
          },
        }).render(`#${plan.paypalId}`);
      }
    });
  }, [paypalReady, interviewId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden py-12 px-4">
      {/* Vignette effect */}
      <div className="pointer-events-none absolute inset-0 z-0" style={{background: 'radial-gradient(ellipse at center, rgba(40,40,40,0.5) 0%, rgba(0,0,0,0.95) 80%)'}} />
      <div className="w-full max-w-5xl flex flex-col items-center z-10 relative">
        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight text-center drop-shadow-lg">Retake Interview</h1>
        <p className="text-lg text-gray-300 mb-10 text-center max-w-2xl">Choose a plan to unlock more retakes and get the most out of your mock interview experience. Pay securely to retake your interview now!</p>
        <div className="flex flex-col md:flex-row gap-8 w-full justify-center">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="flex flex-col items-center bg-gradient-to-br from-[#18181b] via-[#23232a] to-[#0a0a0a] border border-[#23263a]/80 rounded-3xl shadow-2xl p-8 w-full max-w-xs min-h-[420px] transition-transform hover:scale-105 hover:shadow-[0_0_32px_4px_rgba(255,60,111,0.15)] focus-within:shadow-[0_0_32px_4px_rgba(255,60,111,0.15)]"
            >
              <h2 className="text-2xl font-bold text-white mb-2 text-center">{plan.name}</h2>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-gradient-to-r from-[#ff8c42] to-[#ff3c6f] text-white text-2xl font-bold px-6 py-2 rounded-full shadow-lg border-2 border-[#ff3c6f]/40">${plan.price}</span>
              </div>
              <p className="text-gray-300 text-center mb-6 flex-1 flex items-center justify-center">{plan.desc}</p>
              <div id={plan.paypalId} className="w-full flex justify-center" style={{ minHeight: 50 }} />
            </div>
          ))}
        </div>
        <p className="mt-10 text-xs text-gray-500 text-center">Payments are processed securely via PayPal. You will be redirected to your interview after payment.</p>
      </div>
    </div>
  );
} 