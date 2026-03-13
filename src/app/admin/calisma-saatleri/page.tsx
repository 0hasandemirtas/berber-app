"use client";

import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const DAY_NAMES = [
  "Pazar",
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
];

export default function WorkingHoursPage() {
  const barbers = trpc.barber.getAll.useQuery();
  const barberId = barbers.data?.[0]?.id;

  const workingHours = trpc.admin.getWorkingHours.useQuery(
    { barberId: barberId! },
    { enabled: !!barberId }
  );

  const updateHours = trpc.admin.updateWorkingHours.useMutation({
    onSuccess: () => workingHours.refetch(),
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ startTime: "", endTime: "", isOff: false });

  const startEdit = (wh: { id: string; startTime: string; endTime: string; isOff: boolean }) => {
    setEditingId(wh.id);
    setEditForm({ startTime: wh.startTime, endTime: wh.endTime, isOff: wh.isOff });
  };

  const handleSave = () => {
    if (!editingId) return;
    updateHours.mutate({ id: editingId, ...editForm });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Çalışma Saatleri</h2>

      {workingHours.isLoading ? (
        <p className="text-muted-foreground">Yükleniyor...</p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Haftalık Program</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {workingHours.data?.map((wh) => (
              <div
                key={wh.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div className="w-28 font-medium">{DAY_NAMES[wh.dayOfWeek]}</div>

                {editingId === wh.id ? (
                  <div className="flex flex-1 items-center gap-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={editForm.isOff}
                        onChange={(e) =>
                          setEditForm({ ...editForm, isOff: e.target.checked })
                        }
                      />
                      Kapalı
                    </label>
                    {!editForm.isOff && (
                      <>
                        <div className="space-y-1">
                          <Label className="text-xs">Başlangıç</Label>
                          <Input
                            type="time"
                            value={editForm.startTime}
                            onChange={(e) =>
                              setEditForm({ ...editForm, startTime: e.target.value })
                            }
                            className="w-32"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Bitiş</Label>
                          <Input
                            type="time"
                            value={editForm.endTime}
                            onChange={(e) =>
                              setEditForm({ ...editForm, endTime: e.target.value })
                            }
                            className="w-32"
                          />
                        </div>
                      </>
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSave} disabled={updateHours.isPending}>
                        Kaydet
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                        İptal
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-1 items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {wh.isOff ? (
                        <span className="text-red-500">Kapalı</span>
                      ) : (
                        `${wh.startTime} - ${wh.endTime}`
                      )}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => startEdit(wh)}>
                      Düzenle
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
