import {useMemo,useState,type FormEvent} from 'react';
import {calculateRanking,type RankingState} from './ranking';
import {Trophy, Swords, Save, Plus, X, PencilLine} from 'lucide-react';
type Props={state:RankingState;onChange:(s:RankingState)=>void};
export default function AdminRanking({state,onChange}:Props){
 const [tab,setTab]=useState<'combats'|'points'>('combats');
 const [winner,setWinner]=useState('');const [loser,setLoser]=useState('');const [error,setError]=useState('');
 const [edits,setEdits]=useState<Record<string,string>>({});const [adjustments,setAdjustments]=useState<Record<string,string>>({});
 const calculated=useMemo(()=>calculateRanking(state),[state]);
 const names=useMemo(()=>state.base.map(p=>p.name).sort((a,b)=>a.localeCompare(b,'fr')),[state.base]);
 function addFight(e:FormEvent){e.preventDefault();setError('');if(!winner||!loser||winner===loser){setError('Choisis deux combattants différents.');return;}if(state.fights.some(f=>f.winner===winner&&f.loser===loser&&false))return;onChange({...state,fights:[...state.fights,{id:`fight-${Date.now()}`,winner,loser,date:new Date().toISOString()}]});setWinner('');setLoser('');}
 function savePoints(){const base=state.base.map(p=>({...p,basePrestige:edits[p.name]!==undefined&&edits[p.name].trim()!==''?Number(edits[p.name]):p.basePrestige,manualAdjustment:adjustments[p.name]!==undefined&&adjustments[p.name].trim()!==''?Number(adjustments[p.name]):p.manualAdjustment}));if(base.some(p=>!Number.isFinite(p.basePrestige)||!Number.isFinite(p.manualAdjustment))){setError('Une valeur de prestige est invalide.');return;}onChange({...state,base});setEdits({});setAdjustments({});setError('');}
 return <section className="admin-ranking">
  <div className="admin-heading"><div><span className="eyebrow">CONSOLE PRIVÉE</span><h2>Gestion du Power Ranking</h2></div><div className="admin-tabs"><button className={tab==='combats'?'active':''} onClick={()=>setTab('combats')}><Swords size={15}/> Combats</button><button className={tab==='points'?'active':''} onClick={()=>setTab('points')}><PencilLine size={15}/> Prestige</button></div></div>
  {tab==='combats'?<>
   <form className="fight-form" onSubmit={addFight}><div className="form-title"><Swords size={17}/> Enregistrer un combat</div><label>Vainqueur<select value={winner} onChange={e=>setWinner(e.target.value)} required><option value="">Sélectionner…</option>{names.filter(n=>n!==loser).map(n=><option key={n}>{n}</option>)}</select></label><span className="versus">VS</span><label>Perdant<select value={loser} onChange={e=>setLoser(e.target.value)} required><option value="">Sélectionner…</option>{names.filter(n=>n!==winner).map(n=><option key={n}>{n}</option>)}</select></label><button className="save-fight" type="submit"><Plus size={16}/> Ajouter le combat</button></form>
   {error&&<p className="admin-error">{error}</p>}
   <div className="table-heading"><h3>Historique des combats</h3><span>{state.fights.length} COMBATS ENREGISTRÉS</span></div>
   <div className="table-scroll"><table className="admin-table"><thead><tr><th>#</th><th>Vainqueur</th><th>Pts avant</th><th>Gain</th><th>Perdant</th><th>Pts avant</th><th>Perte</th><th></th></tr></thead><tbody>{calculated.results.map(r=><tr key={r.fight.id}><td>{r.number}</td><td className="winner-name">{r.fight.winner}</td><td>{r.winnerBefore}</td><td className="positive">+{r.winnerGain}</td><td>{r.fight.loser}</td><td>{r.loserBefore}</td><td className="negative">{r.loserLoss}</td><td><button className="icon-action" title="Supprimer ce combat" onClick={()=>onChange({...state,fights:state.fights.filter(f=>f.id!==r.fight.id)})}><X size={14}/></button></td></tr>)}</tbody></table></div>
   <p className="admin-note">Les résultats sont recalculés dans l'ordre chronologique. Supprimer un combat recalcule automatiquement tous les suivants.</p>
  </>:<>
   <div className="table-heading"><h3>Prestige et ajustements modifiables</h3><span>{state.base.length} PERSONNAGES</span></div>
   <div className="table-scroll"><table className="admin-table"><thead><tr><th>Personnage</th><th>Prestige initial</th><th>Ajustement manuel</th><th>Total actuel</th></tr></thead><tbody>{calculated.rows.map(row=><tr key={row.name}><td>{row.name}</td><td><input className="points-input" type="number" value={edits[row.name]??String(row.basePrestige)} onChange={e=>setEdits(old=>({...old,[row.name]:e.target.value}))}/></td><td><input className="points-input" type="number" value={adjustments[row.name]??String(row.manualAdjustment)} onChange={e=>setAdjustments(old=>({...old,[row.name]:e.target.value}))}/></td><td><strong>{row.total}</strong></td></tr>)}</tbody></table></div><div className="admin-save-row"><p className="admin-note">Modifier le prestige initial recalcule tous les combats suivants. Les résultats déjà saisis restent dans l'historique.</p><button className="save-fight" onClick={savePoints}><Save size={15}/> Enregistrer les prestiges</button></div>
  </>}
 </section>
}
