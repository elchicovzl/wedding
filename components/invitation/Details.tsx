"use client";

import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaClock, FaGem, FaEnvelopeOpenText, FaBus } from 'react-icons/fa';
import './Details.css';

interface DetailsProps {
    ceremonyTime: string;
    receptionTime: string;
    address: string;
    mapUrl: string;
    dressCode: string;
}

const Details = ({ ceremonyTime, receptionTime, address, mapUrl, dressCode }: DetailsProps) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: "easeOut" as const }
        }
    };

    return (
        <section className="section details-section bg-texture" id="details">
            <div className="container">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={containerVariants}
                    className="details-grid"
                >
                    {/* Dónde */}
                    <motion.div className="detail-card glass-panel" variants={itemVariants}>
                        <div className="icon-wrapper">
                            <FaMapMarkerAlt className="detail-icon" />
                        </div>
                        <h2 className="script-font detail-title">Dónde</h2>
                        <div className="detail-content">
                            <p className="address-text">{address}</p>
                            <a
                                href={mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline map-btn"
                            >
                                Ver en Mapa
                            </a>
                        </div>
                    </motion.div>

                    {/* Hora */}
                    <motion.div className="detail-card glass-panel" variants={itemVariants}>
                        <div className="icon-wrapper">
                            <FaClock className="detail-icon" />
                        </div>
                        <h2 className="script-font detail-title">Hora</h2>
                        <div className="detail-content">
                            <div className="time-block">
                                <span className="time-label sans-font">Llegada al lugar</span>
                                <span className="time-value">{receptionTime}</span>
                            </div>
                            <div className="time-separator"></div>
                            <div className="time-block">
                                <span className="time-label sans-font">Ceremonia</span>
                                <span className="time-value">{ceremonyTime}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Código de Vestimenta */}
                    <motion.div className="detail-card glass-panel" variants={itemVariants}>
                        <div className="icon-wrapper">
                            <FaGem className="detail-icon" />
                        </div>
                        <h2 className="script-font detail-title">Código de Vestimenta</h2>
                        <div className="detail-content">
                            <p className="dress-code-text">{dressCode}</p>
                            <p className="dress-code-subtext">
                                Por tratarse de una ocasión tan especial, les pedimos amablemente no utilizar vestidos o prendas en color blanco, marfil, beige muy claro o tonos similares, reservados para la novia. Tampoco ropa informal o jeans.
                            </p>
                        </div>
                    </motion.div>

                    {/* Transporte */}
                    <motion.div className="detail-card glass-panel" variants={itemVariants}>
                        <div className="icon-wrapper">
                            <FaBus className="detail-icon" />
                        </div>
                        <h2 className="script-font detail-title">Transporte</h2>
                        <div className="detail-content">
                            <p className="dress-code-subtext">
                                Para facilitar su llegada y regreso, tendremos la opción de transporte con un punto de encuentro hacia el lugar de la celebración. Si necesitas transporte, por favor indícalo al confirmar tu asistencia.
                            </p>
                            <a href="#rsvp" className="btn btn-outline map-btn">
                                Solicitar Transporte
                            </a>
                        </div>
                    </motion.div>

                    {/* Lluvia de Sobres */}
                    <motion.div className="detail-card glass-panel" variants={itemVariants}>
                        <div className="icon-wrapper">
                            <FaEnvelopeOpenText className="detail-icon" />
                        </div>
                        <h2 className="script-font detail-title">Lluvia de Sobres</h2>
                        <div className="detail-content">
                            <p className="dress-code-subtext">
                                Si desean tener un detalle con nosotros, hemos dispuesto la opción de lluvia de sobres, que podrá realizarse de manera física el día de la boda o mediante transferencia a esta cuenta:
                            </p>
                            <p className="dress-code-text" style={{ marginTop: '0.75rem' }}>
                                Cta. Ahorros Bancolombia
                                <br />
                                34278341307
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Details;
