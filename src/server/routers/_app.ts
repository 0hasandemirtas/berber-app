import { router } from "@/server/trpc";
import { barberRouter } from "@/server/routers/barber";
import { serviceRouter } from "@/server/routers/service";
import { appointmentRouter } from "@/server/routers/appointment";
import { adminRouter } from "@/server/routers/admin";
import { verificationRouter } from "@/server/routers/verification";

export const appRouter = router({
  barber: barberRouter,
  service: serviceRouter,
  appointment: appointmentRouter,
  admin: adminRouter,
  verification: verificationRouter,
});

export type AppRouter = typeof appRouter;
