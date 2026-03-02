import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Users, Briefcase, DollarSign, Trash2, Edit2, X, ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  notes: string;
  created_at: string;
}

interface Project {
  id: string;
  client_id: string | null;
  title: string;
  status: string;
  amount: number;
  deadline: string | null;
  notes: string;
  created_at: string;
}

interface ClientCRMProps {
  userId: string;
}

export const ClientCRM = ({ userId }: ClientCRMProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAddClient, setShowAddClient] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // New client form
  const [newClient, setNewClient] = useState({ name: "", email: "", company: "", phone: "", notes: "" });
  // New project form
  const [newProject, setNewProject] = useState({ title: "", client_id: "", amount: 0, deadline: "", notes: "", status: "active" });

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    setLoading(true);
    const [clientsRes, projectsRes] = await Promise.all([
      supabase.from("clients").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("projects").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    ]);
    setClients((clientsRes.data as Client[]) || []);
    setProjects((projectsRes.data as Project[]) || []);
    setLoading(false);
  };

  const addClient = async () => {
    if (!newClient.name.trim()) {
      toast({ title: "Client name required", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("clients").insert({ user_id: userId, ...newClient });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Client added! ✅" });
    setNewClient({ name: "", email: "", company: "", phone: "", notes: "" });
    setShowAddClient(false);
    fetchData();
  };

  const addProject = async () => {
    if (!newProject.title.trim()) {
      toast({ title: "Project title required", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("projects").insert({
      user_id: userId,
      title: newProject.title,
      client_id: newProject.client_id || null,
      amount: newProject.amount,
      deadline: newProject.deadline || null,
      notes: newProject.notes,
      status: newProject.status,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Project added! ✅" });
    setNewProject({ title: "", client_id: "", amount: 0, deadline: "", notes: "", status: "active" });
    setShowAddProject(false);
    fetchData();
  };

  const deleteClient = async (id: string) => {
    await supabase.from("clients").delete().eq("id", id);
    toast({ title: "Client deleted" });
    fetchData();
  };

  const deleteProject = async (id: string) => {
    await supabase.from("projects").delete().eq("id", id);
    toast({ title: "Project deleted" });
    fetchData();
  };

  const totalEarnings = projects.reduce((sum, p) => sum + (p.amount || 0), 0);
  const activeProjects = projects.filter((p) => p.status === "active").length;

  const statusColors: Record<string, string> = {
    active: "bg-green-500/10 text-green-700 dark:text-green-400",
    completed: "bg-primary/10 text-primary",
    paused: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Clients", value: clients.length, icon: Users },
          { label: "Active Projects", value: activeProjects, icon: Briefcase },
          { label: "Total Earnings", value: `$${totalEarnings.toLocaleString()}`, icon: DollarSign },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Clients Section */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" /> Clients
          </h3>
          <Button size="sm" onClick={() => setShowAddClient(!showAddClient)}>
            {showAddClient ? <X className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
            {showAddClient ? "Cancel" : "Add Client"}
          </Button>
        </div>

        <AnimatePresence>
          {showAddClient && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-lg bg-muted/50 border border-border">
                <div><Label className="text-xs">Name *</Label><Input value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} placeholder="John Doe" /></div>
                <div><Label className="text-xs">Email</Label><Input value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} placeholder="john@co.com" /></div>
                <div><Label className="text-xs">Company</Label><Input value={newClient.company} onChange={(e) => setNewClient({ ...newClient, company: e.target.value })} /></div>
                <div><Label className="text-xs">Phone</Label><Input value={newClient.phone} onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} /></div>
                <div className="sm:col-span-2"><Label className="text-xs">Notes</Label><Textarea value={newClient.notes} onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })} rows={2} /></div>
                <Button onClick={addClient} className="sm:col-span-2">Save Client</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {clients.length === 0 && !loading ? (
          <p className="text-sm text-muted-foreground text-center py-6">No clients yet. Add your first client above.</p>
        ) : (
          <div className="space-y-2">
            {clients.map((client) => (
              <div key={client.id} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedClient(expandedClient === client.id ? null : client.id)}>
                  <div>
                    <p className="font-medium text-sm">{client.name}</p>
                    <p className="text-xs text-muted-foreground">{client.company || client.email || "No details"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{projects.filter((p) => p.client_id === client.id).length} projects</span>
                    {expandedClient === client.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
                <AnimatePresence>
                  {expandedClient === client.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="mt-3 pt-3 border-t border-border space-y-2 text-sm">
                        {client.email && <p className="text-muted-foreground">📧 {client.email}</p>}
                        {client.phone && <p className="text-muted-foreground">📱 {client.phone}</p>}
                        {client.notes && <p className="text-muted-foreground">📝 {client.notes}</p>}
                        <p className="text-xs text-muted-foreground">Added {formatDistanceToNow(new Date(client.created_at), { addSuffix: true })}</p>
                        <Button variant="destructive" size="sm" onClick={() => deleteClient(client.id)}>
                          <Trash2 className="w-3 h-3 mr-1" /> Delete
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Projects Section */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" /> Projects
          </h3>
          <Button size="sm" onClick={() => setShowAddProject(!showAddProject)}>
            {showAddProject ? <X className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
            {showAddProject ? "Cancel" : "Add Project"}
          </Button>
        </div>

        <AnimatePresence>
          {showAddProject && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-lg bg-muted/50 border border-border">
                <div><Label className="text-xs">Title *</Label><Input value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} placeholder="Website Redesign" /></div>
                <div>
                  <Label className="text-xs">Client</Label>
                  <select
                    value={newProject.client_id}
                    onChange={(e) => setNewProject({ ...newProject, client_id: e.target.value })}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">No client</option>
                    {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div><Label className="text-xs">Amount ($)</Label><Input type="number" value={newProject.amount} onChange={(e) => setNewProject({ ...newProject, amount: Number(e.target.value) })} /></div>
                <div><Label className="text-xs">Deadline</Label><Input type="date" value={newProject.deadline} onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })} /></div>
                <div>
                  <Label className="text-xs">Status</Label>
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
                <div><Label className="text-xs">Notes</Label><Textarea value={newProject.notes} onChange={(e) => setNewProject({ ...newProject, notes: e.target.value })} rows={2} /></div>
                <Button onClick={addProject} className="sm:col-span-2">Save Project</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {projects.length === 0 && !loading ? (
          <p className="text-sm text-muted-foreground text-center py-6">No projects yet.</p>
        ) : (
          <div className="space-y-2">
            {projects.map((project) => {
              const client = clients.find((c) => c.id === project.client_id);
              return (
                <div key={project.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium text-sm">{project.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {client ? client.name : "No client"} · ${project.amount.toLocaleString()}
                      {project.deadline && ` · Due ${new Date(project.deadline).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[project.status] || "bg-muted text-muted-foreground"}`}>
                      {project.status}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => deleteProject(project.id)} className="h-8 w-8">
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
