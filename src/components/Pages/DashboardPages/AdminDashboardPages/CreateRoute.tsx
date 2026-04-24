"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { MapPin, Plus, Trash2, ArrowRight, Clock, Route } from "lucide-react";
import { createRoute } from "@/src/services/routes.service";

// ─── Zod Schema ──────────────────────────────────────────────────────────────

const routeSchema = z.object({
  sourceCity: z.string().min(1, "Source city is required"),
  destinationCity: z.string().min(1, "Destination city is required"),
  distanceKm: z.coerce.number().min(1, "Distance must be at least 1 km"),
  estimatedTimeMinutes: z.coerce.number().min(1, "Time must be at least 1 min"),
  stops: z.array(z.object({ value: z.string().min(1, "Stop name required") })),
}).refine(
  (data) => data.sourceCity !== data.destinationCity,
  {
    message: "Source and destination cannot be the same",
    path: ["destinationCity"],
  }
);

type RouteFormValues = z.infer<typeof routeSchema>;

// ─── Component ───────────────────────────────────────────────────────────────

export default function CreateRoute() {
  const form = useForm<RouteFormValues>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      sourceCity: "",
      destinationCity: "",
      distanceKm: 0,
      estimatedTimeMinutes: 0,
      stops: [],
    },
  });

  const { watch, handleSubmit, register, formState: { errors, isSubmitting }, control } = form;
  const values = watch();

  const { fields, append, remove } = useFieldArray({ control, name: "stops" });

  // ─── Submit ──────────────────────────────────────────────────────────────

  const onSubmit = async (data: RouteFormValues) => {
    const payload = {
      ...data,
      stops: data.stops.map((s) => s.value),
    };

    const res = await createRoute(payload);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Route created successfully!");
      form.reset();
    }
  };

  // ─── UI ──────────────────────────────────────────────────────────────────

  return (
    <div className="grid md:grid-cols-2 gap-6">

      {/* FORM */}
      <Card>
        <CardContent className="space-y-4 pt-6">

          {/* Cities */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input placeholder="Source City" {...register("sourceCity")} />
              {errors.sourceCity && (
                <p className="text-xs text-red-500 mt-1">{errors.sourceCity.message}</p>
              )}
            </div>
            <div>
              <Input placeholder="Destination City" {...register("destinationCity")} />
              {errors.destinationCity && (
                <p className="text-xs text-red-500 mt-1">{errors.destinationCity.message}</p>
              )}
            </div>
          </div>

          {/* Distance & Time */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input type="number" placeholder="Distance (km)" {...register("distanceKm")} />
              {errors.distanceKm && (
                <p className="text-xs text-red-500 mt-1">{errors.distanceKm.message}</p>
              )}
            </div>
            <div>
              <Input type="number" placeholder="Est. Time (minutes)" {...register("estimatedTimeMinutes")} />
              {errors.estimatedTimeMinutes && (
                <p className="text-xs text-red-500 mt-1">{errors.estimatedTimeMinutes.message}</p>
              )}
            </div>
          </div>

          {/* Stops */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Stops</p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => append({ value: "" })}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Stop
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-center">
                <span className="text-xs text-muted-foreground w-5 shrink-0">{index + 1}.</span>
                <Input
                  placeholder={`Stop ${index + 1}`}
                  {...register(`stops.${index}.value`)}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => remove(index)}
                  className="shrink-0 text-red-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {fields.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-2 border rounded-md border-dashed">
                No stops added
              </p>
            )}
          </div>

          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Creating..." : "Create Route"}
          </Button>

        </CardContent>
      </Card>

      {/* ROUTE PREVIEW */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="mb-4 font-semibold">Route Preview</h2>

          {/* Source → Destination */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex flex-col items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div className="w-0.5 h-full min-h-[40px] bg-border" />
              <div className="w-3 h-3 rounded-full bg-red-500" />
            </div>
            <div className="flex flex-col justify-between gap-6">
              <p className="font-semibold text-sm">
                {values.sourceCity || <span className="text-muted-foreground">Source City</span>}
              </p>
              <p className="font-semibold text-sm">
                {values.destinationCity || <span className="text-muted-foreground">Destination City</span>}
              </p>
            </div>
          </div>

          {/* Stops list */}
          {values.stops.length > 0 && (
            <div className="mb-5">
              <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Via</p>
              <div className="flex flex-wrap gap-2">
                {values.stops.map((s, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 bg-muted text-xs px-2.5 py-1 rounded-full"
                  >
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    {s.value || `Stop ${i + 1}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
              <Route className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Distance</p>
                <p className="font-semibold text-sm">
                  {values.distanceKm ? `${values.distanceKm} km` : "—"}
                </p>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Est. Time</p>
                <p className="font-semibold text-sm">
                  {values.estimatedTimeMinutes
                    ? `${Math.floor(values.estimatedTimeMinutes / 60)}h ${values.estimatedTimeMinutes % 60}m`
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Total stops badge */}
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <ArrowRight className="h-3.5 w-3.5" />
            {values.stops.length} intermediate stop{values.stops.length !== 1 ? "s" : ""}
          </div>

        </CardContent>
      </Card>

    </div>
  );
}