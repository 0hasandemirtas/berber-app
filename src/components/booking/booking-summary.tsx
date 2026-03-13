"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Scissors, User } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface BookingSummaryProps {
  barberName: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  date: Date;
  startTime: string;
  endTime: string;
  customerName: string;
  customerPhone: string;
  onConfirm: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function BookingSummary({
  barberName,
  serviceName,
  servicePrice,
  serviceDuration,
  date,
  startTime,
  endTime,
  customerName,
  customerPhone,
  onConfirm,
  onBack,
  isSubmitting,
}: BookingSummaryProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Randevu Özeti</h2>
        <p className="text-muted-foreground">Bilgileri kontrol edip onaylayın</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Randevu Detayları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Scissors className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Berber</p>
              <p className="font-medium">{barberName}</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-3">
            <Scissors className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">İşlem</p>
              <p className="font-medium">
                {serviceName} – {servicePrice} ₺ ({serviceDuration} dk)
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Tarih</p>
              <p className="font-medium">
                {format(date, "d MMMM yyyy, EEEE", { locale: tr })}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Saat</p>
              <p className="font-medium">
                {startTime} - {endTime}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Müşteri</p>
              <p className="font-medium">{customerName}</p>
              <p className="text-sm text-muted-foreground">{customerPhone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Geri Dön
        </Button>
        <Button onClick={onConfirm} disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "Oluşturuluyor..." : "Randevuyu Onayla"}
        </Button>
      </div>
    </div>
  );
}
