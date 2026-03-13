import { z } from "zod";
import { router, publicProcedure } from "@/server/trpc";

export const adminRouter = router({
  // Tüm randevuları getir (filtrelenebilir)
  getAppointments: publicProcedure
    .input(
      z.object({
        status: z.enum(["ALL", "PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]).default("ALL"),
        date: z.string().optional(), // "2026-03-10"
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Record<string, unknown> = {};

      if (input.status !== "ALL") {
        where.status = input.status;
      }

      if (input.date) {
        const startOfDay = new Date(input.date + "T00:00:00");
        const endOfDay = new Date(input.date + "T23:59:59");
        where.date = { gte: startOfDay, lte: endOfDay };
      }

      return ctx.prisma.appointment.findMany({
        where,
        include: {
          user: true,
          barber: true,
          service: true,
        },
        orderBy: [{ date: "asc" }, { startTime: "asc" }],
      });
    }),

  // Randevu durumunu güncelle
  updateAppointmentStatus: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.appointment.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),

  // Dashboard istatistikleri
  getStats: publicProcedure.query(async ({ ctx }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [todayCount, pendingCount, totalCount, todayRevenue] =
      await Promise.all([
        ctx.prisma.appointment.count({
          where: {
            date: { gte: today, lt: tomorrow },
            status: { not: "CANCELLED" },
          },
        }),
        ctx.prisma.appointment.count({
          where: { status: "PENDING" },
        }),
        ctx.prisma.appointment.count({
          where: { status: { not: "CANCELLED" } },
        }),
        ctx.prisma.appointment.findMany({
          where: {
            date: { gte: today, lt: tomorrow },
            status: "COMPLETED",
          },
          include: { service: true },
        }),
      ]);

    const revenue = todayRevenue.reduce(
      (sum, apt) => sum + apt.service.price,
      0
    );

    return {
      todayAppointments: todayCount,
      pendingAppointments: pendingCount,
      totalAppointments: totalCount,
      todayRevenue: revenue,
    };
  }),

  // Hizmetleri yönet
  getServices: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.service.findMany({
      include: { barber: true },
      orderBy: { price: "asc" },
    });
  }),

  createService: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        duration: z.number().min(5),
        price: z.number().min(0),
        barberId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.service.create({ data: input });
    }),

  updateService: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        description: z.string().optional(),
        duration: z.number().min(5),
        price: z.number().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.service.update({ where: { id }, data });
    }),

  deleteService: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.service.delete({ where: { id: input.id } });
    }),

  // Çalışma saatleri
  getWorkingHours: publicProcedure
    .input(z.object({ barberId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.workingHours.findMany({
        where: { barberId: input.barberId },
        orderBy: { dayOfWeek: "asc" },
      });
    }),

  updateWorkingHours: publicProcedure
    .input(
      z.object({
        id: z.string(),
        startTime: z.string(),
        endTime: z.string(),
        isOff: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.workingHours.update({ where: { id }, data });
    }),
});
