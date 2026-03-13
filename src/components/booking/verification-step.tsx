"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Loader2 } from "lucide-react";

interface VerificationStepProps {
  customerName: string;
  customerPhone: string;
  onNameChange: (name: string) => void;
  onPhoneChange: (phone: string) => void;
  onVerified: () => void;
}

export function VerificationStep({
  customerName,
  customerPhone,
  onNameChange,
  onPhoneChange,
  onVerified,
}: VerificationStepProps) {
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);

  const sendCode = trpc.verification.sendCode.useMutation({
    onSuccess: () => {
      setCodeSent(true);
      setError("");
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const verifyCode = trpc.verification.verifyCode.useMutation({
    onSuccess: () => {
      setVerified(true);
      setError("");
      onVerified();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const phone = customerPhone.replace(/\s/g, "");
  const isPhoneValid = /^0?5\d{9}$/.test(phone);
  const isNameValid = customerName.trim().length >= 2;

  const handleSendCode = () => {
    setError("");
    sendCode.mutate({ phone });
  };

  const handleVerify = () => {
    setError("");
    verifyCode.mutate({ phone, code });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldCheck className="h-5 w-5" />
          İletişim Bilgileri & Doğrulama
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Ad Soyad */}
        <div className="space-y-2">
          <Label htmlFor="name">Ad Soyad</Label>
          <Input
            id="name"
            placeholder="Adınız Soyadınız"
            value={customerName}
            onChange={(e) => onNameChange(e.target.value)}
            disabled={verified}
          />
          {customerName.length > 0 && !isNameValid && (
            <p className="text-sm text-destructive">İsim en az 2 karakter olmalı.</p>
          )}
        </div>

        {/* Telefon */}
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon Numarası</Label>
          <div className="flex gap-2">
            <Input
              id="phone"
              placeholder="05XX XXX XX XX"
              value={customerPhone}
              onChange={(e) => {
                onPhoneChange(e.target.value);
                if (codeSent) {
                  setCodeSent(false);
                  setCode("");
                  setVerified(false);
                }
              }}
              disabled={verified}
              className="flex-1"
            />
            {!verified && (
              <Button
                onClick={handleSendCode}
                disabled={!isPhoneValid || !isNameValid || sendCode.isPending}
                variant="secondary"
              >
                {sendCode.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : codeSent ? (
                  "Tekrar Gönder"
                ) : (
                  "Kod Gönder"
                )}
              </Button>
            )}
          </div>
          {customerPhone.length > 3 && !isPhoneValid && (
            <p className="text-sm text-destructive">
              Geçerli bir telefon numarası girin (05XX XXX XX XX).
            </p>
          )}
        </div>

        {/* Doğrulama Kodu */}
        {codeSent && !verified && (
          <div className="space-y-2">
            <Label htmlFor="code">Doğrulama Kodu</Label>
            <div className="flex gap-2">
              <Input
                id="code"
                placeholder="4 haneli kod"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                maxLength={4}
                className="w-32 text-center text-lg tracking-widest"
              />
              <Button
                onClick={handleVerify}
                disabled={code.length !== 4 || verifyCode.isPending}
              >
                {verifyCode.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Doğrula"
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Telefonunuza gönderilen 4 haneli kodu girin. Kod 5 dakika geçerlidir.
            </p>
          </div>
        )}

        {/* Doğrulama başarılı */}
        {verified && (
          <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-700">
            <ShieldCheck className="h-4 w-4" />
            Telefon numaranız doğrulandı.
          </div>
        )}

        {/* Hata mesajı */}
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
