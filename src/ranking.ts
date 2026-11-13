import seed from './data/ranking-seed.json';
export type PrestigeEntry={name:string;basePrestige:number;manualAdjustment:number};
export type Fight={id:string;winner:string;loser:string;date:string|null};
export type RankingState={base:PrestigeEntry[];fights:Fight[]};
export type FightResult={fight:Fight;winnerBefore:number;loserBefore:number;winnerGain:number;loserLoss:number;winnerAfter:number;loserAfter:number;number:number};
export const initialRankingState:RankingState=seed as RankingState;
const roundExcel=(n:number)=>Math.floor(n+0.5);
const aliases:Record<string,string>={'Tav21 Wraith':'Tav21 Vraith'};
const canonical=(name:string)=>aliases[name]??name; // Excel ROUND for positive values used by this workbook
export function calculateRanking(state:RankingState){
 const totals=new Map(state.base.map(p=>[canonical(p.name),p.basePrestige+p.manualAdjustment]));
 const results:FightResult[]=[];
 state.fights.forEach((fight,index)=>{
  const winnerName=canonical(fight.winner),loserName=canonical(fight.loser);
  const winnerBefore=totals.get(winnerName); const loserBefore=totals.get(loserName);
  if(winnerBefore===undefined||loserBefore===undefined) return;
  // Exact progression found in the workbook's Combats formulas: rows 2-9, 10-12, then 13+.
  const underdogWon=loserBefore>winnerBefore;
  const bonus=index<11?20:30;
  const lossRate=index<8?0.3:0.4;
  const winnerGain=underdogWon?roundExcel(bonus+(loserBefore-winnerBefore)*0.4):Math.max(3,roundExcel(15-(winnerBefore-loserBefore)*0.02));
  const loserLoss=underdogWon?-roundExcel(winnerGain*lossRate):-Math.max(4,roundExcel(loserBefore*0.01));
  const winnerAfter=winnerBefore+winnerGain,loserAfter=loserBefore+loserLoss;
  totals.set(winnerName,winnerAfter);totals.set(loserName,loserAfter);
  results.push({fight,winnerBefore,loserBefore,winnerGain,loserLoss,winnerAfter,loserAfter,number:index+1});
 });
 const rows=state.base.map(p=>({name:p.name,basePrestige:p.basePrestige,manualAdjustment:p.manualAdjustment,total:totals.get(canonical(p.name))??p.basePrestige+p.manualAdjustment})).sort((a,b)=>b.total-a.total||a.name.localeCompare(b.name,'fr'));
 return {rows,results,totals};
}
export function recalculateFightHistory(state:RankingState){return calculateRanking(state).results;}
