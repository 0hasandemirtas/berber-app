import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Mevcut verileri temizle
  await prisma.appointment.deleteMany();
  await prisma.workingHours.deleteMany();
  await prisma.service.deleteMany();
  await prisma.barber.deleteMany();

  // Mustafa Soylu berberini oluştur
  const barber = await prisma.barber.create({
    data: {
      name: "Mustafa Soylu",
      title: "Kurucu & Usta Berber",
      image: null,
      phone: "05551234567",
      isActive: true,
    },
  });

  // Hizmetleri oluştur
  await prisma.service.createMany({
    data: [
      {
        name: "Saç Kesimi",
        description: "Klasik erkek saç kesimi",
        duration: 30,
        price: 250,
        barberId: barber.id,
      },
      {
        name: "Sakal Tıraşı",
        description: "Ustura ile sakal tıraşı",
        duration: 20,
        price: 150,
        barberId: barber.id,
      },
      {
        name: "Saç + Sakal",
        description: "Saç kesimi ve sakal tıraşı kombo",
        duration: 45,
        price: 350,
        barberId: barber.id,
      },
      {
        name: "Saç Yıkama & Şekillendirme",
        description: "Saç yıkama, fön ve şekillendirme",
        duration: 20,
        price: 100,
        barberId: barber.id,
      },
      {
        name: "Çocuk Saç Kesimi",
        description: "12 yaş altı çocuklar için saç kesimi",
        duration: 20,
        price: 150,
        barberId: barber.id,
      },
    ],
  });

  // Çalışma saatlerini oluştur (Pazartesi-Cumartesi 09:00-19:00, Pazar kapalı)
  const workingDays = [
    { dayOfWeek: 1, startTime: "09:00", endTime: "19:00", isOff: false }, // Pazartesi
    { dayOfWeek: 2, startTime: "09:00", endTime: "19:00", isOff: false }, // Salı
    { dayOfWeek: 3, startTime: "09:00", endTime: "19:00", isOff: false }, // Çarşamba
    { dayOfWeek: 4, startTime: "09:00", endTime: "19:00", isOff: false }, // Perşembe
    { dayOfWeek: 5, startTime: "09:00", endTime: "19:00", isOff: false }, // Cuma
    { dayOfWeek: 6, startTime: "09:00", endTime: "17:00", isOff: false }, // Cumartesi
    { dayOfWeek: 0, startTime: "09:00", endTime: "19:00", isOff: true },  // Pazar (kapalı)
  ];

  for (const day of workingDays) {
    await prisma.workingHours.create({
      data: {
        barberId: barber.id,
        ...day,
      },
    });
  }

  console.log("Seed data oluşturuldu!");
  console.log(`Berber: ${barber.name} (${barber.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
