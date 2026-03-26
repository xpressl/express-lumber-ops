import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function CrossSellPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Cross-Sell Opportunities" description="Customers buying X but not Y"
        breadcrumbs={[{ label: "CRM", href: "/crm" }, { label: "Cross-Sell" }]} />
      <Card><CardContent className="py-8 text-center text-muted-foreground text-sm">
        Cross-sell rule engine will analyze purchase patterns and suggest opportunities.
        <br />Example: &quot;Buys doors but not trim&quot;, &quot;Buys framing but not sheathing&quot;
      </CardContent></Card>
    </div>
  );
}
