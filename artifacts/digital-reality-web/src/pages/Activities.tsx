import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency } from "@/lib/format";
import { Search, Filter, Plus, Calendar, MapPin, Wrench, Navigation } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";

export default function Activities() {
  const { activities, projects } = useApp();
  const [search, setSearch] = useState("");

  const filteredActivities = activities.filter(a => {
    const project = projects.find(p => p.id === a.projectId);
    const projectName = project?.name || "";
    const matchesSearch = 
      a.activityType.toLowerCase().includes(search.toLowerCase()) || 
      a.location.toLowerCase().includes(search.toLowerCase()) ||
      projectName.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Field Activities</h1>
          <p className="text-muted-foreground mt-1">Log and track daily field operations</p>
        </div>
        <Button asChild>
          <Link href="/activities/add">
            <Plus className="w-4 h-4 mr-2" />
            Log Activity
          </Link>
        </Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities, locations, or projects..."
            className="pl-9 bg-card"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="shrink-0 bg-card">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredActivities.map(activity => {
          const project = projects.find(p => p.id === activity.projectId);
          
          return (
            <Card key={activity.id} className="overflow-hidden hover:border-primary/50 transition-colors">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row gap-5">
                  <div className="flex-shrink-0 flex md:flex-col gap-4 md:w-32 text-sm text-muted-foreground items-start md:border-r border-border md:pr-4">
                    <div className="flex items-center gap-1.5 md:w-full font-medium text-foreground">
                      <Calendar className="w-4 h-4 text-primary shrink-0" />
                      {activity.date}
                    </div>
                    <div className="flex items-start gap-1.5 md:w-full">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                      <span className="leading-tight">{activity.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{activity.activityType}</h3>
                        <p className="text-sm font-medium text-primary mt-0.5">{project?.name || "Unknown Project"}</p>
                      </div>
                      <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20">
                        {activity.progress}% Complete
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md border">
                      {activity.remarks}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm mt-4 pt-4 border-t">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Navigation className="w-4 h-4" />
                        <span>{activity.areaCovered} sqkm covered</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Wrench className="w-4 h-4" />
                        <div className="flex gap-1.5">
                          {activity.equipmentUsed.map(eq => (
                            <Badge key={eq} variant="outline" className="font-normal text-xs">{eq}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
