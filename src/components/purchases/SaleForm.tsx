import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CatalogueItem, PurchaseItem, PurchaseRecord } from "@/components/contacts/types";

interface Props {
  initial?: PurchaseRecord;
  catalogue: CatalogueItem[];
  onSubmit: (data: Omit<PurchaseRecord, "id">) => void;
  onCancel: () => void;
}

const SaleForm = ({ initial, catalogue, onSubmit, onCancel }: Props) => {
  const [salesperson, setSalesperson] = useState(initial?.salesperson ?? "");
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState<PurchaseItem[]>(initial?.items ?? []);

  const addItem = () => setItems((prev) => [...prev, { itemId: catalogue[0]?.id ?? "", name: catalogue[0]?.name ?? "", quantity: 1 }]);
  const removeItem = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));
  const updateItemId = (idx: number, id: string) => setItems((prev) => {
    const next = [...prev];
    const cat = catalogue.find((c) => c.id === id);
    if (cat) next[idx] = { ...next[idx], itemId: id, name: cat.name };
    return next;
  });
  const updateQty = (idx: number, q: number) => setItems((prev) => {
    const next = [...prev];
    next[idx] = { ...next[idx], quantity: q };
    return next;
  });

  const submit = () => onSubmit({ salesperson, price, items, date: new Date(date).toISOString() });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Сатушы</Label>
        <Input value={salesperson} onChange={(e) => setSalesperson(e.target.value)} placeholder="Мыс: Айару" />
      </div>
      <div className="space-y-2">
        <Label>Жалпы баға (₸)</Label>
        <Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
      </div>
      <div className="space-y-2">
        <Label>Күні</Label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Сатылған заттар</Label>
          <Button variant="outline" size="sm" onClick={addItem}>Қосу</Button>
        </div>
        {items.length === 0 && <p className="text-sm text-muted-foreground">Бос</p>}
        <div className="space-y-3">
          {items.map((it, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-7">
                <Select value={it.itemId} onValueChange={(v) => updateItemId(idx, v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Тауарды таңдаңыз" />
                  </SelectTrigger>
                  <SelectContent>
                    {catalogue.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3">
                <Input type="number" min={1} value={it.quantity} onChange={(e) => updateQty(idx, Number(e.target.value))} />
              </div>
              <div className="col-span-2 flex justify-end">
                <Button variant="ghost" size="sm" onClick={() => removeItem(idx)}>Өшіру</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Болдырмау</Button>
        <Button onClick={submit}>{initial ? "Сақтау" : "Қосу"}</Button>
      </div>
    </div>
  );
};

export default SaleForm;
