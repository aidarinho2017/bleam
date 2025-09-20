import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CatalogueItem, SizeStock } from "@/components/contacts/types";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  initial?: CatalogueItem;
  onSubmit: (data: Omit<CatalogueItem, "id">) => void;
  onCancel: () => void;
}

const CatalogueForm = ({ initial, onSubmit, onCancel }: Props) => {
  const { t } = useLanguage();
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [sizes, setSizes] = useState<SizeStock[]>(
    initial?.sizes ?? [
      { size: "S", available: 0 },
      { size: "M", available: 0 },
      { size: "L", available: 0 },
      { size: "XL", available: 0 },
    ]
  );

  const updateSize = (index: number, value: number) => {
    setSizes((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], available: value };
      return next;
    });
  };

  const submit = () => {
    const filtered = sizes.filter((s) => s.available >= 0);
    onSubmit({ name, price, sizes: filtered });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{t('name')}</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Мыс: Ерлер жейде" />
      </div>
      <div className="space-y-2">
        <Label>{t('price')} (₸)</Label>
        <Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {sizes.map((s, idx) => (
          <div key={s.size} className="space-y-1">
            <Label>{s.size} {t('available')}</Label>
            <Input type="number" value={s.available} onChange={(e) => updateSize(idx, Number(e.target.value))} />
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>{t('cancel')}</Button>
        <Button onClick={submit}>{initial ? t('save') : t('add')}</Button>
      </div>
    </div>
  );
};

export default CatalogueForm;
