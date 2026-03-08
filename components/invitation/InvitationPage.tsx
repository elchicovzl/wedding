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
  weddingDate: "10 de Julio 2026",
  locationDetails: "San Jerónimo, Antioquia Colombia",
  ceremonyTime: "16:00 HRS",
  receptionTime: "18:00 HRS",
  address: "Camino Real a Cholula 1234, C.P. 72810, Puebla, Pue.",
  mapUrl: "https://maps.app.goo.gl/",
  dressCode: "Formal",
};

export default function InvitationPage({
  familyName,
  familyCode,
  members,
  alreadyResponded,
  previousResponse,
}: InvitationPageProps) {
  return (
    <div className="app-container">
      <Hero
        brideName={weddingConfig.brideName}
        groomName={weddingConfig.groomName}
        weddingDate={weddingConfig.weddingDate}
        locationDetails={weddingConfig.locationDetails}
      />

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
            &ldquo;El amor no consiste en mirarse el uno al otro, sino en mirar
            juntos en la misma dirección.&rdquo;
          </p>
          <span className="quote-author sans-font">
            - A. de Saint-Exupéry
          </span>
        </div>
      </div>

      <Gallery />

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
