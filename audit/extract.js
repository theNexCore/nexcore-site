const fs=require('fs'),path=require('path');
const RAW='C:/Dev/nexcore-site/audit/raw';
const OUT='C:/Dev/nexcore-site/audit/extracted';
fs.mkdirSync(OUT,{recursive:true});

const decode=s=>s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<')
 .replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;|&rsquo;/g,"'")
 .replace(/&ldquo;|&rdquo;/g,'"').replace(/&mdash;/g,'—').replace(/&ndash;/g,'–')
 .replace(/&hellip;/g,'…').replace(/&#(\d+);/g,(m,d)=>String.fromCharCode(d));

// grab balanced div starting at index of '<div'
function balanced(html,start){
  let i=start,depth=0;
  const re=/<\/?div\b[^>]*>/gi; re.lastIndex=start;
  let m;
  while((m=re.exec(html))){
    if(m[0][1]==='/') depth--; else depth++;
    if(depth===0) return html.slice(start,m.index+m[0].length);
  }
  return html.slice(start);
}

const files=fs.readdirSync(RAW).filter(f=>f.endsWith('.html'));
const report={};
for(const f of files){
  const slug=f.replace(/\.html$/,'');
  const html=fs.readFileSync(path.join(RAW,f),'utf8');
  const title=(html.match(/<title>([^<]*)<\/title>/)||[])[1]||'';

  // content region
  const ci=html.indexOf('<div id="wsite-content"');
  const content= ci>=0? balanced(html,ci) : '';

  // custom html embeds
  const embeds=[];
  const er=/<div[^>]*class="wcustomhtml"[^>]*>/gi; let em;
  while((em=er.exec(content))){ embeds.push(balanced(content,em.index)); }

  // headings from content
  const heads=[...content.matchAll(/<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi)]
    .map(m=>({tag:m[1].toLowerCase(),text:decode(m[2].replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim()}))
    .filter(h=>h.text);

  // text: strip style/script then tags
  const stripped=content.replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<script[\s\S]*?<\/script>/gi,'');
  const text=decode(stripped.replace(/<(br|\/p|\/div|\/li|\/h[1-6]|\/tr)>/gi,'\n').replace(/<[^>]+>/g,' '))
    .split('\n').map(l=>l.replace(/\s+/g,' ').trim()).filter(Boolean).join('\n');

  // links
  const links=[...content.matchAll(/href="([^"]+)"/gi)].map(m=>decode(m[1]));
  // images
  const imgs=[...content.matchAll(/(?:src|data-src)="([^"]+)"/gi)].map(m=>decode(m[1]));
  const bgs=[...content.matchAll(/url\((['"]?)([^)'"]+)\1\)/gi)].map(m=>decode(m[2]));
  const srcsets=[...content.matchAll(/srcset="([^"]+)"/gi)].flatMap(m=>decode(m[1]).split(',').map(s=>s.trim().split(/\s+/)[0]));

  fs.writeFileSync(path.join(OUT,slug+'.txt'),
    `URL: https://www.thenexcore.com/${slug}.html\nTITLE: ${title}\n\n=== HEADINGS ===\n`+
    heads.map(h=>`${h.tag.toUpperCase()}: ${h.text}`).join('\n')+
    `\n\n=== TEXT ===\n${text}\n`);
  fs.writeFileSync(path.join(OUT,slug+'.embeds.html'),embeds.join('\n\n<!-- ===== NEXT EMBED ===== -->\n\n'));

  report[slug]={title,embeds:embeds.length,headings:heads.length,textLen:text.length,
    links:[...new Set(links)],imgs:[...new Set([...imgs,...bgs,...srcsets])]};
}
fs.writeFileSync('C:/Dev/nexcore-site/audit/report.json',JSON.stringify(report,null,2));
for(const [k,v] of Object.entries(report))
  console.log(`${k.padEnd(24)} embeds=${String(v.embeds).padStart(2)} h=${String(v.headings).padStart(3)} text=${String(v.textLen).padStart(6)} links=${String(v.links.length).padStart(3)} imgs=${v.imgs.length}`);
