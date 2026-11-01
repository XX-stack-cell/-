import { _electron as electron } from 'playwright-core';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root=fileURLToPath(new URL('..',import.meta.url));
const profile=await mkdtemp(path.join(tmpdir(),'panwu-grip-review-'));
const expectedPoses={corn:'pinch',gourd:'pinch',hetian:'pinch',walnut:'walnut',zitan:'beads',huanghuali:'beads',jingang:'beads',zijinshu:'beads',sandalwood:'loose',xingyue:'loose',yedi:'loose',olive:'loose'};
const shots=path.join(root,'artifacts','screenshots');
await mkdir(shots,{recursive:true});
const app=await electron.launch({args:[root],env:{...process.env,PANWU_TEST_USER_DATA:profile}});

// Exercise the shipped CSS, rather than reimplementing its keyframes in the test.
async function sampleMotion(page,phase,duration) {
  return page.evaluate(async({phase,duration})=>{
    const scenes=[...document.querySelectorAll('.review-card .hold-scene')];
    for(const scene of scenes) {
      const surface=scene.closest('.widget-surface')||scene.closest('.hero-art-wrap');
      surface.classList.remove('is-auto','is-paused','is-manual','is-stroking');
      surface.classList.add(`is-${phase}`);
      surface.style.setProperty('--hand-x','0px');
      surface.style.setProperty('--hand-y','0px');
      surface.style.setProperty('--hand-angle','0deg');
    }
    await new Promise(resolve=>setTimeout(resolve,150));
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    const started=performance.now();
    const frames=[];
    const capture=()=>({
      elapsed:Math.round(performance.now()-started),
      scenes:scenes.map(scene=>({
        id:scene.dataset.heldItem,
        pose:scene.dataset.pose,
        method:scene.classList.contains('method-glove')?'glove':'bare',
        targets:Object.fromEntries([['thumb','.front-thumb'],['object','.held-object']].map(([name,selector])=>{
          const element=scene.querySelector(selector);
          return [name,{
            transform:getComputedStyle(element).transform,
            animations:element.getAnimations().map(animation=>({
              name:animation.animationName||animation.id||'animation',
              currentTime:typeof animation.currentTime==='number'?animation.currentTime:null,
              progress:animation.effect?.getComputedTiming().progress??null,
              playState:animation.playState,
            })),
          }];
        })),
      })),
    });
    frames.push(capture());
    while(performance.now()-started<duration) {
      await new Promise(resolve=>setTimeout(resolve,250));
      frames.push(capture());
    }
    return {phase,duration:Math.round(performance.now()-started),frames};
  },{phase,duration});
}

function verifyMotion(record,mode) {
  const first=record.frames[0].scenes;
  assert.equal(first.length,24);
  for(let index=0;index<first.length;index++) {
    const {id,method}=first[index];
    for(const target of ['thumb','object']) {
      const samples=record.frames.map(frame=>frame.scenes[index].targets[target]);
      const label=`${mode} ${id}/${method} ${target} ${record.phase}`;
      const transforms=new Set(samples.map(sample=>sample.transform));
      const times=samples.flatMap(sample=>sample.animations.map(animation=>animation.currentTime).filter(time=>time!==null));
      if(record.phase==='auto') {
        assert(samples.some(sample=>sample.animations.some(animation=>animation.playState==='running')),`${label}: a live CSS animation runs`);
        assert(times.length>1&&Math.max(...times)-Math.min(...times)>500,`${label}: animation time advances`);
        assert(transforms.size>2,`${label}: the visible transform changes over four seconds`);
      } else {
        assert.equal(transforms.size,1,`${label}: stationary transforms do not drift`);
        assert(samples.every(sample=>sample.animations.every(animation=>animation.playState!=='running')),`${label}: no CSS animation keeps running`);
        // Pausing and cancelling the animation are both valid stationary states.
        assert(times.length===0||Math.max(...times)-Math.min(...times)<1,`${label}: paused animation time is stable`);
      }
    }
  }
}

try {
  await app.firstWindow();
  await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows().forEach(window=>window.hide()));
  for(const mode of ['dashboard','widget']) {
    const url=`panwu://app/artifacts/grip-review.html?mode=${mode}`;
    await app.evaluate(async({BrowserWindow},{url})=>{
      const review=new BrowserWindow({show:false,width:1400,height:1100,transparent:true,frame:false,backgroundColor:'#00000000',webPreferences:{sandbox:true,contextIsolation:true,nodeIntegration:false,backgroundThrottling:false}});
      await review.loadURL(url);
    },{url});
    const page=app.windows().find(w=>w.url()===url);
    assert(page);
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.waitForFunction(()=>document.querySelectorAll('.review-card').length===24);
    await page.evaluate(async()=>{await Promise.all([...document.images].map(img=>img.decode()));await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
    const entries=await page.locator('.review-card .hold-scene').evaluateAll(scenes=>scenes.map(scene=>{
      const object=scene.querySelector('.held-object'),hand=scene.querySelector('.hand-back');
      return {
        id:scene.dataset.heldItem,
        pose:scene.dataset.pose,
        method:scene.classList.contains('method-glove')?'glove':'bare',
        handSource:hand.querySelector('img').getAttribute('src'),
        width:object.offsetWidth,
        height:object.offsetHeight,
        objectToHandWidthRatio:+(object.offsetWidth/hand.offsetWidth).toFixed(3),
        objectToHandHeightRatio:+(object.offsetHeight/hand.offsetHeight).toFixed(3),
        foregroundLayers:scene.querySelectorAll('.hand-front').length,
        fingers:scene.querySelectorAll('.front-fingers').length,
        thumbs:scene.querySelectorAll('.front-thumb').length,
        photoDecoded:scene.querySelector('.object-photo').complete&&scene.querySelector('.object-photo').naturalWidth>0,
        handsDecoded:[...scene.querySelectorAll('.interaction-hand img,.hand-front img')].every(image=>image.complete&&image.naturalWidth>0),
      };
    }));
    assert.equal(entries.length,24);
    assert.deepEqual([...new Set(entries.map(entry=>entry.pose))].sort(),['beads','loose','pinch','walnut']);
    for(const entry of entries) {
      const label=`${mode} ${entry.id}/${entry.method}`;
      assert.equal(entry.pose,expectedPoses[entry.id],`${label}: the material uses its reference pose`);
      assert.equal(entry.handSource,`./assets/interactions/reference-${entry.pose}-${entry.method}.png`,`${label}: correct pose asset`);
      assert(entry.foregroundLayers===2&&entry.fingers===1&&entry.thumbs===1,`${label}: two foreground occlusion layers`);
      assert(entry.photoDecoded&&entry.handsDecoded,`${label}: all object and hand images decode`);
      assert(entry.width>=155&&entry.width<=230&&entry.height>=180&&entry.height<=330,`${label}: portrait object dimensions (${entry.width}×${entry.height})`);
      assert(entry.objectToHandWidthRatio>=.48&&entry.objectToHandWidthRatio<=.72&&entry.objectToHandHeightRatio>=.56&&entry.objectToHandHeightRatio<=1.04,`${label}: object scale relative to the hand canvas`);
    }
    await page.screenshot({path:path.join(shots,`grip-review-${mode}.png`),fullPage:true,omitBackground:true});

    await writeFile(path.join(root,'artifacts',`grip-review-${mode}.json`),JSON.stringify(entries,null,2));
    const motion=[];
    for(const [phase,duration] of [['auto',4000],['paused',1000],['manual',1000]]) {
      const record=await sampleMotion(page,phase,duration);
      motion.push(record);
      verifyMotion(record,mode);
    }
    await writeFile(path.join(root,'artifacts',`grip-motion-${mode}.json`),JSON.stringify(motion,null,2));
    console.log(`PASS ${mode}: 24 decoded reference-pose compositions, portrait sizing, two foreground layers; thumb/object move over four seconds and stay still when paused/manual; visual matrix and motion samples saved`);
  }
}finally{await app.close();await rm(profile,{recursive:true,force:true});}
