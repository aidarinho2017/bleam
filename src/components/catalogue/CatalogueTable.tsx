import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { CatalogueItem } from "@/components/contacts/types";
import CatalogueForm from "./CatalogueForm";

interface Props {
  items: CatalogueItem[];
  onCreate: (data: Omit<CatalogueItem, "id">) => void;
  onUpdate: (item: CatalogueItem) => void;
  onDelete: (id: string) => void;
}

const CatalogueTable = ({ items, onCreate, onUpdate, onDelete }: Props) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CatalogueItem | null>(null);

  const totalStock = (item: CatalogueItem) => item.sizes.reduce((sum, s) => sum + s.available, 0);

  const handleAdd = () => {
    setEditing(null);
    setOpen(true);
  };

  const handleEdit = (item: CatalogueItem) => {
    setEditing(item);
    setOpen(true);
  };

  const submit = (data: Omit<CatalogueItem, "id">) => {
    if (editing) {
      onUpdate({ ...editing, ...data });
    } else {
      onCreate(data);
    }
    setOpen(false);
  };

  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="font-semibold">Каталог (киім)</h3>
        <Button onClick={handleAdd} className="btn-primary"><Plus className="h-4 w-4 mr-2" />Тауар қосу</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Атауы</TableHead>
            <TableHead>Өлшемдер</TableHead>
            <TableHead>Жалпы қалдық</TableHead>
            <TableHead>Бағасы (₸)</TableHead>
            <TableHead className="text-right">Әрекет</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">Тауар жоқ</TableCell>
            </TableRow>
          ) : (
            items.map((it) => (
              <TableRow key={it.id} className="transition-colors hover:bg-muted/50 animate-fade-in">
                <TableCell className="font-mono text-xs">{it.id}</TableCell>
                <TableCell className="font-medium">{it.name}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {it.sizes.map((s) => (
                      <span key={s.size} className="rounded bg-muted px-2 py-0.5">{s.size}: {s.available}</span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{totalStock(it)}</TableCell>
                <TableCell>{it.price.toLocaleString("kk-KZ")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(it)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(it.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Тауарды өңдеу" : "Жаңа тауар"}</DialogTitle>
          </DialogHeader>
          <CatalogueForm initial={editing ?? undefined} onSubmit={submit} onCancel={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CatalogueTable;
