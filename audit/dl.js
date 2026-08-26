const fs=require('fs'),{execFileSync}=require('child_process');
const plan=JSON.parse(fs.readFileSync('C:/Dev/nexcore-site/audit/asset-plan.json','utf8'));
const DIR='C:/Dev/nexcore-site/audit/assets/';
fs.mkdirSync(DIR,{recursive:true});
let ok=0,fail=[];
plan.forEach((o,i)=>{
  const dest=DIR+o.clean;
  if(fs.existsSync(dest)&&fs.statSync(dest).size>0){ok++;o.bytes=fs.statSync(dest).size;return;}
  try{
    execFileSync('curl',['-sfL','--max-time','60','-A','Mozilla/5.0',o.url,'-o',dest],{stdio:'pipe'});
    const sz=fs.statSync(dest).size;
    if(sz>0){ok++;o.bytes=sz;} else {fail.push(o.url);fs.unlinkSync(dest);}
  }catch(e){fail.push(o.url); try{fs.unlinkSync(dest)}catch(_){}}
  if((i+1)%50===0)console.log('  ...'+(i+1)+'/'+plan.length);
});
fs.writeFileSync('C:/Dev/nexcore-site/audit/asset-plan.json',JSON.stringify(plan,null,2));
console.log('DOWNLOADED: '+ok+'/'+plan.length);
if(fail.length){console.log('FAILED ('+fail.length+'):');fail.forEach(f=>console.log('  '+f));}
