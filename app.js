const SUPABASE_URL='https://cmtbwohbktirmplieeeq.supabase.co';
const SUPABASE_KEY='sb_publishable_tk18F8g4AS7oQF9eV9qGQw_nONj_xiX';
const DEFAULT_TAXONOMY={offers:['Discovery calls','Objection handling','Closing conversations','Consultative selling','Cold outreach','Follow-up systems','CRM discipline','Pipeline review','Pricing confidence','Sales messaging','Lead qualification','Demo practice','Storytelling','Negotiation','Accountability','Mindset and confidence','Founder-led sales','Referral strategy'],needs:['More qualified leads','Better discovery questions','Handle price objections','Improve closing rate','Consistent follow-up','Clearer offer','Shorter sales cycle','Better pitch','Practice role-play','Confidence on calls','CRM habits','Convert free consults','Niche clarity','More referrals','Webinar conversion','Sales scripts','Accountability partner','Premium package selling'],rooms:['Discovery Call Practice Studio','Price Objection Role-Play','Closing Confidence Circle','Pipeline Accountability Café','Cold Outreach Lab','Follow-Up Sprint Room','Offer Clarity Hot Seat','Demo Practice Room','Referral Strategy Table','Founder Sales Circle']};
let sb=null;const $=id=>document.getElementById(id);const state={communityName:'Spark Match Sales Coaching',communityId:null,userKey:key(),myProfileId:null,currentType:'',currentTypeLabel:'',selectedTags:[],me:{name:'',title:'',bio:'',photo_url:'',offers:[],needs:[],current_focus:'',braindate_offer:'',ideal_match:'',meeting_style:'',availability:'',openness:'',email:'',phone:''},people:[],saved:[],taxonomy:DEFAULT_TAXONOMY};
function key(){let k=localStorage.getItem('sparkMatchHlcUserKey');if(!k){k=crypto.randomUUID?crypto.randomUUID():Date.now()+Math.random().toString(16);localStorage.setItem('sparkMatchHlcUserKey',k)}return k}
function status(t,c=''){const e=$('dbStatus');if(e){e.textContent=t;e.className='status '+c}}
function arr(v){if(Array.isArray(v))return v.filter(Boolean);if(!v)return[];if(typeof v==='string'){try{const p=JSON.parse(v);if(Array.isArray(p))return p}catch(e){}return v.split(',').map(x=>x.trim()).filter(Boolean)}return[]}
function prof(r){return{id:r.id,user_key:r.user_key,name:r.name||'',title:r.title||'',bio:r.bio||'',photo_url:r.photo_url||r.photo||'',offers:arr(r.offers),needs:arr(r.needs),current_focus:r.current_focus||'',braindate_offer:r.braindate_offer||'',ideal_match:r.ideal_match||'',meeting_style:r.meeting_style||'',availability:r.availability||'',openness:r.openness||'',email:r.email||'',phone:r.phone||''}}
async function init(){try{sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);status('Connecting...');const {data:c,error:ce}=await sb.from('communities').select('*').eq('name',state.communityName).limit(1).maybeSingle();if(ce)throw ce;if(!c){status('Setup needed','error');return}state.communityId=c.id;const {data:t}=await sb.from('community_taxonomy').select('*').eq('community_id',state.communityId).limit(1).maybeSingle();if(t)state.taxonomy={offers:arr(t.offers).length?arr(t.offers):DEFAULT_TAXONOMY.offers,needs:arr(t.needs).length?arr(t.needs):DEFAULT_TAXONOMY.needs,rooms:arr(t.rooms).length?arr(t.rooms):DEFAULT_TAXONOMY.rooms};const {data:p}=await sb.from('profiles').select('*').eq('community_id',state.communityId).eq('user_key',state.userKey).limit(1).maybeSingle();if(p){Object.assign(state.me,prof(p));state.myProfileId=p.id;hydrate()}await loadPeople();await loadSaved();status('Connected','ok');renderTags();renderAll()}catch(e){console.error(e);status('Connection error','error')}}
async function loadPeople(){if(!sb||!state.communityId)return;const {data,error}=await sb.from('profiles').select('*').eq('community_id',state.communityId).order('updated_at',{ascending:false});if(error){console.error(error);return}state.people=(data||[]).map(prof).filter(p=>p.user_key!==state.userKey)}
async function loadSaved(){if(!sb||!state.myProfileId)return;const {data,error}=await sb.from('saved_connections').select('*').eq('saver_profile_id',state.myProfileId);if(!error)state.saved=data||[]}
function hydrate(){if($('quickName')){$('quickName').value=state.me.name||'';$('quickTitle').value=state.me.title||'';$('quickGoal').value=state.me.current_focus||'';$('quickNeed').value=(state.me.needs||[]).slice(0,3).join(', ');$('quickOffer').value=(state.me.offers||[]).slice(0,3).join(', ')}}
function split(s){return(s||'').split(/,|\n/).map(x=>x.trim()).filter(Boolean)}function uniq(a){return[...new Set((a||[]).filter(Boolean))]}
function collectQuick(){state.me.name=$('quickName').value.trim();state.me.title=$('quickTitle').value.trim();state.me.current_focus=$('quickGoal').value.trim();state.me.bio=state.me.current_focus||state.me.bio;state.me.needs=uniq([state.currentTypeLabel,...state.selectedTags,...split($('quickNeed').value)]);state.me.offers=uniq(split($('quickOffer').value));state.me.braindate_offer=state.me.offers.join(', ');state.me.meeting_style=state.currentType==='practice'?'30-minute role-play':state.currentType==='accountability'?'Accountability check-in':state.currentType==='mentor'?'Deep-dive coaching conversation':''}
function collectFull(){if(!$('profileName'))return;const has=$('profileName').value||$('profileTitle').value||$('profileBio').value||$('profileGoal').value||$('profileOffer').value||$('profileNeed').value;if(!has)return;state.me.name=$('profileName').value.trim();state.me.title=$('profileTitle').value.trim();state.me.bio=$('profileBio').value.trim();state.me.current_focus=$('profileGoal').value.trim();state.me.offers=split($('profileOffer').value);state.me.needs=split($('profileNeed').value);state.me.email=$('profileEmail').value.trim();state.me.phone=$('profilePhone').value.trim()}
async function saveProfile(){
  if(!sb||!state.communityId){status('Connection error','error');return null}
  collectFull();
  status('Saving...');
  const minimal={
    community_id:state.communityId,
    user_key:state.userKey,
    name:state.me.name||'Guest',
    title:state.me.title||'',
    bio:state.me.bio||state.me.current_focus||'',
    offers:state.me.offers||[],
    needs:state.me.needs||[],
    current_focus:state.me.current_focus||'',
    braindate_offer:state.me.braindate_offer||'',
    updated_at:new Date().toISOString()
  };
  let res = await sb.from('profiles').upsert(minimal,{onConflict:'community_id,user_key'}).select('*').single();
  if(res.error){
    console.warn('Minimal upsert failed, trying select/update fallback',res.error);
    const found = await sb.from('profiles').select('id').eq('community_id',state.communityId).eq('user_key',state.userKey).limit(1).maybeSingle();
    if(found.data && found.data.id){
      res = await sb.from('profiles').update(minimal).eq('id',found.data.id).select('*').single();
    }else{
      res = await sb.from('profiles').insert(minimal).select('*').single();
    }
  }
  if(res.error){
    console.error('Save profile failed:',res.error);
    status('Save error','error');
    alert('Save failed: '+(res.error.message||'Supabase schema error'));
    return null;
  }
  Object.assign(state.me,prof(res.data));
  state.myProfileId=res.data.id;
  await loadPeople();
  await loadSaved();
  status('Saved','ok');
  return state.me;
}
function score(p){const need=(state.me.needs||[]).join(' ').toLowerCase(),goal=(state.me.current_focus||'').toLowerCase();let s=10;const c=[p.offers.join(' '),p.needs.join(' '),p.current_focus,p.bio,p.braindate_offer].join(' ').toLowerCase();(state.me.needs||[]).forEach(n=>{if(c.includes(String(n).toLowerCase()))s+=18});(p.offers||[]).forEach(o=>{o=String(o).toLowerCase();if(need.includes(o)||goal.includes(o.split(' ')[0]))s+=14});if(state.currentType==='practice'&&c.includes('practice'))s+=18;if(state.currentType==='practice'&&c.includes('role'))s+=12;if(state.currentType==='accountability'&&c.includes('accountability'))s+=22;if(state.currentType==='mentor'&&(c.includes('mentor')||c.includes('coach')||c.includes('founder')))s+=18;if(p.photo_url)s+=4;if(p.current_focus)s+=5;return Math.min(99,s)}
function rec(n=3){return[...state.people].map(p=>({...p,score:score(p)})).sort((a,b)=>b.score-a.score).slice(0,n)}function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}function initls(n){return(n||'SM').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()}function first(n){return(n||'').trim().split(/\s+/)[0]}
function why(p){const o=(p.offers||[]).slice(0,2).join(', ');if(state.currentType==='practice')return`${p.name||'This member'} may be useful for focused role-play and feedback, especially around ${o||'sales practice'}.`;if(state.currentType==='accountability')return`${p.name||'This member'} can help create momentum and follow-through around your current sales goal.`;if(state.currentType==='mentor')return`${p.name||'This member'} may help you see the next move with more clarity and confidence.`;return`${p.name||'This member'} has signals that connect to what you need now.`}
function card(p){const img=p.photo_url?`<img src="${esc(p.photo_url)}">`:initls(p.name);const offers=(p.offers||[]).slice(0,3).join(', ')||'Sales practice';const goal=p.current_focus||p.bio||'Open to a focused sales conversation.';return`<article class="match"><div class="mhead"><div class="avatar">${img}</div><div><h3>${esc(first(p.name)||'Member')}</h3><p class="role">${esc(p.title||'Community member')}</p></div></div><p class="section"><strong>Current goal:</strong><br>${esc(goal)}</p><p class="section"><strong>Can help with:</strong><br>${esc(offers)}</p><div class="why">${esc(why(p))}</div><div class="cardactions"><button class="primary" onclick="openMeetingModal('${p.id}')">Meet now</button><button class="soft" onclick="savePerson('${p.id}')">Save</button></div></article>`}
function render(target='resultsList',n=3){const el=$(target);if(!el)return;const list=rec(n);el.innerHTML=list.length?list.map(card).join(''):`<div class="empty">No community profiles yet. Save your profile, invite a few members in, and Spark Match will start recommending people.</div>`}
function renderAll(){render('allMatchesList',6)}function renderSaved(){const el=$('savedList');if(!el)return;const ids=state.saved.map(s=>s.saved_profile_id);const people=state.people.filter(p=>ids.includes(p.id));el.innerHTML=people.length?people.map(card).join(''):`<div class="empty">Nothing saved yet. Find a match and press Save.</div>`}
function renderProfile(){['Name','Title','Bio','Goal','Offer','Need','Email','Phone'].forEach(()=>{});$('profileName').value=state.me.name||'';$('profileTitle').value=state.me.title||'';$('profileBio').value=state.me.bio||'';$('profileGoal').value=state.me.current_focus||'';$('profileOffer').value=(state.me.offers||[]).join(', ');$('profileNeed').value=(state.me.needs||[]).join(', ');$('profileEmail').value=state.me.email||'';$('profilePhone').value=state.me.phone||''}
function counts(a){const m={};(a||[]).forEach(x=>{if(x)m[x]=(m[x]||0)+1});return Object.entries(m).sort((a,b)=>b[1]-a[1])}function renderAdmin(){const el=$('adminSignals');if(!el)return;const needs=counts(state.people.flatMap(p=>p.needs)),offers=counts(state.people.flatMap(p=>p.offers));el.innerHTML=`<div class="signal"><strong>${state.people.length+(state.myProfileId?1:0)}</strong><p>Profiles in this community</p></div><div class="signal"><strong>${esc(needs[0]?.[0]||'—')}</strong><p>Top need</p></div><div class="signal"><strong>${esc(offers[0]?.[0]||'—')}</strong><p>Top strength</p></div>`}
async function ensure(){collectQuick();return await saveProfile()}async function savePerson(id){const me=await ensure();if(!me)return;const {error}=await sb.from('saved_connections').upsert({saver_profile_id:state.myProfileId,saved_profile_id:id,status:'saved'});if(error){console.error(error);alert('Could not save match.');return}await loadSaved();status('Saved match','ok')}async function invitePerson(id){const me=await ensure();if(!me)return;const p=state.people.find(x=>x.id===id);const {error}=await sb.from('invites').insert({community_id:state.communityId,sender_profile_id:state.myProfileId,receiver_profile_id:id,title:`${first(state.me.name)||'Someone'} invited you to a Spark Match`,message:`I'd love to meet for a focused sales practice conversation.`,proposed_times:'',status:'sent'});if(error){console.error(error);alert('Could not create invite.');return}status('Invite sent','ok');alert(`Invite created for ${first(p?.name)||'this member'}.`)}
function showView(v){document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));$('view-'+v)?.classList.add('active');document.querySelectorAll('.nav').forEach(n=>n.classList.toggle('active',n.dataset.view===v));if(v==='matches')renderAll();if(v==='saved')renderSaved();if(v==='profile')renderProfile();if(v==='admin')renderAdmin()}function showStep(id){['welcome','choose','questions','results'].forEach(x=>$(x)?.classList.add('hidden'));$(id)?.classList.remove('hidden')}
function renderTags(){const row=$('quickTags');if(!row)return;const set=state.currentType==='practice'?['Practice role-play','Handle price objections','Better discovery questions','Closing conversations','Demo practice']:state.currentType==='accountability'?['Accountability partner','Consistent follow-up','Pipeline review','CRM habits','Follow-up systems']:['Mentor Match','Pricing confidence','Founder-led sales','Clearer offer','Premium package selling'];row.innerHTML=set.map(t=>`<button class="tag ${state.selectedTags.includes(t)?'selected':''}" data-tag="${esc(t)}">${esc(t)}</button>`).join('');row.querySelectorAll('.tag').forEach(b=>b.onclick=()=>{const t=b.dataset.tag;state.selectedTags=state.selectedTags.includes(t)?state.selectedTags.filter(x=>x!==t):[...state.selectedTags,t];renderTags()})}
function choose(type){state.currentType=type;state.currentTypeLabel=type==='practice'?'Practice role-play':type==='accountability'?'Accountability partner':'Mentor Match';$('questionTitle').textContent=type==='practice'?'What would you like to practice?':type==='accountability'?'Where do you need consistency?':'What kind of guidance would help now?';renderTags();hydrate();showStep('questions')}
document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>showView(b.dataset.view));$('start').onclick=()=>showStep('choose');$('goMatches').onclick=()=>showView('matches');$('back').onclick=()=>showStep('choose');$('again').onclick=()=>showStep('welcome');$('saveQuick').onclick=async()=>{collectQuick();await saveProfile()};$('saveFull').onclick=async()=>{collectFull();await saveProfile()};$('find').onclick=async()=>{collectQuick();await saveProfile();render('resultsList',3);showStep('results')};document.querySelectorAll('.choices article').forEach(c=>c.onclick=()=>choose(c.dataset.type));if(new URLSearchParams(location.search).get('admin')==='true'){const b=document.createElement('button');b.className='nav secondary';b.dataset.view='admin';b.textContent='Coach';b.onclick=()=>showView('admin');document.querySelector('nav')?.appendChild(b)}
let pendingInvitePersonId=null;
const DEMO_PROFILES=[{"name": "Maya", "title": "Business coach for women entrepreneurs", "bio": "I help service providers turn discovery calls into confident paid offers.", "offers": ["Discovery calls", "Pricing confidence", "Closing conversations"], "needs": ["Consistent follow-up", "Pipeline review"], "current_focus": "Helping clients close consultations without sounding pushy.", "braindate_offer": "I can role-play price objections and closing language."}, {"name": "Rachel", "title": "Founder-led sales consultant", "bio": "I work with early-stage founders who need simple, repeatable sales habits.", "offers": ["Founder-led sales", "Sales messaging", "Follow-up systems"], "needs": ["More referrals", "Accountability partner"], "current_focus": "Building a weekly follow-up rhythm and cleaner sales messaging.", "braindate_offer": "I can help sharpen a pitch and follow-up sequence."}, {"name": "Sofia", "title": "SDR team lead", "bio": "I love practicing cold outreach, discovery structure, and objection handling.", "offers": ["Cold outreach", "Lead qualification", "Objection handling"], "needs": ["Confidence on calls", "Demo practice"], "current_focus": "Improving the transition from first call to demo.", "braindate_offer": "I can run a fast objection-handling drill."}, {"name": "Danielle", "title": "Sales accountability partner", "bio": "I am focused on consistency, CRM habits, and keeping the pipeline moving.", "offers": ["Accountability", "CRM discipline", "Pipeline review"], "needs": ["Better pitch", "Clearer offer"], "current_focus": "Creating a simple weekly sales routine and measuring follow-up.", "braindate_offer": "I can host a 20-minute pipeline accountability check-in."}, {"name": "Olivia", "title": "Premium offer strategist", "bio": "I help coaches package and sell premium programs with more clarity.", "offers": ["Premium package selling", "Clearer offer", "Negotiation"], "needs": ["Webinar conversion", "More qualified leads"], "current_focus": "Improving conversion from webinars into strategy calls.", "braindate_offer": "I can help clarify a premium offer and call-to-action."}];
function openMeetingModal(id){pendingInvitePersonId=id;const p=state.people.find(x=>x.id===id);const n=typeof first==='function'?first(p?.name):((p?.name||'').split(/\s+/)[0]);if($('meetingPersonName'))$('meetingPersonName').textContent=p?`Invite ${n} to connect`:'Invite to connect';$('meetingModal')?.classList.remove('hidden')}
function closeMeetingModal(){pendingInvitePersonId=null;$('meetingModal')?.classList.add('hidden')}
function mtimes(){return [$('meetingTime1')?.value,$('meetingTime2')?.value,$('meetingTime3')?.value].map(x=>(x||'').trim()).filter(Boolean).join(' | ')}
async function sendScheduledInvite(){
  if(!pendingInvitePersonId)return;
  const me=await ensure();
  if(!me||!state.myProfileId){alert('Could not save your profile before creating the invite.');return}
  const p=state.people.find(x=>x.id===pendingInvitePersonId);
  const times=mtimes();
  const msg=($('meetingMessage') && $('meetingMessage').value ? $('meetingMessage').value : '').trim()||'Would you like to meet for a focused sales practice conversation?';
  const full=`${msg}\n\nMeeting place: Inside this room · Spark Match table${times?'\nSuggested times: '+times:''}`;
  let payload={community_id:state.communityId,sender_profile_id:state.myProfileId,receiver_profile_id:pendingInvitePersonId,title:`${first(state.me.name)||'Someone'} invited you to a Spark Match`,message:full,proposed_times:times,status:'sent'};
  let res=await sb.from('invites').insert(payload);
  if(res.error){
    console.warn('Full invite insert failed, trying minimal invite',res.error);
    payload={community_id:state.communityId,sender_profile_id:state.myProfileId,receiver_profile_id:pendingInvitePersonId,title:`${first(state.me.name)||'Someone'} invited you to a Spark Match`,message:full,status:'sent'};
    res=await sb.from('invites').insert(payload);
  }
  if(res.error){console.error('Invite failed:',res.error);alert('Could not create invite: '+(res.error.message||'Supabase schema error'));return}
  status('Invite sent','ok');
  alert(`Invite created for ${first(p&&p.name)||'this member'}. Meet inside this room at the Spark Match table.`);
  closeMeetingModal();
}
async function meetNow(){
  if(!pendingInvitePersonId)return;
  const me=await ensure();
  if(!me||!state.myProfileId){alert('Could not save your profile before creating the invite.');return}
  const p=state.people.find(x=>x.id===pendingInvitePersonId);
  let payload={community_id:state.communityId,sender_profile_id:state.myProfileId,receiver_profile_id:pendingInvitePersonId,title:'Meet now at the Spark Match table',message:'I am in the room now. Want to meet at the Spark Match table for a focused sales practice conversation?',proposed_times:'Now · Spark Match table',status:'sent'};
  let res=await sb.from('invites').insert(payload);
  if(res.error){
    console.warn('Full meet-now insert failed, trying minimal invite',res.error);
    payload={community_id:state.communityId,sender_profile_id:state.myProfileId,receiver_profile_id:pendingInvitePersonId,title:'Meet now at the Spark Match table',message:'I am in the room now. Want to meet at the Spark Match table for a focused sales practice conversation?',status:'sent'};
    res=await sb.from('invites').insert(payload);
  }
  if(res.error){console.error('Meet now failed:',res.error);alert('Could not create invite: '+(res.error.message||'Supabase schema error'));return}
  status('Meet now invite sent','ok');
  alert(`Meet now invite created for ${first(p&&p.name)||'this member'}. Go to the Spark Match table in this room.`);
  closeMeetingModal();
}
async function seedDemoProfiles(){if(!sb||!state.communityId){alert('Supabase is not connected yet.');return}status('Creating demo profiles...');const rows=DEMO_PROFILES.map((p,i)=>({community_id:state.communityId,user_key:`demo-hlc-${i+1}`,name:p.name,title:p.title,bio:p.bio,photo_url:'',offers:p.offers,needs:p.needs,current_focus:p.current_focus,braindate_offer:p.braindate_offer,ideal_match:'',meeting_style:i%2===0?'30-minute role-play':'Accountability check-in',availability:'Demo availability',openness:'Open to anyone in the community',updated_at:new Date().toISOString()}));const {error}=await sb.from('profiles').upsert(rows,{onConflict:'community_id,user_key'});if(error){console.error(error);status('Demo seed error','error');alert('Could not create demo profiles.');return}await loadPeople();renderAll();status('Demo profiles created','ok');alert('Demo profiles created. You can now test Spark Match recommendations.')}
function initMeetingAndDemoControls(){$('closeMeetingModal')?.addEventListener('click',closeMeetingModal);$('sendScheduledInvite')?.addEventListener('click',sendScheduledInvite);$('meetNowBtn')?.addEventListener('click',meetNow);$('meetingModal')?.addEventListener('click',e=>{if(e.target.id==='meetingModal')closeMeetingModal()});$('seedDemoProfiles')?.addEventListener('click',seedDemoProfiles);if(new URLSearchParams(location.search).get('demo')==='true')document.querySelectorAll('.demo-only').forEach(el=>el.classList.remove('hidden'))}
initMeetingAndDemoControls();init();


function initDemoVisibilityV23(){
  const isDemo = new URLSearchParams(location.search).get('demo') === 'true';
  if(isDemo){
    document.querySelectorAll('.demo-only').forEach(el => el.classList.remove('hidden'));
  }
  document.getElementById('seedDemoProfiles')?.addEventListener('click', seedDemoProfiles);
  document.getElementById('seedDemoProfilesTop')?.addEventListener('click', seedDemoProfiles);
}
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initDemoVisibilityV23);
}else{
  initDemoVisibilityV23();
}
