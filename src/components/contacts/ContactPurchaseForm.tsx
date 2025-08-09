import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Purchase } from "./types";

interface Props {
  initial?: Purchase;
  onSubmit: (data: Purchase) => void;
  onCancel: () => void;
}

const ContactPurchaseForm = ({ initial, onSubmit, onCancel }: Props) => {
  const [product, setProduct] = useState(initial?.product ?? "");
  const [quantity, setQuantity] = useState(initial?.quantity ?? 1);
  const [date, setDate] = useState(initial?.date ? initial.date.slice(0,10) : new Date().toISOString().slice(0,10));

  const submit = () => onSubmit({ product, quantity, date: new Date(date).toISOString() });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Тауар</Label>
        <Input value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Мыс: Ерлер жейде (M)" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Саны</Label>
          <Input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        </div>
        <div className="space-y-2">
          <Label>Күні</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Болдырмау</Button>
        <Button onClick={submit}>{initial ? "Сақтау" : "Қосу"}</Button>
      </div>
    </div>
  );
};

export default ContactPurchaseForm;
