import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let pw;try{pw=require('playwright')}catch{pw=require('C:/Users/SHREE SAI/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')}
const browser=await pw.chromium.launch({headless:true,channel:'msedge'});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
try{
await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});
await page.locator('#chapter-1').scrollIntoViewIfNeeded();
await page.waitForFunction(()=>document.querySelector('.chapter-switch a[aria-current]')?.textContent.includes('Evaluate'));
await page.getByRole('button',{name:'02 Heatwave'}).click();
await page.locator('#preview-day').fill('8');
assert.match(await page.locator('.experiment-readout').innerText(),/Day 8/);
await page.getByRole('link',{name:'Investigate this scenario'}).click();
await page.waitForFunction(()=>document.querySelector('#scenario')?.value==='heatwave' && document.querySelector('.timeline button.active')?.textContent.includes('8'));
await page.getByRole('button',{name:/Inspect day 4,/}).click();
await page.waitForFunction(()=>document.querySelector('.timeline button.active')?.textContent.includes('4'));
assert.equal(await page.locator('.ensemble-plot circle').count(),24);
await page.getByLabel('Ensemble members').selectOption('48');
await page.waitForFunction(()=>document.querySelectorAll('.ensemble-plot circle').length===48);
for(const width of [360,390,768,1024,1440]){
await page.setViewportSize({width,height:900});
for(const route of ['/','/dashboard']){
await page.goto('http://127.0.0.1:5173'+route,{waitUntil:'networkidle'});
assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow at ${width} on ${route}`);
}
}
await page.emulateMedia({reducedMotion:'reduce'});
await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});
assert.equal(await page.locator('.scroll-invitation svg').evaluate(e=>getComputedStyle(e).animationName),'none');
await page.getByRole('button',{name:'03 What does a 5 km output mean?'}).click();
await page.locator('#answer-2').waitFor({state:'visible'});
console.log('PASS: scroll chapters, preview handoff, evidence-day navigation, ensemble updates, five responsive widths, reduced motion, research accordion.');
}finally{await browser.close()}
