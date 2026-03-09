export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
        fontFamily: "var(--font-serif)",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-script)",
          fontSize: "clamp(3rem, 8vw, 5rem)",
          color: "var(--color-primary)",
          marginBottom: "1rem",
        }}
      >
        Milena & Miguel
      </h1>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.9rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--color-text-muted)",
          marginBottom: "2rem",
        }}
      >
        Viernes, 10 de Julio 2026
      </p>
      <p style={{ color: "var(--color-text-muted)", maxWidth: "400px" }}>
        Esta invitación requiere un enlace personalizado. Por favor, utiliza el
        link que te fue enviado por mensaje.
      </p>
    </div>
  );
}
