import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Scissors, Clock, MapPin } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <div className="rounded-full bg-primary/10 p-4">
          <Scissors className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Mustafa Soylu
        </h1>
        <p className="text-xl text-muted-foreground">Erkek Berber Salonu</p>
        <p className="max-w-md text-muted-foreground">
          Profesyonel saç kesimi ve bakım hizmetleri. Hemen online randevunuzu
          alın, sıra beklemeyin.
        </p>
        <Button asChild size="lg" className="mt-4">
          <Link href="/randevu">Randevu Al</Link>
        </Button>
      </section>

      {/* Bilgi Kartları */}
      <section className="container mx-auto grid gap-6 px-4 pb-16 sm:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <Scissors className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">Profesyonel Hizmet</h3>
            <p className="text-sm text-muted-foreground">
              Yılların deneyimiyle kaliteli saç kesimi ve bakım hizmetleri
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <Clock className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">Online Randevu</h3>
            <p className="text-sm text-muted-foreground">
              7/24 online randevu alın, sıra beklemeyin
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <MapPin className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">Kolay Ulaşım</h3>
            <p className="text-sm text-muted-foreground">
              Merkezi konumumuzla kolayca ulaşabilirsiniz
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
