"use client";

import { useEffect, useState } from "react";
import {
  FaUsers,
  FaCheck,
  FaClock,
  FaTimes,
  FaBed,
  FaChild,
  FaGlassCheers,
  FaUserFriends,
} from "react-icons/fa";

interface Stats {
  totalFamilies: number;
  totalMembers: number;
  totalAdults: number;
  totalChildren: number;
  respondedCount: number;
  confirmedFamilies: number;
  confirmedMembers: number;
  declinedFamilies: number;
  pendingFamilies: number;
  stayingOvernight: number;
  notStaying: number;
  drinkCounts: Record<string, number>;
  recentResponses: Array<{
    name: string;
    groupAttending: boolean | null;
    drinkChoice: string | null;
    stayOvernight: boolean | null;
    respondedAt: string;
    confirmedCount: number;
    totalMembers: number;
  }>;
}

const DRINK_COLORS: Record<string, string> = {
  Cerveza: "#F59E0B",
  Guaro: "#10B981",
  Ron: "#8B5CF6",
  Whisky: "#EF4444",
  Vino: "#EC4899",
  Agua: "#3B82F6",
};

function getInitials(name: string) {
  return name
    .split(/[\s-]+/)
    .filter((w) => !["Familia", "de", "y"].includes(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#4F5D48] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  const progressPct = Math.round(
    (stats.respondedCount / stats.totalFamilies) * 100
  );

  const statCards = [
    {
      label: "Total Familias",
      value: stats.totalFamilies,
      icon: FaUsers,
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      accent: "border-l-blue-500",
    },
    {
      label: "Confirmadas",
      value: stats.confirmedFamilies,
      sub: `${stats.confirmedMembers} personas asisten`,
      icon: FaCheck,
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      accent: "border-l-emerald-500",
    },
    {
      label: "Pendientes",
      value: stats.pendingFamilies,
      icon: FaClock,
      bg: "bg-amber-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      accent: "border-l-amber-500",
    },
    {
      label: "Declinadas",
      value: stats.declinedFamilies,
      icon: FaTimes,
      bg: "bg-red-50",
      iconBg: "bg-red-100",
      iconColor: "text-red-500",
      accent: "border-l-red-400",
    },
    {
      label: "Hospedaje en Finca",
      value: stats.stayingOvernight,
      sub: `${stats.notStaying} no se quedan`,
      icon: FaBed,
      bg: "bg-violet-50",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      accent: "border-l-violet-500",
    },
    {
      label: "Invitados",
      value: stats.totalAdults + stats.totalChildren,
      sub: `${stats.totalAdults} adultos · ${stats.totalChildren} niños`,
      icon: FaChild,
      bg: "bg-indigo-50",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      accent: "border-l-indigo-500",
    },
  ];

  return (
    <div className="max-w-6xl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#4F5D48] to-[#6B7F62] rounded-2xl p-6 md:p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative">
          <p className="text-white/60 text-xs tracking-[0.2em] uppercase mb-1">
            Panel de Administración
          </p>
          <h1
            className="text-3xl md:text-4xl mb-1"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            Milena & Miguel
          </h1>
          <p className="text-white/70 text-sm">
            10 de Julio 2026 — San Jerónimo, Antioquia
          </p>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 max-w-xs">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-white/70">Progreso RSVP</span>
                <span className="text-white font-semibold">
                  {stats.respondedCount}/{stats.totalFamilies} familias
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2.5">
                <div
                  className="bg-[#D4AF37] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-3xl font-bold">{progressPct}%</p>
              <p className="text-white/50 text-xs">respondieron</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`${card.bg} rounded-xl p-5 border-l-4 ${card.accent} flex items-center gap-4 transition-shadow hover:shadow-md`}
          >
            <div
              className={`${card.iconBg} ${card.iconColor} w-12 h-12 rounded-xl flex items-center justify-center shrink-0`}
            >
              <card.icon className="text-xl" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                {card.label}
              </p>
              <p className="text-3xl font-bold text-gray-800 leading-tight">
                {card.value}
              </p>
              {card.sub && (
                <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Drinks Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <FaGlassCheers className="text-[#D4AF37]" />
            <h2 className="text-base font-semibold text-gray-800">
              Distribución de Bebidas
            </h2>
          </div>
          {Object.keys(stats.drinkCounts).length === 0 ? (
            <div className="text-center py-8">
              <FaGlassCheers className="text-4xl text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">
                Aún no hay selecciones de bebidas
              </p>
              <p className="text-gray-300 text-xs mt-1">
                Las bebidas aparecerán cuando las familias confirmen
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(stats.drinkCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([drink, count]) => {
                  const total = Object.values(stats.drinkCounts).reduce(
                    (a, b) => a + b,
                    0
                  );
                  const pct = Math.round((count / total) * 100);
                  const color = DRINK_COLORS[drink] || "#6B7280";
                  return (
                    <div key={drink}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <span className="font-medium text-gray-700">
                            {drink}
                          </span>
                        </div>
                        <span className="text-gray-500 font-medium">
                          {count}{" "}
                          <span className="text-gray-400 font-normal">
                            ({pct}%)
                          </span>
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Recent Responses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <FaUserFriends className="text-[#4F5D48]" />
            <h2 className="text-base font-semibold text-gray-800">
              Respuestas Recientes
            </h2>
          </div>
          {stats.recentResponses.length === 0 ? (
            <div className="text-center py-8">
              <FaUserFriends className="text-4xl text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Aún no hay respuestas</p>
              <p className="text-gray-300 text-xs mt-1">
                Las respuestas aparecerán aquí en tiempo real
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {stats.recentResponses.map((r) => (
                <div
                  key={r.name}
                  className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      r.groupAttending
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {getInitials(r.name)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {r.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(r.respondedAt).toLocaleDateString("es-CO", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {r.groupAttending ? (
                      <>
                        <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium border border-emerald-200">
                          {r.confirmedCount}/{r.totalMembers}
                        </span>
                        {r.drinkChoice && (
                          <span
                            className="text-xs px-2.5 py-1 rounded-full font-medium border"
                            style={{
                              backgroundColor:
                                (DRINK_COLORS[r.drinkChoice] || "#6B7280") +
                                "15",
                              color:
                                DRINK_COLORS[r.drinkChoice] || "#6B7280",
                              borderColor:
                                (DRINK_COLORS[r.drinkChoice] || "#6B7280") +
                                "30",
                            }}
                          >
                            {r.drinkChoice}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-full font-medium border border-red-200">
                        No asiste
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
