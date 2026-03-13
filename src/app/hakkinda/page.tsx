import { Scissors, MapPin, Phone, Clock, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HakkindaPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      {/* Hero */}
      <section className="flex flex-col items-center text-center gap-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Scissors className="h-12 w-12" />
        </div>
        <div>
          <h1 className="text-4xl font-bold">Mustafa Soylu</h1>
          <p className="mt-2 text-lg text-muted-foreground">Usta Berber · 15+ Yıl Deneyim</p>
        </div>
        <p className="max-w-xl text-muted-foreground">
          Geleneksel berberlik sanatını modern tekniklerle birleştirerek her müşterisine özel,
          kaliteli hizmet sunmayı ilke edinmiş bir berber salonu.
        </p>
        <Link href="/randevu">
          <Button size="lg">Randevu Al</Button>
        </Link>
      </section>

      {/* Özellikler */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <Award className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">Uzman Kadro</h3>
            <p className="text-sm text-muted-foreground">
              Alanında uzman, deneyimli berberler ile profesyonel hizmet.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <Clock className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">Kolay Randevu</h3>
            <p className="text-sm text-muted-foreground">
              Online randevu sistemi ile bekleme derdi yok, zamanın değerli.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <Scissors className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">Kaliteli Hizmet</h3>
            <p className="text-sm text-muted-foreground">
              Saç kesimi, sakal tıraşı ve bakım hizmetlerinde en iyi sonuç.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* İletişim & Konum */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Bize Ulaşın</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-md border p-4">
            <MapPin className="h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium">Adres</p>
              <p className="text-sm text-muted-foreground">İhsaniye, Kaleönü Sk No:4 D:c, 42060 Selçuklu/Konya</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-md border p-4">
            <Phone className="h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium">Telefon</p>
              <p className="text-sm text-muted-foreground">+90 (532) 730 26 50</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-md border p-4">
            <Clock className="h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium">Çalışma Saatleri</p>
              <p className="text-sm text-muted-foreground">Pzt–Cts: 09:00 – 19:00</p>
            </div>
          </div>
        </div>
      </section>

      {/* Konum */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Konum</h2>
        <div className="overflow-hidden rounded-xl border">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2266.2426950578615!2d32.486701160957296!3d37.87085305775284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d0856f5bf31dad%3A0xc016e0bb34f05ecf!2sMustafa%20Soylu%20Hair%20Artist!5e0!3m2!1str!2str!4v1773419438513!5m2!1str!2str"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mustafa Soylu Hair Artist Konum"
          />
        </div>
      </section>
    </div>
  );
}
