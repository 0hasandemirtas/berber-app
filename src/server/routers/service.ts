import { z } from "zod";
import { router, publicProcedure } from "@/server/trpc";

export const serviceRouter = router({
  // Berbere göre servisleri getir
  getByBarberId: publicProcedure
    .input(z.object({ barberId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.service.findMany({
        where: { barberId: input.barberId },
        orderBy: { price: "asc" },
      });
    }),
});
