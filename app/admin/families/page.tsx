"use client";

import { useEffect, useState, useCallback } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCopy,
  FaCheck,
  FaClock,
  FaTimes,
  FaSearch,
  FaLink,
  FaUsers,
  FaChild,
} from "react-icons/fa";

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

  const handleDelete = async (id: string) => {
    await fetch(`/api/families/${id}`, { method: "DELETE" });
    setDeleteConfirm(null);
    fetchFamilies();
  };

  const getStatusBadge = (family: Family) => {
    if (family.respondedAt === null) {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200">
          <FaClock className="text-[10px]" /> Pendiente
        </span>
      );
    }
    if (family.groupAttending) {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
          <FaCheck className="text-[10px]" /> Confirmada
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-red-50 text-red-600 px-2.5 py-1 rounded-full border border-red-200">
        <FaTimes className="text-[10px]" /> Declinada
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#4F5D48] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Cargando familias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto" style={{ padding: "1rem 1.5rem" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Familias</h1>
          <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              <FaUsers className="text-xs" /> {families.length} familias
            </span>
            <span className="text-gray-300">|</span>
            <span>{totalMembers} invitados</span>
            <span className="text-gray-300">|</span>
            <span className="inline-flex items-center gap-1">
              <FaChild className="text-xs" /> {totalChildren} niños
            </span>
          </div>
        </div>
        <button
          onClick={openCreateForm}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4F5D48] text-white rounded-xl hover:bg-[#3d4a38] transition-all hover:shadow-md text-sm font-medium"
        >
          <FaPlus className="text-xs" /> Nueva Familia
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 py-1">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Buscar por nombre de familia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4F5D48]/20 focus:border-[#4F5D48] transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: "all", label: "Todas" },
              { key: "confirmed", label: "Confirmadas" },
              { key: "pending", label: "Pendientes" },
              { key: "declined", label: "Declinadas" },
            ] as const
          ).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3.5 py-2 text-xs font-medium rounded-xl transition-all ${
                filter === f.key
                  ? "bg-[#4F5D48] text-white shadow-sm"
                  : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {f.label}{" "}
              <span
                className={
                  filter === f.key ? "text-white/60" : "text-gray-400"
                }
              >
                {filterCounts[f.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                  Familia
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                  Integrantes
                </th>
                <th className="text-center px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                  Estado
                </th>
                <th className="text-center px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                  Bebida
                </th>
                <th className="text-center px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                  Finca
                </th>
                <th className="text-center px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredFamilies.map((family, idx) => (
                <tr
                  key={family.id}
                  className={`border-b border-gray-50 hover:bg-blue-50/30 transition-colors ${
                    idx % 2 === 1 ? "bg-gray-50/30" : ""
                  }`}
                >
                  {/* Family Name + Code */}
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-800 text-sm">
                      {family.name}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <FaLink className="text-[9px] text-gray-300" />
                      <code className="text-[11px] text-gray-400 font-mono">
                        {family.inviteCode}
                      </code>
                      <span className="text-gray-300 mx-1">·</span>
                      <span className="text-[11px] text-gray-400">
                        {family.totalSlots} cupos
                      </span>
                    </div>
                  </td>

                  {/* Members */}
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5 max-w-sm">
                      {family.members.map((m) => (
                        <span
                          key={m.id}
                          className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md font-medium ${
                            m.attending === true
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : m.attending === false
                                ? "bg-red-50 text-red-400 border border-red-200 line-through"
                                : "bg-gray-50 text-gray-600 border border-gray-200"
                          }`}
                        >
                          {m.name}
                          {m.isChild && (
                            <FaChild className="text-[9px] opacity-50" />
                          )}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4 text-center">
                    {getStatusBadge(family)}
                  </td>

                  {/* Drink */}
                  <td className="px-4 py-4 text-center">
                    {family.drinkChoice ? (
                      <span className="text-xs font-medium text-gray-700 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">
                        {family.drinkChoice}
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                  {/* Overnight */}
                  <td className="px-4 py-4 text-center">
                    {family.stayOvernight === null ? (
                      <span className="text-gray-300">—</span>
                    ) : family.stayOvernight ? (
                      <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-200">
                        Sí
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">No</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-0.5">
                      <button
                        onClick={() =>
                          copyLink(family.inviteCode, family.id)
                        }
                        className="p-2.5 text-gray-400 hover:text-[#4F5D48] hover:bg-[#4F5D48]/5 rounded-lg transition-all"
                        title="Copiar link de invitación"
                      >
                        {copiedId === family.id ? (
                          <FaCheck className="text-emerald-500" />
                        ) : (
                          <FaCopy />
                        )}
                      </button>
                      <button
                        onClick={() => openEditForm(family)}
                        className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Editar familia"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(family.id)}
                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Eliminar familia"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredFamilies.length === 0 && (
          <div className="text-center py-12">
            <FaSearch className="text-3xl text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              No se encontraron familias
            </p>
            <p className="text-gray-300 text-xs mt-1">
              Intenta ajustar los filtros o la búsqueda
            </p>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-3 text-right">
        Mostrando {filteredFamilies.length} de {families.length} familias
      </p>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">
                {editingId ? "Editar Familia" : "Nueva Familia"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Nombre del grupo / familia
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ej: Familia García - López"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4F5D48]/20 focus:border-[#4F5D48]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Integrantes
                </label>
                <div className="space-y-2">
                  {formMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl"
                    >
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) =>
                          updateMember(index, "name", e.target.value)
                        }
                        placeholder="Nombre del integrante"
                        className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4F5D48]/20 focus:border-[#4F5D48]"
                      />
                      <label className="flex items-center gap-1.5 text-xs text-gray-500 whitespace-nowrap cursor-pointer select-none bg-white px-3 py-2 rounded-lg border border-gray-200">
                        <input
                          type="checkbox"
                          checked={member.isChild}
                          onChange={(e) =>
                            updateMember(index, "isChild", e.target.checked)
                          }
                          className="rounded accent-[#4F5D48]"
                        />
                        Niño/a
                      </label>
                      {formMembers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMember(index)}
                          className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addMember}
                  className="mt-3 text-sm text-[#4F5D48] hover:text-[#3d4a38] font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#4F5D48]/5 transition-colors"
                >
                  <FaPlus className="text-xs" /> Agregar integrante
                </button>
              </div>

              <div className="flex justify-end gap-3 pt-5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 text-sm bg-[#4F5D48] text-white rounded-xl hover:bg-[#3d4a38] disabled:opacity-50 font-medium transition-all hover:shadow-md"
                >
                  {saving
                    ? "Guardando..."
                    : editingId
                      ? "Actualizar"
                      : "Crear Familia"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrash className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 text-center mb-2">
              ¿Eliminar familia?
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Esta acción no se puede deshacer. Se eliminarán todos los datos
              y la invitación de esta familia.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors border border-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2.5 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition-all"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
