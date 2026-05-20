import { useState } from "react";
import { useApp } from "@/context/AppContext";
import type { Project, ProjectStatus } from "@/context/AppContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { formatCurrency } from "@/lib/format";
import { Search, MapPin, Calendar, Briefcase, Plus, Building2, Hash, CalendarDays, Clock } from "lucide-react";

const PROJECT_STATUSES: ProjectStatus[] = ["Active", "Completed", "On Hold", "Planning", "Quotation Sent"];

function SectionHead({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</span>
      <Separator className="flex-1" />
    </div>
  );
}

function FieldRow({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[160px_1fr] items-center gap-3">
      <Label className="text-xs text-muted-foreground text-right leading-tight">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

const EMPTY_FORM: Omit<Project, "id"> = {
  name: "",
  client: "",
  location: "",
  state: "",
  status: "Planning",
  progress: 0,
  projectId: "",
  poValue: 0,
  startDate: "",
  endDate: "",
  projectManager: "",
  clientGroupCode: "",
  clientCode: "",
  client3Code: "",
  cloveProjectCode: "",
  clientProjectCode: "",
  bidQuote: "Quote",
  enquiryDate: "",
  estimatedDate: "",
  orderedDate: "",
  inputReceivableDate: "",
  proposedDate: "",
  deliveredDate: "",
  quotedHours: 0,
  orderHours: 0,
  receivedHours: 0,
  areaSqKm: 0,
  resolution: "",
};

function AddProjectSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addProject } = useApp();
  const [form, setForm] = useState<Omit<Project, "id">>({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof Omit<Project, "id">, value: string | number) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const str = (key: keyof Omit<Project, "id">) => (form[key] as string | undefined) ?? "";
  const num = (key: keyof Omit<Project, "id">) => (form[key] as number | undefined) ?? 0;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Project name is required";
    if (!form.client.trim()) e.client = "Client is required";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.projectManager.trim()) e.projectManager = "Project manager is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setSaving(true);
    const newId = `p${Date.now()}`;
    const autoId = form.projectId.trim() || `PRJ-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;
    addProject({ ...form, id: newId, projectId: autoId });
    setTimeout(() => {
      setSaving(false);
      setForm({ ...EMPTY_FORM });
      setErrors({});
      onClose();
    }, 300);
  };

  const handleClose = () => {
    setForm({ ...EMPTY_FORM });
    setErrors({});
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={v => { if (!v) handleClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col">
        <SheetHeader className="px-6 py-5 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Project
          </SheetTitle>
          <SheetDescription className="text-xs">Fill in the project details. Fields marked * are required.</SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-4">

            <SectionHead icon={Briefcase} title="Core Information" />

            <FieldRow label="Project Name" required>
              <div>
                <Input
                  placeholder="e.g. SCR Bridge Survey"
                  value={str("name")}
                  onChange={e => { set("name", e.target.value); setErrors(prev => ({ ...prev, name: "" })); }}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>
            </FieldRow>

            <FieldRow label="Client" required>
              <div>
                <Input
                  placeholder="e.g. South Central Railway"
                  value={str("client")}
                  onChange={e => { set("client", e.target.value); setErrors(prev => ({ ...prev, client: "" })); }}
                  className={errors.client ? "border-destructive" : ""}
                />
                {errors.client && <p className="text-xs text-destructive mt-1">{errors.client}</p>}
              </div>
            </FieldRow>

            <FieldRow label="Location" required>
              <div>
                <Input
                  placeholder="e.g. Hyderabad"
                  value={str("location")}
                  onChange={e => { set("location", e.target.value); setErrors(prev => ({ ...prev, location: "" })); }}
                  className={errors.location ? "border-destructive" : ""}
                />
                {errors.location && <p className="text-xs text-destructive mt-1">{errors.location}</p>}
              </div>
            </FieldRow>

            <FieldRow label="State">
              <Input placeholder="e.g. TS" value={str("state")} onChange={e => set("state", e.target.value)} className="max-w-[80px]" />
            </FieldRow>

            <FieldRow label="Status">
              <Select value={str("status") || "Planning"} onValueChange={v => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PROJECT_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </FieldRow>

            <FieldRow label="Project Manager" required>
              <div>
                <Input
                  placeholder="e.g. Roshan Singh"
                  value={str("projectManager")}
                  onChange={e => { set("projectManager", e.target.value); setErrors(prev => ({ ...prev, projectManager: "" })); }}
                  className={errors.projectManager ? "border-destructive" : ""}
                />
                {errors.projectManager && <p className="text-xs text-destructive mt-1">{errors.projectManager}</p>}
              </div>
            </FieldRow>

            <FieldRow label="Project ID">
              <Input placeholder="Auto-generated if blank" value={str("projectId")} onChange={e => set("projectId", e.target.value)} />
            </FieldRow>

            <FieldRow label="PO Value (₹)">
              <Input type="number" placeholder="0" value={num("poValue") || ""} onChange={e => set("poValue", Number(e.target.value))} />
            </FieldRow>

            <FieldRow label="Progress (%)">
              <div className="flex items-center gap-3">
                <Input type="number" min={0} max={100} value={num("progress")} onChange={e => set("progress", Number(e.target.value))} className="max-w-[100px]" />
                <Progress value={num("progress")} className="flex-1 h-2" />
                <span className="text-sm font-bold w-10 text-right">{num("progress")}%</span>
              </div>
            </FieldRow>

            <FieldRow label="Start Date">
              <Input placeholder="DD Mon YYYY" value={str("startDate")} onChange={e => set("startDate", e.target.value)} />
            </FieldRow>

            <FieldRow label="End Date">
              <Input placeholder="DD Mon YYYY" value={str("endDate")} onChange={e => set("endDate", e.target.value)} />
            </FieldRow>

            <SectionHead icon={Building2} title="Client Codes" />

            <FieldRow label="Client Group Code">
              <Input value={str("clientGroupCode")} onChange={e => set("clientGroupCode", e.target.value)} />
            </FieldRow>
            <FieldRow label="Client Code">
              <Input value={str("clientCode")} onChange={e => set("clientCode", e.target.value)} />
            </FieldRow>
            <FieldRow label="Client 3 Code">
              <Input value={str("client3Code")} onChange={e => set("client3Code", e.target.value)} />
            </FieldRow>
            <FieldRow label="Bid / Quote">
              <Select value={str("bidQuote") || "Quote"} onValueChange={v => set("bidQuote", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bid">Bid</SelectItem>
                  <SelectItem value="Quote">Quote</SelectItem>
                </SelectContent>
              </Select>
            </FieldRow>

            <SectionHead icon={Hash} title="Project Codes" />

            <FieldRow label="Clove Project Code">
              <Input value={str("cloveProjectCode")} onChange={e => set("cloveProjectCode", e.target.value)} />
            </FieldRow>
            <FieldRow label="Client Project Code">
              <Input value={str("clientProjectCode")} onChange={e => set("clientProjectCode", e.target.value)} />
            </FieldRow>
            <FieldRow label="Area (Sq Km)">
              <Input type="number" step="0.1" value={num("areaSqKm") || ""} onChange={e => set("areaSqKm", Number(e.target.value))} />
            </FieldRow>
            <FieldRow label="Resolution">
              <Input placeholder="e.g. 5 cm" value={str("resolution")} onChange={e => set("resolution", e.target.value)} />
            </FieldRow>

            <SectionHead icon={CalendarDays} title="Key Dates" />

            {([
              ["enquiryDate", "Enquiry Date"],
              ["estimatedDate", "Estimated Date"],
              ["orderedDate", "Ordered Date"],
              ["inputReceivableDate", "Input Receivable Date"],
              ["proposedDate", "Proposed Date"],
              ["deliveredDate", "Delivered Date"],
            ] as [keyof Omit<Project, "id">, string][]).map(([key, label]) => (
              <FieldRow key={key} label={label}>
                <Input placeholder="DD Mon YYYY" value={str(key)} onChange={e => set(key, e.target.value)} />
              </FieldRow>
            ))}

            <SectionHead icon={Clock} title="Hours" />

            <FieldRow label="Quoted Hours">
              <Input type="number" value={num("quotedHours") || ""} onChange={e => set("quotedHours", Number(e.target.value))} />
            </FieldRow>
            <FieldRow label="Order Hours">
              <Input type="number" value={num("orderHours") || ""} onChange={e => set("orderHours", Number(e.target.value))} />
            </FieldRow>
            <FieldRow label="Received Hours">
              <Input type="number" value={num("receivedHours") || ""} onChange={e => set("receivedHours", Number(e.target.value))} />
            </FieldRow>

          </div>
        </ScrollArea>

        <SheetFooter className="px-6 py-4 border-t bg-muted/30 flex flex-row gap-3 justify-end">
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Plus className="w-4 h-4" />
            {saving ? "Creating…" : "Create Project"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default function Projects() {
  const { projects } = useApp();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const filteredProjects = projects.filter(p => {
    const matchesFilter = filter === "All" || p.status === filter;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.projectId.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage all field surveying and mapping projects</p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="shrink-0 gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" /> New Project
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <Tabs defaultValue="All" value={filter} onValueChange={setFilter} className="w-full sm:w-auto">
          <TabsList className="w-full sm:w-auto h-auto p-1 grid grid-cols-2 sm:flex flex-wrap">
            <TabsTrigger value="All" className="px-4 py-2 text-sm">All</TabsTrigger>
            <TabsTrigger value="Active" className="px-4 py-2 text-sm">Active</TabsTrigger>
            <TabsTrigger value="Completed" className="px-4 py-2 text-sm">Completed</TabsTrigger>
            <TabsTrigger value="On Hold" className="px-4 py-2 text-sm">On Hold</TabsTrigger>
            <TabsTrigger value="Planning" className="px-4 py-2 text-sm">Planning</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9 bg-card"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed">
            No projects found.{" "}
            <button onClick={() => setAddOpen(true)} className="text-primary underline underline-offset-2">
              Create one?
            </button>
          </div>
        ) : (
          filteredProjects.map(project => (
            <Card key={project.id} className="overflow-hidden hover:border-primary/50 transition-colors">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-[1fr_300px] gap-0">
                  <div className="p-6 space-y-4">
                    <div className="flex flex-wrap gap-3 items-start justify-between">
                      <div className="space-y-1">
                        <Link href={`/projects/${project.id}`} className="text-xl font-bold hover:underline inline-block">
                          {project.name}
                        </Link>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                          <span className="font-medium px-2 py-0.5 bg-muted rounded-md text-foreground">{project.projectId}</span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {project.client}</span>
                          {project.cloveProjectCode && (
                            <>
                              <span>&bull;</span>
                              <span className="text-xs font-mono">{project.cloveProjectCode}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <StatusBadge status={project.status} />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase">Location</p>
                        <p className="text-sm font-medium flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {project.location}{project.state ? `, ${project.state}` : ""}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase">Timeline</p>
                        <p className="text-sm font-medium flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {project.startDate ? `${project.startDate} – ${project.endDate}` : "TBD"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase">PO Value</p>
                        <p className="text-sm font-medium">{project.poValue ? formatCurrency(project.poValue) : "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase">Manager</p>
                        <p className="text-sm font-medium">{project.projectManager}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-muted/30 border-t md:border-t-0 md:border-l flex flex-col justify-center gap-3">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-medium text-muted-foreground">Progress</span>
                      <span className="text-2xl font-bold tracking-tight">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-3" />
                    {project.enquiryDate && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Enquiry: <span className="font-medium text-foreground">{project.enquiryDate}</span>
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AddProjectSheet open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
