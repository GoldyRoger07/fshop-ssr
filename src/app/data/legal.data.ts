/**
 * Identité légale de l'éditeur du site (page Mentions légales, CGV).
 * À compléter : une valeur null s'affiche « Non renseigné ».
 */
export interface LegalInfo {
  /** Raison sociale ou nom de l'entrepreneur. */
  companyName: string | null;
  /** Forme juridique (SA, SARL, entreprise individuelle…). */
  legalForm: string | null;
  address: string | null;
  /** Numéro d'immatriculation / d'identification fiscale (NIF). */
  registrationNumber: string | null;
  phone: string | null;
  /** Directeur de la publication. */
  publisher: string | null;
  /** Hébergeur du site : nom et adresse. */
  hostName: string | null;
  hostAddress: string | null;
}

export const LEGAL_INFO: LegalInfo = {
  companyName: null,
  legalForm: null,
  address: null,
  registrationNumber: null,
  phone: null,
  publisher: null,
  hostName: null,
  hostAddress: null,
};
