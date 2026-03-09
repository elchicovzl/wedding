"use client";

import Hero from "./Hero";
import Details from "./Details";
import Gallery from "./Gallery";
import RSVP from "./RSVP";
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
    drinkChoice: string | null;
    stayOvernight: boolean | null;
    members: MemberData[];
  };
}

const weddingConfig = {
  brideName: "Milena",
  groomName: "Miguel",
  weddingDate: "Viernes, 10 de Julio 2026",
  locationDetails: "San Jerónimo, Antioquia Colombia",
  ceremonyTime: "7:00 PM",
  receptionTime: "6:00 PM",
  address: "San Jerónimo, Antioquia — Sede Murano Mi Casa Campestre",
  mapUrl: "https://maps.app.goo.gl/3HWc5nQ8htMcz2tG8?g_st=am",
  dressCode: "Cóctel",
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
            &ldquo;El amor nos unió, y hoy decidimos caminar juntos para siempre.
            Nos encantaría que seas parte de este momento tan especial.&rdquo;
          </p>
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
            {weddingConfig.brideName} & {weddingConfig.groomName}
          </p>
          <p className="sans-font footer-date">{weddingConfig.weddingDate}</p>
          <p className="footer-hashtag">
            #{weddingConfig.brideName}Y{weddingConfig.groomName}2026
          </p>
        </div>
      </footer>
    </div>
  );
}
