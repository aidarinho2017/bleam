import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Contact } from "./types";

interface ContactFormProps {
  initial?: Partial<Contact>;
  onSubmit: (data: Omit<Contact, "id" | "purchaseHistory"> & { purchaseHistory?: Contact["purchaseHistory"] }) => void;
  onCancel: () => void;
}

const ContactForm = ({ initial, onSubmit, onCancel }: ContactFormProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [lastActivity, setLastActivity] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (initial) {
      setName(initial.name ?? "");
      setPhone(initial.phone ?? "");
      setEmail(initial.email ?? "");
      setLastActivity(initial.lastActivity?.slice(0, 10) ?? "");
      setNotes(initial.notes ?? "");
    }
  }, [initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    onSubmit({ name, phone, email, lastActivity: lastActivity || new Date().toISOString(), notes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Aidos Bek" />
        </div>
        <div>
          <label className="text-sm font-medium">Phone</label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+7 701 123 4567" />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="aidos@example.kz" />
        </div>
        <div>
          <label className="text-sm font-medium">Last Activity</label>
          <Input type="date" value={lastActivity} onChange={(e) => setLastActivity(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Notes</label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="VIP customer, prefers WhatsApp." />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

export default ContactForm;
