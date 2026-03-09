"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Copy,
  Check,
  Clock,
  X,
  Search,
  Link,
  Users,
  Baby,
  MoreHorizontal,
  Send,
} from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

interface Member {
  id: string;
  name: string;
  isChild: boolean;
  attending: boolean | null;
}

interface Family {
  id: string;
  name: string;
  inviteCode: string;
  totalSlots: number;
  childrenCount: number;
  groupAttending: boolean | null;
  drinkChoice: string | null;
  stayOvernight: boolean | null;
  invitationSent: boolean;
  respondedAt: string | null;
  members: Member[];
}

interface FormMember {
  name: string;
  isChild: boolean;
}

export default function FamiliesPage() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "confirmed" | "pending" | "declined"
  >("all");
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formMembers, setFormMembers] = useState<FormMember[]>([
    { name: "", isChild: false },
  ]);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchFamilies = useCallback(async () => {
    const res = await fetch("/api/families");
    const data = await res.json();
    setFamilies(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFamilies();
  }, [fetchFamilies]);

  const filteredFamilies = families.filter((f) => {
    if (filter === "confirmed" && f.groupAttending !== true) return false;
    if (filter === "pending" && f.respondedAt !== null) return false;
    if (filter === "declined" && f.groupAttending !== false) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const totalMembers = families.reduce((acc, f) => acc + f.members.length, 0);
  const totalChildren = families.reduce((acc, f) => acc + f.childrenCount, 0);

  const filterCounts = {
    all: families.length,
    confirmed: families.filter((f) => f.groupAttending === true).length,
    pending: families.filter((f) => f.respondedAt === null).length,
    declined: families.filter((f) => f.groupAttending === false).length,
  };

  const copyLink = async (code: string, id: string) => {
    const baseUrl = window.location.origin;
    await navigator.clipboard.writeText(`${baseUrl}/invite/${code}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openCreateForm = () => {
    setEditingId(null);
    setFormName("");
    setFormMembers([{ name: "", isChild: false }]);
    setShowForm(true);
  };

  const openEditForm = (family: Family) => {
    setEditingId(family.id);
    setFormName(family.name);
    setFormMembers(
      family.members.map((m) => ({ name: m.name, isChild: m.isChild }))
    );
    setShowForm(true);
  };

  const addMember = () => {
    setFormMembers([...formMembers, { name: "", isChild: false }]);
  };

  const removeMember = (index: number) => {
    if (formMembers.length <= 1) return;
    setFormMembers(formMembers.filter((_, i) => i !== index));
  };

  const updateMember = (
    index: number,
    field: keyof FormMember,
    value: string | boolean
  ) => {
    const updated = [...formMembers];
    updated[index] = { ...updated[index], [field]: value };
    setFormMembers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const validMembers = formMembers.filter((m) => m.name.trim());
    if (!formName.trim() || validMembers.length === 0) {
      setSaving(false);
      return;
    }

    const url = editingId ? `/api/families/${editingId}` : "/api/families";
    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: formName, members: validMembers }),
    });

    setSaving(false);
    setShowForm(false);
    fetchFamilies();
  };

  const toggleInvitationSent = async (id: string, current: boolean) => {
    await fetch(`/api/families/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invitationSent: !current }),
    });
    setFamilies((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, invitationSent: !current } : f
      )
    );
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/families/${id}`, { method: "DELETE" });
    setDeleteConfirm(null);
    fetchFamilies();
  };

  const getStatusBadge = (family: Family) => {
    if (family.respondedAt === null) {
      return (
        <Badge variant="outline" className="bg-amber-50 p-2! text-amber-700 border-amber-200">
          <Clock className="h-3 w-3 mr-1" /> Pendiente
        </Badge>
      );
    }
    if (family.groupAttending) {
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
          <Check className="h-3 w-3 mr-1" /> Confirmada
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
        <X className="h-3 w-3 mr-1" /> Declinada
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="max-w-10! mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-10 w-64" />
        </div>
        <Card className="p-0!">
          <CardContent className="p-0!">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4! border-b border-border last:border-0">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto" style={{ padding: "1rem 1.5rem" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8!">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Familias</h1>
          <div className="flex items-center gap-3 mt-1.5! text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> {families.length} familias
            </span>
            <span className="text-border">|</span>
            <span>{totalMembers} invitados</span>
            <span className="text-border">|</span>
            <span className="inline-flex items-center gap-1">
              <Baby className="h-3.5 w-3.5" /> {totalChildren} niños
            </span>
          </div>
        </div>
        <Button className="p-3!" onClick={openCreateForm}>
          <Plus className="h-4 w-4 mr-2" /> Nueva Familia
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6! items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre de familia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9! h-10!"
          />
        </div>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList className="h-10! p-2!">
            {([
              { key: "all", label: "Todas" },
              { key: "confirmed", label: "Confirmadas" },
              { key: "pending", label: "Pendientes" },
              { key: "declined", label: "Declinadas" },
            ] as const).map((f) => (
              <TabsTrigger key={f.key} value={f.key} className="gap-1.5 px-3! py-1.5! text-sm!">
                {f.label}
                <Badge variant="secondary" className="ml-0.5 px-1.5! py-0 text-[10px] font-semibold h-5 min-w-5 flex items-center justify-center">
                  {filterCounts[f.key]}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Table */}
      <Card className="shadow-sm border border-border p-0!">
        <CardContent className="p-0! overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5!">Familia</TableHead>
                <TableHead>Integrantes</TableHead>
                <TableHead className="text-center">Enviada</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-center">Bebida</TableHead>
                <TableHead className="text-center">Finca</TableHead>
                <TableHead className="text-center w-[60px] pr-3!">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFamilies.map((family) => (
                <TableRow key={family.id}>
                  {/* Family Name + Code */}
                  <TableCell className="pl-5!">
                    <p className="font-semibold text-foreground text-sm">
                      {family.name}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Link className="h-3 w-3 text-muted-foreground/40" />
                      <code className="text-[11px] text-muted-foreground font-mono">
                        {family.inviteCode}
                      </code>
                      <span className="text-muted-foreground/30 mx-1">·</span>
                      <span className="text-[11px] text-muted-foreground">
                        {family.totalSlots} cupos
                      </span>
                    </div>
                  </TableCell>

                  {/* Members */}
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5! max-w-sm">
                      {family.members.map((m) => (
                        <Badge
                          key={m.id}
                          variant="outline"
                          className={`text-xs font-medium ${
                            m.attending === true
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : m.attending === false
                                ? "bg-red-50 text-red-400 border-red-200 line-through"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {m.name}
                          {m.isChild && (
                            <Baby className="h-3 w-3 ml-0.5 opacity-50" />
                          )}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>

                  {/* Invitation Sent */}
                  <TableCell className="text-center">
                    <button
                      onClick={() => toggleInvitationSent(family.id, family.invitationSent)}
                      className="inline-flex items-center justify-center"
                      title={family.invitationSent ? "Marcar como no enviada" : "Marcar como enviada"}
                    >
                      {family.invitationSent ? (
                        <Send className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Send className="h-4 w-4 text-muted-foreground/30" />
                      )}
                    </button>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="text-center">
                    {getStatusBadge(family)}
                  </TableCell>

                  {/* Drink */}
                  <TableCell className="text-center">
                    {family.drinkChoice ? (
                      <Badge variant="secondary" className="font-medium">
                        {family.drinkChoice}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </TableCell>

                  {/* Overnight */}
                  <TableCell className="text-center">
                    {family.stayOvernight === null ? (
                      <span className="text-muted-foreground/40">—</span>
                    ) : family.stayOvernight ? (
                      <Badge variant="outline" className="bg-violet-50 text-violet-600 border-violet-200 font-medium">
                        Sí
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">No</span>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-center p-3!">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="p-4!" align="end">
                        <DropdownMenuItem onClick={() => copyLink(family.inviteCode, family.id)}>
                          {copiedId === family.id ? (
                            <Check className="h-4 w-4 mr-2 text-emerald-500" />
                          ) : (
                            <Copy className="h-4 w-4 mr-2" />
                          )}
                          {copiedId === family.id ? "Copiado!" : "Copiar link"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditForm(family)}>
                          <Pencil className="h-4 w-4 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteConfirm(family.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredFamilies.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-8 w-8 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                No se encontraron familias
              </p>
              <p className="text-muted-foreground/60 text-xs mt-1">
                Intenta ajustar los filtros o la búsqueda
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground mt-3! text-right">
        Mostrando {filteredFamilies.length} de {families.length} familias
      </p>

      {/* Create/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="p-3!">
              {editingId ? "Editar Familia" : "Nueva Familia"}
            </DialogTitle>
            <DialogDescription className="px-3!">
              {editingId
                ? "Modifica los datos de la familia."
                : "Agrega una nueva familia con sus integrantes."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5! p-3!">
            <div className="space-y-2!">
              <Label htmlFor="familyName">Nombre del grupo / familia</Label>
              <Input
                id="familyName"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Ej: Familia García - López"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Integrantes</Label>
              <div className="space-y-2 gap-2">
                {formMembers.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-muted p-2.5! mb-2! rounded-lg"
                  >
                    <Input
                      value={member.name}
                      onChange={(e) =>
                        updateMember(index, "name", e.target.value)
                      }
                      placeholder="Nombre del integrante"
                      className="flex-1"
                    />
                    <div className="flex items-center gap-1.5 bg-background px-3! py-2! rounded-md border border-border">
                      <Checkbox
                        id={`child-${index}`}
                        checked={member.isChild}
                        onCheckedChange={(checked) =>
                          updateMember(index, "isChild", !!checked)
                        }
                      />
                      <Label
                        htmlFor={`child-${index}`}
                        className="text-xs whitespace-nowrap cursor-pointer"
                      >
                        Niño/a
                      </Label>
                    </div>
                    {formMembers.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMember(index)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={addMember}
                className="text-primary"
              >
                <Plus className="h-4 w-4 mr-1.5" /> Agregar integrante
              </Button>
            </div>

            <DialogFooter className="p-3!">
              <Button
                className="p-3!"
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
              <Button className="p-3!" type="submit" disabled={saving}>
                {saving
                  ? "Guardando..."
                  : editingId
                    ? "Actualizar"
                    : "Crear Familia"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar familia?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminarán todos los datos y
              la invitación de esta familia.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
