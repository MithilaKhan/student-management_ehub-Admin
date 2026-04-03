export enum Level {
  OLEVEL = "O'LEVEL",
  ALEVEL = "A'LEVEL",
  PRELEVEL = "PRELEVEL",
  UNDERGRADUATE = "UNDERGRADUATE",
  POSTGRADUATE = "POSTGRADUATE",
  PHD = "PHD",
}

export interface SubjectListType {
  id: number;
  subjectName: string;
  subjectDetails: string;
  status: string;
}[] 

export interface modalType {
  isOpen ?: boolean;
  setIsOpen: (value: boolean) => void;
}