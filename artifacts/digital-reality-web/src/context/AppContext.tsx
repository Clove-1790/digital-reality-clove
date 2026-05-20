import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ProjectStatus = "Active" | "Completed" | "On Hold" | "Planning" | "Quotation Sent";
export type EquipmentStatus = "In Use" | "Available" | "Maintenance";
export type InvoiceStatus = "Paid" | "Partial" | "Pending" | "Not Raised";

export interface Project {
  id: string;
  name: string;
  location: string;
  state: string;
  status: ProjectStatus;
  progress: number;
  client: string;
  projectId: string;
  poValue: number;
  startDate: string;
  endDate: string;
  projectManager: string;
  clientGroupCode?: string;
  clientCode?: string;
  client3Code?: string;
  cloveProjectCode?: string;
  clientProjectCode?: string;
  bidQuote?: string;
  enquiryDate?: string;
  estimatedDate?: string;
  orderedDate?: string;
  inputReceivableDate?: string;
  proposedDate?: string;
  deliveredDate?: string;
  quotedHours?: number;
  orderHours?: number;
  receivedHours?: number;
  areaSqKm?: number;
  resolution?: string;
}

export interface Activity {
  id: string;
  projectId: string;
  activityType: string;
  date: string;
  location: string;
  lat: number;
  lng: number;
  equipmentUsed: string[];
  areaCovered: number;
  progress: number;
  remarks: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  status: EquipmentStatus;
  assignedTo: string;
}

export interface Invoice {
  id: string;
  projectId: string;
  number: string;
  description: string;
  amount: number;
  date: string;
  status: InvoiceStatus;
}

export interface Expense {
  id: string;
  projectId: string;
  expenseType: string;
  date: string;
  amount: number;
  paidBy: string;
  location: string;
  remarks: string;
}

export interface User {
  name: string;
  role: string;
  email: string;
}

export interface StageProgress {
  qc: boolean;
  qa: boolean;
  delivery: boolean;
  qcDate?: string;
  qaDate?: string;
  deliveryDate?: string;
}

export interface ProjectPipeline {
  processing: StageProgress;
  modelling: StageProgress;
}

interface AppState {
  user: User | null;
  projects: Project[];
  activities: Activity[];
  equipment: Equipment[];
  invoices: Invoice[];
  expenses: Expense[];
  pipelines: Record<string, ProjectPipeline>;
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addProject: (p: Project) => void;
  addActivity: (a: Activity) => void;
  addExpense: (e: Expense) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  togglePipelineStage: (
    projectId: string,
    pipeline: "processing" | "modelling",
    stage: "qc" | "qa" | "delivery",
    checked: boolean
  ) => void;
}

const SEED_PROJECTS: Project[] = [
  {
    id: "p1", name: "SCR Bridge Survey", location: "KagaZnagar", state: "TS", status: "Active", progress: 75,
    client: "South Central Railway", projectId: "PRJ-2024-001", poValue: 5000000,
    startDate: "12 May 2024", endDate: "25 May 2024", projectManager: "Roshan Singh",
    clientGroupCode: "SCR-GRP", clientCode: "SCR-HQ", client3Code: "SCR-ENGG",
    cloveProjectCode: "CLV-2024-BR-001", clientProjectCode: "SCR/BRIDGE/KGZ/24",
    bidQuote: "Quote", enquiryDate: "02 Apr 2024", estimatedDate: "20 May 2024",
    orderedDate: "28 Apr 2024", inputReceivableDate: "10 May 2024",
    proposedDate: "22 May 2024", deliveredDate: "",
    quotedHours: 320, orderHours: 300, receivedHours: 224,
    areaSqKm: 45.6, resolution: "5 cm",
  },
  {
    id: "p2", name: "Rail Corridor Mapping", location: "Guntakal", state: "AP", status: "Active", progress: 60,
    client: "Indian Railways", projectId: "PRJ-2024-002", poValue: 3500000,
    startDate: "05 May 2024", endDate: "20 May 2024", projectManager: "Roshan Singh",
    clientGroupCode: "IR-GRP", clientCode: "IR-SWR", client3Code: "IR-INFRA",
    cloveProjectCode: "CLV-2024-RC-002", clientProjectCode: "IR/GTL/CORR/24",
    bidQuote: "Bid", enquiryDate: "15 Mar 2024", estimatedDate: "18 May 2024",
    orderedDate: "22 Apr 2024", inputReceivableDate: "04 May 2024",
    proposedDate: "19 May 2024", deliveredDate: "",
    quotedHours: 240, orderHours: 230, receivedHours: 138,
    areaSqKm: 32.0, resolution: "10 cm",
  },
  {
    id: "p3", name: "SHM Monitoring Project", location: "Vijayawada", state: "AP", status: "Planning", progress: 40,
    client: "NHAI", projectId: "PRJ-2024-003", poValue: 2800000,
    startDate: "10 May 2024", endDate: "30 Jun 2024", projectManager: "Sunil Verma",
    clientGroupCode: "NHAI-GRP", clientCode: "NHAI-AP", client3Code: "",
    cloveProjectCode: "CLV-2024-SHM-003", clientProjectCode: "NHAI/VJA/SHM/24",
    bidQuote: "Quote", enquiryDate: "01 Apr 2024", estimatedDate: "28 Jun 2024",
    orderedDate: "05 May 2024", inputReceivableDate: "09 May 2024",
    proposedDate: "30 Jun 2024", deliveredDate: "",
    quotedHours: 180, orderHours: 175, receivedHours: 70,
    areaSqKm: 18.5, resolution: "3 cm",
  },
  {
    id: "p4", name: "Digital Twin - Station", location: "Secunderabad", state: "TS", status: "Quotation Sent", progress: 0,
    client: "South Central Railway", projectId: "PRJ-2024-004", poValue: 0,
    startDate: "", endDate: "", projectManager: "Roshan Singh",
    clientGroupCode: "SCR-GRP", clientCode: "SCR-SC", client3Code: "",
    cloveProjectCode: "CLV-2024-DT-004", clientProjectCode: "",
    bidQuote: "Quote", enquiryDate: "10 May 2024", estimatedDate: "",
    orderedDate: "", inputReceivableDate: "", proposedDate: "", deliveredDate: "",
    quotedHours: 500, orderHours: 0, receivedHours: 0,
    areaSqKm: 0, resolution: "2 cm",
  },
  {
    id: "p5", name: "Highway LiDAR Scan", location: "Hyderabad", state: "TS", status: "Completed", progress: 100,
    client: "NHAI", projectId: "PRJ-2024-005", poValue: 4200000,
    startDate: "01 Apr 2024", endDate: "30 Apr 2024", projectManager: "Ramesh Gupta",
    clientGroupCode: "NHAI-GRP", clientCode: "NHAI-TS", client3Code: "NHAI-HYD",
    cloveProjectCode: "CLV-2024-HW-005", clientProjectCode: "NHAI/HYD/LIDAR/24",
    bidQuote: "Bid", enquiryDate: "10 Feb 2024", estimatedDate: "28 Apr 2024",
    orderedDate: "18 Mar 2024", inputReceivableDate: "01 Apr 2024",
    proposedDate: "30 Apr 2024", deliveredDate: "29 Apr 2024",
    quotedHours: 280, orderHours: 275, receivedHours: 275,
    areaSqKm: 85.2, resolution: "5 cm",
  },
  {
    id: "p6", name: "Metro Corridor Survey", location: "Chennai", state: "TN", status: "On Hold", progress: 35,
    client: "CMRL", projectId: "PRJ-2024-006", poValue: 6000000,
    startDate: "15 Mar 2024", endDate: "15 Jun 2024", projectManager: "Prakash S",
    clientGroupCode: "CMRL-GRP", clientCode: "CMRL-CH", client3Code: "",
    cloveProjectCode: "CLV-2024-MT-006", clientProjectCode: "CMRL/CHN/METRO/24",
    bidQuote: "Bid", enquiryDate: "20 Jan 2024", estimatedDate: "10 Jun 2024",
    orderedDate: "28 Feb 2024", inputReceivableDate: "14 Mar 2024",
    proposedDate: "15 Jun 2024", deliveredDate: "",
    quotedHours: 420, orderHours: 400, receivedHours: 140,
    areaSqKm: 62.3, resolution: "8 cm",
  },
];

const SEED_EQUIPMENT: Equipment[] = [
  { id: "e1", name: "NavVis VLX 3", type: "Mobile LiDAR Scanner", status: "In Use", assignedTo: "Ramesh" },
  { id: "e2", name: "Trinity F90+", type: "Fixed Wing UAV", status: "In Use", assignedTo: "Sunil" },
  { id: "e3", name: "Leica GS18", type: "GNSS Receiver", status: "In Use", assignedTo: "Mahesh" },
  { id: "e4", name: "Leica TS16", type: "Total Station", status: "Maintenance", assignedTo: "Prakash" },
  { id: "e5", name: "FARO Focus S350", type: "3D Laser Scanner", status: "Available", assignedTo: "" },
  { id: "e6", name: "DJI Matrice 300", type: "Drone UAV", status: "Available", assignedTo: "" },
  { id: "e7", name: "Trimble R10", type: "GNSS Receiver", status: "In Use", assignedTo: "Vijay" },
];

const SEED_ACTIVITIES: Activity[] = [
  { id: "a1", projectId: "p1", activityType: "Drone LiDAR Survey", date: "16 May 2024", location: "Kagaznagar", lat: 16.7563, lng: 80.4356, equipmentUsed: ["Trinity F90+", "GS18 DGPS"], areaCovered: 12.5, progress: 65, remarks: "Weather good. Completed Area 12.50 sqkm." },
  { id: "a2", projectId: "p2", activityType: "GNSS Control Survey", date: "15 May 2024", location: "Guntakal", lat: 15.1667, lng: 77.3667, equipmentUsed: ["Leica GS18"], areaCovered: 8.0, progress: 50, remarks: "Set up 12 GCPs along corridor." },
  { id: "a3", projectId: "p1", activityType: "Ground Truth Verification", date: "14 May 2024", location: "Kagaznagar", lat: 16.7563, lng: 80.4356, equipmentUsed: ["Leica TS16"], areaCovered: 3.2, progress: 80, remarks: "Cross-checked with design data." },
];

const SEED_INVOICES: Invoice[] = [
  { id: "i1", projectId: "p1", number: "INV-001", description: "Advance", amount: 1000000, date: "01 May 2024", status: "Paid" },
  { id: "i2", projectId: "p1", number: "INV-002", description: "Field Work Completion", amount: 1500000, date: "15 May 2024", status: "Partial" },
  { id: "i3", projectId: "p1", number: "INV-003", description: "Processing Completion", amount: 1500000, date: "25 May 2024", status: "Pending" },
  { id: "i4", projectId: "p1", number: "INV-004", description: "Final Delivery", amount: 1000000, date: "05 Jun 2024", status: "Not Raised" },
  { id: "i5", projectId: "p2", number: "INV-005", description: "Advance", amount: 700000, date: "06 May 2024", status: "Paid" },
  { id: "i6", projectId: "p2", number: "INV-006", description: "Field Work Completion", amount: 1050000, date: "22 May 2024", status: "Pending" },
];

const SEED_EXPENSES: Expense[] = [
  { id: "ex1", projectId: "p1", expenseType: "Fuel", date: "16 May 2024", amount: 2500, paidBy: "Ramesh", location: "Kagaznagar", remarks: "Fuel for site visit" },
  { id: "ex2", projectId: "p2", expenseType: "Accommodation", date: "15 May 2024", amount: 3200, paidBy: "Sunil", location: "Guntakal", remarks: "Hotel for 2 nights" },
  { id: "ex3", projectId: "p1", expenseType: "Vehicle", date: "14 May 2024", amount: 4500, paidBy: "Mahesh", location: "Kagaznagar", remarks: "Vehicle rental for equipment transport" },
];

const EMPTY_STAGE: StageProgress = { qc: false, qa: false, delivery: false };
const EMPTY_PIPELINE: ProjectPipeline = {
  processing: { ...EMPTY_STAGE },
  modelling: { ...EMPTY_STAGE },
};

const SEED_PIPELINES: Record<string, ProjectPipeline> = {
  p1: { processing: { qc: true, qa: true, delivery: false, qcDate: "18 May 2024", qaDate: "20 May 2024" }, modelling: { qc: true, qa: false, delivery: false, qcDate: "21 May 2024" } },
  p5: { processing: { qc: true, qa: true, delivery: true, qcDate: "10 Apr 2024", qaDate: "18 Apr 2024", deliveryDate: "28 Apr 2024" }, modelling: { qc: true, qa: true, delivery: true, qcDate: "12 Apr 2024", qaDate: "20 Apr 2024", deliveryDate: "29 Apr 2024" } },
};

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = "dr_app_data_web_v3";

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: null,
    projects: SEED_PROJECTS,
    activities: SEED_ACTIVITIES,
    equipment: SEED_EQUIPMENT,
    invoices: SEED_INVOICES,
    expenses: SEED_EXPENSES,
    pipelines: SEED_PIPELINES,
  });

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setState((prev) => ({ ...prev, ...parsed }));
      } catch {}
    }
    setInitialized(true);
  }, []);

  const save = (newState: Partial<AppState>) => {
    setState((prev) => {
      const merged = { ...prev, ...newState };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    });
  };

  const login = async (email: string, _password: string): Promise<boolean> => {
    if (!email) return false;
    const user: User = { name: "Roshan Singh", role: "Project Manager", email };
    save({ user });
    return true;
  };

  const logout = () => save({ user: null });

  const addProject = (p: Project) => save({ projects: [...state.projects, p] });
  const addActivity = (a: Activity) => save({ activities: [...state.activities, a] });
  const addExpense = (e: Expense) => save({ expenses: [...state.expenses, e] });
  const updateProject = (id: string, updates: Partial<Project>) =>
    save({ projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)) });

  const togglePipelineStage = (
    projectId: string,
    pipeline: "processing" | "modelling",
    stage: "qc" | "qa" | "delivery",
    checked: boolean
  ) => {
    const existing = state.pipelines[projectId] ?? EMPTY_PIPELINE;
    const dateKey = `${stage}Date` as keyof StageProgress;
    const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    const updated: ProjectPipeline = {
      ...existing,
      [pipeline]: {
        ...existing[pipeline],
        [stage]: checked,
        [dateKey]: checked ? today : undefined,
      },
    };
    save({ pipelines: { ...state.pipelines, [projectId]: updated } });
  };

  if (!initialized) return null;

  return (
    <AppContext.Provider value={{ ...state, login, logout, addProject, addActivity, addExpense, updateProject, togglePipelineStage }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
