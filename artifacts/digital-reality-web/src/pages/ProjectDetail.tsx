import { useApp } from "@/context/AppContext";
import { useRoute } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency } from "@/lib/format";
import { Progress } from "@/components/ui/progress";
import { MapPin, Calendar, Briefcase, FileText, User as UserIcon, ActivitySquare, Receipt, AlertCircle, Download } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

async function exportProjectPDF(
  project: ReturnType<typeof useApp>["projects"][0],
  activities: ReturnType<typeof useApp>["activities"],
  invoices: ReturnType<typeof useApp>["invoices"],
  expenses: ReturnType<typeof useApp>["expenses"]
) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 14;
  let y = 0;

  const PRIMARY = [21, 101, 192] as [number, number, number];
  const GREY = [100, 100, 100] as [number, number, number];
  const LIGHT = [245, 247, 250] as [number, number, number];
  const WHITE = [255, 255, 255] as [number, number, number];
  const DARK = [30, 40, 55] as [number, number, number];

  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, pageW, 36, "F");

  doc.setTextColor(...WHITE);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Digital Reality", margin, 14);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Project Management — Field Operations", margin, 20);

  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`, pageW - margin, 14, { align: "right" });
  doc.text(`Report ID: ${project.projectId}`, pageW - margin, 20, { align: "right" });

  y = 44;
  doc.setTextColor(...DARK);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(project.name, margin, y);

  y += 7;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GREY);
  doc.text(`${project.client}  ·  ${project.location}, ${project.state}  ·  ${project.projectId}`, margin, y);

  y += 4;
  doc.setDrawColor(220, 225, 235);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageW - margin, y);

  y += 8;
  const cardW = (pageW - margin * 2 - 9) / 4;
  const cards = [
    { label: "PO VALUE", value: formatCurrency(project.poValue) },
    { label: "START DATE", value: project.startDate || "TBD" },
    { label: "END DATE", value: project.endDate || "TBD" },
    { label: "PROJECT MANAGER", value: project.projectManager },
  ];
  cards.forEach((c, i) => {
    const x = margin + i * (cardW + 3);
    doc.setFillColor(...LIGHT);
    doc.roundedRect(x, y, cardW, 18, 2, 2, "F");
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GREY);
    doc.text(c.label, x + 4, y + 6);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...DARK);
    doc.text(c.value, x + 4, y + 13, { maxWidth: cardW - 8 });
  });

  y += 26;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GREY);
  doc.text(`STATUS: ${project.status.toUpperCase()}`, margin, y);
  doc.text(`PROGRESS: ${project.progress}%`, margin + 50, y);

  y += 3;
  doc.setDrawColor(220, 225, 235);
  doc.setFillColor(220, 225, 235);
  doc.roundedRect(margin, y, pageW - margin * 2, 4, 2, 2, "F");
  doc.setFillColor(...PRIMARY);
  doc.roundedRect(margin, y, (pageW - margin * 2) * project.progress / 100, 4, 2, 2, "F");

  y += 12;

  const sectionHeader = (title: string) => {
    doc.setFillColor(...PRIMARY);
    doc.rect(margin, y, 3, 6, "F");
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...DARK);
    doc.text(title, margin + 6, y + 5);
    y += 10;
  };

  sectionHeader("Field Activities");

  if (activities.length === 0) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...GREY);
    doc.text("No field activities logged for this project.", margin, y);
    y += 10;
  } else {
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Date", "Activity Type", "Location", "Area (sqkm)", "Equipment", "Progress", "Remarks"]],
      body: activities.map(a => [
        a.date,
        a.activityType,
        a.location,
        `${a.areaCovered} sqkm`,
        a.equipmentUsed.join(", "),
        `${a.progress}%`,
        a.remarks,
      ]),
      headStyles: { fillColor: PRIMARY, textColor: WHITE, fontSize: 8, fontStyle: "bold", cellPadding: 3 },
      bodyStyles: { fontSize: 8, textColor: DARK, cellPadding: 3 },
      alternateRowStyles: { fillColor: LIGHT },
      columnStyles: {
        0: { cellWidth: 22 },
        1: { cellWidth: 34 },
        2: { cellWidth: 24 },
        3: { cellWidth: 20 },
        4: { cellWidth: 32 },
        5: { cellWidth: 18 },
        6: { cellWidth: "auto" },
      },
      tableLineColor: [220, 225, 235],
      tableLineWidth: 0.3,
    });
    y = (doc as any).lastAutoTable.finalY + 12;
  }

  sectionHeader("Invoices");

  const totalInvoiced = invoices.reduce((s, i) => s + i.amount, 0);
  const totalPaid = invoices.filter(i => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const totalPending = invoices.filter(i => i.status === "Pending" || i.status === "Partial").reduce((s, i) => s + i.amount, 0);

  if (invoices.length === 0) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...GREY);
    doc.text("No invoices raised yet.", margin, y);
    y += 10;
  } else {
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Invoice #", "Description", "Date", "Amount", "Status"]],
      body: [
        ...invoices.map(i => [i.number, i.description, i.date, formatCurrency(i.amount), i.status]),
        ["", "TOTAL INVOICED", "", formatCurrency(totalInvoiced), ""],
      ],
      headStyles: { fillColor: PRIMARY, textColor: WHITE, fontSize: 8, fontStyle: "bold", cellPadding: 3 },
      bodyStyles: { fontSize: 8, textColor: DARK, cellPadding: 3 },
      alternateRowStyles: { fillColor: LIGHT },
      didParseCell: (data: any) => {
        if (data.row.index === invoices.length) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [230, 238, 255];
        }
      },
      tableLineColor: [220, 225, 235],
      tableLineWidth: 0.3,
    });
    y = (doc as any).lastAutoTable.finalY + 8;

    const summW = (pageW - margin * 2 - 6) / 3;
    const summItems = [
      { label: "Total Invoiced", value: formatCurrency(totalInvoiced) },
      { label: "Received", value: formatCurrency(totalPaid) },
      { label: "Pending", value: formatCurrency(totalPending) },
    ];
    summItems.forEach((s, i) => {
      const x = margin + i * (summW + 3);
      if (i === 2) {
        doc.setFillColor(255, 247, 235);
      } else {
        doc.setFillColor(...LIGHT);
      }
      doc.roundedRect(x, y, summW, 14, 2, 2, "F");
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...GREY);
      doc.text(s.label.toUpperCase(), x + 4, y + 5);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      if (i === 2) {
        doc.setTextColor(180, 80, 0);
      } else {
        doc.setTextColor(...DARK);
      }
      doc.text(s.value, x + 4, y + 12);
    });
    y += 20;
  }

  sectionHeader("Field Expenses");

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  if (expenses.length === 0) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...GREY);
    doc.text("No field expenses logged.", margin, y);
    y += 10;
  } else {
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Date", "Type", "Paid By", "Location", "Remarks", "Amount"]],
      body: [
        ...expenses.map(e => [e.date, e.expenseType, e.paidBy, e.location, e.remarks, `₹${e.amount.toLocaleString("en-IN")}`]),
        ["", "", "", "", "TOTAL", `₹${totalExpenses.toLocaleString("en-IN")}`],
      ],
      headStyles: { fillColor: PRIMARY, textColor: WHITE, fontSize: 8, fontStyle: "bold", cellPadding: 3 },
      bodyStyles: { fontSize: 8, textColor: DARK, cellPadding: 3 },
      alternateRowStyles: { fillColor: LIGHT },
      didParseCell: (data: any) => {
        if (data.row.index === expenses.length) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [230, 238, 255];
        }
      },
      tableLineColor: [220, 225, 235],
      tableLineWidth: 0.3,
    });
    y = (doc as any).lastAutoTable.finalY + 10;
  }

  const pageCount = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const ph = doc.internal.pageSize.getHeight();
    doc.setDrawColor(220, 225, 235);
    doc.setLineWidth(0.3);
    doc.line(margin, ph - 12, pageW - margin, ph - 12);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GREY);
    doc.text("Digital Reality — Confidential Project Report", margin, ph - 7);
    doc.text(`Page ${i} of ${pageCount}`, pageW - margin, ph - 7, { align: "right" });
  }

  doc.save(`${project.projectId}_${project.name.replace(/\s+/g, "_")}_Report.pdf`);
}

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:id");
  const id = params?.id;
  const { projects, activities, invoices, expenses } = useApp();
  const [exporting, setExporting] = useState(false);

  const project = projects.find(p => p.id === id);
  const projectActivities = activities.filter(a => a.projectId === id);
  const projectInvoices = invoices.filter(i => i.projectId === id);
  const projectExpenses = expenses.filter(e => e.projectId === id);

  if (!project) {
    return <div className="p-8 text-center text-muted-foreground">Project not found</div>;
  }

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportProjectPDF(project, projectActivities, projectInvoices, projectExpenses);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <StatusBadge status={project.status} className="text-sm" />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="font-medium bg-muted px-2 py-0.5 rounded text-foreground">{project.projectId}</span>
            <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {project.client}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {project.location}, {project.state}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-full md:w-52 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Progress</span>
              <span className="font-bold">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2.5" />
          </div>
          <Button onClick={handleExport} disabled={exporting} className="shrink-0 gap-2">
            <Download className="w-4 h-4" />
            {exporting ? "Generating…" : "Export PDF"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">PO Value</p>
              <p className="font-bold text-lg">{formatCurrency(project.poValue)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-muted rounded-full">
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Timeline</p>
              <p className="font-bold text-sm">{project.startDate || 'TBD'} <br/><span className="text-xs font-normal text-muted-foreground">to {project.endDate || 'TBD'}</span></p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-muted rounded-full">
              <UserIcon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Project Manager</p>
              <p className="font-bold">{project.projectManager}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-full text-blue-600">
              <ActivitySquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Field Activities</p>
              <p className="font-bold text-lg">{projectActivities.length} Logged</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="field-work" className="mt-8">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
          <TabsTrigger value="field-work" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3">Field Work</TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3">Billing & Expenses</TabsTrigger>
          <TabsTrigger value="processing" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3">Data Processing</TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="field-work" className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold">Activity Logs</h3>
          {projectActivities.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed">
              No field activities logged for this project yet.
            </div>
          ) : (
            <div className="grid gap-3">
              {projectActivities.map(activity => (
                <Card key={activity.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="font-normal bg-muted/50">{activity.date}</Badge>
                          <h4 className="font-semibold">{activity.activityType}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                          <MapPin className="w-3 h-3" /> {activity.location} • {activity.areaCovered} sqkm
                        </p>
                        <p className="text-sm border-l-2 border-primary/30 pl-3 italic">"{activity.remarks}"</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-medium mb-1">Progress: {activity.progress}%</div>
                        <div className="flex gap-1 flex-wrap justify-end w-32">
                          {activity.equipmentUsed.map(eq => (
                            <span key={eq} className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground">{eq}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="billing" className="pt-6 space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" /> Invoices
            </h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">No invoices raised yet.</TableCell>
                    </TableRow>
                  ) : (
                    projectInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.number}</TableCell>
                        <TableCell>{invoice.description}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(invoice.amount)}</TableCell>
                        <TableCell><StatusBadge status={invoice.status} /></TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" /> Field Expenses
            </h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Paid By</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectExpenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">No expenses logged.</TableCell>
                    </TableRow>
                  ) : (
                    projectExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{expense.date}</TableCell>
                        <TableCell><Badge variant="secondary" className="font-normal">{expense.expenseType}</Badge></TableCell>
                        <TableCell>{expense.paidBy}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-muted-foreground">{expense.remarks}</TableCell>
                        <TableCell className="text-right font-medium">₹{expense.amount.toLocaleString("en-IN")}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="processing" className="pt-6">
          <Card className="border-dashed bg-muted/20">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <ActivitySquare className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
              <h3 className="font-semibold text-lg">Processing Pipeline</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">Data processing integration coming in v2. Track point cloud classification and orthomosaic generation here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="pt-6">
          <Card className="border-dashed bg-muted/20">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
              <h3 className="font-semibold text-lg">Project Documents</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">Upload and manage POs, site permits, and final deliverable reports.</p>
              <Button variant="outline" className="mt-4">Upload Document</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
