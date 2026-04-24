'use client';

import { useState } from 'react';
import { Check, ChevronRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'; // অথবা তোমার toast library

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createBooking } from '@/src/services/booking.service';
import { createPayment } from '@/src/services/payment.service';


interface Seat {
  id: string;
  number: string;
  type: string;
  price: number;
}

interface Lock {
  id: string;
  seat: Seat;
}

interface Schedule {
  id: string;
  route?: {
    sourceCity: string;
    destinationCity: string;
  };
}

interface Props {
  locks: Lock[];
  schedule: Schedule;
}

export default function BookingConfirmPage({ locks, schedule }: Props) {
  const router = useRouter();

  const [step, setStep] = useState<'summary' | 'confirm' | 'payment'>(
    'summary'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const totalPrice = locks.reduce((sum, l) => sum + l.seat.price, 0);

  // Step 1 → 2: booking create করো
  const handleConfirm = async () => {
    setIsProcessing(true);

    const { data, error } = await createBooking(schedule.id);

    setIsProcessing(false);

    if (error || !data) {
      toast.error(error ?? 'Booking failed. Please try again.');
      return;
    }

    setBookingId(data.id);
    setStep('payment');
  };

  // Step 3: Stripe checkout এ redirect করো
  const handlePayment = async () => {
    if (!bookingId) {
      toast.error('Booking not found. Please go back and try again.');
      return;
    }

    setIsProcessing(true);

    const { data, error } = await createPayment(bookingId);

    setIsProcessing(false);

    if (error || !data?.checkoutUrl) {
      toast.error(error ?? 'Payment initialization failed.');
      return;
    }

    // Stripe Checkout page এ redirect
    window.location.href = data.checkoutUrl;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted p-4">

      {/* SUMMARY */}
      {step === 'summary' && (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
            <p className="text-sm text-muted-foreground">
              {schedule.route?.sourceCity} → {schedule.route?.destinationCity}
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {locks.map((lock) => (
              <div
                key={lock.id}
                className="flex justify-between border p-3 rounded-lg"
              >
                <div>
                  <p className="font-medium">Seat {lock.seat.number}</p>
                  <p className="text-xs text-muted-foreground">
                    {lock.seat.type}
                  </p>
                </div>
                <span className="font-semibold">৳{lock.seat.price}</span>
              </div>
            ))}

            <Separator />

            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>৳{totalPrice}</span>
            </div>

            <Button className="w-full" onClick={() => setStep('confirm')}>
              Proceed to Confirm
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* CONFIRM */}
      {step === 'confirm' && (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Confirm Booking</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <ScrollArea className="h-40">
              {locks.map((lock) => (
                <div
                  key={lock.id}
                  className="flex justify-between border p-2 rounded mb-2"
                >
                  <div className="flex gap-2 items-center">
                    <Check size={16} />
                    <span>Seat {lock.seat.number}</span>
                  </div>
                  <span>৳{lock.seat.price}</span>
                </div>
              ))}
            </ScrollArea>

            <Separator />

            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>৳{totalPrice}</span>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setStep('summary')}
                disabled={isProcessing}
              >
                Back
              </Button>

              <Button
                className="w-full"
                onClick={handleConfirm}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Booking...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PAYMENT */}
      {step === 'payment' && (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Payment</CardTitle>
            <p className="text-sm text-muted-foreground">
              You'll be redirected to Stripe to complete payment securely.
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="border p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="text-xl font-bold">৳{totalPrice}</p>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setStep('confirm')}
                disabled={isProcessing}
              >
                Back
              </Button>

              <Button
                className="w-full"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirecting to Stripe...
                  </>
                ) : (
                  <>Pay ৳{totalPrice}</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}