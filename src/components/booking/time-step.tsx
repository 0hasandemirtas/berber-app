"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check } from "lucide-react";
import { format, addDays, isBefore, startOfDay } from "date-fns";
import { tr } from "date-fns/locale";

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface TimeStepProps {
  slots: TimeSlot[];
  selectedDate: Date | undefined;
  selectedTime: string | null;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSelect: (startTime: string, endTime: string) => void;
  isLoading: boolean;
}

export function TimeStep({
  slots,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  isLoading,
}: TimeStepProps) {
  const today = startOfDay(new Date());
  const maxDate = addDays(today, 30);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Tarih & Saat Seç</h2>
        <p className="text-muted-foreground">Randevu tarih ve saatinizi seçin</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Takvim */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tarih Seçin</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateSelect}
              disabled={(date) =>
                isBefore(date, today) || date > maxDate
              }
              locale={tr}
              className="rounded-md"
            />
          </CardContent>
        </Card>

        {/* Saat Slotları */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {selectedDate
                ? format(selectedDate, "d MMMM yyyy, EEEE", { locale: tr })
                : "Önce tarih seçin"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedDate ? (
              <p className="text-sm text-muted-foreground">
                Lütfen sol taraftaki takvimden bir tarih seçin.
              </p>
            ) : isLoading ? (
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-10 animate-pulse rounded-md bg-muted" />
                ))}
              </div>
            ) : slots.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Bu tarihte müsait saat bulunmuyor.
              </p>
            ) : (
              <ScrollArea className="h-[280px]">
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((slot) => {
                    const isSelected = selectedTime === slot.startTime;
                    return (
                      <Button
                        key={slot.startTime}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        className="relative"
                        onClick={() => onTimeSelect(slot.startTime, slot.endTime)}
                      >
                        {slot.startTime}
                        {isSelected && (
                          <Check className="ml-1 h-3 w-3" />
                        )}
                      </Button>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
