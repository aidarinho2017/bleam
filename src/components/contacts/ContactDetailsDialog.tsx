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
import { Contact } from "./types";
import { format } from "date-fns";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  contact?: Contact | null;
}

const ContactDetailsDialog = ({ open, onOpenChange, contact }: Props) => {
  if (!contact) return null;
  const totalPurchases = contact.purchaseHistory.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Contact Details</DialogTitle>
          <DialogDescription>Full profile and purchase history</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{contact.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{contact.phone}</p>
            </div>
            {contact.email && (
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{contact.email}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Last Activity</p>
              <p className="font-medium">{format(new Date(contact.lastActivity), 'dd MMM yyyy')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Purchases</p>
              <Badge variant="secondary">{totalPurchases}</Badge>
            </div>
          </section>
          {contact.notes && (
            <section>
              <p className="text-sm text-muted-foreground mb-1">Notes</p>
              <p className="text-sm">{contact.notes}</p>
            </section>
          )}
          <section>
            <h4 className="text-sm font-semibold mb-2">Purchase History</h4>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contact.purchaseHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No purchases yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    contact.purchaseHistory.map((p, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{p.product}</TableCell>
                        <TableCell>{p.quantity}</TableCell>
                        <TableCell>{format(new Date(p.date), 'dd MMM yyyy')}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDetailsDialog;
