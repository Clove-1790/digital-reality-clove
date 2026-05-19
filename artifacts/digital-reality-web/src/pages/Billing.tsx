import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency } from "@/lib/format";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Receipt, FileText, ArrowDownRight, ArrowUpRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Billing() {
  const { projects, invoices, expenses } = useApp();

  // Calculate summaries
  const totalPoValue = projects.reduce((sum, p) => sum + p.poValue, 0);
  const totalInvoiced = invoices.reduce((sum, i) => sum + i.amount, 0);
  const totalPaid = invoices.filter(i => i.status === "Paid").reduce((sum, i) => sum + i.amount, 0);
  const totalPending = totalInvoiced - totalPaid;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Finance</h1>
          <p className="text-muted-foreground mt-1">Financial overview across all projects</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/expenses/add">
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Link>
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" /> Total PO Value
            </p>
            <p className="text-3xl font-bold tracking-tight mt-2">{formatCurrency(totalPoValue)}</p>
            <p className="text-xs text-muted-foreground mt-2">Across {projects.length} projects</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Receipt className="w-4 h-4 text-blue-500" /> Total Invoiced
            </p>
            <p className="text-3xl font-bold tracking-tight mt-2 text-blue-600">{formatCurrency(totalInvoiced)}</p>
            <div className="w-full bg-muted rounded-full h-1.5 mt-3">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(totalInvoiced / totalPoValue) * 100}%` }}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">{Math.round((totalInvoiced / totalPoValue) * 100)}% of total PO</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ArrowDownRight className="w-4 h-4 text-green-500" /> Received
            </p>
            <p className="text-3xl font-bold tracking-tight mt-2 text-green-600">{formatCurrency(totalPaid)}</p>
            <div className="w-full bg-muted rounded-full h-1.5 mt-3">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(totalPaid / totalInvoiced) * 100}%` }}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">{Math.round((totalPaid / totalInvoiced) * 100)}% of invoiced</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-red-500" /> Pending (AR)
            </p>
            <p className="text-3xl font-bold tracking-tight mt-2 text-red-600">{formatCurrency(totalPending)}</p>
            <p className="text-xs text-muted-foreground mt-3 pt-1 border-t">Expenses to date: <span className="font-semibold text-foreground">₹{totalExpenses.toLocaleString("en-IN")}</span></p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => {
                  const project = projects.find(p => p.id === invoice.projectId);
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.number}</TableCell>
                      <TableCell>
                        <Link href={`/projects/${project?.id}`} className="text-primary hover:underline">
                          {project?.name || "Unknown"}
                        </Link>
                      </TableCell>
                      <TableCell>{invoice.description}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(invoice.amount)}</TableCell>
                      <TableCell>
                        <StatusBadge status={invoice.status} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
