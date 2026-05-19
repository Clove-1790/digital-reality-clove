import { useState } from "react";
import { useLocation } from "wouter";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function AddExpense() {
  const { projects, addExpense } = useApp();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [projectId, setProjectId] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [locationStr, setLocationStr] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectId || !expenseType || !date || !amount || !paidBy) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    addExpense({
      id: `ex${Date.now()}`,
      projectId,
      expenseType,
      date,
      amount: parseFloat(amount) || 0,
      paidBy,
      location: locationStr,
      remarks
    });

    toast({
      title: "Expense added",
      description: "Field expense has been successfully recorded."
    });

    setLocation("/billing");
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/billing">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Expense</h1>
          <p className="text-muted-foreground mt-1">Record project-related field expenses</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Details</CardTitle>
          <CardDescription>Enter the details of the field expense incurred.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                <Label htmlFor="type">Expense Category *</Label>
                <Select value={expenseType} onValueChange={setExpenseType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fuel">Fuel</SelectItem>
                    <SelectItem value="Accommodation">Accommodation</SelectItem>
                    <SelectItem value="Vehicle">Vehicle Rental</SelectItem>
                    <SelectItem value="Food">Food & Meals</SelectItem>
                    <SelectItem value="Equipment Repair">Equipment Repair</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input id="amount" type="number" placeholder="2500" value={amount} onChange={e => setAmount(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paidBy">Paid By (Name) *</Label>
                <Input id="paidBy" placeholder="e.g., Ramesh" value={paidBy} onChange={e => setPaidBy(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="City or Site" value={locationStr} onChange={e => setLocationStr(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2 border-t pt-6">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea 
                id="remarks" 
                placeholder="Details about the expense, bill numbers, etc." 
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" asChild>
                <Link href="/billing">Cancel</Link>
              </Button>
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" />
                Save Expense
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
