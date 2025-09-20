import { useMemo } from "react";
import { CatalogueItem, Contact, PurchaseRecord } from "@/components/contacts/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  Cell,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  contacts: Contact[];
  sales: PurchaseRecord[];
  catalogue: CatalogueItem[];
}

const palette = [
  "hsl(var(--chart-red))",
  "hsl(var(--chart-blue))",
  "hsl(var(--chart-green))",
  "hsl(var(--chart-yellow))",
  "hsl(var(--chart-pink))",
];

export default function ContactsMetrics({ contacts, sales }: Props) {
  const { t } = useLanguage();
  const totalIncome = useMemo(() => sales.reduce((s, r) => s + r.price, 0), [sales]);
  const converted = useMemo(
    () => contacts.filter((c) => c.purchaseHistory.length > 0).length,
    [contacts]
  );
  const conversionRate = useMemo(
    () => (contacts.length ? Math.round((converted / contacts.length) * 100) : 0),
    [converted, contacts.length]
  );

  const salesByPerson = useMemo(() => {
    const map = new Map<string, number>();
    sales.forEach((s) => map.set(s.salesperson, (map.get(s.salesperson) || 0) + s.price));
    return Array.from(map.entries())
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);
  }, [sales]);

  const popularItems = useMemo(() => {
    const map = new Map<string, number>();
    sales.forEach((s) => s.items.forEach((i) => map.set(i.name, (map.get(i.name) || 0) + i.quantity)));
    return Array.from(map.entries())
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 6);
  }, [sales]);

  const messagesByDay = useMemo(() => {
    // Mock last 7 days of chatbot messages (WhatsApp & Telegram)
    const days = 7;
    const labels = Array.from({ length: days }, (_, i) => {
      const d = new Date(Date.now() - (days - 1 - i) * 86400000);
      return d.toLocaleDateString("kk-KZ", { month: "2-digit", day: "2-digit" });
    });
    const data = labels.map((label, idx) => ({
      day: label,
      WhatsApp: [42, 36, 50, 28, 61, 48, 55][idx % 7],
      Telegram: [30, 22, 35, 18, 40, 27, 33][idx % 7],
    }));
    return data;
  }, []);

  return (
    <section aria-label="CRM Metrics" className="grid gap-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">{t('totalIncome')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₸ {totalIncome.toLocaleString("kk-KZ")}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">{t('totalSales')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sales.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">{t('contacts')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">{t('conversion')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-28">
              <ChartContainer
                config={{ conv: { label: "Conversion", color: "hsl(var(--chart-pink))" } }}
              >
                <RadialBarChart data={[{ name: "conv", value: conversionRate }]} innerRadius={40} outerRadius={60} startAngle={90} endAngle={-270}>
                  <RadialBar dataKey="value" cornerRadius={10} fill="var(--color-conv)" />
                </RadialBarChart>
              </ChartContainer>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">{conversionRate}% {t('ofContactsPurchased')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Salespeople by revenue */}
        <Card className="bg-card border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">{t('topSalesRevenue')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartContainer
                config={{ revenue: { label: "Revenue", color: "hsl(var(--primary))" } }}
              >
                <BarChart data={salesByPerson} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                    {salesByPerson.map((_, idx) => (
                      <Cell key={`rev-${idx}`} fill={palette[idx % palette.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Popular items (pie) */}
        <Card className="bg-card border">
          <CardHeader>
            <CardTitle className="text-base">{t('mostPopularItems')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartContainer config={{}}>
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie data={popularItems} dataKey="quantity" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={4}>
                    {popularItems.map((_, idx) => (
                      <Cell key={idx} fill={palette[idx % palette.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chatbot messages by day (stacked bars) */}
      <Card className="bg-card border">
        <CardHeader>
          <CardTitle className="text-base">{t('chatbotMessages')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ChartContainer
              config={{
                WhatsApp: { label: "WhatsApp", color: "hsl(var(--chart-green))" },
                Telegram: { label: "Telegram", color: "hsl(var(--chart-blue))" },
              }}
            >
              <BarChart data={messagesByDay}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="WhatsApp" stackId="a" fill="var(--color-WhatsApp)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Telegram" stackId="a" fill="var(--color-Telegram)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
