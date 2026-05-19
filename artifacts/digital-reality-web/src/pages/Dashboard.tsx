import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { FolderGit2, ActivitySquare, Compass, Receipt, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { projects } = useApp();
  const activeProjects = projects.filter(p => p.status === "Active");
  const recentProjects = projects.slice(0, 4);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Field operations overview for {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderGit2 className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground mt-1">Across 3 states</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Today's Activities</CardTitle>
            <ActivitySquare className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">Field surveys & scans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Equipment In Use</CardTitle>
            <Compass className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground mt-1">Total stations, drones, scanners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pending Billing</CardTitle>
            <Receipt className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹24.50L</div>
            <p className="text-xs text-muted-foreground mt-1">Invoices to be cleared</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Recent Projects</h2>
            <Link href="/projects" className="text-sm text-primary hover:underline font-medium inline-flex items-center">
              View all
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid gap-4">
            {recentProjects.map(project => (
              <Card key={project.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <Link href={`/projects/${project.id}`} className="font-semibold text-lg hover:underline">
                          {project.name}
                        </Link>
                        <StatusBadge status={project.status} />
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-3">
                        <span className="font-medium text-foreground">{project.projectId}</span>
                        <span>&bull;</span>
                        <span>{project.client}</span>
                        <span>&bull;</span>
                        <span>{project.location}, {project.state}</span>
                      </div>
                    </div>
                    
                    <div className="w-full md:w-64 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="md:col-span-4 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Active Banner</h2>
          <Card className="bg-primary text-primary-foreground border-none">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1.5">
                <div className="text-primary-foreground/80 text-sm font-medium">PRIORITY FOCUS</div>
                <h3 className="font-semibold text-xl leading-tight">{activeProjects[0]?.name || "No active projects"}</h3>
                <p className="text-sm text-primary-foreground/90">{activeProjects[0]?.client}</p>
              </div>
              
              {activeProjects[0] && (
                <div className="pt-4 border-t border-primary-foreground/20 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-primary-foreground/80">Overall Progress</span>
                    <span className="font-semibold">{activeProjects[0].progress}%</span>
                  </div>
                  <Progress value={activeProjects[0].progress} className="h-2 bg-primary-foreground/20 [&>div]:bg-primary-foreground" />
                  
                  <div className="flex justify-between items-center text-sm pt-2">
                    <span className="text-primary-foreground/80">Manager</span>
                    <span className="font-medium">{activeProjects[0].projectManager}</span>
                  </div>
                </div>
              )}
              
              {activeProjects[0] && (
                <Button className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold" asChild>
                  <Link href={`/projects/${activeProjects[0].id}`}>
                    Go to Project <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
