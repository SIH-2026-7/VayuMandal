import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let playwright;try{playwright=require('playwright')}catch{playwright=require('C:/Users/SHREE SAI/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')}
const browser=await playwright.chromium.launch({headless:true,channel:'msedge'});
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});await page.screenshot({path:'artifacts/landing-desktop.png',fullPage:true});assert.equal(await page.locator('h1').count(),1);
await page.getByRole('link',{name:'Explore the live demo'}).click();await page.waitForURL('**/dashboard');await page.getByText('Scenario ready').waitFor();await page.waitForTimeout(1200);await page.screenshot({path:'artifacts/dashboard-desktop.png',fullPage:true});
await Promise.all([page.waitForResponse(r=>r.url().includes('/api/forecast?scenario=heatwave')),page.getByLabel('Weather scenario').selectOption('heatwave')]);await page.getByRole('heading',{name:'North India heatwave',exact:true}).waitFor();
await Promise.all([page.waitForResponse(r=>r.url().includes('day=10')),page.getByRole('button',{name:'DAY 10 +240h',exact:true}).click()]);await page.waitForTimeout(200);
await page.getByRole('tab',{name:'Downscaling lab'}).click();await page.getByRole('heading',{name:'What gets lost when we average?'}).waitFor();await page.screenshot({path:'artifacts/downscaling-desktop.png',fullPage:true});
await page.getByRole('tab',{name:'Spatial alerts'}).click();const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Export GeoJSON'}).click();assert.ok((await downloadPromise).suggestedFilename().endsWith('.geojson'));
await page.getByRole('button',{name:'Mark reviewed'}).click();await page.getByRole('button',{name:'Reviewed',exact:true}).waitFor();
await page.reload({waitUntil:'networkidle'});await page.getByRole('tab',{name:'Methodology'}).click();await page.getByRole('heading',{name:'Science you can inspect'}).waitFor();
await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'artifacts/landing-mobile.png',fullPage:true});
await page.goto('http://127.0.0.1:5173/dashboard',{waitUntil:'networkidle'});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'artifacts/dashboard-mobile.png',fullPage:true});
const api=await page.request.get('http://127.0.0.1:5173/api/forecast?day=11');assert.equal(api.status(),400);assert.deepEqual(errors,[]);console.log('PASS: navigation, scenarios, timeline, tabs, export, review, API validation, desktop/mobile, no browser errors.');await browser.close();

