import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Search, Compass, MapPin, User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Equipment() {
  const { equipment } = useApp();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredEquipment = equipment.filter(e => {
    const matchesFilter = filter === "All" || e.status === filter;
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) || 
                          e.type.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipment Inventory</h1>
          <p className="text-muted-foreground mt-1">Track hardware, scanners, and drones</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <Tabs defaultValue="All" value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="All" className="px-4">All</TabsTrigger>
            <TabsTrigger value="Available" className="px-4">Available</TabsTrigger>
            <TabsTrigger value="In Use" className="px-4">In Use</TabsTrigger>
            <TabsTrigger value="Maintenance" className="px-4">Maintenance</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search equipment..."
            className="pl-9 bg-card"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[300px]">Equipment Name & Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipment.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No equipment found matching criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEquipment.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-md shrink-0">
                            <Compass className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold">{item.name}</div>
                            <div className="text-xs text-muted-foreground">{item.type}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={item.status} />
                      </TableCell>
                      <TableCell>
                        {item.assignedTo ? (
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <UserIcon className="w-3.5 h-3.5 text-muted-foreground" />
                            {item.assignedTo}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground italic">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="cursor-pointer hover:bg-muted font-normal">
                          Manage
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
