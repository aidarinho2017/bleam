import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, Eye, Pencil, Trash2 } from "lucide-react";
import { Contact } from "./types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export type SortKey = "name" | "numPurchases" | "lastActivity";
export type SortDir = "asc" | "desc";

interface ContactsTableProps {
  contacts: Contact[];
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onSortChange: (key: SortKey) => void;
  sortKey: SortKey;
  sortDir: SortDir;
  onRowClick: (c: Contact) => void;
  onEdit: (c: Contact) => void;
  onDelete: (c: Contact) => void;
  deletingId?: string | null;
}

const ContactsTable = ({
  contacts,
  page,
  pageSize,
  onPageChange,
  onSortChange,
  sortKey,
  sortDir,
  onRowClick,
  onEdit,
  onDelete,
  deletingId,
}: ContactsTableProps) => {
  const totalPages = Math.max(1, Math.ceil(contacts.length / pageSize));

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return contacts.slice(start, start + pageSize);
  }, [contacts, page, pageSize]);

  const getSortIndicator = (key: SortKey) => (
    <span className={cn("inline-flex items-center gap-1", sortKey === key && "text-foreground")}> 
      <ArrowUpDown className="h-4 w-4" />
    </span>
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer select-none" onClick={() => onSortChange("name")}>
              <div className="flex items-center gap-1">Name {getSortIndicator("name")}</div>
            </TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead className="cursor-pointer select-none" onClick={() => onSortChange("lastActivity")}>
              <div className="flex items-center gap-1">Last Activity {getSortIndicator("lastActivity")}</div>
            </TableHead>
            <TableHead>Purchase History</TableHead>
            <TableHead className="cursor-pointer select-none" onClick={() => onSortChange("numPurchases")}>
              <div className="flex items-center gap-1"># Purchases {getSortIndicator("numPurchases")}</div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">No contacts found.</TableCell>
            </TableRow>
          ) : (
            paged.map((c) => (
              <TableRow
                key={c.id}
                className={cn("transition-colors hover:bg-muted/50 animate-fade-in", deletingId === c.id && "animate-fade-out opacity-0")}
                onClick={() => onRowClick(c)}
              >
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>{format(new Date(c.lastActivity), 'dd MMM yyyy')}</TableCell>
                <TableCell>
                  {c.purchaseHistory.length === 0 ? (
                    <span className="text-muted-foreground text-sm">—</span>
                  ) : (
                    <ul className="text-sm list-disc pl-4 space-y-0.5">
                      {c.purchaseHistory.slice(0, 3).map((p, idx) => (
                        <li key={idx}>{p.product} x{p.quantity}</li>
                      ))}
                      {c.purchaseHistory.length > 3 && (
                        <li className="text-muted-foreground">+{c.purchaseHistory.length - 3} more</li>
                      )}
                    </ul>
                  )}
                </TableCell>
                <TableCell>{c.purchaseHistory.length}</TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onRowClick(c)} aria-label="View details">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(c)} aria-label="Edit">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(c)} aria-label="Delete">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {contacts.length > pageSize && (
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} • {contacts.length} contacts
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1}>
              Prev
            </Button>
            <Button variant="outline" size="sm" onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsTable;
