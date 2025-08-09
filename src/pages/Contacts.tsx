import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Users } from "lucide-react";
import SearchBar from "@/components/contacts/SearchBar";
import ContactsTable, { SortDir, SortKey } from "@/components/contacts/ContactsTable";
import ContactDetailsDialog from "@/components/contacts/ContactDetailsDialog";
import ContactForm from "@/components/contacts/ContactForm";
import { Contact, CatalogueItem, PurchaseRecord } from "@/components/contacts/types";
import { cn } from "@/lib/utils";
import CatalogueTable from "@/components/catalogue/CatalogueTable";
import PurchasesTable from "@/components/purchases/PurchasesTable";
import { mockContacts, mockCatalogue, mockSales } from "@/components/contacts/mockData";

// mock data moved to separate module

const PAGE_SIZE = 10;

const ContactsPage = () => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Clothing shop state
  const [catalogue, setCatalogue] = useState(mockCatalogue);
  const [sales, setSales] = useState(mockSales);

  // Update contact from details dialog
  const onUpdateContact = (updated: Contact) => {
    setContacts(prev => prev.map(c => c.id === updated.id ? updated : c));
    setSelected(updated);
    toast({ title: "Contact updated" });
  };

  // Catalogue CRUD
  const createItem = (data: Omit<CatalogueItem, "id">) => {
    const id = `SKU-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    setCatalogue(prev => [{ id, ...data }, ...prev]);
    toast({ title: "Тауар қосылды" });
  };
  const updateItem = (item: CatalogueItem) => {
    setCatalogue(prev => prev.map(i => i.id === item.id ? item : i));
    toast({ title: "Тауар жаңартылды" });
  };
  const deleteItem = (id: string) => {
    setCatalogue(prev => prev.filter(i => i.id !== id));
    toast({ title: "Тауар өшірілді" });
  };

  // Sales CRUD
  const createSale = (data: Omit<PurchaseRecord, "id">) => {
    const id = `SALE-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    setSales(prev => [{ id, ...data }, ...prev]);
    toast({ title: "Сату қосылды" });
  };
  const updateSale = (rec: PurchaseRecord) => {
    setSales(prev => prev.map(s => s.id === rec.id ? rec : s));
    toast({ title: "Сату жаңартылды" });
  };
  const deleteSale = (id: string) => {
    setSales(prev => prev.filter(s => s.id !== id));
    toast({ title: "Сату өшірілді" });
  };

  useEffect(() => {
    // reset to page 1 when search changes
    setPage(1);
  }, [search]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return contacts.filter(c => c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q));
  }, [contacts, search]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let comp = 0;
      if (sortKey === "name") comp = a.name.localeCompare(b.name);
      if (sortKey === "numPurchases") comp = a.purchaseHistory.length - b.purchaseHistory.length;
      if (sortKey === "lastActivity") comp = new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime();
      return sortDir === "asc" ? comp : -comp;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const onSortChange = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const paginated = sorted; // table handles slicing

  const handleRowClick = (c: Contact) => {
    setSelected(c);
    setDetailsOpen(true);
  };

  const handleAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (c: Contact) => {
    setEditing(c);
    setFormOpen(true);
  };

  const handleDelete = (c: Contact) => {
    setDeletingId(c.id);
    setTimeout(() => {
      setContacts(prev => prev.filter(x => x.id !== c.id));
      setDeletingId(null);
      toast({ title: "Contact deleted" });
    }, 300);
  };

  const submitForm = (data: any) => {
    if (editing) {
      setContacts(prev => prev.map(c => c.id === editing.id ? { ...c, ...data } : c));
      toast({ title: "Contact updated" });
    } else {
      const newContact: Contact = {
        id: Math.random().toString(36).slice(2),
        name: data.name,
        phone: data.phone,
        email: data.email,
        lastActivity: data.lastActivity || new Date().toISOString(),
        notes: data.notes,
        purchaseHistory: [],
      };
      setContacts(prev => [newContact, ...prev]);
      toast({ title: "Contact added" });
    }
    setFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo title="Contacts CRM | Bleam" description="Manage customer contacts, search, sort, and view purchase history in Bleam CRM." canonical={typeof window !== 'undefined' ? window.location.href : undefined} />

      <header className="border-b border-border/50 bg-card/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-accent">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Contacts CRM</h1>
                <p className="text-sm text-muted-foreground">Manage your customer database</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/dashboard">
                <Button variant="outline" className="btn-secondary">Dashboard</Button>
              </Link>
              <Button onClick={handleAdd} className="btn-primary">
                <Plus className="h-4 w-4 mr-2" /> Add Contact
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <section className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar value={search} onChange={setSearch} />
          <div className="text-sm text-muted-foreground">{contacts.length} total contacts</div>
        </section>

        <ContactsTable
          contacts={paginated}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          onSortChange={onSortChange}
          sortKey={sortKey}
          sortDir={sortDir}
          onRowClick={handleRowClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
          deletingId={deletingId}
        />

        <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CatalogueTable
            items={catalogue}
            onCreate={createItem}
            onUpdate={updateItem}
            onDelete={deleteItem}
          />
          <PurchasesTable
            sales={sales}
            catalogue={catalogue}
            onCreate={createSale}
            onUpdate={updateSale}
            onDelete={deleteSale}
          />
        </section>
      </main>

      {/* Details Dialog */}
      <ContactDetailsDialog open={detailsOpen} onOpenChange={setDetailsOpen} contact={selected} onUpdateContact={onUpdateContact} />

      {/* Add/Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Contact" : "Add Contact"}</DialogTitle>
          </DialogHeader>
          <ContactForm initial={editing ?? undefined} onSubmit={submitForm} onCancel={() => setFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactsPage;
