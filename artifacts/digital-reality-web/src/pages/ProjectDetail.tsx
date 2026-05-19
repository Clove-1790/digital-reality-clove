import { useApp } from "@/context/AppContext";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency } from "@/lib/format";
import { Progress } from "@/components/ui/progress";
import { MapPin, Calendar, Briefcase, FileText, User as UserIcon, ActivitySquare, Receipt, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:id");
  const id = params?.id;
  const { projects, activities, invoices, expenses } = useApp();
  
  const project = projects.find(p => p.id === id);
  const projectActivities = activities.filter(a => a.projectId === id);
  const projectInvoices = invoices.filter(i => i.projectId === id);
  const projectExpenses = expenses.filter(e => e.projectId === id);

  if (!project) {
    return <div className="p-8 text-center text-muted-foreground">Project not found</div>;
  }

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
        <div className="w-full md:w-64 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Project Progress</span>
            <span className="font-bold">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2.5" />
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
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Activity Logs</h3>
            <Button variant="outline" size="sm">Download Report</Button>
          </div>
          
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
