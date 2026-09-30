import {readFile} from 'node:fs/promises';
import ts from 'typescript';
import assert from 'node:assert/strict';
const code=ts.transpile((await readFile(new URL('../lib/weather-engine.ts',import.meta.url),'utf8')),{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022});
const {simulate,validateConfig,efi,alertGeoJSON,haversine}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
for(const scenario of ['cyclone','heatwave','coldwave'])for(const day of [3,5,10]){const c=validateConfig({scenario,day}),f=simulate(c);assert.deepEqual(f,simulate(c));assert.ok(Math.abs(f.efi)<=1);assert.ok(f.probability>=0&&f.probability<=1);assert.ok(f.p10<=f.median&&f.median<=f.p90);assert.equal(f.grid.fine.length,25);assert.equal(f.tracks.length,8);assert.equal(f.ensemble.length,24);const geo=alertGeoJSON(f),ring=geo.features[1].geometry.coordinates[0];assert.equal(ring.length,65);for(const [lon,lat] of ring)assert.ok(Math.abs(haversine(f.centroid,{lat,lon})-5)<.00001);if(scenario==='coldwave')assert.ok(f.efi<0);else assert.ok(f.efi>0)}
for(const input of [{scenario:'unknown'},{day:2},{day:11},{day:3.5},{members:0},{seed:NaN},{scenario:'constructor'},{scenario:'__proto__'}])assert.throws(()=>validateConfig(input));
const climate=Array.from({length:100},(_,i)=>i);assert.ok(Math.abs(efi(climate,climate))<.02);assert.ok(efi([150,151],climate)>.9);assert.ok(efi([-50,-51],climate)<-.9);
console.log('PASS: 9 deterministic scenarios, numerical EFI, quantiles, 5 km geodesic polygons, validation boundaries.');
