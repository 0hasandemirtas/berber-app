"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface Barber {
  id: string;
  name: string;
  title: string | null;
  image: string | null;
}

interface BarberStepProps {
  barbers: Barber[];
  selectedBarberId: string | null;
  onSelect: (barberId: string) => void;
}

export function BarberStep({ barbers, selectedBarberId, onSelect }: BarberStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Berber Seç</h2>
        <p className="text-muted-foreground">Randevunuz için berberinizi seçin</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {barbers.map((barber) => {
          const isSelected = selectedBarberId === barber.id;
          return (
            <Card
              key={barber.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? "border-primary ring-2 ring-primary" : ""
              }`}
              onClick={() => onSelect(barber.id)}
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={barber.image || undefined} alt={barber.name} />
                  <AvatarFallback className="text-lg">
                    {barber.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{barber.name}</CardTitle>
                  {barber.title && (
                    <p className="text-sm text-muted-foreground">{barber.title}</p>
                  )}
                </div>
                {isSelected && (
                  <Badge className="bg-primary">
                    <Check className="h-4 w-4" />
                  </Badge>
                )}
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
