import { z } from "zod";
import { router, publicProcedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";

const MONTHLY_APPOINTMENT_LIMIT = 5;
const CODE_EXPIRY_MINUTES = 5;
const MAX_VERIFY_ATTEMPTS = 5;

function generateCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

const phoneSchema = z
  .string()
  .transform((val) => val.replace(/\s/g, ""))
  .pipe(z.string().regex(/^0?5\d{9}$/, "Geçerli bir telefon numarası girin (05XX XXX XX XX)"));

export const verificationRouter = router({
  // Telefon numarasını doğrula ve kod gönder
  sendCode: publicProcedure
    .input(z.object({ phone: phoneSchema }))
    .mutation(async ({ ctx, input }) => {
      const phone = input.phone;

      // Aylık randevu limitini kontrol et
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const monthlyCount = await ctx.prisma.appointment.count({
        where: {
          user: { phone },
          status: { not: "CANCELLED" },
          createdAt: { gte: startOfMonth },
        },
      });

      if (monthlyCount >= MONTHLY_APPOINTMENT_LIMIT) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: `Bu numara ile aylık en fazla ${MONTHLY_APPOINTMENT_LIMIT} randevu alabilirsiniz.`,
        });
      }

      // Son 2 dakikada kod gönderilmiş mi?
      const recentCode = await ctx.prisma.phoneVerification.findFirst({
        where: {
          phone,
          createdAt: { gte: new Date(Date.now() - 2 * 60 * 1000) },
        },
        orderBy: { createdAt: "desc" },
      });

      if (recentCode) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Lütfen 2 dakika bekleyip tekrar deneyin.",
        });
      }

      const code = generateCode();
      const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);

      await ctx.prisma.phoneVerification.create({
        data: { phone, code, expiresAt },
      });

      // TODO: Gerçek SMS servisi entegre edilecek (Netgsm, Twilio vb.)
      // Şimdilik konsola yazdırıyoruz
      console.log(`📱 Doğrulama kodu [${phone}]: ${code}`);

      return { success: true, message: "Doğrulama kodu gönderildi." };
    }),

  // Kodu doğrula
  verifyCode: publicProcedure
    .input(
      z.object({
        phone: phoneSchema,
        code: z.string().length(4, "Kod 4 haneli olmalı"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const verification = await ctx.prisma.phoneVerification.findFirst({
        where: {
          phone: input.phone,
          verified: false,
          expiresAt: { gte: new Date() },
        },
        orderBy: { createdAt: "desc" },
      });

      if (!verification) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Doğrulama kodu bulunamadı veya süresi dolmuş. Yeni kod gönderin.",
        });
      }

      if (verification.attempts >= MAX_VERIFY_ATTEMPTS) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Çok fazla deneme yaptınız. Yeni kod gönderin.",
        });
      }

      if (verification.code !== input.code) {
        await ctx.prisma.phoneVerification.update({
          where: { id: verification.id },
          data: { attempts: { increment: 1 } },
        });

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Doğrulama kodu hatalı.",
        });
      }

      await ctx.prisma.phoneVerification.update({
        where: { id: verification.id },
        data: { verified: true },
      });

      return { success: true, message: "Telefon doğrulandı." };
    }),

  // Aylık limit kontrolü
  checkLimit: publicProcedure
    .input(z.object({ phone: phoneSchema }))
    .query(async ({ ctx, input }) => {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const monthlyCount = await ctx.prisma.appointment.count({
        where: {
          user: { phone: input.phone },
          status: { not: "CANCELLED" },
          createdAt: { gte: startOfMonth },
        },
      });

      return {
        count: monthlyCount,
        limit: MONTHLY_APPOINTMENT_LIMIT,
        remaining: Math.max(0, MONTHLY_APPOINTMENT_LIMIT - monthlyCount),
        canBook: monthlyCount < MONTHLY_APPOINTMENT_LIMIT,
      };
    }),
});
