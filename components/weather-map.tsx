'use client';
import {useEffect,useState,useId} from 'react';
type Feature={geometry:{type:'Polygon';coordinates:number[][][]}|{type:'MultiPolygon';coordinates:number[][][][]}};
type Props={day?:number;scenario?:string;hero?:boolean;layer?:string;zoom?:number;onSelect?:(lat:number,lon:number)=>void};
export default function WeatherMap({day=5,scenario='cyclone',hero=false,layer='intensity',zoom=1,onSelect}:Props){
 const id=useId().replace(/:/g,''); const gridId=`grid-${id}`,stormId=`storm-${id}`;
 const [features,setFeatures]=useState<Feature[]>([]);const [failed,setFailed]=useState(false);
 useEffect(()=>{fetch('/data/world.geojson').then(r=>{if(!r.ok)throw Error();return r.json() as Promise<{features:Feature[]}>}).then(d=>setFeatures(d.features)).catch(()=>setFailed(true))},[]);
 const project=(lon:number,lat:number)=>[440+(lon-81)*15*zoom,300-(lat-22)*15*zoom];
 const path=(ring:number[][])=>ring.map((p,i)=>`${i?'L':'M'}${project(p[0],p[1]).map(n=>n.toFixed(1)).join(',')}`).join(' ')+'Z';
 const center=scenario==='heatwave'?[75+(day-3)*.24,28+(day-3)*.1]:scenario==='coldwave'?[78-(day-3)*.2,33-(day-3)*.15]:[86+(day-3)*.48,15+(day-3)*1.1];
 const [cx,cy]=project(center[0],center[1]); const color=scenario==='coldwave'?'#67befe':scenario==='heatwave'?'#ffb14e':'#c6ee76';
 const cities=[['New Delhi',77.2,28.6],['Mumbai',72.87,19.07],['Kolkata',88.36,22.57],['Chennai',80.27,13.08],['Bengaluru',77.59,12.97]] as const;
 return <div className={'weather-map '+(hero?'hero-map':'')}><svg viewBox="0 0 880 620" role="img" aria-label={`${scenario} synthetic forecast map for day ${day}`} onClick={e=>{if(!onSelect)return;const p=e.currentTarget.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const m=e.currentTarget.getScreenCTM();if(m){const q=p.matrixTransform(m.inverse());onSelect(22-(q.y-300)/(15*zoom),81+(q.x-440)/(15*zoom))}}}>
 <defs><pattern id={gridId} width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="#719399" strokeWidth=".5" opacity=".18"/></pattern><radialGradient id={stormId}><stop stopColor={color} stopOpacity=".66"/><stop offset=".35" stopColor={color} stopOpacity=".35"/><stop offset="1" stopColor={color} stopOpacity="0"/></radialGradient></defs>
 <rect width="880" height="620" fill="#0a1b24"/><rect width="880" height="620" fill={`url(#${gridId})`}/>
 <g fill="#192e37" stroke="#44616a" strokeWidth=".8">{features.map((f,i)=>{const polys=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.type==='MultiPolygon'?f.geometry.coordinates:[];return <path key={i} d={polys.map(p=>p.map(path).join(' ')).join(' ')} />})}</g>
 <g fill="#6b858c" fontSize="13" letterSpacing="3"><text x="390" y="218">INDIA</text><text x="629" y="172">BANGLADESH</text><text x="195" y="360" transform="rotate(-15 195 360)">ARABIAN SEA</text><text x="570" y="425">BAY OF BENGAL</text></g>
 {layer!=='trajectory'&&<g><ellipse cx={cx} cy={cy} rx={scenario==='cyclone'?115:155} ry={scenario==='cyclone'?155:90} fill={`url(#${stormId})`} transform={`rotate(25 ${cx} ${cy})`}/>{[1,2,3,4].map(k=><ellipse key={k} cx={cx} cy={cy} rx={k*25*zoom} ry={k*(scenario==='cyclone'?32:18)*zoom} fill="none" stroke={color} strokeOpacity={.7-k*.11} strokeWidth="1" transform={`rotate(25 ${cx} ${cy})`}/>)}</g>}
 <path d={Array.from({length:8},(_,i)=>{const lon=scenario==='cyclone'?86+i*.48:scenario==='heatwave'?75+i*.24:78-i*.2;const lat=scenario==='cyclone'?15+i*1.1:scenario==='heatwave'?28+i*.1:33-i*.15;return `${i?'L':'M'}${project(lon,lat).join(',')}`}).join(' ')} fill="none" stroke={color} strokeWidth="2" strokeDasharray="5 7"/>
 {layer==='ensemble'&&Array.from({length:12},(_,i)=><path key={i} d={`M${project(center[0]-1,center[1]-3).join(',')} Q${cx+(i-6)*7},${cy} ${cx+(i-6)*15},${cy-80}`} stroke={color} opacity=".25" fill="none"/>)}
 <circle cx={cx} cy={cy} r="7" fill={color}/><circle cx={cx} cy={cy} r="13" fill="none" stroke={color}/>
 {cities.map(([n,lon,lat])=>{const [x,y]=project(lon,lat);return <g key={n}><circle cx={x} cy={y} r="2.5" fill="#b1c3c7"/><text x={x+9} y={y+4} fill="#acbfc4" fontSize="12">{n}</text></g>})}
 <g transform={`translate(${cx+25},${cy-55})`}><rect width="166" height="48" rx="6" fill="#0b2029" stroke="#49604d"/><text x="12" y="20" fill={color} fontSize="11" letterSpacing="1">{scenario.toUpperCase()} · DAY {day}</text><text x="12" y="36" fill="#aabec4" fontSize="10">{center[1].toFixed(2)}° N / {center[0].toFixed(2)}° E</text></g>
 <text x="24" y="598" fill="#739099" fontSize="10">NATURAL EARTH · SYNTHETIC SCENARIO · EQUIRECTANGULAR</text>
 </svg>{failed&&<p className="map-error">Map boundaries unavailable. Scenario coordinates remain available.</p>}</div>
}

