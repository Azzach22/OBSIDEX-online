export type Person = {
 id:string; name:string; type:'Élève'|'Professeur'; rank?:number; power?:string; className?:string;
 initials?:string; glow?:string; summary?:string; relations?:string[]; public?:string; age?:string;
 nationality?:string; club?:string; personality?:string[]; np?:string; subject?:string; function?:string;
 secondary?:string; detailed?:boolean; cardX?:number; cardY?:number; cardZoom?:number; cardFit?:string;
 cardImage?:string; profileImage?:string; gallery?:string[]; [key:string]:unknown;
};
