"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

const STATUS_OPTIONS = [
  { value: "ALL", label: "Tümü" },
  { value: "PENDING", label: "Bekleyen" },
  { value: "CONFIRMED", label: "Onaylı" },
  { value: "COMPLETED", label: "Tamamlandı" },
  { value: "CANCELLED", label: "İptal" },
] as const;

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Bekleyen",
  CONFIRMED: "Onaylı",
  COMPLETED: "Tamamlandı",
  CANCELLED: "İptal",
};

type StatusFilter = "ALL" | "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export default function AppointmentsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [dateFilter, setDateFilter] = useState("");

  const appointments = trpc.admin.getAppointments.useQuery({
    status: statusFilter,
    date: dateFilter || undefined,
  });

  const updateStatus = trpc.admin.updateAppointmentStatus.useMutation({
    onSuccess: () => appointments.refetch(),
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Randevular</h2>

      {/* Filtreler */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1">
          {STATUS_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              variant={statusFilter === opt.value ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-auto"
        />
        {dateFilter && (
          <Button variant="ghost" size="sm" onClick={() => setDateFilter("")}>
            Tarihi Temizle
          </Button>
        )}
      </div>

      {/* Randevu listesi */}
      {appointments.isLoading ? (
        <p className="text-muted-foreground">Yükleniyor...</p>
      ) : !appointments.data?.length ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Randevu bulunamadı.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {appointments.data.map((apt) => (
            <Card key={apt.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{apt.user.name}</span>
                    <Badge className={STATUS_COLORS[apt.status]}>
                      {STATUS_LABELS[apt.status]}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(apt.date), "d MMMM yyyy, EEEE", { locale: tr })}
                    {" • "}
                    {apt.startTime} - {apt.endTime}
                  </div>
                  <div className="text-sm">
                    {apt.service.name} • ₺{apt.service.price}
                    {apt.user.phone && ` • ${apt.user.phone}`}
                  </div>
                  {apt.note && (
                    <div className="text-sm text-muted-foreground italic">
                      Not: {apt.note}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {apt.status === "PENDING" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        updateStatus.mutate({
                          id: apt.id,
                          status: "CONFIRMED",
                        })
                      }
                      disabled={updateStatus.isPending}
                    >
                      Onayla
                    </Button>
                  )}
                  {(apt.status === "PENDING" || apt.status === "CONFIRMED") && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateStatus.mutate({
                            id: apt.id,
                            status: "COMPLETED",
                          })
                        }
                        disabled={updateStatus.isPending}
                      >
                        Tamamla
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          updateStatus.mutate({
                            id: apt.id,
                            status: "CANCELLED",
                          })
                        }
                        disabled={updateStatus.isPending}
                      >
                        İptal
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
