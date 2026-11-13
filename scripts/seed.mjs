import { createClient } from '@supabase/supabase-js';
import { readFile } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const url=process.env.SUPABASE_URL||process.env.VITE_SUPABASE_URL;
const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
if(!url||!key){console.error('Définis SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans ton terminal.');process.exit(1)}
const client=createClient(url,key,{auth:{persistSession:false}});
const {people}=JSON.parse(await readFile(join(root,'src/seed-data.json'),'utf8'));
for(const p of people){
 const {error}=await client.from('people').upsert({id:p.id,rank:p.rank??null,type:p.type,name:p.name,data:p,updated_at:new Date().toISOString()},{onConflict:'id'});
 if(error){console.error(`Erreur ${p.id} ${p.name}:`,error.message);process.exit(1)}
}
const ranking=JSON.parse(await readFile(join(root,'src/data/ranking-seed.json'),'utf8'));
const {error:rankingError}=await client.from('ranking_state').upsert({id:'main',state:{base:ranking.base,fights:ranking.fights},updated_at:new Date().toISOString()},{onConflict:'id'});
if(rankingError){console.error('Erreur import Power Ranking:',rankingError.message);process.exit(1)}
console.log(`${people.length} dossiers et ${ranking.base.length} prestiges / ${ranking.fights.length} combats importés dans Supabase.`);
