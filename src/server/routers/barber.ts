import { z } from "zod";
import { router, publicProcedure } from "@/server/trpc";

export const barberRouter = router({
  // Tüm aktif berberleri getir
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.barber.findMany({
      where: { isActive: true },
      include: {
        services: true,
      },
    });
  }),

  // Tek berber detayı
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.barber.findUnique({
        where: { id: input.id },
        include: {
          services: true,
          workingHours: true,
        },
      });
    }),
});
