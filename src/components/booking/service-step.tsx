"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, TurkishLira } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
}

interface ServiceStepProps {
  services: Service[];
  selectedServiceId: string | null;
  onSelect: (serviceId: string) => void;
  isLoading: boolean;
}

export function ServiceStep({ services, selectedServiceId, onSelect, isLoading }: ServiceStepProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">İşlem Seç</h2>
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 w-32 rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-4 w-24 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">İşlem Seç</h2>
        <p className="text-muted-foreground">Yaptırmak istediğiniz işlemi seçin</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {services.map((service) => {
          const isSelected = selectedServiceId === service.id;
          return (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? "border-primary ring-2 ring-primary" : ""
              }`}
              onClick={() => onSelect(service.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  {isSelected && (
                    <Badge className="bg-primary">
                      <Check className="h-4 w-4" />
                    </Badge>
                  )}
                </div>
                {service.description && (
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {service.duration} dk
                  </span>
                  <span className="font-semibold text-foreground">
                    {service.price} ₺
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
