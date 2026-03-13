"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function ServicesPage() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", duration: 30, price: 0 });

  const services = trpc.admin.getServices.useQuery();
  const barbers = trpc.barber.getAll.useQuery();

  const createService = trpc.admin.createService.useMutation({
    onSuccess: () => {
      services.refetch();
      setShowNew(false);
      setForm({ name: "", description: "", duration: 30, price: 0 });
    },
  });

  const updateService = trpc.admin.updateService.useMutation({
    onSuccess: () => {
      services.refetch();
      setEditingId(null);
    },
  });

  const deleteService = trpc.admin.deleteService.useMutation({
    onSuccess: () => services.refetch(),
  });

  const handleCreate = () => {
    const barberId = barbers.data?.[0]?.id;
    if (!barberId) return;
    createService.mutate({ ...form, barberId });
  };

  const startEdit = (service: { id: string; name: string; description: string | null; duration: number; price: number }) => {
    setEditingId(service.id);
    setForm({
      name: service.name,
      description: service.description ?? "",
      duration: service.duration,
      price: service.price,
    });
  };

  const handleUpdate = () => {
    if (!editingId) return;
    updateService.mutate({ id: editingId, ...form });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Hizmetler</h2>
        <Button onClick={() => setShowNew(!showNew)}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Hizmet
        </Button>
      </div>

      {/* Yeni hizmet formu */}
      {showNew && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Yeni Hizmet Ekle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Hizmet Adı</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Saç Kesimi"
                />
              </div>
              <div className="space-y-2">
                <Label>Açıklama</Label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Opsiyonel"
                />
              </div>
              <div className="space-y-2">
                <Label>Süre (dk)</Label>
                <Input
                  type="number"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Fiyat (₺)</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={handleCreate} disabled={createService.isPending || !form.name}>
                Ekle
              </Button>
              <Button variant="outline" onClick={() => setShowNew(false)}>
                İptal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hizmet listesi */}
      {services.isLoading ? (
        <p className="text-muted-foreground">Yükleniyor...</p>
      ) : (
        <div className="space-y-3">
          {services.data?.map((service) => (
            <Card key={service.id}>
              <CardContent className="flex items-center justify-between py-4">
                {editingId === service.id ? (
                  <div className="flex-1 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-4">
                      <Input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                      <Input
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Açıklama"
                      />
                      <Input
                        type="number"
                        value={form.duration}
                        onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                      />
                      <Input
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleUpdate} disabled={updateService.isPending}>
                        Kaydet
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                        İptal
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="font-semibold">{service.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {service.duration} dk • ₺{service.price}
                        {service.description && ` • ${service.description}`}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEdit(service)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteService.mutate({ id: service.id })}
                        disabled={deleteService.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
