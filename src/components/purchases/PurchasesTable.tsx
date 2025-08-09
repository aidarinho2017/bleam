import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { CatalogueItem, PurchaseRecord } from "@/components/contacts/types";
import SaleForm from "./SaleForm";
import { cn } from "@/lib/utils";

interface Props {
  sales: PurchaseRecord[];
  catalogue: CatalogueItem[];
  onCreate: (data: Omit<PurchaseRecord, "id">) => void;
  onUpdate: (rec: PurchaseRecord) => void;
  onDelete: (id: string) => void;
}

export type SortKey = "salesperson" | "itemsCount";
export type SortDir = "asc" | "desc";

const PurchasesTable = ({ sales, catalogue, onCreate, onUpdate, onDelete }: Props) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PurchaseRecord | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("salesperson");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleAdd = () => { setEditing(null); setOpen(true); };
  const handleEdit = (rec: PurchaseRecord) => { setEditing(rec); setOpen(true); };

  const submit = (data: Omit<PurchaseRecord, "id">) => {
    if (editing) onUpdate({ ...editing, ...data }); else onCreate(data);
    setOpen(false);
  };

  const onSortChange = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc"); else { setSortKey(key); setSortDir("asc"); }
  };

  const sorted = useMemo(() => {
    const arr = [...sales];
    arr.sort((a, b) => {
      let comp = 0;
      if (sortKey === "salesperson") comp = a.salesperson.localeCompare(b.salesperson);
      if (sortKey === "itemsCount") comp = a.items.reduce((s, i) => s + i.quantity, 0) - b.items.reduce((s, i) => s + i.quantity, 0);
      return sortDir === "asc" ? comp : -comp;
    });
    return arr;
  }, [sales, sortKey, sortDir]);

  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="font-semibold">Сатулар</h3>
        <Button onClick={handleAdd} className="btn-primary"><Plus className="h-4 w-4 mr-2" />Сату қосу</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer select-none" onClick={() => onSortChange("salesperson")}>
              <div className="flex items-center gap-1">Сатушы <ArrowUpDown className="h-4 w-4" /></div>
            </TableHead>
            <TableHead>Баға (₸)</TableHead>
            <TableHead className="cursor-pointer select-none" onClick={() => onSortChange("itemsCount")}>
              <div className="flex items-center gap-1">Зат саны <ArrowUpDown className="h-4 w-4" /></div>
            </TableHead>
            <TableHead>Сатылған заттар</TableHead>
            <TableHead className="text-right">Әрекет</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">Сату табылмады</TableCell>
            </TableRow>
          ) : (
            sorted.map((s) => (
              <TableRow key={s.id} className={cn("transition-colors hover:bg-muted/50 animate-fade-in")}> 
                <TableCell className="font-medium">{s.salesperson}</TableCell>
                <TableCell>{s.price.toLocaleString("kk-KZ")}</TableCell>
                <TableCell>{s.items.reduce((sum, i) => sum + i.quantity, 0)}</TableCell>
                <TableCell>
                  <ul className="text-sm list-disc pl-4 space-y-0.5">
                    {s.items.map((i, idx) => (
                      <li key={idx}>{i.name} x{i.quantity}</li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(s)} aria-label="Өңдеу"><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(s.id)} aria-label="Өшіру"><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
            <DialogTitle>{editing ? "Сатуды өңдеу" : "Жаңа сату"}</DialogTitle>
          </DialogHeader>
          <SaleForm initial={editing ?? undefined} catalogue={catalogue} onSubmit={submit} onCancel={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchasesTable;
