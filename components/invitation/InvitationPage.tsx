"use client";

import Hero from "./Hero";
import Details from "./Details";
import Gallery from "./Gallery";
import RSVP from "./RSVP";
import { motion } from "framer-motion";
import "./InvitationApp.css";

interface MemberData {
  id: string;
  name: string;
  isChild: boolean;
  attending: boolean | null;
}

interface InvitationPageProps {
  familyName: string;
  familyCode: string;
  members: MemberData[];
  alreadyResponded: boolean;
  previousResponse?: {
    groupAttending: boolean | null;
    needsTransport: boolean | null;
    members: MemberData[];
  };
}

const weddingConfig = {
  brideName: "Yaneth",
  groomName: "Jair",
  weddingDate: "Viernes, 16 de Octubre 2026",
  locationDetails: "Llano Grande, Antioquia, Colombia",
  ceremonyTime: "5:00 PM",
  receptionTime: "4:30 PM",
  address: "Zona Campestre Eventos — Vía Don Diego, Llanogrande, El Retiro",
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Zona+Campestre+Eventos+V%C3%ADa+Don+Diego+Llanogrande+El+Retiro+Antioquia",
  dressCode: "Formal / Elegante",
};

export default function InvitationPage({
  familyName,
  familyCode,
  members,
  alreadyResponded,
  previousResponse,
}: InvitationPageProps) {
  return (
    <div className="app-container invitation-page">
      <Hero
        brideName={weddingConfig.brideName}
        groomName={weddingConfig.groomName}
        weddingDate={weddingConfig.weddingDate}
        locationDetails={weddingConfig.locationDetails}
      />

      <div className="section divider-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8 }}
          >
            <p className="script-font quote-text">
              Porque si hay algo que nos encanta, es pasarla bueno juntos.
            </p>
            <p className="welcome-text sans-font">
              Los esperamos para compartir el comienzo de una nueva aventura,
              con comida rica, nuestra gente favorita y, por supuesto…
              musiquita.
            </p>
            <p className="welcome-text welcome-text--accent sans-font">
              Los que saben, saben.
            </p>
          </motion.div>
        </div>
      </div>

      <Gallery />

      <Details
        ceremonyTime={weddingConfig.ceremonyTime}
        receptionTime={weddingConfig.receptionTime}
        address={weddingConfig.address}
        mapUrl={weddingConfig.mapUrl}
        dressCode={weddingConfig.dressCode}
      />

      <div className="section divider-section">
        <div className="container">
          <p className="script-font quote-text">
            &ldquo;Además, uno que anda solo puede ser vencido, pero dos juntos
            pueden hacerle frente al agresor. Y una cuerda triple no se rompe
            fácilmente.&rdquo;
          </p>
          <p className="quote-reference sans-font">Eclesiastés 4:12</p>
        </div>
      </div>

      <RSVP
        familyName={familyName}
        familyCode={familyCode}
        members={members}
        alreadyResponded={alreadyResponded}
        previousResponse={previousResponse}
      />

      <footer className="footer bg-texture">
        <div className="container">
          <p className="script-font footer-names">
            {weddingConfig.groomName} & {weddingConfig.brideName}
          </p>
          <p className="sans-font footer-date">{weddingConfig.weddingDate}</p>
          <p className="footer-hashtag">
            #{weddingConfig.groomName}Y{weddingConfig.brideName}2026
          </p>
        </div>
      </footer>
    </div>
  );
}
