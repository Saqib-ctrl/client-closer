import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { exportToPdf } from "@/lib/exportToPdf";
import { Plus, Trash2, Download, Save, FileText } from "lucide-react";
import { motion } from "framer-motion";

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceGeneratorProps {
  userId: string;
}

export const InvoiceGenerator = ({ userId }: InvoiceGeneratorProps) => {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [taxRate, setTaxRate] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [items, setItems] = useState<LineItem[]>([
    { description: "", quantity: 1, rate: 0, amount: 0 },
  ]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Auto-generate invoice number
    const num = `INV-${Date.now().toString(36).toUpperCase()}`;
    setInvoiceNumber(num);
  }, []);

  const updateItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    updated[index].amount = updated[index].quantity * updated[index].rate;
    setItems(updated);
  };

  const addItem = () => setItems([...items, { description: "", quantity: 1, rate: 0, amount: 0 }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const currencySymbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency;

  const saveInvoice = async () => {
    if (!clientName.trim()) {
      toast({ title: "Client name required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("invoices").insert({
        user_id: userId,
        client_name: clientName,
        client_email: clientEmail,
        invoice_number: invoiceNumber,
        items: items as any,
        subtotal,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total,
        currency,
        due_date: dueDate || null,
        notes,
        status: "draft",
      });
      if (error) throw error;
      toast({ title: "Invoice saved! ✅" });
    } catch (e: any) {
      toast({ title: "Error saving invoice", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const downloadPdf = () => {
    const content = `
INVOICE ${invoiceNumber}
${"=".repeat(40)}

Bill To: ${clientName}
Email: ${clientEmail}
Due Date: ${dueDate || "N/A"}

${"─".repeat(40)}
ITEMS:
${items.map((item, i) => `${i + 1}. ${item.description}\n   Qty: ${item.quantity} × ${currencySymbol}${item.rate.toFixed(2)} = ${currencySymbol}${item.amount.toFixed(2)}`).join("\n\n")}

${"─".repeat(40)}
Subtotal: ${currencySymbol}${subtotal.toFixed(2)}
Tax (${taxRate}%): ${currencySymbol}${taxAmount.toFixed(2)}
TOTAL: ${currencySymbol}${total.toFixed(2)}

${notes ? `Notes:\n${notes}` : ""}
    `.trim();
    exportToPdf(content, `invoice-${invoiceNumber}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Client & Invoice Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" /> Client Details
          </h3>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Client Name *</Label>
              <Input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Acme Inc." />
            </div>
            <div>
              <Label className="text-xs">Client Email</Label>
              <Input value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="client@example.com" />
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold text-sm">Invoice Details</h3>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Invoice #</Label>
              <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Due Date</Label>
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs">Currency</Label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="font-semibold text-sm">Line Items</h3>
        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-12 gap-2 items-end"
            >
              <div className="col-span-5">
                {i === 0 && <Label className="text-xs">Description</Label>}
                <Input
                  value={item.description}
                  onChange={(e) => updateItem(i, "description", e.target.value)}
                  placeholder="Service description"
                />
              </div>
              <div className="col-span-2">
                {i === 0 && <Label className="text-xs">Qty</Label>}
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateItem(i, "quantity", Number(e.target.value))}
                />
              </div>
              <div className="col-span-2">
                {i === 0 && <Label className="text-xs">Rate</Label>}
                <Input
                  type="number"
                  min={0}
                  value={item.rate}
                  onChange={(e) => updateItem(i, "rate", Number(e.target.value))}
                />
              </div>
              <div className="col-span-2">
                {i === 0 && <Label className="text-xs">Amount</Label>}
                <div className="h-9 flex items-center text-sm font-medium px-3 bg-muted rounded-md">
                  {currencySymbol}{item.amount.toFixed(2)}
                </div>
              </div>
              <div className="col-span-1">
                {items.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => removeItem(i)} className="h-9 w-9">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={addItem}>
          <Plus className="w-4 h-4 mr-1" /> Add Item
        </Button>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <Label className="text-xs">Notes</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Payment terms, thank you note..." rows={3} />
        </div>
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{currencySymbol}{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm gap-3">
            <span className="text-muted-foreground">Tax</span>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                max={100}
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-20 h-8 text-xs"
              />
              <span className="text-xs text-muted-foreground">%</span>
              <span className="font-medium ml-auto">{currencySymbol}{taxAmount.toFixed(2)}</span>
            </div>
          </div>
          <div className="border-t border-border pt-3 flex justify-between text-base font-bold">
            <span>Total</span>
            <span className="text-primary">{currencySymbol}{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={saveInvoice} disabled={saving}>
          <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : "Save Invoice"}
        </Button>
        <Button variant="outline" onClick={downloadPdf}>
          <Download className="w-4 h-4 mr-2" /> Download PDF
        </Button>
      </div>
    </div>
  );
};
