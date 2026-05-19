import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { formatCurrency } from "@/lib/format";
import { Search, MapPin, Calendar, Briefcase } from "lucide-react";

export default function Projects() {
  const { projects } = useApp();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredProjects = projects.filter(p => {
    const matchesFilter = filter === "All" || p.status === filter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
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
            No projects found matching the criteria.
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
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="font-medium px-2 py-0.5 bg-muted rounded-md text-foreground">{project.projectId}</span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {project.client}</span>
                        </div>
                      </div>
                      <StatusBadge status={project.status} />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase">Location</p>
                        <p className="text-sm font-medium flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {project.location}, {project.state}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase">Timeline</p>
                        <p className="text-sm font-medium flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {project.startDate ? `${project.startDate} - ${project.endDate}` : "TBD"}</p>
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
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
