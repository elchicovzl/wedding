"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import "./RSVP.css";

const DRINK_OPTIONS = ["Cerveza", "Guaro", "Ron", "Whisky", "Vino", "Agua"];

interface MemberData {
  id: string;
  name: string;
  isChild: boolean;
  attending: boolean | null;
}

interface RSVPProps {
  familyName: string;
  familyCode: string;
  members: MemberData[];
  alreadyResponded: boolean;
  previousResponse?: {
    groupAttending: boolean | null;
    drinkChoice: string | null;
    stayOvernight: boolean | null;
    members: MemberData[];
  };
}

const RSVP = ({
  familyName,
  familyCode,
  members,
  alreadyResponded,
  previousResponse,
}: RSVPProps) => {
  const [confirmedGuests, setConfirmedGuests] = useState<Set<string>>(() => {
    if (previousResponse?.groupAttending) {
      return new Set(
        previousResponse.members
          .filter((m) => m.attending)
          .map((m) => m.id)
      );
    }
    return new Set();
  });
  const [selectedDrink, setSelectedDrink] = useState<string>(
    previousResponse?.drinkChoice || ""
  );
  const [stayOvernight, setStayOvernight] = useState<boolean | null>(
    previousResponse?.stayOvernight ?? null
  );
  const [groupAttending, setGroupAttending] = useState<boolean | null>(
    previousResponse?.groupAttending ?? null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(alreadyResponded);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showForm = !isSuccess || isEditing;

  const handleGroupAttendance = (willAttend: boolean) => {
    setGroupAttending(willAttend);
    if (!willAttend) {
      setSelectedDrink("");
      setConfirmedGuests(new Set());
      setStayOvernight(null);
    }
  };

  const toggleGuest = (id: string) => {
    setConfirmedGuests((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (groupAttending === null) {
      setError("Por favor, indícanos si podrán acompañarnos.");
      return;
    }

    if (groupAttending === true) {
      if (confirmedGuests.size === 0) {
        setError("Por favor, confirma al menos un miembro del grupo.");
        return;
      }
      if (!selectedDrink) {
        setError("Por favor, selecciona una bebida para el grupo.");
        return;
      }
      if (stayOvernight === null) {
        setError("Por favor, indícanos si se quedarán en la finca.");
        return;
      }
    }

    setIsSubmitting(true);

    const memberAttendance: Record<string, boolean> = {};
    members.forEach((m) => {
      memberAttendance[m.id] = groupAttending
        ? confirmedGuests.has(m.id)
        : false;
    });

    try {
      const res = await fetch(`/api/rsvp/${familyCode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupAttending,
          memberAttendance,
          drinkChoice: groupAttending ? selectedDrink : null,
          stayOvernight: groupAttending ? stayOvernight : null,
        }),
      });

      if (!res.ok) {
        throw new Error("Error al enviar la respuesta");
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      setIsEditing(false);
    } catch {
      setIsSubmitting(false);
      setError(
        "Hubo un error al enviar tu respuesta. Por favor intenta de nuevo."
      );
    }
  };

  return (
    <section className="section rsvp-section" id="rsvp">
      <div className="container">
        <motion.div
          className="rsvp-container glass-panel"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="rsvp-header">
            <h2 className="script-font rsvp-title">RSVP</h2>
            <p className="sans-font rsvp-subtitle">
              Confirmación de Asistencia
            </p>
            <p className="rsvp-description">
              Invitación especial para:
              <br />
              <strong className="group-name-highlight">{familyName}</strong>
            </p>
          </div>

          {showForm ? (
            <form className="rsvp-form" onSubmit={handleSubmit}>
              <div className="group-attendance-card">
                <h3 className="attendance-question sans-font">
                  ¿Nos acompañarán este día?
                </h3>
                <div className="attendance-toggle group-toggle">
                  <button
                    type="button"
                    className={`toggle-btn ${groupAttending === true ? "active-yes" : ""}`}
                    onClick={() => handleGroupAttendance(true)}
                  >
                    Sí, iremos
                  </button>
                  <button
                    type="button"
                    className={`toggle-btn ${groupAttending === false ? "active-no" : ""}`}
                    onClick={() => handleGroupAttendance(false)}
                  >
                    No podremos asistir
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {groupAttending === true && (
                  <motion.div
                    className="guests-and-drinks"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Guest checklist */}
                    <div className="group-attendance-card guest-checklist-card">
                      <h3 className="attendance-question sans-font">
                        Confirma quién asiste
                      </h3>
                      <p className="drinks-subtitle">
                        Toca cada nombre para confirmarlo
                      </p>
                      <ul className="guest-checklist">
                        {members.map((member) => (
                          <motion.li
                            key={member.id}
                            className={`guest-checklist-item ${confirmedGuests.has(member.id) ? "confirmed" : ""}`}
                            onClick={() => toggleGuest(member.id)}
                            whileTap={{ scale: 0.97 }}
                          >
                            <span className="guest-check-indicator">
                              {confirmedGuests.has(member.id) ? (
                                <FaCheckCircle className="guest-check-icon checked" />
                              ) : (
                                <span className="guest-check-icon unchecked" />
                              )}
                            </span>
                            <span className="guest-check-name">
                              {member.name}
                              {member.isChild && (
                                <span
                                  style={{
                                    fontSize: "0.75em",
                                    color: "var(--color-text-muted)",
                                    marginLeft: "0.5em",
                                  }}
                                >
                                  (niño/a)
                                </span>
                              )}
                            </span>
                            {confirmedGuests.has(member.id) && (
                              <motion.span
                                className="guest-strike-line"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{
                                  duration: 0.3,
                                  ease: "easeOut",
                                }}
                              />
                            )}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Drinks */}
                    <div className="drinks-section group-attendance-card">
                      <h3 className="drinks-title sans-font">
                        ¿Qué prefieren tomar?
                      </h3>
                      <p className="drinks-subtitle">
                        Seleccionen una bebida para el grupo.
                      </p>

                      <div className="drink-grid drink-grid-single">
                        {DRINK_OPTIONS.map((drinkStr) => (
                          <label
                            key={drinkStr}
                            className={`drink-option drink-option-lg ${selectedDrink === drinkStr ? "selected" : ""}`}
                          >
                            <input
                              type="radio"
                              name="group-drink"
                              value={drinkStr}
                              checked={selectedDrink === drinkStr}
                              onChange={() => setSelectedDrink(drinkStr)}
                            />
                            <span>{drinkStr}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Overnight stay */}
                    <div className="group-attendance-card">
                      <h3 className="attendance-question sans-font">
                        ¿Se quedan a dormir en la finca?
                      </h3>
                      <p className="drinks-subtitle">
                        La finca tiene habitaciones disponibles para los
                        invitados.
                      </p>
                      <div className="attendance-toggle group-toggle">
                        <button
                          type="button"
                          className={`toggle-btn ${stayOvernight === true ? "active-yes" : ""}`}
                          onClick={() => setStayOvernight(true)}
                        >
                          Sí, nos quedamos
                        </button>
                        <button
                          type="button"
                          className={`toggle-btn ${stayOvernight === false ? "active-no" : ""}`}
                          onClick={() => setStayOvernight(false)}
                        >
                          No, regresamos
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <div
                  style={{
                    color: "#a37272",
                    textAlign: "center",
                    marginTop: "1rem",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.85rem",
                  }}
                >
                  <FaExclamationCircle
                    style={{ marginRight: "0.5rem" }}
                  />
                  {error}
                </div>
              )}

              <div className="form-submit">
                <button
                  type="submit"
                  className={`btn btn-primary submit-btn ${isSubmitting ? "submitting" : ""}`}
                  disabled={isSubmitting || groupAttending === null}
                >
                  {isSubmitting ? (
                    "Procesando..."
                  ) : (
                    <>
                      {isEditing ? "Actualizar" : "Confirmar y Enviar"}{" "}
                      <FaPaperPlane className="submit-icon" />
                    </>
                  )}
                </button>
                <p className="submit-note">
                  Tu respuesta se registrará directamente en nuestro
                  sistema.
                </p>
              </div>
            </form>
          ) : (
            <motion.div
              className="success-message"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
            >
              <FaCheckCircle className="success-icon" />
              <h3 className="sans-font">¡Confirmación Exitosa!</h3>
              <p>
                {groupAttending
                  ? "Muchísimas gracias. ¡Nos vemos en la boda!"
                  : "Lo entendemos, gracias por avisarnos. ¡Harán falta!"}
              </p>
              <button
                type="button"
                className="btn btn-outline"
                style={{ marginTop: "2rem" }}
                onClick={() => setIsEditing(true)}
              >
                Editar respuesta
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default RSVP;
