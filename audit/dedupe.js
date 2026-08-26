const fs=require('fs');
const urls=fs.readFileSync('C:/Dev/nexcore-site/audit/asset-urls.txt','utf8').split('\n').map(s=>s.trim()).filter(Boolean);
const groups={};
for(const u of urls){
  const file=u.split('/').pop();
  const ext=file.slice(file.lastIndexOf('.'));
  let base=file.slice(0,file.lastIndexOf('.'));
  const isOrig=/_orig$/.test(base);
  base=base.replace(/_orig$/,'');
  const key=base.toLowerCase()+ext.toLowerCase();
  if(!groups[key]) groups[key]={orig:null,alt:null,base,ext};
  if(isOrig) groups[key].orig=u; else groups[key].alt=u;
}
const clean=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').replace(/-+/g,'-');
const out=[];const names=new Set();
for(const k of Object.keys(groups).sort()){
  const g=groups[k];
  const url=g.orig||g.alt;
  let name=clean(g.base)+g.ext.toLowerCase().replace('.jpeg','.jpg');
  let n=name,i=2;
  while(names.has(n)){const d=name.lastIndexOf('.');n=name.slice(0,d)+'-'+(i++)+name.slice(d);}
  names.add(n);
  out.push({url,clean:n,hadOrig:!!g.orig,hadAlt:!!g.alt});
}
fs.writeFileSync('C:/Dev/nexcore-site/audit/asset-plan.json',JSON.stringify(out,null,2));
console.log('unique assets: '+out.length+'  (from '+urls.length+' urls)');
console.log('with _orig: '+out.filter(o=>o.hadOrig).length);
