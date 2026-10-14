(function(){
'use strict';
/* ---------- helpers ---------- */
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,9);
const num=v=>{const n=parseFloat(String(v==null?'':v).replace(/[^0-9.\-]/g,''));return isNaN(n)?0:n};
const PHP=n=>'₱'+Math.round(n||0).toLocaleString('en-PH');
const fmtNum=n=>n?Number(n).toLocaleString('en-PH'):'';
const sum=(a,f)=>a.reduce((s,x)=>s+(+f(x)||0),0);
const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const parse=s=>{if(!s)return null;const p=s.split('-').map(Number);return new Date(p[0],p[1]-1,p[2])};
const addDays=(s,n)=>{const d=parse(s);d.setDate(d.getDate()+n);return iso(d)};
const todayISO=()=>iso(new Date());
const diffDays=(a,b)=>Math.round((parse(a)-parse(b))/864e5);
const fmtDate=(s,o)=>s?parse(s).toLocaleDateString('en-PH',o||{month:'short',day:'numeric'}):'';
const fmtTime=t=>{if(!t)return '';const p=t.split(':').map(Number);const h=p[0]%12||12;return h+':'+String(p[1]).padStart(2,'0')+' '+(p[0]<12?'AM':'PM')};
const ink=hex=>{const h=(hex||'#888888').replace('#','');const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);return (0.299*r+0.587*g+0.114*b)>150?'#13261B':'#FFFFFF'};
const getPath=k=>k.split('.').reduce((o,p)=>o==null?o:o[p],state_());
let STATE=null;function state_(){return STATE}

/* ---------- constants ---------- */
const CATS=['Venue & Food','Attire & Beauty','Photo & Video','Flowers & Decor','Music & Program','Invites & Guests','Legal & Church','Honeymoon & Misc'];
const catCol=c=>'var(--c'+(Math.max(0,CATS.indexOf(c))+1)+')';
const SIDES=['Bride','Groom','Both'],GROUPS=['Family','Friends','Work','Entourage','Sponsor','Other'];
const RSVP=['Pending','Yes','No'],MEALS=['TBD','Beef','Chicken','Fish','Vegetarian','Kids'];
const TSTAT=['To do','Doing','Done'],PRI=['High','Med','Low'];
const VSTAT=['Shortlisted','Visited','Booked','Passed'];
const VTYPE=['Garden','Hotel ballroom','Hall','Beach or resort','Farm or estate','Restaurant','Other'];
const VCATER=['In-house only','Outside allowed (fee)','Outside allowed'],RAIN=['Indoor option','Tent included','None'];
const VCAT=['Photo & video','Catering','Florals & styling','Hair & makeup','Music & host','Cake','Coordinator','Invitations','Gowns & suits','Transport','Other'];
const NEED=['Photo & video','Catering','Florals & styling','Hair & makeup','Music & host','Cake','Coordinator','Invitations'];
const QSTAT=['Inquiry','Quoted','Shortlisted','Booked','Declined'];
const OSTAT=['To order','Ordered','In fitting','Altering','Ready','Collected'];
const MOMENTS=['Guest arrival','Processional','Ceremony','Recessional','Cocktail hour','Grand entrance','First dance','Parent dances','Dinner','Cake cutting','Bouquet toss','Party set','Last dance'];
const PSTAT=['Locked','Considering','Request'];
const SHOTG=['Getting ready','Details','First look','Ceremony','Family','Bridal party','Couple portraits','Reception'];
const EVTYPES=['Appointment','Fitting','Tasting','Meeting','Other'];
const KIND={task:'Task due',pay:'Payment due',event:'Appointment',wedding:'Wedding day',rsvp:'RSVP deadline'};

/* ---------- seed (starting template; every cell is editable) ---------- */
const W='2027-06-26';
function seed(){
  const d=n=>addDays(W,n);
  const B=(cat,item,vendor,est,actual,paid,due)=>({id:uid(),cat,item,vendor,est,actual,paid,due});
  const T=(title,cat,owner,off,pri,status)=>({id:uid(),title,cat,owner,due:d(off),pri,status});
  const tb=['t1','t2','t3','t4','t5'];
  const G=(name,side,group,rsvp,meal,table)=>({id:uid(),name,side,group,rsvp,meal,table:table||'',notes:''});
  const V=(o)=>Object.assign({id:uid(),status:'Shortlisted',location:'',type:'Garden',capacity:0,price:0,includes:'',extras:'',catering:'In-house only',rain:'Indoor option',parking:0,drive:'',r1:0,r2:0,r3:0,r4:0,notes:''},o);
  const Q=(cat,vendor,contact,pkg,quote,rating,status)=>({id:uid(),cat,vendor,contact,pkg,quote,rating,status});
  const O=(who,outfit,shop,color,acc,shoes,fit,pick,cost,status,notes)=>({id:uid(),who,outfit,shop,color,acc,shoes,fit,pickup:pick,cost,status,notes});
  const L=(time,title,who,where,notes)=>({id:uid(),time,title,who,where,notes});
  const P=(moment,title,artist,notes,status)=>({id:uid(),moment,title,artist,notes,status});
  const S=(group,shot,who,time,where,must)=>({id:uid(),group,shot,who,time,where,must,done:false});
  const K=(group,text,done)=>({id:uid(),group,text,done:!!done});
  return {
    meta:{a:'Bea',b:'Carlo',date:W,budget:900000,guests:120,rsvp:d(-45),dnp:'Songs with a long intro or drum solo\nAnything the host would have to bleep'},
    mood:{words:'Garden romance, soft candlelight, warm greenery, piña lace, relaxed elegance',
      palette:[{id:uid(),name:'Sampaguita',hex:'#F6F3EA'},{id:uid(),name:'Leaf',hex:'#2F5D46'},{id:uid(),name:'Berry',hex:'#7A2E55'},{id:uid(),name:'Piña gold',hex:'#C9A24D'},{id:uid(),name:'Blush',hex:'#E3B8C0'}],
      tiles:[
        {id:uid(),cat:'Flowers',title:'Loose garden bouquets',note:'White roses, sampaguita, trailing greens',img:''},
        {id:uid(),cat:'Table',title:'Long tables, low candles',note:'Linen runners, brass candle holders',img:''},
        {id:uid(),cat:'Attire',title:'Piña and lace details',note:'Barong with subtle embroidery; gown with sleeves',img:''},
        {id:uid(),cat:'Stationery',title:'Cream cards, berry ink',note:'Letterpress feel, wax seal',img:''},
        {id:uid(),cat:'Food',title:'Kamayan-style cocktail hour',note:'Local favorites, plated dinner after',img:''},
        {id:uid(),cat:'Lighting',title:'Warm string lights',note:'Festoon lights over the garden dinner',img:''}]},
    venues:[
      V({name:'Casa Verde Gardens',status:'Visited',location:'Tagaytay',type:'Garden',capacity:150,price:90000,includes:'Garden, tables and chairs, bridal suite, 8 hours',extras:'Overtime ₱5,000 per hour; no corkage on wine',catering:'Outside allowed (fee)',rain:'Tent included',parking:60,drive:'About 2 hours',r1:5,r2:4,r3:3,r4:4,notes:'Beautiful at sunset. Roads can be slow on weekends.'}),
      V({name:'Hotel Ballroom (Option B)',status:'Shortlisted',location:'Metro Manila',type:'Hotel ballroom',capacity:200,price:140000,includes:'Ballroom, basic styling, rooms for the couple',extras:'Corkage ₱500 per bottle; service charge applies',catering:'In-house only',rain:'Indoor option',parking:120,drive:'30 to 60 minutes',r1:3,r2:3,r3:5,r4:4,notes:'Easy for guests. Less personal.'}),
      V({name:'Clifftop Resort (Option C)',status:'Shortlisted',location:'Batangas',type:'Beach or resort',capacity:120,price:120000,includes:'Ceremony lawn, reception hall, 10 rooms',extras:'Shuttle ₱18,000; overtime ₱8,000 per hour',catering:'In-house only',rain:'Indoor option',parking:40,drive:'About 3 hours',r1:5,r2:3,r3:2,r4:3,notes:'Best view. Far for older guests.'})],
    vendors:[
      Q('Photo & video','Lumen Studio','@lumenstudio','Photo and same-day edit video, 10 hours',85000,5,'Shortlisted'),
      Q('Photo & video','Alba Photo Co.','0917 000 0001','Photo only, 2 shooters, 8 hours',60000,4,'Quoted'),
      Q('Photo & video','Frame and Feast','hello@example.com','Photo and video, 8 hours, album',95000,4,'Quoted'),
      Q('Catering','Heritage Table','0917 000 0002','₱1,350 per head, plated, 120 guests minimum',162000,5,'Shortlisted'),
      Q('Catering','Casa Kitchen','0917 000 0003','₱1,200 per head, buffet',144000,3,'Quoted'),
      Q('Florals & styling','Petal and Pine','@petalandpine','Ceremony and reception styling, bouquets',95000,5,'Quoted'),
      Q('Florals & styling','Bloom Atelier','0917 000 0004','Styling only, bouquets extra',78000,4,'Quoted'),
      Q('Hair & makeup','Glow by Mia','@glowbymia','Bride trial and wedding day, 3 mothers',18000,5,'Shortlisted'),
      Q('Music & host','The Local Band','0917 000 0005','4-piece band, 3 hours, sound system',38000,4,'Inquiry'),
      Q('Music & host','DJ Rico','@djrico','DJ, host, lights, 5 hours',28000,4,'Quoted'),
      Q('Cake','Sugar Table','0917 000 0006','3 tier cake plus cupcakes',12000,4,'Quoted'),
      Q('Coordinator','Day Of Co.','0917 000 0007','Day-of coordination, 1 month before',25000,5,'Shortlisted')],
    budget:[
      B('Venue & Food','Venue rental','Casa Verde Gardens',90000,90000,45000,d(-225)),
      B('Venue & Food','Catering (120 guests)','Heritage Table',162000,0,0,d(-14)),
      B('Venue & Food','Wedding cake','Sugar Table',12000,0,0,d(-30)),
      B('Venue & Food','Bar and drinks','',25000,0,0,d(-14)),
      B('Attire & Beauty','Wedding gown','',45000,45000,15000,d(-21)),
      B('Attire & Beauty','Barong or suit','',18000,0,0,d(-30)),
      B('Attire & Beauty','Entourage attire','',35000,0,0,d(-30)),
      B('Attire & Beauty','Hair and makeup','Glow by Mia',18000,0,0,d(-7)),
      B('Attire & Beauty','Rings','',40000,38500,38500,d(-90)),
      B('Photo & Video','Photo and video team','Lumen Studio',85000,85000,25000,d(-14)),
      B('Photo & Video','Pre-nup shoot','',15000,0,0,d(-140)),
      B('Flowers & Decor','Bridal bouquet and flowers','Petal and Pine',30000,0,0,d(-14)),
      B('Flowers & Decor','Ceremony and reception styling','Petal and Pine',65000,0,0,d(-14)),
      B('Music & Program','Host','',12000,0,0,d(-14)),
      B('Music & Program','Band or DJ','',28000,0,0,d(-14)),
      B('Music & Program','Sound system','',10000,0,0,d(-14)),
      B('Invites & Guests','Invitations and stationery','',12000,0,0,d(-120)),
      B('Invites & Guests','Giveaways','',18000,0,0,d(-45)),
      B('Invites & Guests','Guest shuttle','',20000,0,0,d(-30)),
      B('Legal & Church','Marriage license and documents','',3000,0,0,d(-60)),
      B('Legal & Church','Church or officiant donation','',15000,0,0,d(-7)),
      B('Legal & Church','Pre-marriage seminar','',2000,0,0,d(-100)),
      B('Honeymoon & Misc','Honeymoon','',40000,0,0,d(-30)),
      B('Honeymoon & Misc','Day-of coordinator','Day Of Co.',25000,0,0,d(-14)),
      B('Honeymoon & Misc','Contingency fund','',40000,0,0,'')],
    guests:[
      G('Maria Santos','Bride','Family','Yes','Chicken','t1'),G('Jose Santos','Bride','Family','Yes','Beef','t1'),
      G('Ana Dela Cruz','Groom','Family','Yes','Fish','t1'),G('Paolo Dela Cruz','Groom','Family','Yes','Beef','t1'),
      G('Isabel Mendoza','Bride','Entourage','Yes','Vegetarian','t1'),G('Rafael Bautista','Groom','Entourage','Yes','Beef','t1'),
      G('Carmen Villanueva','Bride','Family','Yes','Chicken','t2'),G('Luis Aquino','Bride','Family','Yes','Fish','t2'),
      G('Teresa Navarro','Bride','Family','Pending','TBD','t2'),G('Miguel Castillo','Bride','Family','Yes','Beef','t2'),
      G('Sofia Ramos','Groom','Friends','Yes','Chicken','t3'),G('Daniel Torres','Groom','Friends','Yes','Beef','t3'),
      G('Patricia Flores','Both','Friends','Pending','TBD','t3'),G('Marco Domingo','Groom','Friends','No','TBD',''),
      G('Lourdes Cruz','Bride','Work','Yes','Fish','t4'),G('Ben Salazar','Bride','Work','Yes','Beef','t4'),
      G('Katrina Lim','Groom','Work','Pending','TBD',''),G('Ernesto Pascual','Both','Sponsor','Yes','Chicken',''),
      G('Grace Tan','Both','Sponsor','Pending','TBD',''),G('Victor Soriano','Groom','Family','Yes','Beef',''),
      G('Nina Panganiban','Bride','Friends','Yes','Vegetarian',''),G('Andrei Valdez','Groom','Friends','Pending','TBD','')],
    tables:[{id:'t1',name:'Head table',cap:8},{id:'t2',name:'Table 1',cap:10},{id:'t3',name:'Table 2',cap:10},{id:'t4',name:'Table 3',cap:10},{id:'t5',name:'Table 4',cap:10}],
    tasks:[
      T('Set overall budget and who pays for what','Honeymoon & Misc','Both',-262,'High','Done'),
      T('Draft the first guest list','Invites & Guests','Both',-258,'High','Done'),
      T('Choose the church or officiant','Legal & Church','Both',-256,'High','Doing'),
      T('Visit and shortlist venues','Venue & Food','Both',-240,'High','Doing'),
      T('Book the venue and pay the reservation fee','Venue & Food','Carlo',-225,'High','To do'),
      T('Request PSA birth certificates and CENOMAR','Legal & Church','Bea',-210,'High','To do'),
      T('Book photo and video team','Photo & Video','Bea',-200,'High','To do'),
      T('Choose a day-of coordinator','Honeymoon & Misc','Both',-195,'Med','To do'),
      T('Book caterer and schedule a tasting','Venue & Food','Bea',-185,'High','To do'),
      T('Ask the entourage and sponsors','Invites & Guests','Both',-180,'Med','To do'),
      T('Shop for the gown and book first fitting','Attire & Beauty','Bea',-170,'High','To do'),
      T('Choose barong or suit','Attire & Beauty','Carlo',-160,'Med','To do'),
      T('Book host and band or DJ','Music & Program','Carlo',-150,'Med','To do'),
      T('Pre-nup shoot','Photo & Video','Both',-140,'Low','To do'),
      T('Book florist and styling','Flowers & Decor','Bea',-130,'Med','To do'),
      T('Order invitations and save-the-dates','Invites & Guests','Both',-120,'Med','To do'),
      T('Attend the pre-marriage seminar','Legal & Church','Both',-100,'High','To do'),
      T('Book hair and makeup trial','Attire & Beauty','Bea',-90,'Med','To do'),
      T('Buy the rings','Attire & Beauty','Carlo',-90,'Med','To do'),
      T('Send invitations','Invites & Guests','Both',-75,'High','To do'),
      T('Apply for marriage license (10-day posting, valid 120 days)','Legal & Church','Both',-60,'High','To do'),
      T('RSVP deadline and final headcount to caterer','Invites & Guests','Bea',-45,'High','To do'),
      T('Finalize seating plan','Invites & Guests','Both',-30,'Med','To do'),
      T('Final fittings','Attire & Beauty','Both',-21,'High','To do'),
      T('Confirm all vendors and send the day-of timeline','Honeymoon & Misc','Coordinator',-14,'High','To do'),
      T('Pay final balances','Honeymoon & Misc','Both',-7,'High','To do'),
      T('Pack emergency kit and honeymoon bags','Honeymoon & Misc','Both',-3,'Med','To do'),
      T('Ceremony rehearsal','Music & Program','Both',-1,'Med','To do')],
    events:[
      {id:uid(),date:d(-230),time:'10:00',title:'Casa Verde site visit',type:'Appointment'},
      {id:uid(),date:d(-184),time:'14:00',title:'Catering tasting',type:'Tasting'},
      {id:uid(),date:d(-180),time:'15:00',title:'Cake tasting',type:'Tasting'},
      {id:uid(),date:d(-120),time:'11:00',title:'First gown fitting',type:'Fitting'},
      {id:uid(),date:d(-85),time:'09:00',title:'Hair and makeup trial',type:'Appointment'},
      {id:uid(),date:d(-1),time:'17:00',title:'Ceremony rehearsal',type:'Meeting'}],
    emergency:{
      kit:[K('Bridal kit','Safety pins and a small sewing kit'),K('Bridal kit','Fashion tape and stain remover pen'),K('Bridal kit','Blotting papers, powder, lip color'),K('Bridal kit','Tissues and wet wipes'),K('Bridal kit','Pain reliever, antacid, bandages, blister pads'),K('Bridal kit','Hairspray, pins, comb'),K('Bridal kit','Power bank and phone charger'),K('Bridal kit','Snacks, water, straws'),
        K('Documents and money','Marriage license and valid IDs'),K('Documents and money','Printed vendor contacts and contracts'),K('Documents and money','Cash envelopes for final payments and tips'),K('Documents and money','Rings, and who is holding them'),K('Documents and money','Vows and speeches, printed'),K('Documents and money','Permits and letters for venue or church'),
        K('Setup bag','Printed timeline for every vendor'),K('Setup bag','Extra seating plan and table cards'),K('Setup bag','Umbrellas and hand fans'),K('Setup bag','Backup playlist on phone and USB'),K('Setup bag','Scissors, tape, zip ties, candle lighter'),K('Setup bag','Spare batteries for mics and cameras')],
      contacts:[
        {id:uid(),role:'Coordinator',name:'',phone:''},{id:uid(),role:'Venue manager',name:'',phone:''},{id:uid(),role:'Photographer',name:'',phone:''},{id:uid(),role:'Caterer',name:'',phone:''},{id:uid(),role:'Florist',name:'',phone:''},{id:uid(),role:'Host or DJ',name:'',phone:''},{id:uid(),role:'Maid of honor',name:'',phone:''},{id:uid(),role:'Best man',name:'',phone:''},{id:uid(),role:'Nearest hospital',name:'',phone:''},{id:uid(),role:'Driver',name:'',phone:''}],
      plans:[
        {id:uid(),risk:'Rain during the ceremony',plan:'Move to the indoor option or tent. Coordinator tells guests and vendors by 1:00 PM.'},
        {id:uid(),risk:'A vendor does not show',plan:'Call coordinator first, then backup vendor from the comparison list.'},
        {id:uid(),risk:'Heavy traffic, guests arrive late',plan:'Hold the ceremony 20 minutes. Play extra prelude music.'},
        {id:uid(),risk:'Wardrobe damage',plan:'Sewing kit and fashion tape in the bridal kit. Maid of honor has the kit.'},
        {id:uid(),risk:'Power outage',plan:'Battery speakers and candles ready. Ask venue about the generator.'},
        {id:uid(),risk:'Someone feels unwell',plan:'First-aid items in the kit. Driver and hospital number saved with the coordinator.'}]},
    outfits:[
      O('Bride','Gown with lace sleeves','Bridal atelier','Ivory','Veil, pearl earrings','Low block heels',d(-120),d(-10),45000,'Ordered','Alter hem after second fitting'),
      O('Groom','Barong Tagalog','Tailor','Cream piña','Cufflinks, undershirt','Leather shoes',d(-100),d(-14),18000,'To order','Match thread color to Berry'),
      O('Maid of honor','Dress in Leaf green','Online order','Leaf green','Gold earrings','Nude heels',d(-60),d(-20),4500,'To order',''),
      O('Best man','Barong, cream','Tailor','Cream','','Dress shoes',d(-60),d(-20),4000,'To order',''),
      O('Bridesmaids','Dresses in Blush','Online order','Blush','Gold accessories','Nude sandals',d(-60),d(-20),12000,'To order','4 bridesmaids; sizes needed'),
      O('Groomsmen','Barongs, cream','Tailor','Cream','','Dress shoes',d(-60),d(-20),12000,'To order','4 groomsmen'),
      O('Parents','Barong and formal dresses','Own tailors','Berry or Leaf','','',d(-45),d(-20),0,'To order','')],
    timeline:[
      L('06:00','Hair and makeup begins','Bea, makeup artist','Bridal suite',''),L('07:30','Photographer arrives, getting-ready photos','Photo team','Bridal suite','Details: rings, shoes, invitation'),
      L('09:00','Groom and groomsmen get dressed','Carlo','Groom room',''),L('10:30','Bride puts on gown','Bea, maid of honor','Bridal suite',''),
      L('11:30','Lunch for the bridal party','All','Suite',''),L('12:30','First look and couple portraits','Bea, Carlo','Garden','Keep it private'),
      L('13:30','Bridal party photos','Entourage','Garden',''),L('14:15','Guests arrive, prelude music','Coordinator','Ceremony area','Ushers hand out programs'),
      L('14:45','Entourage lines up','Coordinator','Ceremony area',''),L('15:00','Ceremony begins','Officiant','Ceremony area',''),
      L('16:00','Recessional and family photos','Photo team','Ceremony area','Use the family group list'),L('16:30','Cocktail hour','Guests','Garden','Couple portraits at golden hour'),
      L('17:30','Grand entrance','Host','Reception',''),L('17:45','Welcome and blessing','Host','Reception',''),
      L('18:00','Dinner served','Caterer','Reception',''),L('19:00','First dance and parent dances','DJ or band','Reception',''),
      L('19:30','Cake cutting and toasts','Host','Reception',''),L('20:15','Bouquet toss and games','Host','Reception',''),
      L('20:30','Party set','DJ or band','Reception',''),L('22:00','Last dance and send-off','Everyone','Reception',''),L('23:00','Gift check and venue clear-out','Coordinator','Venue','Assign someone to carry gifts and cards')],
    playlist:[
      P('Guest arrival','Canon in D','Johann Pachelbel','Instrumental, quartet or recording','Locked'),
      P('Processional','A Thousand Years','Christina Perri','Bride walks in','Considering'),
      P('Recessional','Marry You','Bruno Mars','Upbeat exit','Locked'),
      P('Cocktail hour','Sway','Michael Bublé','Soft jazz set','Considering'),
      P('Grand entrance','Uptown Funk','Mark Ronson ft. Bruno Mars','','Considering'),
      P('First dance','Can’t Help Falling in Love','Elvis Presley','Cut to 3 minutes','Locked'),
      P('Parent dances','Kahit Maputi Na Ang Buhok Ko','Rey Valera','Father and daughter, mother and son','Considering'),
      P('Dinner','Ikaw','Yeng Constantino','Acoustic version if available','Request'),
      P('Cake cutting','Sugar','Maroon 5','','Request'),
      P('Party set','September','Earth, Wind & Fire','Opens the dance floor','Locked'),
      P('Party set','Dancing Queen','ABBA','For the titas','Locked'),
      P('Last dance','Last Dance','Donna Summer','','Locked')],
    photo:{photographer:'Lumen Studio',videographer:'Lumen Studio (same-day edit)',hours:'10 hours',start:'07:30',end:'17:30',delivery:d(45),second:'Yes, 1 second shooter',style:'Natural light, candid, warm tones. Avoid heavy filters. A few posed family shots, mostly candid.',must:'Parents blessing, ring exchange, first kiss, grandparents, the bridal party laughing',
      shots:[
        S('Getting ready','Gown on hanger by the window','','07:45','Bridal suite',true),S('Getting ready','Bride and mothers','Bea, mothers','08:30','Bridal suite',true),S('Details','Rings, shoes, invitation flat lay','','07:45','Bridal suite',true),S('Details','Table setting and florals','','14:00','Reception',false),
        S('First look','The first look','Bea, Carlo','12:30','Garden',true),S('Couple portraits','Walking in the garden','Bea, Carlo','12:45','Garden',true),S('Couple portraits','Golden hour portraits','Bea, Carlo','17:00','Garden',false),
        S('Ceremony','Processional, bride’s entrance','','15:00','Ceremony area',true),S('Ceremony','Ring exchange','','15:30','Ceremony area',true),S('Ceremony','First kiss','','15:40','Ceremony area',true),S('Ceremony','Recessional','','16:00','Ceremony area',false),
        S('Family','Family formal photos (see groups below)','Family','16:10','Ceremony area',true),S('Bridal party','Entourage group and fun poses','Entourage','13:30','Garden',true),
        S('Reception','Grand entrance','','17:30','Reception',false),S('Reception','First dance','Bea, Carlo','19:00','Reception',true),S('Reception','Toasts and reactions','','19:30','Reception',false),S('Reception','Cake cutting','Bea, Carlo','19:30','Reception',true),S('Reception','Bouquet toss','','20:15','Reception',false),S('Reception','Send-off','Everyone','22:00','Reception',false)],
      groups:[{id:uid(),group:'Bride with her parents',who:'Bea, Maria, Jose'},{id:uid(),group:'Groom with his parents',who:'Carlo, Ana, Paolo'},{id:uid(),group:'Both families together',who:'Immediate family of both sides'},{id:uid(),group:'Grandparents with the couple',who:''},{id:uid(),group:'Sponsors with the couple',who:'Ernesto Pascual, Grace Tan'}]}
  };
}
STATE=seed();
const state=STATE;
const ui={cur:'overview',gfilter:'All',gq:'',tfilter:'Open',towner:'All',vfilter:'All',calMonth:todayISO().slice(0,7),calSel:todayISO(),confirm:null,assets:false,focus:null,uploading:null,undo:null};

/* ---------- persistence: shared db when available, this device otherwise ---------- */
let DB=null,SYNC='Loading…';let REMOTE=false,PASS='',retry=null,poll=null;const lastT={},retryKeys=new Set();const dirty=new Set(),writing={},again={};let timer=null;
function setSync(s){SYNC=s;const e=$('#sync');if(e)e.textContent=s}
function touch(path){dirty.add(path.split('.')[0]);setSync('Saving…');clearTimeout(timer);timer=setTimeout(flush,350)}
async function flush(){for(const k of [...dirty])await writeKey(k)}
async function writeKey(key){
  if(writing[key]){again[key]=true;return}
  writing[key]=true;dirty.delete(key);let fail=false;
  try{
    if(DB)await DB.doc('planner/'+key).set({v:JSON.parse(JSON.stringify(state[key]))});
    else{
      try{localStorage.setItem('wp:'+key,JSON.stringify(state[key]))}catch(e2){}
      if(REMOTE){
        const r=await api('PUT',{sections:{[key]:state[key]}});
        if(r.status===401){writing[key]=false;lockOut();return}
        if(r.status!==200)throw new Error('sync');
        lastT[key]=r.json.t;retryKeys.delete(key);
      }
    }
  }catch(e){fail=true;if(REMOTE){retryKeys.add(key);clearTimeout(retry);retry=setTimeout(()=>{retryKeys.forEach(k=>dirty.add(k));flush()},15000)}}
  writing[key]=false;
  if(again[key]||dirty.has(key)){again[key]=false;return writeKey(key)}
  if(!dirty.size&&!Object.values(writing).some(Boolean))setSync(fail?(REMOTE?'Offline. Kept on this device, will sync again soon.':'Could not save. Try again.'):(DB?'All changes saved':(REMOTE?'Synced '+clock():'Saved in this browser only')));
}

/* ---------- ui helpers ---------- */
const at=(k,id,f,t)=>'data-k="'+k+'" data-id="'+(id||'')+'" data-f="'+f+'" data-t="'+(t||'text')+'"';
const inp=(k,id,f,v,o)=>{o=o||{};return '<input class="in '+(o.cls||'')+'" '+at(k,id,f,o.t)+' type="'+(o.type||'text')+'" value="'+esc(v)+'"'+(o.ph?' placeholder="'+esc(o.ph)+'"':'')+(o.list?' list="'+o.list+'"':'')+(o.attr?' '+o.attr:'')+' aria-label="'+esc(o.label||f)+'">'};
const money=(k,id,f,v,label)=>inp(k,id,f,fmtNum(v),{t:'num',cls:'num',ph:'0',attr:'inputmode="decimal"',label:label||f});
const intf=(k,id,f,v,label)=>inp(k,id,f,v?String(v):'',{t:'int',cls:'num',ph:'0',attr:'inputmode="numeric"',label:label||f});
const area=(k,id,f,v,ph)=>'<textarea class="in" rows="2" '+at(k,id,f)+' placeholder="'+esc(ph||'')+'" aria-label="'+esc(f)+'">'+esc(v)+'</textarea>';
const sel=(k,id,f,v,opts,o)=>{o=o||{};return '<select class="in '+(o.cls||'')+'" '+at(k,id,f,o.t)+' aria-label="'+esc(o.label||f)+'">'+opts.map(x=>'<option'+(x===v?' selected':'')+'>'+esc(x)+'</option>').join('')+'</select>'};
const chk=(k,id,f,v,label,t)=>'<input type="checkbox" '+at(k,id,f,t||'bool')+(v?' checked':'')+' aria-label="'+esc(label)+'">';
const head=(t,lead,act)=>'<header class="head"><div><h2>'+t+'</h2><p class="lead">'+lead+'</p></div>'+(act?'<div class="acts">'+act+'</div>':'')+'</header>';
const stat=(l,v,n,tone)=>'<div class="stat '+(tone||'')+'"><div class="sl">'+l+'</div><div class="sv">'+v+'</div>'+(n?'<div class="sn">'+n+'</div>':'')+'</div>';
const pill=(t,c,g)=>'<span class="pill '+(c||'mute')+'">'+(g?g+' ':'')+esc(t)+'</span>';
const addBtn=(k,l)=>'<button class="btn" data-act="add" data-k="'+k+'">+ '+l+'</button>';
const delBtn=(k,id,l)=>'<button class="x" data-act="del" data-k="'+k+'" data-id="'+id+'" aria-label="'+(l||'Delete row')+'" title="'+(l||'Delete row')+'">×</button>';
const clearBtn=(k,l)=>'<button class="btn sm'+(ui.confirm===k?' warnb':'')+'" data-act="clear" data-k="'+k+'">'+(ui.confirm===k?'Click again to clear all':l)+'</button>';
const chipRow=(key,opts,cur,extra)=>'<div class="chips">'+opts.map(o=>'<button class="cb" data-act="setui" data-ui="'+key+'" data-v="'+esc(o)+'" aria-pressed="'+(o===cur)+'">'+esc(o)+'</button>').join('')+(extra||'')+'</div>';
function hbars(rows,max){max=max||Math.max(1,...rows.map(r=>r.val));return '<div class="hb">'+rows.map(r=>'<div class="hrow"><div class="hl"><i class="sw" style="background:'+r.color+'"></i><span>'+esc(r.label)+'</span></div><div class="hbar"><div class="hfill" style="width:'+Math.max(r.val>0?2:0,r.val/max*100)+'%;background:'+r.color+'"></div></div><div class="hv">'+(r.text!=null?r.text:r.val)+'</div></div>').join('')+'</div>'}
function progRows(rows){/* rows:[{label,color,done,total}] */return '<div class="hb">'+rows.map(r=>'<div class="hrow"><div class="hl"><i class="sw" style="background:'+r.color+'"></i><span>'+esc(r.label)+'</span></div><div class="hbar"><div class="hfill soft" style="width:'+(r.total?100:0)+'%;--col:'+r.color+'"><div class="hpaid" style="width:'+(r.total?r.done/r.total*100:0)+'%"></div></div></div><div class="hv">'+r.done+'/'+r.total+'</div></div>').join('')+'</div>'}

/* ---------- derived numbers ---------- */
const expOf=i=>(i.actual>0?i.actual:i.est)||0;
function bud(){const it=state.budget;const total=state.meta.budget||0;const expected=sum(it,expOf),paid=sum(it,i=>i.paid);return{total,expected,planned:sum(it,i=>i.est),paid,toPay:Math.max(expected-paid,0),left:total-expected}}
function gst(){const g=state.guests,c=r=>g.filter(x=>x.rsvp===r).length;const yes=c('Yes'),no=c('No'),pend=c('Pending');return{n:g.length,yes,no,pend,head:yes+pend,target:state.meta.guests||0}}
function tsk(){const t=state.tasks,td=todayISO();const done=t.filter(x=>x.status==='Done').length;const open=t.filter(x=>x.status!=='Done');return{n:t.length,done,doing:t.filter(x=>x.status==='Doing').length,todo:t.filter(x=>x.status==='To do').length,over:open.filter(x=>x.due&&x.due<td).length,soon:open.filter(x=>x.due&&x.due>=td&&x.due<=addDays(td,14)).length}}
function allItems(){
  const out=[];
  state.tasks.forEach(t=>t.due&&out.push({date:t.due,kind:'task',title:t.title,sub:[t.owner,t.status].filter(Boolean).join(' · '),done:t.status==='Done'}));
  state.budget.forEach(b=>{const bal=expOf(b)-(b.paid||0);if(b.due&&bal>0)out.push({date:b.due,kind:'pay',title:'Pay: '+b.item,sub:PHP(bal)+' balance'})});
  state.events.forEach(e=>e.date&&out.push({date:e.date,kind:'event',title:e.title||'Untitled',sub:[fmtTime(e.time),e.type].filter(Boolean).join(' · '),id:e.id}));
  out.push({date:state.meta.date,kind:'wedding',title:'Wedding day',sub:fmtDate(state.meta.date,{weekday:'long'})});
  if(state.meta.rsvp)out.push({date:state.meta.rsvp,kind:'rsvp',title:'RSVP deadline',sub:'Final headcount to caterer'});
  return out;
}

/* ---------- dashboards (re-rendered live while typing) ---------- */
const DASH={};
DASH.budget=()=>{
  const b=bud();const scale=Math.max(b.total,b.expected,1);
  const cr=CATS.map((c,i)=>{const its=state.budget.filter(x=>x.cat===c);return{c,i,e:sum(its,expOf),p:sum(its,x=>x.paid)}});const mx=Math.max(1,...cr.map(r=>r.e));
  return '<div class="stats">'+stat('Budget',PHP(b.total))+stat('Expected cost',PHP(b.expected),b.total?Math.round(b.expected/b.total*100)+'% of budget':'')+stat('Paid so far',PHP(b.paid))+stat('Still to pay',PHP(b.toPay))+(b.left>=0?stat('Left to spend',PHP(b.left),'','good'):stat('Over budget by',PHP(-b.left),'Trim a line or raise the budget','bad'))+'</div>'+
  '<div class="meter" role="img" aria-label="Paid '+PHP(b.paid)+', still to pay '+PHP(b.toPay)+', budget '+PHP(b.total)+'"><div class="mseg paid" style="width:'+b.paid/scale*100+'%"></div><div class="mseg rest" style="width:'+Math.max(b.expected-b.paid,0)/scale*100+'%"></div><div class="mtick" style="left:'+b.total/scale*100+'%"><span>Budget '+PHP(b.total)+'</span></div></div>'+
  '<h3>Expected cost by category</h3><div class="hb">'+cr.map(r=>'<div class="hrow"><div class="hl"><i class="sw" style="background:var(--c'+(r.i+1)+')"></i><span>'+esc(r.c)+'</span></div><div class="hbar"><div class="hfill soft" style="width:'+r.e/mx*100+'%;--col:var(--c'+(r.i+1)+')"><div class="hpaid" style="width:'+(r.e?Math.min(100,r.p/r.e*100):0)+'%"></div></div></div><div class="hv">'+PHP(r.e)+'<small>'+(b.total?Math.round(r.e/b.total*100):0)+'%</small></div></div>').join('')+'</div>'+
  '<div class="legend"><span><i style="background:var(--accent)"></i>Paid</span><span><i style="background:color-mix(in srgb,var(--accent) 35%,var(--surface-2))"></i>Still to pay</span><span>Final quote is used when you enter one, otherwise the estimate.</span></div>';
};
DASH.guests=()=>{
  const g=gst();const gs=state.guests;const p=v=>g.n?v/g.n*100:0;
  const by=(arr,f)=>arr.map((x,i)=>({label:x,color:'var(--c'+(i+1)+')',val:gs.filter(y=>y[f]===x).length})).filter(r=>r.val>0);
  const att=gs.filter(x=>x.rsvp!=='No');
  const meals=MEALS.map((m,i)=>({label:m,color:'var(--c'+(i+1)+')',val:att.filter(x=>x.meal===m).length})).filter(r=>r.val>0);
  return '<div class="stats">'+stat('On the list',g.n)+stat('Confirmed',g.yes,'',g.yes?'good':'')+stat('Awaiting reply',g.pend,'',g.pend?'warn':'')+stat('Declined',g.no)+stat('Reply rate',(g.n?Math.round((g.yes+g.no)/g.n*100):0)+'%')+stat('Expected headcount',g.head,g.target?'Target '+g.target+(g.head>g.target?' · '+(g.head-g.target)+' over':' · '+(g.target-g.head)+' to go'):'',g.target&&g.head>g.target?'bad':'')+'</div>'+
  '<div class="stack" role="img" aria-label="Confirmed '+g.yes+', awaiting '+g.pend+', declined '+g.no+'"><div style="flex:'+g.yes+';background:var(--ok-t)"></div><div style="flex:'+g.pend+';background:var(--warn-t)"></div><div style="flex:'+g.no+';background:var(--bad-t)"></div></div>'+
  '<div class="legend"><span><i style="background:var(--ok-t)"></i>✓ Confirmed</span><span><i style="background:var(--warn-t)"></i>● Awaiting</span><span><i style="background:var(--bad-t)"></i>× Declined</span></div>'+
  '<div class="grid2" style="margin-top:6px"><div><h3>By side</h3>'+hbars(by(SIDES,'side'),g.n||1)+'</div><div><h3>By group</h3>'+hbars(by(GROUPS,'group'),g.n||1)+'</div><div><h3>Meals (not counting declines)</h3>'+(meals.length?hbars(meals):'<div class="sn">No meals chosen yet.</div>')+'</div></div>';
};
DASH.tasks=()=>{
  const t=tsk();
  const cr=CATS.map(c=>{const its=state.tasks.filter(x=>x.cat===c);return{label:c,color:catCol(c),done:its.filter(x=>x.status==='Done').length,total:its.length}}).filter(r=>r.total);
  return '<div class="stats">'+stat('Tasks',t.n)+stat('Done',t.done,t.n?Math.round(t.done/t.n*100)+'% complete':'')+stat('In progress',t.doing)+stat('Not started',t.todo)+stat('Overdue',t.over,'',t.over?'bad':'')+stat('Due in 14 days',t.soon,'',t.soon?'warn':'')+'</div>'+
  '<div class="stack" role="img" aria-label="Done '+t.done+', in progress '+t.doing+', not started '+t.todo+'"><div style="flex:'+t.done+';background:var(--ok-t)"></div><div style="flex:'+t.doing+';background:var(--info-t)"></div><div style="flex:'+t.todo+';background:var(--line-strong)"></div></div>'+
  '<div class="legend"><span><i style="background:var(--ok-t)"></i>✓ Done</span><span><i style="background:var(--info-t)"></i>● In progress</span><span><i style="background:var(--line-strong)"></i>○ Not started</span></div>'+
  '<h3>Progress by category (solid = done)</h3>'+progRows(cr);
};
DASH.outfits=()=>{
  const o=state.outfits;const ready=o.filter(x=>x.status==='Ready'||x.status==='Collected').length;const td=todayISO();
  const nf=o.map(x=>x.fitting).filter(d=>d&&d>=td).sort()[0];
  return '<div class="stats">'+stat('Outfits',o.length)+stat('Ready or collected',ready,'',ready===o.length&&o.length?'good':'')+stat('Total cost',PHP(sum(o,x=>x.cost)))+stat('Next fitting',nf?fmtDate(nf,{month:'short',day:'numeric'}):'None set',nf?'in '+diffDays(nf,td)+' days':'')+'</div>';
};
DASH.playlist=()=>{
  const p=state.playlist;const rows=MOMENTS.map((m,i)=>({label:m,color:'var(--c'+(i%8+1)+')',val:p.filter(x=>x.moment===m).length})).filter(r=>r.val);
  return '<div class="stats">'+stat('Songs',p.length)+stat('Locked',p.filter(x=>x.status==='Locked').length,'','good')+stat('Still deciding',p.filter(x=>x.status==='Considering').length)+stat('Guest requests',p.filter(x=>x.status==='Request').length)+'</div>'+(rows.length?'<h3>Songs per moment</h3>'+hbars(rows):'');
};
DASH.photo=()=>{
  const s=state.photo.shots;const must=s.filter(x=>x.must);const got=s.filter(x=>x.done).length;
  const rows=SHOTG.map((g,i)=>({label:g,color:'var(--c'+(i+1)+')',val:s.filter(x=>x.group===g).length})).filter(r=>r.val);
  return '<div class="stats">'+stat('Shots listed',s.length)+stat('Must-haves',must.length)+stat('Captured',got,s.length?Math.round(got/s.length*100)+'% of the list':'')+stat('Family groups',state.photo.groups.length)+'</div>'+(rows.length?'<h3>Shots per moment</h3>'+hbars(rows):'');
};
DASH.emergency=()=>{
  const k=state.emergency.kit;const d=k.filter(x=>x.done).length;
  return '<div class="stats">'+stat('Items packed',d+'/'+k.length,k.length?Math.round(d/k.length*100)+'% ready':'',d===k.length&&k.length?'good':'')+stat('Contacts filled in',state.emergency.contacts.filter(c=>c.phone).length+'/'+state.emergency.contacts.length)+stat('Backup plans',state.emergency.plans.length)+'</div>';
};

/* ---------- row-level computed cells ---------- */
const findRow=(k,id)=>(getPath(k)||[]).find(r=>r.id===id);
const CALC={
  bal:id=>{const r=findRow('budget',id);if(!r)return '';const e=expOf(r),b=e-(r.paid||0);if(e>0&&b<=0)return pill('Paid','ok','✓');return PHP(b)},
  'tot-est':()=>PHP(sum(state.budget,i=>i.est)),'tot-act':()=>PHP(sum(state.budget,i=>i.actual)),'tot-paid':()=>PHP(sum(state.budget,i=>i.paid)),'tot-bal':()=>PHP(Math.max(sum(state.budget,expOf)-sum(state.budget,i=>i.paid),0)),
  when:id=>{const r=findRow('tasks',id);if(!r)return '';if(r.status==='Done')return pill('Done','ok','✓');if(!r.due)return '';const n=diffDays(r.due,todayISO());if(n<0)return pill(-n+' d late','bad','!');if(n===0)return pill('Today','warn','●');return n<=14?pill('in '+n+' d','warn'):'<span class="sn">in '+n+' d</span>'},
  vflag:id=>{const r=findRow('vendors',id);if(!r)return '';const same=state.vendors.filter(v=>v.cat===r.cat&&v.status!=='Declined');let out='';if(same.length>1){const q=same.filter(v=>v.quote>0);if(r.quote>0&&r.quote===Math.min(...q.map(v=>v.quote)))out+=pill('Lowest quote','info');const rt=Math.max(...same.map(v=>v.rating||0));if(r.rating>0&&r.rating===rt)out+=' '+pill('Top rated','ok','★')}return out},
  vscore:id=>{const r=findRow('venues',id);if(!r)return '';const a=[r.r1,r.r2,r.r3,r.r4].filter(x=>x>0);if(!a.length)return '—';const s=a.reduce((x,y)=>x+y,0)/a.length;const best=Math.max(...state.venues.filter(v=>v.status!=='Passed').map(v=>{const b=[v.r1,v.r2,v.r3,v.r4].filter(x=>x>0);return b.length?b.reduce((x,y)=>x+y,0)/b.length:0}));return '<b>'+s.toFixed(1)+' / 5</b> '+(r.status!=='Passed'&&Math.abs(s-best)<1e-9?pill('Top score','ok','★'):'')},
  vfit:id=>{const r=findRow('venues',id);if(!r||!r.capacity)return '—';const t=state.meta.guests||0;return r.capacity>=t?pill('Fits '+t,'ok','✓'):pill('Seats '+r.capacity+', need '+t,'bad','!')},
  vper:id=>{const r=findRow('venues',id);const t=state.meta.guests||0;return r&&r.price&&t?PHP(r.price/t):'—'},
  seats:id=>{const t=findRow('tables',id);if(!t)return '';return ''}
};

/* ---------- views ---------- */
const VIEWS={};
const monthLabel=k=>{const p=k.split('-').map(Number);return new Date(p[0],p[1]-1,1).toLocaleDateString('en-PH',{month:'long',year:'numeric'})};

VIEWS.overview={title:'Overview',render(){
  const m=state.meta,td=todayISO(),b=bud(),g=gst(),t=tsk();
  const up=allItems().filter(i=>i.date>=td&&!i.done&&i.kind!=='wedding').sort((a,c)=>a.date.localeCompare(c.date)).slice(0,8);
  const late=state.tasks.filter(x=>x.status!=='Done'&&x.due&&x.due<td).sort((a,c)=>a.due.localeCompare(c.due)).slice(0,6);
  const lateP=state.budget.filter(x=>x.due&&x.due<td&&expOf(x)-(x.paid||0)>0).slice(0,4);
  const tag=d=>{const n=diffDays(d,td);return n===0?'Today':n<0?(-n)+' d ago':n<=60?'in '+n+' d':fmtDate(d)};
  return head('Overview','Start here. Everything in this planner is a template with sample entries. Edit any cell, add rows, and delete what you do not need.')+
  '<section class="panel"><h3>Wedding basics</h3><div class="form">'+
  '<label class="fld">Partner 1'+inp('meta','','a',m.a)+'</label><label class="fld">Partner 2'+inp('meta','','b',m.b)+'</label>'+
  '<label class="fld">Wedding date'+inp('meta','','date',m.date,{type:'date'})+'</label>'+
  '<label class="fld">Total budget (₱)'+money('meta','','budget',m.budget)+'</label>'+
  '<label class="fld">Target guests'+intf('meta','','guests',m.guests)+'</label>'+
  '<label class="fld">RSVP deadline'+inp('meta','','rsvp',m.rsvp,{type:'date'})+'</label></div></section>'+
  '<div class="tiles3">'+
  '<div class="tile3"><div class="sl">BUDGET</div><div class="big">'+PHP(b.expected)+'</div><div class="sn">of '+PHP(b.total)+' · '+PHP(b.paid)+' paid</div><div class="stack"><div style="flex:'+b.paid+';background:var(--accent)"></div><div style="flex:'+Math.max(b.expected-b.paid,0)+';background:color-mix(in srgb,var(--accent) 35%,var(--surface-2))"></div><div style="flex:'+Math.max(b.left,0)+';background:var(--surface-2)"></div></div><button class="lnk" data-go="budget">Open budget →</button></div>'+
  '<div class="tile3"><div class="sl">GUESTS</div><div class="big">'+g.yes+' confirmed</div><div class="sn">'+g.pend+' waiting · '+g.no+' declined · target '+g.target+'</div><div class="stack"><div style="flex:'+g.yes+';background:var(--ok-t)"></div><div style="flex:'+g.pend+';background:var(--warn-t)"></div><div style="flex:'+g.no+';background:var(--bad-t)"></div></div><button class="lnk" data-go="guests">Open guest list →</button></div>'+
  '<div class="tile3"><div class="sl">TASKS</div><div class="big">'+t.done+' of '+t.n+' done</div><div class="sn">'+(t.over?'<b style="color:var(--bad-t)">'+t.over+' overdue</b> · ':'')+t.soon+' due in 14 days</div><div class="stack"><div style="flex:'+t.done+';background:var(--ok-t)"></div><div style="flex:'+t.doing+';background:var(--info-t)"></div><div style="flex:'+t.todo+';background:var(--line-strong)"></div></div><button class="lnk" data-go="tasks">Open task tracker →</button></div></div>'+
  '<div class="grid2"><section class="panel"><h3>Needs attention</h3>'+((late.length||lateP.length)?'<ul class="list">'+late.map(x=>'<li><span class="dtag">'+tag(x.due)+'</span><div>'+esc(x.title)+'<small>'+esc(x.owner||'')+' · '+esc(x.cat)+'</small></div>'+pill('Overdue','bad','!')+'</li>').join('')+lateP.map(x=>'<li><span class="dtag">'+tag(x.due)+'</span><div>Pay: '+esc(x.item)+'<small>'+PHP(expOf(x)-(x.paid||0))+' balance</small></div>'+pill('Payment late','bad','!')+'</li>').join('')+'</ul>':'<div class="empty">Nothing overdue. Nice.</div>')+'</section>'+
  '<section class="panel"><h3>Coming up</h3>'+(up.length?'<ul class="list">'+up.map(x=>'<li><span class="dtag">'+tag(x.date)+'</span><div>'+esc(x.title)+'<small>'+KIND[x.kind]+(x.sub?' · '+esc(x.sub):'')+'</small></div><span class="g k-'+x.kind+'"></span></li>').join('')+'</ul>':'<div class="empty">No upcoming items.</div>')+'</section></div>';
}};

VIEWS.tasks={title:'Task tracker',render(){
  const td=todayISO();let rows=state.tasks.slice();
  if(ui.tfilter==='Open')rows=rows.filter(t=>t.status!=='Done');
  else if(ui.tfilter==='Overdue')rows=rows.filter(t=>t.status!=='Done'&&t.due&&t.due<td);
  else if(ui.tfilter==='Done')rows=rows.filter(t=>t.status==='Done');
  if(ui.towner!=='All')rows=rows.filter(t=>(t.owner||'')===ui.towner);
  rows.sort((a,b)=>((a.status==='Done')-(b.status==='Done'))||(a.due||'9').localeCompare(b.due||'9'));
  const owners=['All'].concat([...new Set(state.tasks.map(t=>t.owner).filter(Boolean))]);
  const ownerSel='<select class="cb" data-ui="towner" aria-label="Filter by owner">'+owners.map(o=>'<option'+(o===ui.towner?' selected':'')+'>'+esc(o)+'</option>').join('')+'</select>';
  const dl='<datalist id="owners">'+[...new Set([state.meta.a,state.meta.b,'Both','Family','Coordinator'].concat(owners.slice(1)))].filter(Boolean).map(o=>'<option value="'+esc(o)+'">').join('')+'</datalist>';
  return head('Task tracker','Every to-do with an owner and a due date. Check the box to finish a task.',addBtn('tasks','Add task'))+
  '<section class="dash" data-dash="tasks"></section>'+chipRow('tfilter',['Open','Overdue','Done','All'],ui.tfilter,ownerSel)+dl+
  '<div class="tbl-wrap"><table><thead><tr><th class="c">Done</th><th>Task</th><th>Category</th><th>Owner</th><th>Due</th><th>Priority</th><th>Status</th><th>When</th><th></th></tr></thead><tbody>'+
  (rows.length?rows.map(r=>{const done=r.status==='Done',late=!done&&r.due&&r.due<td;return '<tr class="'+(late?'late ':'')+(done?'done':'')+'"><td class="c">'+chk('tasks',r.id,'status',done,'Mark done','done')+'</td><td style="min-width:260px">'+inp('tasks',r.id,'title',r.title,{ph:'Task'})+'</td><td>'+sel('tasks',r.id,'cat',r.cat,CATS)+'</td><td style="min-width:110px">'+inp('tasks',r.id,'owner',r.owner,{list:'owners'})+'</td><td>'+inp('tasks',r.id,'due',r.due,{type:'date'})+'</td><td>'+sel('tasks',r.id,'pri',r.pri,PRI)+'</td><td>'+sel('tasks',r.id,'status',r.status,TSTAT)+'</td><td class="when" data-calc="when" data-id="'+r.id+'"></td><td>'+delBtn('tasks',r.id)+'</td></tr>'}).join(''):'<tr><td colspan="9" class="empty">No tasks match this filter.</td></tr>')+
  '</tbody></table></div>';
}};

VIEWS.summary={title:'Task summary',render(){
  const td=todayISO(),ts=state.tasks,t=tsk();
  const owners=[...new Set(ts.map(x=>x.owner||'Unassigned'))];
  const orows=owners.map(o=>{const its=ts.filter(x=>(x.owner||'Unassigned')===o);const open=its.filter(x=>x.status!=='Done');const nx=open.filter(x=>x.due).sort((a,b)=>a.due.localeCompare(b.due))[0];return{o,open:open.length,done:its.length-open.length,late:open.filter(x=>x.due&&x.due<td).length,nx}});
  const months=[...new Set(ts.filter(x=>x.due).map(x=>x.due.slice(0,7)))].sort();
  const mmax=Math.max(1,...months.map(mk=>ts.filter(x=>x.due&&x.due.startsWith(mk)).length));
  const cr=CATS.map(c=>{const its=ts.filter(x=>x.cat===c);return{label:c,color:catCol(c),done:its.filter(x=>x.status==='Done').length,total:its.length}}).filter(r=>r.total);
  const attn=ts.filter(x=>x.status!=='Done'&&x.due&&x.due<=addDays(td,30)).sort((a,b)=>a.due.localeCompare(b.due)).slice(0,10);
  const hi=ts.filter(x=>x.status!=='Done'&&x.pri==='High').length;
  return head('Task summary','Where the work sits: by category, by person and by month.')+
  '<section class="dash"><div class="stats">'+stat('Complete',(t.n?Math.round(t.done/t.n*100):0)+'%',t.done+' of '+t.n+' tasks','good')+stat('Open high priority',hi)+stat('Overdue',t.over,'',t.over?'bad':'')+stat('Due in 30 days',attn.length+'','Showing up to 10 below')+'</div></section>'+
  '<div class="grid2"><section class="panel"><h3>By category (solid = done)</h3>'+progRows(cr)+'</section>'+
  '<section class="panel"><h3>Tasks due each month</h3><div class="hb">'+months.map(mk=>{const its=ts.filter(x=>x.due&&x.due.startsWith(mk));const d=its.filter(x=>x.status==='Done').length;return '<div class="hrow" style="grid-template-columns:minmax(80px,110px) minmax(0,1fr) auto"><div class="hl"><span>'+esc(new Date(+mk.slice(0,4),+mk.slice(5)-1,1).toLocaleDateString('en-PH',{month:'short',year:'2-digit'}))+'</span></div><div class="hbar"><div class="hfill soft" style="width:'+its.length/mmax*100+'%;--col:var(--c1)"><div class="hpaid" style="width:'+(its.length?d/its.length*100:0)+'%"></div></div></div><div class="hv">'+d+'/'+its.length+'</div></div>'}).join('')+'</div></section></div>'+
  '<section class="panel"><h3>By owner</h3><div class="tbl-wrap" style="margin:0"><table style="min-width:520px"><thead><tr><th>Owner</th><th class="r">Open</th><th class="r">Done</th><th class="r">Overdue</th><th>Next due</th></tr></thead><tbody>'+orows.map(r=>'<tr><td style="padding:8px"><b>'+esc(r.o)+'</b></td><td class="r" style="padding:8px">'+r.open+'</td><td class="r" style="padding:8px">'+r.done+'</td><td class="r" style="padding:8px">'+(r.late?pill(r.late+'','bad','!'):'0')+'</td><td style="padding:8px">'+(r.nx?esc(r.nx.title)+' <span class="sn">· '+fmtDate(r.nx.due)+'</span>':'—')+'</td></tr>').join('')+'</tbody></table></div></section>'+
  '<section class="panel"><h3>Overdue and due in the next 30 days</h3>'+(attn.length?'<ul class="list">'+attn.map(x=>{const n=diffDays(x.due,td);return '<li><span class="dtag">'+fmtDate(x.due)+'</span><div>'+esc(x.title)+'<small>'+esc(x.owner||'Unassigned')+' · '+esc(x.cat)+'</small></div>'+(n<0?pill(-n+' d late','bad','!'):pill('in '+n+' d','warn'))+'</li>'}).join('')+'</ul>':'<div class="empty">Nothing due in the next 30 days.</div>')+'</section>';
}};

VIEWS.calendar={title:'Calendar',render(){
  const p=ui.calMonth.split('-').map(Number),y=p[0],m=p[1];
  const first=new Date(y,m-1,1),start=new Date(y,m-1,1-first.getDay()),td=todayISO();
  const by={};allItems().forEach(i=>{(by[i.date]=by[i.date]||[]).push(i)});
  let cells='';
  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d=>cells+='<div class="dh">'+d+'</div>');
  for(let i=0;i<42;i++){
    const d=new Date(start);d.setDate(start.getDate()+i);const ds=iso(d);const its=by[ds]||[];
    const cls=[d.getMonth()!==m-1?'out':'',ds===td?'today':'',ds===ui.calSel?'sel':'',ds===state.meta.date?'wed':''].join(' ');
    cells+='<button class="day '+cls+'" data-act="calsel" data-date="'+ds+'" aria-label="'+fmtDate(ds,{weekday:'long',month:'long',day:'numeric'})+', '+its.length+' items"><span class="dn">'+d.getDate()+'</span><span class="dl">'+its.slice(0,3).map(x=>'<span class="ch k-'+x.kind+(x.done?' dn2':'')+'"><span class="g"></span><span class="t">'+esc(x.title)+'</span></span>').join('')+(its.length>3?'<span class="more">+'+(its.length-3)+'</span>':'')+'</span></button>';
  }
  const daySel=by[ui.calSel]||[];
  const evs=state.events.slice().sort((a,b)=>(a.date+(a.time||'')).localeCompare(b.date+(b.time||'')));
  return head('Calendar','Task deadlines, payments due, appointments and the big day in one place.','<button class="btn sm" data-act="calnav" data-v="prev">← Prev</button><button class="btn sm" data-act="calnav" data-v="today">Today</button><button class="btn sm" data-act="calnav" data-v="wedding">Wedding month</button><button class="btn sm" data-act="calnav" data-v="next">Next →</button>')+
  '<h3 style="font:500 26px var(--display);margin:0 0 12px">'+monthLabel(ui.calMonth)+'</h3><div class="cal">'+cells+'</div>'+
  '<div class="legend" style="margin:10px 0 22px"><span><span class="g k-task"></span> Task due</span><span><span class="g k-pay"></span> Payment due</span><span><span class="g k-event"></span> Appointment</span><span><span class="g k-rsvp"></span> RSVP deadline</span><span><span class="g k-wedding"></span> Wedding day</span></div>'+
  '<div class="grid2"><section class="panel"><h3>'+fmtDate(ui.calSel,{weekday:'long',month:'long',day:'numeric',year:'numeric'})+'</h3>'+(daySel.length?'<ul class="list">'+daySel.map(x=>'<li><span class="g k-'+x.kind+'"></span><div'+(x.done?' style="text-decoration:line-through;color:var(--muted)"':'')+'>'+esc(x.title)+'<small>'+KIND[x.kind]+(x.sub?' · '+esc(x.sub):'')+'</small></div>'+(x.id?delBtn('events',x.id,'Delete appointment'):'<span></span>')+'</li>').join('')+'</ul>':'<div class="empty">Nothing on this day.</div>')+
  '<h3>Add an appointment on this day</h3><div class="form"><label class="fld">Title<input class="in" id="evTitle" placeholder="Cake tasting"></label><label class="fld">Time<input class="in" id="evTime" type="time"></label><label class="fld">Type<select class="in" id="evType">'+EVTYPES.map(x=>'<option>'+x+'</option>').join('')+'</select></label></div><p><button class="btn pri" data-act="addEvent">Add to calendar</button></p></section>'+
  '<section class="panel"><h3>All appointments</h3><div class="tbl-wrap" style="margin:0"><table style="min-width:520px"><thead><tr><th>Date</th><th>Time</th><th>Title</th><th>Type</th><th></th></tr></thead><tbody>'+
  (evs.length?evs.map(r=>'<tr><td>'+inp('events',r.id,'date',r.date,{type:'date'})+'</td><td>'+inp('events',r.id,'time',r.time,{type:'time'})+'</td><td>'+inp('events',r.id,'title',r.title)+'</td><td>'+sel('events',r.id,'type',r.type,EVTYPES)+'</td><td>'+delBtn('events',r.id)+'</td></tr>').join(''):'<tr><td colspan="5" class="empty">No appointments yet.</td></tr>')+'</tbody></table></div></section></div>';
}};

VIEWS.budget={title:'Budget',render(){
  const rows=state.budget.slice().sort((a,b)=>CATS.indexOf(a.cat)-CATS.indexOf(b.cat));
  return head('Budget','Estimates, final quotes and payments. The dashboard updates as you type.','<label class="fld inline">Total budget ₱'+money('meta','','budget',state.meta.budget,'Total budget')+'</label>'+addBtn('budget','Add item'))+
  '<section class="dash" data-dash="budget"></section>'+
  '<div class="tbl-wrap"><table><thead><tr><th>Item</th><th>Category</th><th>Vendor</th><th class="r">Estimate</th><th class="r">Final quote</th><th class="r">Paid</th><th class="r">Balance</th><th>Due</th><th></th></tr></thead><tbody>'+
  rows.map(r=>'<tr><td style="min-width:200px">'+inp('budget',r.id,'item',r.item,{ph:'Item'})+'</td><td>'+sel('budget',r.id,'cat',r.cat,CATS)+'</td><td style="min-width:130px">'+inp('budget',r.id,'vendor',r.vendor,{ph:'Vendor'})+'</td><td style="min-width:104px">'+money('budget',r.id,'est',r.est,'Estimate')+'</td><td style="min-width:104px">'+money('budget',r.id,'actual',r.actual,'Final quote')+'</td><td style="min-width:104px">'+money('budget',r.id,'paid',r.paid,'Paid')+'</td><td class="r" style="padding-right:10px" data-calc="bal" data-id="'+r.id+'"></td><td>'+inp('budget',r.id,'due',r.due,{type:'date'})+'</td><td>'+delBtn('budget',r.id)+'</td></tr>').join('')+
  '</tbody><tfoot><tr><td colspan="3">Totals</td><td class="r" data-calc="tot-est"></td><td class="r" data-calc="tot-act"></td><td class="r" data-calc="tot-paid"></td><td class="r" data-calc="tot-bal"></td><td colspan="2"></td></tr></tfoot></table></div>';
}};

const VROWS=[
  ['status','Status','sel',VSTAT],['location','Location','text'],['type','Venue type','sel',VTYPE],['capacity','Capacity (guests)','int'],['fit','Fits your guest list','calc','vfit'],
  ['price','Package price','money'],['per','Cost per target guest','calc','vper'],['includes','What is included','area'],['extras','Overtime, corkage, extras','area'],
  ['catering','Catering rules','sel',VCATER],['rain','Rain plan','sel',RAIN],['parking','Parking slots','int'],['drive','Travel time','text'],
  ['r1','Ambience (1–5)','rate'],['r2','Value (1–5)','rate'],['r3','Access and parking (1–5)','rate'],['r4','Staff and flexibility (1–5)','rate'],['score','Overall score','calc','vscore'],['notes','Pros and cons','area']];
VIEWS.venues={title:'Venue comparison',render(){
  const vs=state.venues;
  const cell=(r,v)=>{const k='venues',f=r[0];switch(r[2]){
    case 'sel':return sel(k,v.id,f,v[f],r[3]);
    case 'int':return intf(k,v.id,f,v[f],r[1]);
    case 'money':return money(k,v.id,f,v[f],r[1]);
    case 'area':return area(k,v.id,f,v[f]);
    case 'rate':return '<select class="in" '+at(k,v.id,f,'int')+' aria-label="'+r[1]+'">'+[0,1,2,3,4,5].map(n=>'<option value="'+n+'"'+(v[f]===n?' selected':'')+'>'+(n?n+(n>=4?' ★':''):'—')+'</option>').join('')+'</select>';
    case 'calc':return '<div style="padding:6px 8px" data-calc="'+r[3]+'" data-id="'+v.id+'"></div>';
    default:return inp(k,v.id,f,v[f],{label:r[1]});}};
  return head('Venue comparison','Venues side by side. Scores, price per guest and whether the room fits your guest list update as you edit.',addBtn('venues','Add venue')+clearBtn('venues','Clear all venues'))+
  (vs.length?'<div class="tbl-wrap"><table class="vt"><thead><tr><th class="rowlab"></th>'+vs.map(v=>'<th style="min-width:230px;max-width:230px;text-transform:none;letter-spacing:0;padding:8px 6px"><div style="display:flex;align-items:center;gap:4px"><span style="flex:1">'+inp('venues',v.id,'name',v.name,{cls:'vname',ph:'Venue name',label:'Venue name'})+'</span>'+delBtn('venues',v.id,'Remove venue')+'</div></th>').join('')+'</tr></thead><tbody>'+
  VROWS.map(r=>'<tr'+(r[2]==='calc'?' class="calcrow"':'')+'><td class="rowlab">'+r[1]+'</td>'+vs.map(v=>'<td>'+cell(r,v)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>':'<div class="empty tbl-wrap">No venues yet. Add the first one you are considering.</div>');
}};

VIEWS.vendors={title:'Vendor comparison',render(){
  let rows=state.vendors.slice();if(ui.vfilter!=='All')rows=rows.filter(v=>v.cat===ui.vfilter);
  rows.sort((a,b)=>VCAT.indexOf(a.cat)-VCAT.indexOf(b.cat));
  const cover=NEED.map(c=>{const rs=state.vendors.filter(v=>v.cat===c);const st=rs.some(v=>v.status==='Booked')?'Booked':rs.some(v=>v.status==='Shortlisted')?'Shortlisted':rs.length?'Comparing':'Not started';return{c,st}});
  const tone={Booked:['ok','✓'],Shortlisted:['info','◆'],Comparing:['warn','●'],'Not started':['mute','○']};
  const booked=cover.filter(x=>x.st==='Booked').length;
  return head('Vendor comparison','Collect quotes in one list. The lowest quote and top-rated vendor in each category are flagged for you.',addBtn('vendors','Add quote')+clearBtn('vendors','Clear all quotes'))+
  '<section class="dash"><div class="stats">'+stat('Essential vendors booked',booked+' of '+NEED.length,'',booked===NEED.length?'good':'')+stat('Quotes collected',state.vendors.length)+stat('Booked so far',PHP(sum(state.vendors.filter(v=>v.status==='Booked'),v=>v.quote)))+'</div><h3>Booking status by category</h3><div class="chips" style="margin:0">'+cover.map(x=>'<span class="pill '+tone[x.st][0]+'" style="padding:5px 12px;font-size:13px">'+tone[x.st][1]+' '+x.c+' · '+x.st+'</span>').join('')+'</div></section>'+
  chipRow('vfilter',['All'].concat(VCAT),ui.vfilter)+
  '<div class="tbl-wrap"><table><thead><tr><th>Category</th><th>Vendor</th><th>Contact</th><th>Package and inclusions</th><th class="r">Quote</th><th>Rating</th><th>Status</th><th>Flags</th><th></th></tr></thead><tbody>'+
  (rows.length?rows.map(r=>'<tr><td>'+sel('vendors',r.id,'cat',r.cat,VCAT)+'</td><td style="min-width:140px">'+inp('vendors',r.id,'vendor',r.vendor,{ph:'Vendor name'})+'</td><td style="min-width:130px">'+inp('vendors',r.id,'contact',r.contact,{ph:'Phone or handle'})+'</td><td style="min-width:240px">'+inp('vendors',r.id,'pkg',r.pkg,{ph:'What is included'})+'</td><td style="min-width:104px">'+money('vendors',r.id,'quote',r.quote,'Quote')+'</td><td><select class="in" '+at('vendors',r.id,'rating','int')+' aria-label="Rating">'+[0,1,2,3,4,5].map(n=>'<option value="'+n+'"'+(r.rating===n?' selected':'')+'>'+(n?n+' ★':'—')+'</option>').join('')+'</select></td><td>'+sel('vendors',r.id,'status',r.status,QSTAT)+'</td><td data-calc="vflag" data-id="'+r.id+'"></td><td>'+delBtn('vendors',r.id)+'</td></tr>').join(''):'<tr><td colspan="9" class="empty">No quotes in this category yet.</td></tr>')+'</tbody></table></div>';
}};

VIEWS.guests={title:'Guest list',render(){
  let rows=state.guests.slice();if(ui.gfilter!=='All')rows=rows.filter(g=>g.rsvp===ui.gfilter);
  const topts=state.tables.map(t=>'<option value="'+t.id+'">'+esc(t.name)+'</option>').join('');
  const tsel=g=>'<select class="in" '+at('guests',g.id,'table')+' aria-label="Table"><option value="">—</option>'+state.tables.map(t=>'<option value="'+t.id+'"'+(t.id===g.table?' selected':'')+'>'+esc(t.name)+'</option>').join('')+'</select>';
  return head('Guest list','Who is coming, what they will eat, and where they sit.',addBtn('guests','Add guest')+clearBtn('guests','Clear all guests'))+
  '<section class="dash" data-dash="guests"></section>'+
  '<div class="chips">'+['All'].concat(RSVP).map(o=>'<button class="cb" data-act="setui" data-ui="gfilter" data-v="'+o+'" aria-pressed="'+(o===ui.gfilter)+'">'+o+'</button>').join('')+'<input class="search" id="gq" data-ui="gq" type="search" placeholder="Search names" value="'+esc(ui.gq)+'" aria-label="Search guests"></div>'+
  '<div class="tbl-wrap"><table><thead><tr><th>Name</th><th>Side</th><th>Group</th><th>RSVP</th><th>Meal</th><th>Table</th><th>Notes</th><th></th></tr></thead><tbody>'+
  (rows.length?rows.map(g=>'<tr data-q="'+esc((g.name+' '+g.notes).toLowerCase())+'"><td style="min-width:170px">'+inp('guests',g.id,'name',g.name,{ph:'Full name'})+'</td><td>'+sel('guests',g.id,'side',g.side,SIDES)+'</td><td>'+sel('guests',g.id,'group',g.group,GROUPS)+'</td><td>'+sel('guests',g.id,'rsvp',g.rsvp,RSVP)+'</td><td>'+sel('guests',g.id,'meal',g.meal,MEALS)+'</td><td>'+tsel(g)+'</td><td style="min-width:160px">'+inp('guests',g.id,'notes',g.notes,{ph:'Allergies, plus one…'})+'</td><td>'+delBtn('guests',g.id)+'</td></tr>').join(''):'<tr><td colspan="8" class="empty">No guests match. Add your first guest or paste a list below.</td></tr>')+'</tbody></table></div>'+
  '<section class="panel"><h3>Paste a list of names</h3><p class="sn" style="margin:0 0 8px">One name per line. Everyone is added as awaiting reply.</p><textarea class="in" id="gbulk" rows="4" style="border-color:var(--line-strong);background:var(--surface)" placeholder="Lola Remedios&#10;Tito Ramon and family"></textarea><p><button class="btn" data-act="addNames">Add names</button></p></section>';
}};

function tableSvg(cap,n){
  const seats=[];const R=40;
  for(let i=0;i<cap;i++){const a=-Math.PI/2+i*2*Math.PI/cap;const f=i<n;seats.push('<circle cx="'+(60+R*Math.cos(a)).toFixed(1)+'" cy="'+(60+R*Math.sin(a)).toFixed(1)+'" r="6.5" style="fill:'+(f?'var(--accent)':'var(--surface)')+';stroke:'+(f?'var(--accent)':'var(--line-strong)')+';stroke-width:1.5"/>')}
  return '<svg viewBox="0 0 120 120" width="112" height="112" role="img" aria-label="'+n+' of '+cap+' seats filled">'+seats.join('')+'<circle cx="60" cy="60" r="25" style="fill:var(--surface-2);stroke:var(--line)"/><text x="60" y="65" text-anchor="middle" style="font:600 15px var(--body);fill:var(--ink)">'+n+'/'+cap+'</text></svg>';
}
VIEWS.seating={title:'Seating plan',render(){
  const att=state.guests.filter(g=>g.rsvp!=='No');
  const seated=att.filter(g=>state.tables.some(t=>t.id===g.table));
  const pool=att.filter(g=>!state.tables.some(t=>t.id===g.table));
  const seats=sum(state.tables,t=>t.cap);
  const tsel=g=>'<select class="in" '+at('guests',g.id,'table')+' aria-label="Seat '+esc(g.name)+' at"><option value="">Seat at…</option>'+state.tables.map(t=>'<option value="'+t.id+'">'+esc(t.name)+'</option>').join('')+'</select>';
  const declined=state.guests.filter(g=>g.rsvp==='No'&&state.tables.some(t=>t.id===g.table));
  return head('Seating plan','Drag a guest onto a table, or pick a table from the menu. Guests who declined are left out.',addBtn('tables','Add table'))+
  '<section class="dash"><div class="stats">'+stat('Seats available',seats)+stat('Guests seated',seated.length,'of '+att.length+' attending or pending')+stat('Still to seat',pool.length,'',pool.length?'warn':'good')+stat('Tables',state.tables.length)+'</div>'+(declined.length?'<p class="sn" style="margin:12px 0 0">'+pill(declined.length+' seated guest'+(declined.length>1?'s':'')+' declined','bad','!')+' Remove them from tables: '+declined.map(g=>esc(g.name)).join(', ')+'.</p>':'')+'</section>'+
  '<div class="tables">'+state.tables.map(t=>{const gs=att.filter(g=>g.table===t.id);const over=gs.length>t.cap;return '<div class="tcard'+(over?' full':'')+'" data-drop="'+t.id+'"><div class="thead">'+inp('tables',t.id,'name',t.name,{label:'Table name',cls:'vname'})+intf('tables',t.id,'cap',t.cap,'Seats')+delBtn('tables',t.id,'Delete table')+'</div><div class="tsvg">'+tableSvg(t.cap,Math.min(gs.length,t.cap))+'</div>'+(over?'<div style="text-align:center;margin-bottom:4px">'+pill((gs.length-t.cap)+' over capacity','bad','!')+'</div>':'')+gs.map(g=>'<div class="gc" draggable="true" data-drag="'+g.id+'"><span>'+esc(g.name)+(g.rsvp==='Pending'?' <small class="sn">· pending</small>':'')+'</span><button class="x" data-act="unseat" data-id="'+g.id+'" aria-label="Unseat '+esc(g.name)+'">×</button></div>').join('')+(gs.length?'':'<div class="sn" style="text-align:center">Drop guests here</div>')+'</div>'}).join('')+'</div>'+
  '<section class="panel pool" data-drop="" style="margin-top:22px"><h3>Not seated yet ('+pool.length+')</h3>'+(pool.length?pool.map(g=>'<div class="gcp gc" draggable="true" data-drag="'+g.id+'"><span>'+esc(g.name)+' <small class="sn">· '+esc(g.group)+'</small></span>'+tsel(g)+'</div>').join(''):'<div class="empty">Everyone attending has a seat.</div>')+'</section>';
}};

VIEWS.mood={title:'Mood board',render(){
  const md=state.mood,pal=md.palette;
  const words=(md.words||'').split(',').map(s=>s.trim()).filter(Boolean);
  const CATM=['Flowers','Table','Attire','Stationery','Food','Lighting','Venue','Music','Other'];
  return head('Mood board','Colors, textures and ideas that set the look of the day.',addBtn('mood.palette','Add color')+addBtn('mood.tiles','Add idea'))+
  '<section class="panel"><h3>Palette</h3><div class="swatches">'+pal.map(c=>'<div class="swc"><label class="swatch" style="background:'+esc(c.hex)+';color:'+ink(c.hex)+'"><input type="color" '+at('mood.palette',c.id,'hex')+' value="'+esc(c.hex)+'" aria-label="Pick color for '+esc(c.name)+'"><span>'+esc(c.hex.toUpperCase())+'</span></label><div style="display:flex;gap:2px">'+inp('mood.palette',c.id,'name',c.name,{label:'Color name'})+delBtn('mood.palette',c.id,'Remove color')+'</div></div>').join('')+'</div></section>'+
  '<section class="panel"><h3>Feeling in a few words</h3><label class="fld">Separate with commas'+inp('mood','','words',md.words)+'</label><div class="words">'+words.map(w=>'<span class="word">'+esc(w)+'</span>').join('')+'</div></section>'+
  '<div class="mtiles">'+md.tiles.map((t,i)=>{const c=pal.length?pal[i%pal.length].hex:'#cccccc';return '<figure class="mt" style="margin:0"><div class="mimg" style="background:'+esc(c)+';color:'+ink(c)+'">'+(t.img?'<img src="'+esc(t.img)+'" alt="'+esc(t.title)+'" loading="lazy">':'<span>'+esc(t.title||'New idea')+'</span>')+
  '<div class="ov">'+(ui.assets?'<label class="btn sm" style="cursor:pointer">'+(ui.uploading===t.id?'Uploading…':(t.img?'Change':'Add photo'))+'<input type="file" accept="image/*" hidden data-up="'+t.id+'"></label>':'')+(t.img?'<button class="btn sm" data-act="rmimg" data-id="'+t.id+'">Remove</button>':'')+'</div></div><div class="mb">'+
  '<div style="display:flex;gap:2px">'+sel('mood.tiles',t.id,'cat',t.cat,CATM,{label:'Category'})+delBtn('mood.tiles',t.id,'Delete idea')+'</div>'+inp('mood.tiles',t.id,'title',t.title,{ph:'Title',label:'Title'})+area('mood.tiles',t.id,'note',t.note,'Notes')+'</div></figure>'}).join('')+'</div>'+
  (ui.assets?'':'<p class="sn" style="margin-top:14px">Photo upload is available when you open this planner as its owner or an editor. Until then, use colors, titles and notes.</p>');
}};

VIEWS.outfits={title:'Outfit details',render(){
  return head('Outfit details','One card per person. Track the look, who is making it, and every fitting and pickup date.',addBtn('outfits','Add outfit'))+
  '<section class="dash" data-dash="outfits"></section><div class="ocards">'+
  state.outfits.map(o=>'<div class="oc"><div style="display:flex;gap:2px;align-items:center">'+inp('outfits',o.id,'who',o.who,{cls:'who',ph:'Who',label:'Who'})+delBtn('outfits',o.id,'Delete outfit')+'</div>'+
  '<label class="fld">Outfit'+inp('outfits',o.id,'outfit',o.outfit)+'</label>'+
  '<div class="two"><label class="fld">Made or bought at'+inp('outfits',o.id,'shop',o.shop)+'</label><label class="fld">Color and fabric'+inp('outfits',o.id,'color',o.color)+'</label></div>'+
  '<div class="two"><label class="fld">Accessories'+inp('outfits',o.id,'acc',o.acc)+'</label><label class="fld">Shoes'+inp('outfits',o.id,'shoes',o.shoes)+'</label></div>'+
  '<div class="two"><label class="fld">Fitting'+inp('outfits',o.id,'fitting',o.fitting,{type:'date'})+'</label><label class="fld">Pickup'+inp('outfits',o.id,'pickup',o.pickup,{type:'date'})+'</label></div>'+
  '<div class="two"><label class="fld">Cost (₱)'+money('outfits',o.id,'cost',o.cost,'Cost')+'</label><label class="fld">Status'+sel('outfits',o.id,'status',o.status,OSTAT)+'</label></div>'+
  '<label class="fld">Notes'+area('outfits',o.id,'notes',o.notes,'Alterations, sizes, reminders')+'</label></div>').join('')+'</div>';
}};

VIEWS.photo={title:'Photography plan',render(){
  const p=state.photo;const shots=p.shots.slice().sort((a,b)=>(SHOTG.indexOf(a.group)-SHOTG.indexOf(b.group))||(a.time||'').localeCompare(b.time||''));
  return head('Photography plan','Coverage details, the shot list and the family photos your photographer needs to know about.')+
  '<section class="dash" data-dash="photo"></section>'+
  '<section class="panel"><h3>Coverage</h3><div class="form"><label class="fld">Photographer'+inp('photo','','photographer',p.photographer)+'</label><label class="fld">Videographer'+inp('photo','','videographer',p.videographer)+'</label><label class="fld">Hours of coverage'+inp('photo','','hours',p.hours)+'</label><label class="fld">Second shooter'+inp('photo','','second',p.second)+'</label><label class="fld">Starts'+inp('photo','','start',p.start,{type:'time'})+'</label><label class="fld">Ends'+inp('photo','','end',p.end,{type:'time'})+'</label><label class="fld">Photos delivered by'+inp('photo','','delivery',p.delivery,{type:'date'})+'</label></div>'+
  '<div class="grid2" style="margin-top:14px"><label class="fld">Style notes'+area('photo','','style',p.style,'Natural light, candid…')+'</label><label class="fld">Moments we cannot miss'+area('photo','','must',p.must,'List the people and moments')+'</label></div></section>'+
  '<div class="head" style="margin-bottom:10px"><h3 style="font:500 24px var(--display);margin:0">Shot list</h3>'+addBtn('photo.shots','Add shot')+'</div>'+
  '<div class="tbl-wrap"><table><thead><tr><th class="c">Got it</th><th>Shot</th><th>Moment</th><th>Who</th><th>Time</th><th>Where</th><th class="c">Must have</th><th></th></tr></thead><tbody>'+
  shots.map(s=>'<tr class="'+(s.done?'done':'')+'"><td class="c">'+chk('photo.shots',s.id,'done',s.done,'Captured')+'</td><td style="min-width:230px">'+inp('photo.shots',s.id,'shot',s.shot,{ph:'Shot'})+'</td><td>'+sel('photo.shots',s.id,'group',s.group,SHOTG)+'</td><td style="min-width:120px">'+inp('photo.shots',s.id,'who',s.who)+'</td><td>'+inp('photo.shots',s.id,'time',s.time,{type:'time'})+'</td><td style="min-width:120px">'+inp('photo.shots',s.id,'where',s.where)+'</td><td class="c">'+chk('photo.shots',s.id,'must',s.must,'Must have')+'</td><td>'+delBtn('photo.shots',s.id)+'</td></tr>').join('')+'</tbody></table></div>'+
  '<div class="head" style="margin:22px 0 10px"><h3 style="font:500 24px var(--display);margin:0">Family photo groups</h3>'+addBtn('photo.groups','Add group')+'</div>'+
  '<div class="tbl-wrap"><table style="min-width:520px"><thead><tr><th>Group</th><th>Who is in it</th><th></th></tr></thead><tbody>'+p.groups.map(g=>'<tr><td style="min-width:220px">'+inp('photo.groups',g.id,'group',g.group)+'</td><td style="min-width:260px">'+inp('photo.groups',g.id,'who',g.who,{ph:'Names'})+'</td><td>'+delBtn('photo.groups',g.id)+'</td></tr>').join('')+'</tbody></table></div>';
}};

VIEWS.playlist={title:'Wedding day playlist',render(){
  const rows=state.playlist.slice().sort((a,b)=>MOMENTS.indexOf(a.moment)-MOMENTS.indexOf(b.moment));
  return head('Wedding day playlist','Songs by moment, so your DJ or band knows the cue for each one.',addBtn('playlist','Add song')+clearBtn('playlist','Clear all songs'))+
  '<section class="dash" data-dash="playlist"></section>'+
  '<div class="tbl-wrap"><table><thead><tr><th>Moment</th><th>Song</th><th>Artist</th><th>Cue or notes</th><th>Status</th><th>Listen</th><th></th></tr></thead><tbody>'+
  (rows.length?rows.map(s=>'<tr><td>'+sel('playlist',s.id,'moment',s.moment,MOMENTS)+'</td><td style="min-width:200px">'+inp('playlist',s.id,'title',s.title,{ph:'Song title'})+'</td><td style="min-width:170px">'+inp('playlist',s.id,'artist',s.artist,{ph:'Artist'})+'</td><td style="min-width:200px">'+inp('playlist',s.id,'notes',s.notes,{ph:'Version, length, cue'})+'</td><td>'+sel('playlist',s.id,'status',s.status,PSTAT)+'</td><td><a class="btn sm" style="text-decoration:none;display:inline-block" target="_blank" rel="noopener" href="https://open.spotify.com/search/'+encodeURIComponent((s.title+' '+s.artist).trim())+'">Find</a></td><td>'+delBtn('playlist',s.id)+'</td></tr>').join(''):'<tr><td colspan="7" class="empty">No songs yet. Start with the first dance.</td></tr>')+'</tbody></table></div>'+
  '<section class="panel"><h3>Do not play</h3><label class="fld">One per line'+area('meta','','dnp',state.meta.dnp,'Songs or genres to skip')+'</label></section>';
}};

VIEWS.timeline={title:'Wedding day timeline',render(){
  const rows=state.timeline.slice().sort((a,b)=>(a.time||'99').localeCompare(b.time||'99'));
  const ph=t=>!t?'':(t<'12:00'?'Morning':t<'17:00'?'Afternoon':'Evening');let last='';
  return head('Wedding day timeline','Hour by hour, from the first hair curl to the send-off. Share it with every vendor and the entourage.',addBtn('timeline','Add moment'))+
  '<section class="dash"><div class="stats">'+stat('Moments',rows.length)+stat('Starts',rows.length?fmtTime(rows[0].time):'—')+stat('Ends',rows.length?fmtTime(rows[rows.length-1].time):'—')+stat('Ceremony',fmtTime((rows.find(r=>/ceremony begins|ceremony starts/i.test(r.title))||{}).time)||'Not set')+'</div></section>'+
  '<div class="tl">'+rows.map(r=>{const p=ph(r.time);let h='';if(p!==last){last=p;h='<div class="phase">'+p+'</div>'}return h+'<div class="tr"><div>'+inp('timeline',r.id,'time',r.time,{type:'time',label:'Time'})+'</div><div class="dot"></div><div class="tbody"><div>'+inp('timeline',r.id,'title',r.title,{ph:'What happens',label:'What happens'})+'</div><div>'+inp('timeline',r.id,'who',r.who,{ph:'Who',label:'Who'})+'</div><div>'+inp('timeline',r.id,'where',r.where,{ph:'Where',label:'Where'})+'</div><div class="full">'+inp('timeline',r.id,'notes',r.notes,{ph:'Notes for vendors',label:'Notes'})+'</div></div><div>'+delBtn('timeline',r.id,'Delete moment')+'</div></div>'}).join('')+'</div>';
}};

VIEWS.emergency={title:'Emergency checklist',render(){
  const kit=state.emergency.kit;const groups=[...new Set(kit.map(k=>k.group))];
  return head('Emergency checklist','What to pack, who to call, and what to do if the day does not go to plan.')+
  '<section class="dash" data-dash="emergency"></section>'+
  '<div class="grid2"><section class="panel"><h3>Pack list</h3>'+groups.map(g=>'<div class="kg2"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><b>'+esc(g)+'</b><button class="btn sm" data-act="addKit" data-g="'+esc(g)+'">+ Add item</button></div>'+kit.filter(k=>k.group===g).map(k=>'<div class="krow'+(k.done?' dn':'')+'">'+chk('emergency.kit',k.id,'done',k.done,'Packed')+inp('emergency.kit',k.id,'text',k.text,{label:'Item'})+delBtn('emergency.kit',k.id)+'</div>').join('')+'</div>').join('')+'</section>'+
  '<section class="panel"><h3>Emergency contacts</h3><div class="tbl-wrap" style="margin:0 0 10px"><table style="min-width:440px"><thead><tr><th>Role</th><th>Name</th><th>Phone</th><th></th></tr></thead><tbody>'+state.emergency.contacts.map(c=>'<tr><td>'+inp('emergency.contacts',c.id,'role',c.role)+'</td><td>'+inp('emergency.contacts',c.id,'name',c.name,{ph:'Name'})+'</td><td>'+inp('emergency.contacts',c.id,'phone',c.phone,{ph:'0917…',attr:'inputmode="tel"'})+'</td><td>'+delBtn('emergency.contacts',c.id)+'</td></tr>').join('')+'</tbody></table></div>'+addBtn('emergency.contacts','Add contact')+'</section></div>'+
  '<section class="panel"><h3>If this happens, we will…</h3><div class="tbl-wrap" style="margin:0 0 10px"><table style="min-width:560px"><thead><tr><th>What could go wrong</th><th>Our plan</th><th></th></tr></thead><tbody>'+state.emergency.plans.map(p=>'<tr><td style="min-width:200px;vertical-align:top">'+area('emergency.plans',p.id,'risk',p.risk)+'</td><td style="min-width:300px">'+area('emergency.plans',p.id,'plan',p.plan)+'</td><td>'+delBtn('emergency.plans',p.id)+'</td></tr>').join('')+'</tbody></table></div>'+addBtn('emergency.plans','Add backup plan')+'</section>';
}};

/* ---------- shell: masthead, nav, render ---------- */
const NAV=[['Plan',[['overview','Overview'],['tasks','Task tracker'],['summary','Task summary'],['calendar','Calendar']]],
  ['Money',[['budget','Budget'],['venues','Venue comparison'],['vendors','Vendor comparison']]],
  ['People',[['guests','Guest list'],['seating','Seating plan']]],
  ['Look and feel',[['mood','Mood board'],['outfits','Outfit details'],['photo','Photography plan'],['playlist','Wedding day playlist']]],
  ['The big day',[['timeline','Wedding day timeline'],['emergency','Emergency checklist']]]];
function renderMast(){
  const m=state.meta,days=diffDays(m.date,todayISO());
  const cd=days>0?'<b>'+days+'</b> days to go':days===0?'<b>Today</b> is the day':'Married <b>'+(-days)+'</b> days ago';
  $('#mast').innerHTML='<div class="eyebrow">Wedding planner</div><h1 class="names">'+esc(m.a||'—')+' <em>&amp;</em> '+esc(m.b||'—')+'</h1><div class="when">'+esc(fmtDate(m.date,{weekday:'long',month:'long',day:'numeric',year:'numeric'}))+'</div><div class="cd">'+cd+'</div><div class="sync" id="sync" aria-live="polite">'+esc(SYNC)+'</div>'+(window.claude&&window.claude.use?'':'<div class="bk"><button class="btn sm" data-act="backup">Download backup</button><label class="btn sm" style="cursor:pointer">Restore backup<input type="file" accept="application/json,.json" hidden data-restore="1"></label>'+(REMOTE?'<button class="btn sm" data-act="signout">Sign out</button>':'')+'</div>');
}
function renderNav(){
  const cnt={tasks:state.tasks.filter(t=>t.status!=='Done').length,guests:state.guests.length};
  $('#nav').innerHTML=NAV.map(g=>'<div class="ng"><div class="nlab">'+g[0]+'</div>'+g[1].map(i=>'<button class="nl" data-go="'+i[0]+'"'+(ui.cur===i[0]?' aria-current="page"':'')+'>'+i[1]+(cnt[i[0]]!=null?' <small>'+cnt[i[0]]+'</small>':'')+'</button>').join('')+'</div>').join('');
  const a=$('#nav [aria-current]');if(a&&a.scrollIntoView&&window.innerWidth<960)try{a.scrollIntoView({inline:'center',block:'nearest'})}catch(e){}
}
function refreshDerived(){
  document.querySelectorAll('[data-dash]').forEach(el=>{el.innerHTML=DASH[el.dataset.dash]()});
  document.querySelectorAll('[data-calc]').forEach(el=>{const f=CALC[el.dataset.calc];if(f)el.innerHTML=f(el.dataset.id)});
  renderMast();
}
function applySearch(){const q=(ui.gq||'').toLowerCase().trim();document.querySelectorAll('#view tbody tr[data-q]').forEach(r=>{r.hidden=!!q&&r.dataset.q.indexOf(q)<0})}
function snapFocus(){const a=document.activeElement;if(a&&a.dataset&&a.dataset.f&&$('#view').contains(a))return{k:a.dataset.k,id:a.dataset.id||'',f:a.dataset.f,s:a.selectionStart,e:a.selectionEnd};return null}
function restoreFocus(p,sc){if(!p)return;const el=[...document.querySelectorAll('#view [data-f]')].find(x=>x.dataset.k===p.k&&(x.dataset.id||'')===p.id&&x.dataset.f===p.f);if(el){el.focus({preventScroll:!sc});try{if(p.s!=null&&p.s!==undefined)el.setSelectionRange(p.s,p.e)}catch(e){}}}
function render(keep){
  const p=keep===false?null:snapFocus(),y=window.scrollY;
  $('#view').innerHTML=VIEWS[ui.cur].render();
  refreshDerived();renderNav();applySearch();
  if(ui.focus){const f=ui.focus;ui.focus=null;restoreFocus(f,true)}else restoreFocus(p);
  if(keep!==false)window.scrollTo(0,y);
}
function go(id){if(!VIEWS[id])id='overview';ui.cur=id;try{location.hash=id}catch(e){}render(false);window.scrollTo(0,0)}

let toastTimer=null;
function toast(msg,undo){const t=$('#toast');t.hidden=false;t.innerHTML='<span>'+esc(msg)+'</span>'+(undo?'<button data-act="undo">Undo</button>':'');clearTimeout(toastTimer);toastTimer=setTimeout(()=>{t.hidden=true;ui.undo=null},6000)}

/* ---------- editing ---------- */
const ADD={
  tasks:()=>({id:uid(),title:'',cat:CATS[0],owner:'',due:'',pri:'Med',status:'To do'}),
  budget:()=>({id:uid(),cat:CATS[0],item:'',vendor:'',est:0,actual:0,paid:0,due:''}),
  guests:()=>({id:uid(),name:'',side:'Both',group:'Friends',rsvp:'Pending',meal:'TBD',table:'',notes:''}),
  venues:()=>({id:uid(),name:'New venue',status:'Shortlisted',location:'',type:'Garden',capacity:0,price:0,includes:'',extras:'',catering:'In-house only',rain:'Indoor option',parking:0,drive:'',r1:0,r2:0,r3:0,r4:0,notes:''}),
  vendors:()=>({id:uid(),cat:ui.vfilter!=='All'?ui.vfilter:VCAT[0],vendor:'',contact:'',pkg:'',quote:0,rating:0,status:'Inquiry'}),
  tables:()=>({id:uid(),name:'Table '+(state.tables.length),cap:10}),
  events:()=>({id:uid(),date:ui.calSel,time:'',title:'',type:'Appointment'}),
  outfits:()=>({id:uid(),who:'New outfit',outfit:'',shop:'',color:'',acc:'',shoes:'',fitting:'',pickup:'',cost:0,status:'To order',notes:''}),
  playlist:()=>({id:uid(),moment:'First dance',title:'',artist:'',notes:'',status:'Considering'}),
  timeline:()=>{const l=state.timeline.slice().sort((a,b)=>(a.time||'').localeCompare(b.time||'')).pop();return{id:uid(),time:l?l.time:'12:00',title:'',who:'',where:'',notes:''}},
  'mood.palette':()=>({id:uid(),name:'New color',hex:'#8a8f7a'}),
  'mood.tiles':()=>({id:uid(),cat:'Other',title:'',note:'',img:''}),
  'photo.shots':()=>({id:uid(),group:'Ceremony',shot:'',who:'',time:'',where:'',must:false,done:false}),
  'photo.groups':()=>({id:uid(),group:'',who:''}),
  'emergency.contacts':()=>({id:uid(),role:'',name:'',phone:''}),
  'emergency.plans':()=>({id:uid(),risk:'',plan:''})
};
const FIRST={tasks:'title',budget:'item',guests:'name',venues:'name',vendors:'vendor',tables:'name',events:'title',outfits:'who',playlist:'title',timeline:'title','mood.palette':'name','mood.tiles':'title','photo.shots':'shot','photo.groups':'group','emergency.contacts':'role','emergency.plans':'risk'};
function commit(t){
  const d=t.dataset;let v=t.type==='checkbox'?t.checked:t.value;
  if(d.t==='done')v=t.checked?'Done':'To do';
  else if(d.t==='num')v=num(v);
  else if(d.t==='int')v=Math.max(0,Math.round(num(v)));
  const rec=d.id?(getPath(d.k)||[]).find(r=>r.id===d.id):getPath(d.k);
  if(!rec)return;rec[d.f]=v;touch(d.k);
}
function onInput(e){
  const t=e.target;
  if(t.dataset.ui==='gq'){ui.gq=t.value;applySearch();return}
  if(!t.dataset.f||t.tagName==='SELECT'||t.type==='checkbox'||t.type==='file')return;
  if(t.type==='date'||t.type==='time'||t.type==='color')return;
  commit(t);refreshDerived();
}
function onChange(e){
  const t=e.target;
  if(t.dataset.up){const f=t.files&&t.files[0];if(f)uploadTile(t.dataset.up,f);return}
  if(t.dataset.ui&&t.tagName==='SELECT'){ui[t.dataset.ui]=t.value;render();return}
  if(!t.dataset.f)return;
  commit(t);
  if(t.dataset.t==='num')t.value=fmtNum(num(t.value));
  const structural=t.tagName==='SELECT'||t.type==='checkbox'||t.type==='date'||t.type==='time'||t.type==='color';
  if(structural)render();else refreshDerived();
}
function onClick(e){
  const go_=e.target.closest('[data-go]');if(go_){go(go_.dataset.go);return}
  const b=e.target.closest('[data-act]');if(!b)return;const d=b.dataset,a=d.act;
  if(a==='add'){const l=getPath(d.k),r=ADD[d.k]();l.push(r);touch(d.k);ui.focus={k:d.k,id:r.id,f:FIRST[d.k]};render(false);return}
  if(a==='addKit'){const r={id:uid(),group:d.g,text:'',done:false};state.emergency.kit.push(r);touch('emergency.kit');ui.focus={k:'emergency.kit',id:r.id,f:'text'};render();return}
  if(a==='del'){const l=getPath(d.k),i=l.findIndex(r=>r.id===d.id);if(i<0)return;const row=l.splice(i,1)[0];
    if(d.k==='tables')state.guests.forEach(g=>{if(g.table===d.id){g.table='';touch('guests')}});
    ui.undo={k:d.k,row,idx:i};touch(d.k);render();toast('Row deleted',true);return}
  if(a==='undo'){const u=ui.undo;if(u){getPath(u.k).splice(u.idx,0,u.row);touch(u.k);ui.undo=null;$('#toast').hidden=true;render()}return}
  if(a==='clear'){if(ui.confirm===d.k){state[d.k]=[];touch(d.k);ui.confirm=null;render();return}ui.confirm=d.k;render();setTimeout(()=>{if(ui.confirm===d.k){ui.confirm=null;render()}},4000);return}
  if(a==='setui'){ui[d.ui]=d.v;render();return}
  if(a==='calnav'){const p=ui.calMonth.split('-').map(Number);let m=p[1]-1,y=p[0];
    if(d.v==='prev')m--;else if(d.v==='next')m++;
    else if(d.v==='today'){ui.calMonth=todayISO().slice(0,7);ui.calSel=todayISO();render();return}
    else{ui.calMonth=state.meta.date.slice(0,7);ui.calSel=state.meta.date;render();return}
    const n=new Date(y,m,1);ui.calMonth=n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0');render();return}
  if(a==='calsel'){ui.calSel=d.date;ui.calMonth=d.date.slice(0,7);render();return}
  if(a==='addEvent'){const ti=$('#evTitle').value.trim();if(!ti){toast('Give the appointment a title first.');$('#evTitle').focus();return}
    state.events.push({id:uid(),date:ui.calSel,time:$('#evTime').value,title:ti,type:$('#evType').value});touch('events');render();return}
  if(a==='addNames'){const ta=$('#gbulk');const names=ta.value.split('\n').map(s=>s.trim()).filter(Boolean);if(!names.length){toast('Type one name per line first.');return}
    names.forEach(n=>{const r=ADD.guests();r.name=n;state.guests.push(r)});touch('guests');render();toast(names.length+' guest'+(names.length>1?'s':'')+' added');return}
  if(a==='unseat'){const g=state.guests.find(x=>x.id===d.id);if(g){g.table='';touch('guests');render()}return}
  if(a==='backup'){try{const blob=new Blob([JSON.stringify(state)],{type:'application/json'});const u=URL.createObjectURL(blob);const l=document.createElement('a');l.href=u;l.download='wedding-planner-backup-'+todayISO()+'.json';document.body.appendChild(l);l.click();l.remove();setTimeout(()=>URL.revokeObjectURL(u),2000);toast('Backup downloaded. Keep the file somewhere safe.')}catch(err){toast('Could not create the backup file.')}return}
  if(a==='signout'){Object.keys(localStorage).filter(k=>k.indexOf('wp:')===0).forEach(k=>localStorage.removeItem(k));location.reload();return}
  if(a==='rmimg'){const t=state.mood.tiles.find(x=>x.id===d.id);if(t){t.img='';touch('mood');render()}return}
}
async function uploadTile(id,file){
  const t=state.mood.tiles.find(x=>x.id===id);if(!t)return;
  try{const A=await window.claude.use('assets');if(!A){toast('Photo upload is not available here.');return}
    ui.uploading=id;render();const r=await A.upload(file);t.img=r.url;touch('mood');
  }catch(e){toast('That photo could not be uploaded. Try a smaller image.')}
  ui.uploading=null;render();
}
/* drag and drop seating */
function onDragStart(e){const c=e.target.closest&&e.target.closest('[data-drag]');if(c){e.dataTransfer.setData('text/plain',c.dataset.drag);e.dataTransfer.effectAllowed='move'}}
function onDragOver(e){const z=e.target.closest&&e.target.closest('[data-drop]');if(z){e.preventDefault();z.classList.add('over')}}
function onDragLeave(e){const z=e.target.closest&&e.target.closest('[data-drop]');if(z&&!z.contains(e.relatedTarget))z.classList.remove('over')}
function onDrop(e){const z=e.target.closest&&e.target.closest('[data-drop]');if(!z)return;e.preventDefault();
  const g=state.guests.find(x=>x.id===e.dataTransfer.getData('text/plain'));if(g){g.table=z.dataset.drop;touch('guests');render()}}

/* ---------- boot ---------- */
const view=$('#view');
document.addEventListener('click',onClick);
document.addEventListener('change',ev=>{const t=ev.target;if(!t.dataset||!t.dataset.restore)return;const f=t.files&&t.files[0];if(!f)return;const rd=new FileReader();
  rd.onload=()=>{try{const d=JSON.parse(rd.result);let n=0;Object.keys(state).forEach(k=>{if(d[k]!=null){state[k]=d[k];touch(k);n++}});if(!n)throw new Error('empty');render();toast('Backup restored.')}catch(err){toast('That file is not a planner backup.')}};
  rd.readAsText(f);t.value=''});
function saveNow(){clearTimeout(timer);if(DB){flush();return}dirty.forEach(k=>{try{localStorage.setItem('wp:'+k,JSON.stringify(state[k]))}catch(err){}});if(REMOTE){flush();return}dirty.clear()}
window.addEventListener('pagehide',saveNow);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')saveNow()});
view.addEventListener('input',onInput);view.addEventListener('change',onChange);
view.addEventListener('dragstart',onDragStart);view.addEventListener('dragover',onDragOver);view.addEventListener('dragleave',onDragLeave);view.addEventListener('drop',onDrop);
window.addEventListener('hashchange',()=>{const h=location.hash.slice(1);if(VIEWS[h]&&h!==ui.cur){ui.cur=h;render(false)}});
{const h=(location.hash||'').slice(1);if(VIEWS[h])ui.cur=h}
renderMast();render(false);

function loadLocal(){
  Object.keys(state).forEach(k=>{try{const s=localStorage.getItem('wp:'+k);if(s)state[k]=JSON.parse(s)}catch(e){}});
}
async function connect(){
  let db=null;
  try{db=window.claude&&window.claude.use?await window.claude.use('db'):null}catch(e){db=null}
  if(db){
    DB=db;setSync('Connected. Loading your plan…');
    try{
      DB.collection('planner').onSnapshot(snap=>{
        let changed=false;
        snap.docs.forEach(d=>{
          if(!d.exists||d.metadata.hasPendingWrites)return;
          const key=d.id;if(!(key in state)||dirty.has(key)||writing[key])return;
          const dat=d.data();if(!dat||dat.v==null)return;
          if(JSON.stringify(dat.v)!==JSON.stringify(state[key])){state[key]=dat.v;changed=true}
        });
        if(!dirty.size&&!Object.values(writing).some(Boolean))setSync('All changes saved');
        if(changed)render();
      },()=>{DB=null;loadLocal();setSync('Saved on this device only');render()});
    }catch(e){DB=null;loadLocal();setSync('Saved on this device only')}
  }else{loadLocal();setSync('Saved in this browser only');render();initRemote()}
  try{const A=await window.claude.use('assets');if(A){ui.assets=true;if(ui.cur==='mood')render()}}catch(e){}
}

/* ---------- cross-device sync through /api/planner (passcode protected) ---------- */
function clock(){return new Date().toLocaleTimeString('en-PH',{hour:'numeric',minute:'2-digit'})}
async function api(method,body){
  const r=await fetch('/api/planner',{method,headers:{'content-type':'application/json','x-passcode':PASS},body:body?JSON.stringify(body):undefined,cache:'no-store',keepalive:method==='PUT'});
  let j=null;try{j=await r.json()}catch(e){}
  return{status:r.status,json:j};
}
const gate=$('#gate');
function showGate(msg){gate.hidden=false;$('#gerr').textContent=msg||'';setTimeout(()=>{try{$('#gpass').focus()}catch(e){}},50)}
function hideGate(){gate.hidden=true;$('#gerr').textContent=''}
function lockOut(){REMOTE=false;PASS='';try{localStorage.removeItem('wp:pass')}catch(e){}showGate('The passcode is missing or has changed. Enter it again.')}
$('#gform').addEventListener('submit',ev=>{ev.preventDefault();const v=$('#gpass').value;if(!v)return;PASS=v;try{localStorage.setItem('wp:pass',v)}catch(e){}$('#gpass').value='';tryConnect(true)});
function applyRemote(secs,force){
  let changed=false;
  Object.keys(state).forEach(k=>{
    const x=secs[k];if(!x||x.v==null)return;
    if(!force&&(dirty.has(k)||writing[k]||retryKeys.has(k)))return;
    if(force||x.t>(lastT[k]||0)){
      if(JSON.stringify(x.v)!==JSON.stringify(state[k])){state[k]=x.v;changed=true;try{localStorage.setItem('wp:'+k,JSON.stringify(x.v))}catch(e){}}
      lastT[k]=x.t;
    }
  });
  if(changed)render();else renderMast();
}
async function tryConnect(manual){
  let r;try{r=await api('GET')}catch(e){return}
  if(r.status===404||r.status===405||!r.json)return;
  if(r.status===500){setSync('Sync is not set up yet. Saved in this browser only.');return}
  if(r.status===401){showGate(manual?'That passcode did not match. Try again.':'');return}
  if(r.status!==200)return;
  REMOTE=true;hideGate();
  const secs=r.json.sections||{};
  const missing=Object.keys(state).filter(k=>!secs[k]);
  applyRemote(secs,true);
  if(missing.length){missing.forEach(k=>dirty.add(k));setSync('Sync connected. Uploading your plan…');flush()}
  else setSync('Synced '+clock());
  startPolling();
}
function startPolling(){
  if(poll)return;
  poll=setInterval(pull,20000);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')pull()});
}
async function pull(){
  if(!REMOTE||document.hidden)return;
  const a=document.activeElement;
  if(a&&/INPUT|TEXTAREA/.test(a.tagName)&&a.type!=='checkbox'&&$('#view').contains(a))return;
  let r;try{r=await api('GET')}catch(e){return}
  if(r.status===401){lockOut();return}
  if(r.status!==200||!r.json)return;
  applyRemote(r.json.sections||{},false);
  if(!dirty.size&&!Object.values(writing).some(Boolean)&&!retryKeys.size)setSync('Synced '+clock());
}
async function initRemote(){
  if(location.protocol==='file:')return;
  try{PASS=localStorage.getItem('wp:pass')||''}catch(e){PASS=''}
  if(!PASS){try{const r=await api('GET');if(r.status===401)showGate('');else if(r.status===200||r.status===500)tryConnect()}catch(e){}return}
  tryConnect();
}
connect();
})();
