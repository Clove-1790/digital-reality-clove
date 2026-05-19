import { useState } from "react";
import { useLocation } from "wouter";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function AddActivity() {
  const { projects, equipment, addActivity } = useApp();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [projectId, setProjectId] = useState("");
  const [activityType, setActivityType] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [locationStr, setLocationStr] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [selectedEq, setSelectedEq] = useState<string[]>([]);
  const [area, setArea] = useState("");
  const [progress, setProgress] = useState(0);
  const [remarks, setRemarks] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectId || !activityType || !date || !locationStr) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const eqNames = equipment.filter(e => selectedEq.includes(e.id)).map(e => e.name);

    addActivity({
      id: `a${Date.now()}`,
      projectId,
      activityType,
      date,
      location: locationStr,
      lat: parseFloat(lat) || 0,
      lng: parseFloat(lng) || 0,
      equipmentUsed: eqNames.length > 0 ? eqNames : ["None"],
      areaCovered: parseFloat(area) || 0,
      progress,
      remarks
    });

    toast({
      title: "Activity logged",
      description: "Field activity has been successfully recorded."
    });

    setLocation("/activities");
  };

  const toggleEquipment = (id: string) => {
    if (selectedEq.includes(id)) {
      setSelectedEq(selectedEq.filter(e => e !== id));
    } else {
      setSelectedEq([...selectedEq, id]);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/activities">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Log Field Activity</h1>
          <p className="text-muted-foreground mt-1">Record daily progress and equipment usage</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Activity Details</CardTitle>
              <CardDescription>Basic information about the field work.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="project">Project *</Label>
                  <Select value={projectId} onValueChange={setProjectId}>
                    <SelectTrigger id="project">
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Activity Type *</Label>
                  <Select value={activityType} onValueChange={setActivityType}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select activity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Drone LiDAR Survey">Drone LiDAR Survey</SelectItem>
                      <SelectItem value="GNSS Control Survey">GNSS Control Survey</SelectItem>
                      <SelectItem value="Ground Truth Verification">Ground Truth Verification</SelectItem>
                      <SelectItem value="Topographic Survey">Topographic Survey</SelectItem>
                      <SelectItem value="Mobile Mapping">Mobile Mapping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location Name *</Label>
                  <Input id="location" placeholder="e.g., KagaZnagar Sector A" value={locationStr} onChange={e => setLocationStr(e.target.value)} required />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Coordinates & Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lat">Latitude</Label>
                  <Input id="lat" type="number" step="any" placeholder="16.7563" value={lat} onChange={e => setLat(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lng">Longitude</Label>
                  <Input id="lng" type="number" step="any" placeholder="80.4356" value={lng} onChange={e => setLng(e.target.value)} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="area">Area Covered (sqkm)</Label>
                <Input id="area" type="number" step="any" placeholder="12.5" value={area} onChange={e => setArea(e.target.value)} />
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex justify-between">
                  <Label>Task Progress</Label>
                  <span className="text-sm font-medium text-primary">{progress}%</span>
                </div>
                <Slider 
                  value={[progress]} 
                  onValueChange={val => setProgress(val[0])} 
                  max={100} 
                  step={5} 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Equipment & Remarks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Equipment Used</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border rounded-md p-4 bg-muted/20">
                  {equipment.map(eq => (
                    <div key={eq.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`eq-${eq.id}`} 
                        checked={selectedEq.includes(eq.id)}
                        onCheckedChange={() => toggleEquipment(eq.id)}
                      />
                      <label 
                        htmlFor={`eq-${eq.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 truncate"
                        title={`${eq.name} (${eq.type})`}
                      >
                        {eq.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">Field Remarks</Label>
                <Textarea 
                  id="remarks" 
                  placeholder="Weather conditions, issues faced, next steps..." 
                  className="min-h-[100px]"
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button variant="outline" asChild>
            <Link href="/activities">Cancel</Link>
          </Button>
          <Button type="submit">
            <Save className="w-4 h-4 mr-2" />
            Save Activity
          </Button>
        </div>
      </form>
    </div>
  );
}
