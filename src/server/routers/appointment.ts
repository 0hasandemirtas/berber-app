import { z } from "zod";
import { router, publicProcedure } from "@/server/trpc";
import { addMinutes, format, parse, isBefore } from "date-fns";

export const appointmentRouter = router({
  // Müsait saatleri getir
  getAvailableSlots: publicProcedure
    .input(
      z.object({
        barberId: z.string(),
        serviceId: z.string(),
        date: z.string(), // "2026-03-10"
      })
    )
    .query(async ({ ctx, input }) => {
      const selectedDate = new Date(input.date);
      const dayOfWeek = selectedDate.getDay();

      // Çalışma saatlerini getir
      const workingHours = await ctx.prisma.workingHours.findUnique({
        where: {
          barberId_dayOfWeek: {
            barberId: input.barberId,
            dayOfWeek,
          },
        },
      });

      if (!workingHours || workingHours.isOff) {
        return [];
      }

      // Seçilen servisin süresini getir
      const service = await ctx.prisma.service.findUnique({
        where: { id: input.serviceId },
      });

      if (!service) return [];

      // O gün alınmış randevuları getir
      const startOfDay = new Date(input.date + "T00:00:00");
      const endOfDay = new Date(input.date + "T23:59:59");

      const existingAppointments = await ctx.prisma.appointment.findMany({
        where: {
          barberId: input.barberId,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
          status: { not: "CANCELLED" },
        },
      });

      // Slotları oluştur
      const slots: { startTime: string; endTime: string }[] = [];
      const startTime = parse(workingHours.startTime, "HH:mm", selectedDate);
      const endTime = parse(workingHours.endTime, "HH:mm", selectedDate);

      let current = startTime;

      while (isBefore(addMinutes(current, service.duration), endTime) || 
             addMinutes(current, service.duration).getTime() === endTime.getTime()) {
        const slotStart = format(current, "HH:mm");
        const slotEnd = format(addMinutes(current, service.duration), "HH:mm");

        // Çakışma kontrolü
        const hasConflict = existingAppointments.some((apt: { startTime: string; endTime: string }) => {
          return !(slotEnd <= apt.startTime || slotStart >= apt.endTime);
        });

        if (!hasConflict) {
          slots.push({ startTime: slotStart, endTime: slotEnd });
        }

        current = addMinutes(current, 30); // 30 dk aralıklarla slotlar
      }

      return slots;
    }),

  // Randevu oluştur
  create: publicProcedure
    .input(
      z.object({
        customerName: z.string().min(2, "İsim en az 2 karakter olmalı"),
        customerPhone: z.string().min(10, "Telefon en az 10 karakter olmalı").max(15),
        barberId: z.string(),
        serviceId: z.string(),
        date: z.string(),
        startTime: z.string(),
        endTime: z.string(),
        note: z.string().optional().default(""),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Müşteri için user oluştur veya bul
      let user = await ctx.prisma.user.findFirst({
        where: { phone: input.customerPhone },
      });

      if (!user) {
        user = await ctx.prisma.user.create({
          data: {
            name: input.customerName,
            phone: input.customerPhone,
          },
        });
      }

      // Çakışma kontrolü
      const startOfDay = new Date(input.date + "T00:00:00");
      const endOfDay = new Date(input.date + "T23:59:59");

      const conflict = await ctx.prisma.appointment.findFirst({
        where: {
          barberId: input.barberId,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
          status: { not: "CANCELLED" },
          OR: [
            {
              startTime: { lt: input.endTime },
              endTime: { gt: input.startTime },
            },
          ],
        },
      });

      if (conflict) {
        throw new Error("Bu saat dilimi dolu. Lütfen başka bir saat seçin.");
      }

      return ctx.prisma.appointment.create({
        data: {
          userId: user.id,
          barberId: input.barberId,
          serviceId: input.serviceId,
          date: new Date(input.date),
          startTime: input.startTime,
          endTime: input.endTime,
          note: input.note,
          status: "CONFIRMED",
        },
        include: {
          barber: true,
          service: true,
        },
      });
    }),
});
