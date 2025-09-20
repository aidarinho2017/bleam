import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Contact, Purchase } from "./types";
import { format } from "date-fns";
import { Pencil, Trash2, Plus } from "lucide-react";
import ContactPurchaseForm from "./ContactPurchaseForm";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  contact?: Contact | null;
  onUpdateContact?: (c: Contact) => void;
}

const ContactDetailsDialog = ({ open, onOpenChange, contact, onUpdateContact }: Props) => {
  const { t } = useLanguage();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);

  if (!contact) return null;
  const totalPurchases = contact.purchaseHistory.length;

  const handleAdd = () => { setEditingIndex(null); setFormOpen(true); };
  const handleEdit = (idx: number) => { setEditingIndex(idx); setFormOpen(true); };
  const handleDelete = (idx: number) => {
    if (!onUpdateContact) return;
    const next = contact.purchaseHistory.filter((_, i) => i !== idx);
    onUpdateContact({ ...contact, purchaseHistory: next });
  };
  const submit = (data: Purchase) => {
    if (!onUpdateContact) return;
    const list = [...contact.purchaseHistory];
    if (editingIndex === null) list.unshift(data); else list[editingIndex] = data;
    onUpdateContact({ ...contact, purchaseHistory: list });
    setFormOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('contactDetails')}</DialogTitle>
          <DialogDescription>{t('fullProfile')}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{t('name')}</p>
              <p className="font-medium">{contact.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('phone')}</p>
              <p className="font-medium">{contact.phone}</p>
            </div>
            {contact.email && (
              <div>
                <p className="text-sm text-muted-foreground">{t('email')}</p>
                <p className="font-medium">{contact.email}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">{t('lastActivity')}</p>
              <p className="font-medium">{format(new Date(contact.lastActivity), 'dd MMM yyyy')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('totalPurchases')}</p>
              <Badge variant="secondary">{totalPurchases}</Badge>
            </div>
          </section>

          {contact.notes && (
            <section>
              <p className="text-sm text-muted-foreground mb-1">{t('notes')}</p>
              <p className="text-sm">{contact.notes}</p>
            </section>
          )}

          <section>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold">{t('purchaseHistory')}</h4>
              <Button size="sm" onClick={handleAdd}><Plus className="h-4 w-4 mr-2" />{t('addPurchase')}</Button>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('product')}</TableHead>
                    <TableHead>{t('quantity')}</TableHead>
                    <TableHead>{t('date')}</TableHead>
                    <TableHead className="text-right">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contact.purchaseHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        {t('noPurchases')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    contact.purchaseHistory.map((p, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{p.product}</TableCell>
                        <TableCell>{p.quantity}</TableCell>
                        <TableCell>{format(new Date(p.date), 'dd MMM yyyy')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(idx)} aria-label={t('editPurchase')}><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(idx)} aria-label={t('deletePurchase')}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {formOpen && (
              <div className="mt-4 p-4 border rounded-md">
                <ContactPurchaseForm
                  initial={editingIndex !== null ? contact.purchaseHistory[editingIndex] : undefined}
                  onSubmit={submit}
                  onCancel={() => setFormOpen(false)}
                />
              </div>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDetailsDialog;
