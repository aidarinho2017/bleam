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
import { Contact } from "@/components/contacts/types";
import { cn } from "@/lib/utils";

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Айдос Бек",
    phone: "+7 701 123 4567",
    email: "aidos.bek@example.kz",
    lastActivity: new Date().toISOString(),
    purchaseHistory: [
      { product: "Samruk Pro", quantity: 1, date: new Date().toISOString() },
      { product: "Kaspi Premium", quantity: 2, date: new Date().toISOString() },
    ],
    notes: "VIP клиент, предпочитает WhatsApp",
  },
  {
    id: "2",
    name: "Алтынай Салым",
    phone: "+7 777 555 2211",
    email: "altynai.s@example.kz",
    lastActivity: new Date(Date.now() - 86400000 * 2).toISOString(),
    purchaseHistory: [],
  },
  {
    id: "3",
    name: "Жанар Куат",
    phone: "+7 702 987 6543",
    email: "zhanar.k@example.kz",
    lastActivity: new Date(Date.now() - 86400000 * 3).toISOString(),
    purchaseHistory: [
      { product: "Beeline+", quantity: 1, date: new Date().toISOString() },
      { product: "Halyk Gold", quantity: 1, date: new Date().toISOString() },
      { product: "Kcell Business", quantity: 3, date: new Date().toISOString() },
      { product: "Magnum Club", quantity: 1, date: new Date().toISOString() },
    ],
  },
  {
    id: "4",
    name: "Нурсултан Ерлан",
    phone: "+7 705 111 2233",
    email: "nursultan.y@example.kz",
    lastActivity: new Date(Date.now() - 86400000 * 10).toISOString(),
    purchaseHistory: [
      { product: "Air Astana Miles", quantity: 1, date: new Date().toISOString() },
    ],
  },
  {
    id: "5",
    name: "Айгерим Тас",
    phone: "+7 706 333 5566",
    email: "aigerim.t@example.kz",
    lastActivity: new Date(Date.now() - 86400000 * 1).toISOString(),
    purchaseHistory: [
      { product: "Kaspi Red", quantity: 1, date: new Date().toISOString() },
      { product: "Yandex Go Pro", quantity: 2, date: new Date().toISOString() },
    ],
  },
  {
    id: "6",
    name: "Еркебулан Саин",
    phone: "+7 707 444 7788",
    email: "erkebulan.s@example.kz",
    lastActivity: new Date(Date.now() - 86400000 * 6).toISOString(),
    purchaseHistory: [],
  },
  {
    id: "7",
    name: "Динара Аман",
    phone: "+7 708 999 0001",
    email: "dinara.a@example.kz",
    lastActivity: new Date(Date.now() - 86400000 * 15).toISOString(),
    purchaseHistory: [
      { product: "KazMunaiGaz Bonus", quantity: 4, date: new Date().toISOString() },
    ],
  },
  {
    id: "8",
    name: "Рустем Нур",
    phone: "+7 747 222 3344",
    email: "rustem.n@example.kz",
    lastActivity: new Date(Date.now() - 86400000 * 5).toISOString(),
    purchaseHistory: [
      { product: "Forte Gold", quantity: 2, date: new Date().toISOString() },
    ],
  },
  {
    id: "9",
    name: "Меруерт Жан",
    phone: "+7 771 112 2233",
    email: "meruert.j@example.kz",
    lastActivity: new Date(Date.now() - 86400000 * 20).toISOString(),
    purchaseHistory: [],
  },
  {
    id: "10",
    name: "Ернар Али",
    phone: "+7 775 555 6677",
    email: "ernar.a@example.kz",
    lastActivity: new Date(Date.now() - 86400000 * 8).toISOString(),
    purchaseHistory: [
      { product: "Kaspi Gold", quantity: 1, date: new Date().toISOString() },
      { product: "Zerta CRM", quantity: 1, date: new Date().toISOString() },
    ],
  },
  {
    id: "11",
    name: "Санжар Омир",
    phone: "+7 700 321 2323",
    email: "sanzhar.o@example.kz",
    lastActivity: new Date(Date.now() - 86400000 * 4).toISOString(),
    purchaseHistory: [],
  },
  {
    id: "12",
    name: "Аружан Тал",
    phone: "+7 776 909 1010",
    email: "aruzhan.t@example.kz",
    lastActivity: new Date(Date.now() - 86400000 * 12).toISOString(),
    purchaseHistory: [
      { product: "Halyk Black", quantity: 1, date: new Date().toISOString() },
    ],
  },
];

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
      </main>

      {/* Details Dialog */}
      <ContactDetailsDialog open={detailsOpen} onOpenChange={setDetailsOpen} contact={selected} />

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
