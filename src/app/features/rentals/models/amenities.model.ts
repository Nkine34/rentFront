export interface Amenities {
  // Équipements courants
  wifi?: boolean;
  tv?: boolean;
  kitchen?: boolean;
  washingMachine?: boolean;
  freeParking?: boolean;
  paidParking?: boolean;
  airConditioning?: boolean;
  dedicatedWorkspace?: boolean;

  // Équipements hors du commun
  pool?: boolean;
  hotTub?: boolean;
  patio?: boolean;
  bbqGrill?: boolean;
  outdoorDining?: boolean;
  firePit?: boolean;
  poolTable?: boolean;
  fireplace?: boolean;
  piano?: boolean;
  exerciseEquipment?: boolean;
  lakeAccess?: boolean;
  beachAccess?: boolean;
  skiInOut?: boolean;
  outdoorShower?: boolean;

  // Équipements de sécurité
  smokeAlarm?: boolean;
  firstAidKit?: boolean;
  fireExtinguisher?: boolean;
  carbonMonoxideAlarm?: boolean;
}
