"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";



// shadcn
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { createBus } from "@/src/services/buses.service";

// ─── Zod Schema ─────────────────────────────────────

const busSchema = z
  .object({
    name: z.string().min(1),
    number: z.string().min(1),
    type: z.enum(["AC", "NON_AC"]),
    totalSeats: z.coerce.number().min(1),

    vipSeats: z.coerce.number().min(0),
    vipPrice: z.coerce.number().min(0),

    deluxeSeats: z.coerce.number().min(0),
    deluxePrice: z.coerce.number().min(0),

    pricePerSeat: z.coerce.number().min(1),
    isActive: z.boolean(),
  })
  .refine(
    (data) => data.vipSeats + data.deluxeSeats <= data.totalSeats,
    {
      message: "VIP + Deluxe seats cannot exceed total seats",
      path: ["vipSeats"],
    }
  );

// ─── Component ─────────────────────────────────────

export default function CreateBus() {
  const form = useForm({
    resolver: zodResolver(busSchema),
    defaultValues: {
      name: "",
      number: "",
      type: "NON_AC",
      totalSeats: 40,
      vipSeats: 0,
      vipPrice: 0,
      deluxeSeats: 0,
      deluxePrice: 0,
      pricePerSeat: 200,
      isActive: true,
    },
  });

  const { watch, handleSubmit, register, formState } = form;
  const values = watch();

  // ─── Seat Preview Logic ───────────────────────────

  const seats = useMemo(() => {
    const arr = [];
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let i = 0; i < values.totalSeats; i++) {
      const row = Math.floor(i / 4);
      const col = (i % 4) + 1;

      let type = "STANDARD";
      if (i < values.vipSeats) type = "VIP";
      else if (i < values.vipSeats + values.deluxeSeats) type = "DELUXE";

      arr.push({
        label: `${letters[row]}${col}`,
        type,
      });
    }

    return arr;
  }, [values]);

  // ─── Submit ─────────────────────────────────────

  const onSubmit = async (data: any) => {
    const res = await createBus(data);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Bus created successfully 🚀");
      form.reset();
    }
  };

  // ─── UI ─────────────────────────────────────────

  return (
    <div className="grid md:grid-cols-2 gap-6">
      
      {/* FORM */}
      <Card>
        <CardContent className="space-y-4 pt-6">

          <Input placeholder="Bus Name" {...register("name")} />
          <Input placeholder="Bus Number" {...register("number")} />

          <select {...register("type")} className="w-full border p-2 rounded">
            <option value="NON_AC">NON_AC</option>
            <option value="AC">AC</option>
          </select>

          <Input type="number" placeholder="Total Seats" {...register("totalSeats")} />

          <div className="grid grid-cols-2 gap-2">
            <Input type="number" placeholder="VIP Seats" {...register("vipSeats")} />
            <Input type="number" placeholder="VIP Price" {...register("vipPrice")} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Input type="number" placeholder="Deluxe Seats" {...register("deluxeSeats")} />
            <Input type="number" placeholder="Deluxe Price" {...register("deluxePrice")} />
          </div>

          <Input type="number" placeholder="Standard Price" {...register("pricePerSeat")} />

          <Button onClick={handleSubmit(onSubmit)} disabled={formState.isSubmitting}>
            Create Bus
          </Button>

        </CardContent>
      </Card>

      {/* SEAT PREVIEW */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="mb-4 font-semibold">Seat Preview</h2>

          <div className="grid grid-cols-4 gap-2">
            {seats.map((seat, i) => (
              <div
                key={i}
                className={`p-2 text-center text-xs rounded
                  ${
                    seat.type === "VIP"
                      ? "bg-yellow-400"
                      : seat.type === "DELUXE"
                      ? "bg-blue-400"
                      : "bg-gray-300"
                  }
                `}
              >
                {seat.label}
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm space-y-1">
            <p>🟡 VIP</p>
            <p>🔵 Deluxe</p>
            <p>⚪ Standard</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}