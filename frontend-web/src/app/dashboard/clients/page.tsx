"use client";

import { useState, useEffect } from "react";
import {
  fetchClients,
  createClient,
  updateClient,
  type Client as APIClient,
  type CreateClientInput
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Pencil, Archive, Search, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ClientsPage() {
  const [clients, setClients] = useState<APIClient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<APIClient | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "" as APIClient["gender"],
    age: "",
    goals: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load clients on mount
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchClients();
      setClients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar clientes");
      console.error("Error loading clients:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.status === "active" &&
      (client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getAdherenceBadge = (adherence: number) => {
    if (adherence >= 80)
      return <Badge className="bg-chart-3 text-white">Alta ({adherence}%)</Badge>;
    if (adherence >= 50)
      return <Badge className="bg-chart-1 text-white">Media ({adherence}%)</Badge>;
    return <Badge className="bg-chart-5 text-white">Baja ({adherence}%)</Badge>;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.email) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const input: CreateClientInput = {
        name: formData.name,
        email: formData.email,
        gender: formData.gender || undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
        goals: formData.goals || undefined,
      };

      // Optimistic update - add temporary client
      const tempClient: APIClient = {
        id: `temp-${Date.now()}`,
        name: input.name,
        email: input.email,
        gender: input.gender,
        age: input.age,
        goals: input.goals,
        adherence: 0,
        lastActivity: "Nunca",
        status: "active",
        createdAt: new Date().toISOString(),
        workoutsCompleted: 0,
        workoutsAssigned: 0,
      };
      setClients([...clients, tempClient]);

      // Make API call
      const newClient = await createClient(input);

      // Replace temp client with real one
      setClients(prev => prev.map(c => c.id === tempClient.id ? newClient : c));

      setIsCreateOpen(false);
      resetForm();
    } catch (err) {
      // Remove temp client on error
      setClients(prev => prev.filter(c => !c.id.startsWith('temp-')));
      setError(err instanceof Error ? err.message : "Error al crear cliente");
      console.error("Error creating client:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!editingClient || !formData.name || !formData.email) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const input: Partial<CreateClientInput> = {
        name: formData.name,
        email: formData.email,
        gender: formData.gender || undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
        goals: formData.goals || undefined,
      };

      // Optimistic update
      const previousClients = [...clients];
      setClients(
        clients.map((client) =>
          client.id === editingClient.id
            ? { ...client, ...input }
            : client
        )
      );

      // Make API call
      const updatedClient = await updateClient(editingClient.id, input);

      // Update with real data
      setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));

      setIsEditOpen(false);
      setEditingClient(null);
      resetForm();
    } catch (err) {
      // Revert on error
      loadClients();
      setError(err instanceof Error ? err.message : "Error al actualizar cliente");
      console.error("Error updating client:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchive = async (clientId: string) => {
    if (!confirm("¿Estás seguro de archivar este cliente?")) return;

    try {
      setError(null);

      // Optimistic update
      setClients(
        clients.map((client) =>
          client.id === clientId ? { ...client, status: "archived" as const } : client
        )
      );

      // Make API call
      await updateClient(clientId, { });

    } catch (err) {
      // Revert on error
      loadClients();
      setError(err instanceof Error ? err.message : "Error al archivar cliente");
      console.error("Error archiving client:", err);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", gender: undefined, age: "", goals: "" });
  };

  const openEditDialog = (client: APIClient) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      gender: client.gender,
      age: client.age?.toString() || "",
      goals: client.goals || "",
    });
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Error message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">{error}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setError(null)}
            className="ml-auto"
          >
            Cerrar
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mis Clientes</h1>
          <p className="mt-2 text-muted-foreground">
            Gestiona tus clientes y monitorea su progreso
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
              <DialogDescription>
                Ingresa la información del nuevo cliente
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ej: Laura Gómez"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="ejemplo@email.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gender">Género</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData({ ...formData, gender: value as Client['gender'] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Femenino</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                    <SelectItem value="prefer-not-to-say">
                      Prefiero no decir
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="age">Edad</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  placeholder="Ej: 28"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="goals">Objetivos</Label>
                <Textarea
                  id="goals"
                  value={formData.goals}
                  onChange={(e) =>
                    setFormData({ ...formData, goals: e.target.value })
                  }
                  placeholder="Ej: Perder 5kg, ganar músculo..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateOpen(false);
                  resetForm();
                }}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!formData.name || !formData.email || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Cliente"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredClients.length} de {clients.filter((c) => c.status === "active").length}{" "}
          clientes
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Adherencia</TableHead>
              <TableHead>Última Actividad</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Cargando clientes...</p>
                </TableCell>
              </TableRow>
            ) : filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <p className="text-muted-foreground">No se encontraron clientes</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                <TableCell>
                  <Link
                    href={`/dashboard/clients/${client.id}`}
                    className="flex items-center gap-3 hover:underline"
                  >
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(client.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{client.name}</div>
                      {client.goals && (
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {client.goals}
                        </div>
                      )}
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {client.email}
                </TableCell>
                <TableCell>{getAdherenceBadge(client.adherence)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {client.lastActivity}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(client)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleArchive(client.id)}
                    >
                      <Archive className="h-4 w-4" />
                      <span className="sr-only">Archivar</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Actualiza la información del cliente
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nombre completo *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-gender">Género</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData({ ...formData, gender: value as Client['gender'] })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="female">Femenino</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                  <SelectItem value="prefer-not-to-say">
                    Prefiero no decir
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-age">Edad</Label>
              <Input
                id="edit-age"
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-goals">Objetivos</Label>
              <Textarea
                id="edit-goals"
                value={formData.goals}
                onChange={(e) =>
                  setFormData({ ...formData, goals: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditOpen(false);
                setEditingClient(null);
                resetForm();
              }}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEdit}
              disabled={!formData.name || !formData.email || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
