"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import type { AppRouter } from "@/server/routers/_app";
import type { inferRouterOutputs } from "@trpc/server";
import { BookingSteps } from "@/components/booking/booking-steps";
import { BarberStep } from "@/components/booking/barber-step";
import { ServiceStep } from "@/components/booking/service-step";
import { TimeStep } from "@/components/booking/time-step";
import { VerificationStep } from "@/components/booking/verification-step";
import { BookingSummary } from "@/components/booking/booking-summary";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type BarberWithServices = RouterOutputs["barber"]["getAll"][number];
type Service = RouterOutputs["service"]["getByBarberId"][number];

const STEPS = [
  { number: 1, title: "Berber" },
  { number: 2, title: "İşlem" },
  { number: 3, title: "Tarih & Saat" },
  { number: 4, title: "Doğrulama" },
  { number: 5, title: "Onayla" },
];

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(null);
  const [selectedEndTime, setSelectedEndTime] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // tRPC Queries
  const barbersQuery = trpc.barber.getAll.useQuery();
  const servicesQuery = trpc.service.getByBarberId.useQuery(
    { barberId: selectedBarberId! },
    { enabled: !!selectedBarberId }
  );
  const slotsQuery = trpc.appointment.getAvailableSlots.useQuery(
    {
      barberId: selectedBarberId!,
      serviceId: selectedServiceId!,
      date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
    },
    { enabled: !!selectedBarberId && !!selectedServiceId && !!selectedDate }
  );

  const createAppointment = trpc.appointment.create.useMutation({
    onSuccess: () => {
      setIsSuccess(true);
    },
  });

  // Seçili berber ve servis bilgileri
  const selectedBarber = barbersQuery.data?.find((b: BarberWithServices) => b.id === selectedBarberId);
  const selectedService = servicesQuery.data?.find((s: Service) => s.id === selectedServiceId);

  const handleBarberSelect = (barberId: string) => {
    setSelectedBarberId(barberId);
    setSelectedServiceId(null);
    setSelectedDate(undefined);
    setSelectedStartTime(null);
    setSelectedEndTime(null);
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setSelectedDate(undefined);
    setSelectedStartTime(null);
    setSelectedEndTime(null);
  };

  const handleTimeSelect = (startTime: string, endTime: string) => {
    setSelectedStartTime(startTime);
    setSelectedEndTime(endTime);
  };

  const handleConfirm = () => {
    if (
      !selectedBarberId ||
      !selectedServiceId ||
      !selectedDate ||
      !selectedStartTime ||
      !selectedEndTime ||
      !customerName ||
      !customerPhone ||
      !isVerified
    )
      return;

    createAppointment.mutate({
      barberId: selectedBarberId,
      serviceId: selectedServiceId,
      date: format(selectedDate, "yyyy-MM-dd"),
      startTime: selectedStartTime,
      endTime: selectedEndTime,
      customerName: customerName.trim(),
      customerPhone: customerPhone.replace(/\s/g, ""),
    });
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return !!selectedBarberId;
      case 2:
        return !!selectedServiceId;
      case 3:
        return !!selectedDate && !!selectedStartTime;
      case 4:
        return isVerified;
      default:
        return false;
    }
  };

  // Başarılı randevu ekranı
  if (isSuccess) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16 text-center">
        <Card>
          <CardContent className="space-y-4 py-12">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold">Randevunuz Oluşturuldu!</h2>
            <p className="text-muted-foreground">
              Randevunuz başarıyla kaydedildi. Belirtilen tarih ve saatte bekleriz.
            </p>
            <Button asChild>
              <Link href="/">Ana Sayfaya Dön</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="space-y-8">
        {/* Adım göstergesi */}
        <BookingSteps currentStep={currentStep} steps={STEPS} />

        {/* Adım içerikleri */}
        {currentStep === 1 && (
          <BarberStep
            barbers={barbersQuery.data ?? []}
            selectedBarberId={selectedBarberId}
            onSelect={handleBarberSelect}
          />
        )}

        {currentStep === 2 && (
          <ServiceStep
            services={servicesQuery.data ?? []}
            selectedServiceId={selectedServiceId}
            onSelect={handleServiceSelect}
            isLoading={servicesQuery.isLoading}
          />
        )}

        {currentStep === 3 && (
          <TimeStep
            slots={slotsQuery.data ?? []}
            selectedDate={selectedDate}
            selectedTime={selectedStartTime}
            onDateSelect={setSelectedDate}
            onTimeSelect={handleTimeSelect}
            isLoading={slotsQuery.isLoading}
          />
        )}

        {currentStep === 4 && (
          <VerificationStep
            customerName={customerName}
            customerPhone={customerPhone}
            onNameChange={setCustomerName}
            onPhoneChange={(phone) => {
              setCustomerPhone(phone);
              setIsVerified(false);
            }}
            onVerified={() => setIsVerified(true)}
          />
        )}

        {currentStep === 5 && selectedBarber && selectedService && selectedDate && selectedStartTime && selectedEndTime && (
          <BookingSummary
            barberName={selectedBarber.name}
            serviceName={selectedService.name}
            servicePrice={selectedService.price}
            serviceDuration={selectedService.duration}
            date={selectedDate}
            startTime={selectedStartTime}
            endTime={selectedEndTime}
            customerName={customerName}
            customerPhone={customerPhone}
            onConfirm={handleConfirm}
            onBack={() => setCurrentStep(4)}
            isSubmitting={createAppointment.isPending}
          />
        )}

        {/* Navigasyon butonları (Son adım hariç) */}
        {currentStep < 5 && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((s) => s - 1)}
              disabled={currentStep === 1}
            >
              Geri
            </Button>
            <Button
              onClick={() => setCurrentStep((s) => s + 1)}
              disabled={!canGoNext()}
            >
              İleri
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
