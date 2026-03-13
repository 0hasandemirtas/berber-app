"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomerFormProps {
  customerName: string;
  customerPhone: string;
  onNameChange: (name: string) => void;
  onPhoneChange: (phone: string) => void;
}

export function CustomerForm({
  customerName,
  customerPhone,
  onNameChange,
  onPhoneChange,
}: CustomerFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">İletişim Bilgileri</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Ad Soyad</Label>
          <Input
            id="name"
            placeholder="Adınız Soyadınız"
            value={customerName}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input
            id="phone"
            placeholder="05XX XXX XX XX"
            value={customerPhone}
            onChange={(e) => onPhoneChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
