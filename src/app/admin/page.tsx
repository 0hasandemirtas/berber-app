"use client";

import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, TrendingUp, Users } from "lucide-react";

export default function AdminDashboard() {
  const stats = trpc.admin.getStats.useQuery();

  const cards = [
    {
      title: "Bugünkü Randevular",
      value: stats.data?.todayAppointments ?? 0,
      icon: CalendarDays,
      description: "Bugün için alınmış randevular",
    },
    {
      title: "Bekleyen Randevular",
      value: stats.data?.pendingAppointments ?? 0,
      icon: Clock,
      description: "Onay bekleyen randevular",
    },
    {
      title: "Toplam Randevular",
      value: stats.data?.totalAppointments ?? 0,
      icon: Users,
      description: "Toplam alınan randevular",
    },
    {
      title: "Bugünkü Gelir",
      value: `₺${stats.data?.todayRevenue?.toFixed(0) ?? 0}`,
      icon: TrendingUp,
      description: "Tamamlanan randevular",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
