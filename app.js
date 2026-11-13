"use strict";

/*
 * GETFOODIE PORTFOLIO DEMO
 * Everything here is intentionally fictional and browser-local.
 * Do not use for real authentication, payments, or customer data.
 */
const DATA_KEY = "getfoodie_portfolio_demo_data_v1";
const ROLE_KEY = "getfoodie_portfolio_demo_role_v1";
const ACCOUNT_LIST = [
  {role:"customer", title:"Customer", email:"customer@demo.getfoodie.app", password:"Demo123!", icon:"🍽️", path:"/"},
  {role:"business", title:"Restaurant owner", email:"business@demo.getfoodie.app", password:"Demo123!", icon:"🏪", path:"/business"},
  {role:"admin", title:"Administrator", email:"admin@demo.getfoodie.app", password:"Demo123!", icon:"🛡️", path:"/admin"}
];
const IMAGES = {
  hero:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=960&q=80&fit=crop",
  burger:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=560&q=80&fit=crop",
  pizza:"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=560&q=80&fit=crop",
  bowl:"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=560&q=80&fit=crop",
  chicken:"https://images.unsplash.com/photo-1562967914-608f82629710?w=560&q=80&fit=crop",
  pasta:"https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=560&q=80&fit=crop",
  coffee:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=560&q=80&fit=crop",
  fries:"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=560&q=80&fit=crop",
  restaurant:"https://images.unsplash.com/photo-1552566626-52f8b828add9?w=560&q=80&fit=crop"
};
function seed() {
  return {
    restaurants:[
      {id:"r1",name:"The Burger Corner",category:"Burgers & comfort food",rating:4.9,eta:"20–30 min",image:IMAGES.burger,status:"Active"},
      {id:"r2",name:"Slicetown Pizza",category:"Pizza & pasta",rating:4.8,eta:"25–35 min",image:IMAGES.pizza,status:"Active"},
      {id:"r3",name:"Bowl & Beyond",category:"Rice bowls & favorites",rating:4.7,eta:"20–40 min",image:IMAGES.bowl,status:"Pending"}
    ],
    menu:[
      {id:1,restaurantId:"r1",name:"Classic Smash Burger",category:"Burgers",price:189,description:"Smashed beef patty, cheese, lettuce and house sauce.",image:IMAGES.burger,active:true},
      {id:2,restaurantId:"r1",name:"Crispy Chicken Burger",category:"Burgers",price:179,description:"Crispy chicken with tangy slaw and mayo.",image:IMAGES.chicken,active:true},
      {id:3,restaurantId:"r1",name:"Loaded Fries",category:"Sides",price:129,description:"Golden fries, cheese drizzle and seasoning.",image:IMAGES.fries,active:true},
      {id:4,restaurantId:"r2",name:"Margherita Pizza",category:"Pizza",price:329,description:"Fresh mozzarella, tomato and basil.",image:IMAGES.pizza,active:true},
      {id:5,restaurantId:"r2",name:"Creamy Garden Pasta",category:"Pasta",price:269,description:"Creamy pasta finished with herbs and parmesan.",image:IMAGES.pasta,active:true},
      {id:6,restaurantId:"r2",name:"Iced Latte",category:"Drinks",price:115,description:"Smooth coffee over ice with chilled milk.",image:IMAGES.coffee,active:true},
      {id:7,restaurantId:"r3",name:"Fresh Chicken Bowl",category:"Rice bowls",price:219,description:"Wholesome rice bowl with fresh vegetables.",image:IMAGES.bowl,active:true},
      {id:8,restaurantId:"r1",name:"House Iced Coffee",category:"Drinks",price:99,description:"A chilled, bold coffee for any time of day.",image:IMAGES.coffee,active:true}
    ],
    orders:[
      {id:"GF-1042",restaurantId:"r1",items:[{id:1,qty:2},{id:3,qty:1}],total:507,status:"Preparing",payment:"Cash on delivery (demo)",address:"101 Sample Street, Manila",placedAt:"2026-11-13T09:00:00.000Z",cancelRequested:false},
      {id:"GF-1041",restaurantId:"r1",items:[{id:2,qty:1}],total:179,status:"Delivered",payment:"GCash (simulation only)",address:"42 Demo Avenue, Manila",placedAt:"2026-11-12T08:20:00.000Z",cancelRequested:false}
    ],
    cart:[],nextOrder:1043,nextItem:9
  };
}
function load() {
  try {
    const parsed=JSON.parse(localStorage.getItem(DATA_KEY));
    if(parsed && Array.isArray(parsed.restaurants) && Array.isArray(parsed.menu) && Array.isArray(parsed.orders) && Array.isArray(parsed.cart))return parsed;
  } catch(_error) {}
  return seed();
}
let db=load();
let role=sessionStorage.getItem(ROLE_KEY)||"guest";
if(!ACCOUNT_LIST.some(a=>a.role===role))role="guest";
let selectedRole="customer", afterLogin=null, category="All", search="", restaurantFilter="All";
const app=document.getElementById("app");
const currency=new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP",maximumFractionDigits:0});
const money=n=>currency.format(Number(n)||0);
const el=id=>document.getElementById(id);
function esc(value){return String(value==null?"":value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function save(){localStorage.setItem(DATA_KEY,JSON.stringify(db));}
function food(id){return db.menu.find(item=>item.id===Number(id));}
function restaurant(id){return db.restaurants.find(r=>r.id===id);}
function badge(status){return '<span class="badge '+esc(String(status).toLowerCase())+'">● '+esc(status)+'</span>';}
function toast(message){const box=el("toast");box.textContent=message;box.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>box.classList.remove("show"),3200);}
function showDialog(id){const d=el(id);if(d && !d.open)d.showModal();}
function closeDialog(id){const d=el(id);if(d && d.open)d.close();}
function currentRoute(){const path=decodeURIComponent(location.pathname);return ["/","/orders","/business","/admin"].includes(path)?path:"/";}
function pageName(path){return ({"/":"Explore / All restaurants","/orders":"Customer / Your orders","/business":"Restaurant / Management","/admin":"Platform / Administration"})[path]||"Explore";}
function navigate(path,replace){
  const target=["/","/orders","/business","/admin"].includes(path)?path:"/";
  if(!replace)history.pushState({},"",target);
  else history.replaceState({},"",target);
  render();
  window.scrollTo(0,0);
}
function authorize(path){
  const required=({"/orders":"customer","/business":"business","/admin":"admin"})[path];
  if(required && role!==required){openLogin(required,path);return false;}
  return true;
}
function openLogin(wanted,target){
  selectedRole=wanted||"customer";afterLogin=target||null;
  selectRole(selectedRole);
  showDialog("loginDialog");
}
function selectRole(next){
  selectedRole=next;
  el("accountOptions").innerHTML=ACCOUNT_LIST.map(a=>'<button type="button" class="role-option '+(a.role===selectedRole?'selected':'')+'" data-role-choice="'+esc(a.role)+'"><span>'+a.icon+'</span>'+esc(a.title)+'</button>').join("");
  const acc=ACCOUNT_LIST.find(a=>a.role===selectedRole);
  el("demoEmail").value=acc.email;el("demoPassword").value=acc.password;
  el("loginError").textContent="";
}
function logout(){role="guest";sessionStorage.removeItem(ROLE_KEY);navigate("/");toast("Exited demo account.");}
function renderShell(route){
  const items=[
    {path:"/",icon:"◫",name:"Explore food"},
    {path:"/orders",icon:"▤",name:"My orders",count:role==="customer"?db.orders.length:null},
    {path:"/business",icon:"▦",name:"Restaurant dashboard"},
    {path:"/admin",icon:"⚙",name:"Admin console"}
  ];
  el("sideNav").innerHTML=items.map(x=>'<a class="nav-link '+(x.path===route?'active':'')+'" href="'+x.path+'" data-route="'+x.path+'"><span class="nav-icon">'+x.icon+'</span><span class="nav-text">'+x.name+'</span>'+(x.count?'<span class="nav-count">'+x.count+'</span>':'')+'</a>').join("");
  const acc=ACCOUNT_LIST.find(a=>a.role===role);
  el("accountText").textContent=acc?acc.title:"Guest / Sign in";
  el("avatar").textContent=acc?acc.title.slice(0,1):"G";
  el("breadcrumb").textContent=pageName(route);
}
function header(title,subtitle,actions){
  return '<div class="page-header"><div><span class="eyebrow">GETFOODIE · INTERACTIVE SHOWCASE</span><h1>'+title+'</h1><p>'+subtitle+'</p></div><div class="page-tools">'+(actions||"")+'</div></div>';
}
function cartTotal(){return db.cart.reduce((sum,c)=>{const f=food(c.id);return sum+(f?f.price*c.qty:0);},0);}
function cartCount(){return db.cart.reduce((sum,c)=>sum+c.qty,0);}
function cartButton(){return '<button class="button" data-action="cart">🛒 &nbsp;Cart'+(cartCount()?' ('+cartCount()+')':'')+'</button>';}
function restaurantCards(){
  const filtered=db.restaurants.filter(r=>r.status==="Active" && (restaurantFilter==="All"||r.id===restaurantFilter) && (search===""|| (r.name+" "+r.category).toLowerCase().includes(search.toLowerCase())));
  if(!filtered.length)return '<div class="panel blank"><div class="blank-emoji">🍽️</div><h3>No matching restaurants</h3><p>Try a different search or category.</p></div>';
  return filtered.map(r=>'<button class="panel restaurant-card" data-action="restaurant" data-id="'+esc(r.id)+'" style="text-align:left;width:100%;font:inherit"><img src="'+esc(r.image)+'" alt="'+esc(r.name)+'" loading="lazy"><div class="r-info"><h3>'+esc(r.name)+'</h3><p>'+esc(r.category)+'</p><div class="rating">★ '+r.rating.toFixed(1)+' <span>· '+esc(r.eta)+'</span></div></div></button>').join("");
}
function foodCards(){
  const visible=db.menu.filter(f=>{
    const r=restaurant(f.restaurantId);
    return f.active && r && r.status==="Active" && (restaurantFilter==="All"||f.restaurantId===restaurantFilter) && (category==="All"||f.category===category) && (search===""||(f.name+" "+f.category+" "+f.description+" "+r.name).toLowerCase().includes(search.toLowerCase()));
  });
  if(!visible.length)return '<div class="panel blank"><div class="blank-emoji">🔎</div><h3>No dishes found</h3><p>Try a different search or category.</p></div>';
  return visible.map(f=>'<article class="panel food-card"><img class="food-image" src="'+esc(f.image)+'" alt="'+esc(f.name)+'" loading="lazy"><div class="food-body"><div class="food-type">'+esc(f.category)+'</div><h3>'+esc(f.name)+'</h3><p>'+esc(f.description)+'</p><div class="food-footer"><strong>'+money(f.price)+'</strong><button class="button soft small" data-action="add" data-id="'+f.id+'" aria-label="Add '+esc(f.name)+' to cart">+ Add</button></div></div></article>').join("");
}
function renderCatalog(){
  if(el("restaurantGrid"))el("restaurantGrid").innerHTML=restaurantCards();
  if(el("foodGrid"))el("foodGrid").innerHTML=foodCards();
  if(el("dishCount"))el("dishCount").textContent=db.menu.filter(f=>f.active).length+" dishes in our sample catalog";
}
function explore(){
  const categories=["All","Burgers","Pizza","Pasta","Sides","Drinks","Rice bowls"];
  return header("Explore food","Find something good. All restaurants and prices below are fictional.",'<div class="search"><span>⌕</span><input id="searchInput" value="'+esc(search)+'" placeholder="Search dishes or restaurants..." aria-label="Search dishes"></div>'+cartButton())+
    '<section class="panel hero-panel"><div class="hero-copy"><span class="eyebrow">GOOD FOOD, GOOD MOOD</span><h2>Delicious discoveries, <span class="highlight">one click away.</span></h2><p>Explore local favorites, build a cart and experience a complete simulated order.</p><button class="button primary" data-action="browse">Explore menu &nbsp;→</button></div><img class="hero-image" src="'+IMAGES.hero+'" alt="Fresh burger and fries"></section>'+
    '<section><div class="section-heading"><div><h2>Featured restaurants</h2><p>Sample partner listings</p></div><span class="help-line">Only approved example restaurants appear here</span></div><div class="restaurant-grid" id="restaurantGrid">'+restaurantCards()+'</div></section>'+
    '<section id="menuSection"><div class="section-heading"><div><h2>What are you craving?</h2><p id="dishCount">Explore the sample menu</p></div></div><div class="filters" id="filterChips">'+categories.map(c=>'<button class="chip '+(c===category?'active':'')+'" data-action="category" data-category="'+esc(c)+'">'+esc(c)+'</button>').join("")+'</div><div class="food-grid" id="foodGrid">'+foodCards()+'</div></section>';
}
function renderCart(){
  const lines=db.cart.map(item=>({item,f:food(item.id)})).filter(x=>x.f);
  const wrap=el("cartContent");
  if(!lines.length){wrap.innerHTML='<div class="blank"><div class="blank-emoji">🛒</div><h3>Your cart is empty</h3><p>Add something tasty to begin a demo order.</p><button class="button primary" data-action="continue">Explore dishes</button></div>';return;}
  const rest=restaurant(lines[0].f.restaurantId);
  wrap.innerHTML='<p class="subtext">Ordering from '+esc(rest?rest.name:"Demo restaurant")+'</p><div class="cart-items">'+lines.map(x=>'<div class="cart-product"><img src="'+esc(x.f.image)+'" alt=""><div class="body"><h3>'+esc(x.f.name)+'</h3><p>'+money(x.f.price)+' each</p><div class="qty-stepper"><button type="button" aria-label="Decrease quantity" data-action="qty" data-id="'+x.f.id+'" data-delta="-1">−</button><b>'+x.item.qty+'</b><button type="button" aria-label="Increase quantity" data-action="qty" data-id="'+x.f.id+'" data-delta="1">+</button></div></div><strong>'+money(x.f.price*x.item.qty)+'</strong></div>').join("")+'</div><div class="cart-total"><div class="summary-line"><span>Items ('+cartCount()+')</span><strong>'+money(cartTotal())+'</strong></div><div class="summary-line"><span>Delivery fee</span><span>Calculated at checkout · demo</span></div><div class="summary-line total"><strong>Demo subtotal</strong><strong>'+money(cartTotal())+'</strong></div><div class="notice warning">Simulated checkout — no real order or payment will be made.</div><button class="button primary wide" data-action="checkout">Continue to checkout <span>→</span></button></div>';
}
function checkout(){
  if(!db.cart.length){toast("Add something to your cart first.");return;}
  if(role!=="customer"){openLogin("customer","/");return;}
  closeDialog("cartDialog");
  const rest=restaurant(food(db.cart[0].id).restaurantId);
  el("checkoutSummary").innerHTML='<p class="subtext">Restaurant: '+esc(rest?rest.name:"Demo restaurant")+'</p><div class="summary-line"><span>'+cartCount()+' item(s)</span><strong>'+money(cartTotal())+'</strong></div><div class="summary-line"><span>Delivery charge (demo)</span><strong>₱0</strong></div><div class="summary-line total"><strong>Demo total</strong><strong>'+money(cartTotal())+'</strong></div>';
  el("checkoutAddress").value="101 Sample Street, Manila";
  showDialog("checkoutDialog");
}
function orderItems(o){return o.items.map(x=>{const f=food(x.id);return (f?esc(f.name):"Item")+' × '+x.qty;}).join(", ");}
function dateLabel(iso){const d=new Date(iso);return Number.isNaN(d.getTime())?"Demo date":d.toLocaleDateString("en-PH",{month:"short",day:"numeric",year:"numeric"});}
function orders(){
  return header("Your orders","Follow and review fictional orders placed in this browser.",'<button class="button" data-route="/">← Browse menu</button>')+
  '<div class="stack">'+(db.orders.length?db.orders.slice().reverse().map(o=>{
    const steps=["Placed","Preparing","Ready","Delivered"];const index=steps.indexOf(o.status);
    const r=restaurant(o.restaurantId);
    return '<article class="panel order-card"><div class="order-header"><h3>Order #'+esc(o.id)+'</h3>'+badge(o.cancelRequested?"Cancellation requested":o.status)+'</div><p>'+esc(r?r.name:"Demo restaurant")+' · '+dateLabel(o.placedAt)+'</p><p>'+orderItems(o)+'</p><div class="order-progress">'+steps.map((s,i)=>'<div title="'+s+'" class="progress-step '+(index>=i?'done':'')+'"></div>').join("")+'</div><div class="order-actions"><div><strong>'+money(o.total)+'</strong><div class="help-line">'+esc(o.payment)+'</div></div>'+(o.status!=="Delivered"&&!o.cancelRequested?'<button class="button small" data-action="cancel-order" data-id="'+esc(o.id)+'">Request cancellation</button>':'<span class="help-line">'+(o.cancelRequested?"Awaiting restaurant review":"Completed demo order")+'</span>')+'</div></article>';
  }).join(""):'<div class="panel blank"><div class="blank-emoji">📦</div><h3>No orders yet</h3><p>Explore the menu and place a simulated order.</p><button class="button primary" data-route="/">Browse food</button></div>')+'</div>';
}
function stats(){
  const earned=db.orders.filter(x=>x.restaurantId==="r1"&&x.status==="Delivered").reduce((s,x)=>s+x.total,0);
  const active=db.orders.filter(x=>x.restaurantId==="r1"&&x.status!=="Delivered"&&x.status!=="Cancelled").length;
  return '<div class="stats-row"><div class="panel metric"><span class="metric-label">▤ &nbsp; Sample orders</span><strong>'+db.orders.filter(x=>x.restaurantId==="r1").length+'</strong><small>Local demo data</small></div><div class="panel metric"><span class="metric-label">◈ &nbsp; Active orders</span><strong>'+active+'</strong><small>Needs attention</small></div><div class="panel metric"><span class="metric-label">☰ &nbsp; Menu items</span><strong>'+db.menu.filter(x=>x.restaurantId==="r1").length+'</strong><small>Includes unavailable</small></div><div class="panel metric"><span class="metric-label">₱ &nbsp; Delivered sales</span><strong>'+money(earned)+'</strong><small>Fictional revenue</small></div></div>';
}
function business(){
  const mine=db.menu.filter(x=>x.restaurantId==="r1");
  const businessOrders=db.orders.filter(o=>o.restaurantId==="r1").slice().reverse();
  return header("Restaurant overview","Manage the sample restaurant: The Burger Corner.",'<button class="button primary" data-action="new-item">+ Add menu item</button>')+
    '<div class="notice">Restaurant owner demo: menu changes and order status updates are saved only in your own browser.</div>'+stats()+
    '<div class="section-heading"><div><h2>Incoming orders</h2><p>Update statuses to see the customer experience change</p></div></div><div class="panel table-wrap"><table class="data-table"><thead><tr><th>Order</th><th>Items</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead><tbody>'+
    (businessOrders.length?businessOrders.map(o=>'<tr><td><strong>'+esc(o.id)+'</strong><br><span class="muted">'+dateLabel(o.placedAt)+'</span></td><td>'+orderItems(o)+'</td><td>'+money(o.total)+'</td><td>'+badge(o.status)+(o.cancelRequested?'<br><span class="help-line">Cancellation requested</span>':'')+'</td><td>'+(({"Placed":"Preparing","Preparing":"Ready","Ready":"Delivered"})[o.status]?'<button class="button soft small" data-action="advance" data-id="'+esc(o.id)+'">Mark '+({"Placed":"Preparing","Preparing":"Ready","Ready":"Delivered"})[o.status]+'</button>':'<span class="help-line">Done</span>')+(o.cancelRequested?'<br><button class="button danger small" data-action="approve-cancel" data-id="'+esc(o.id)+'">Approve cancel</button>':'')+'</td></tr>').join(""):'<tr><td colspan="5">No sample orders yet</td></tr>')+
    '</tbody></table></div><div class="section-heading"><div><h2>Menu management</h2><p>Toggle item availability or edit pricing</p></div></div><div class="panel table-wrap"><table class="data-table"><thead><tr><th>Item</th><th>Category</th><th>Price</th><th>Availability</th><th>Actions</th></tr></thead><tbody>'+
    mine.map(f=>'<tr><td><div class="item-cell"><img src="'+esc(f.image)+'" alt=""><div><strong>'+esc(f.name)+'</strong><small>Item #'+f.id+'</small></div></div></td><td>'+esc(f.category)+'</td><td>'+money(f.price)+'</td><td>'+badge(f.active?"Active":"Unavailable")+'</td><td><button class="button small" data-action="edit-item" data-id="'+f.id+'">Edit</button> <button class="button soft small" data-action="toggle-item" data-id="'+f.id+'">'+(f.active?"Hide":"Show")+'</button></td></tr>').join("")+
    '</tbody></table></div>';
}
function admin(){
  const pending=db.restaurants.filter(x=>x.status==="Pending").length;
  return header("Platform overview","Review fictional restaurant partners and platform activity.",'<button class="button" data-action="reset-confirm">↻ Reset demo</button>')+
    '<div class="notice">Administrator demo only. Approvals do not affect real businesses or accounts.</div>'+
    '<div class="stats-row"><div class="panel metric"><span class="metric-label">▦ &nbsp; Restaurants</span><strong>'+db.restaurants.length+'</strong><small>Demo listings</small></div><div class="panel metric"><span class="metric-label">◷ &nbsp; Pending approval</span><strong>'+pending+'</strong><small>Review required</small></div><div class="panel metric"><span class="metric-label">▤ &nbsp; Total orders</span><strong>'+db.orders.length+'</strong><small>Fictional orders</small></div><div class="panel metric"><span class="metric-label">☰ &nbsp; Menu items</span><strong>'+db.menu.length+'</strong><small>Across restaurants</small></div></div>'+
    '<div class="section-heading"><div><h2>Restaurant approvals</h2><p>Approve or decline pending example partners</p></div></div><div class="panel table-wrap"><table class="data-table"><thead><tr><th>Restaurant</th><th>Category</th><th>Status</th><th>Actions</th></tr></thead><tbody>'+
    db.restaurants.map(r=>'<tr><td><div class="item-cell"><img src="'+esc(r.image)+'" alt=""><div><strong>'+esc(r.name)+'</strong><small>Partner '+esc(r.id.toUpperCase())+'</small></div></div></td><td>'+esc(r.category)+'</td><td>'+badge(r.status)+'</td><td>'+(r.status!=="Active"?'<button class="button soft small" data-action="approval" data-status="Active" data-id="'+esc(r.id)+'">Approve</button> ':'')+(r.status!=="Declined"?'<button class="button danger small" data-action="approval" data-status="Declined" data-id="'+esc(r.id)+'">Decline</button>':'')+'</td></tr>').join("")+'</tbody></table></div>'+
    '<div class="section-heading"><div><h2>Recent platform orders</h2><p>Cross-restaurant sample activity</p></div></div><div class="panel table-wrap"><table class="data-table"><thead><tr><th>Order</th><th>Restaurant</th><th>Total</th><th>Status</th></tr></thead><tbody>'+
    db.orders.slice().reverse().map(o=>'<tr><td><strong>'+esc(o.id)+'</strong></td><td>'+esc((restaurant(o.restaurantId)||{}).name||"Demo restaurant")+'</td><td>'+money(o.total)+'</td><td>'+badge(o.status)+'</td></tr>').join("")+'</tbody></table></div>';
}
function editor(id){
  const item=id?food(id):null;
  const categories=["Burgers","Sides","Drinks","Pizza","Pasta","Rice bowls"];
  el("detailContent").innerHTML='<form id="productForm"><div class="dialog-heading"><div><span class="eyebrow">RESTAURANT WORKSPACE</span><h2>'+(item?"Edit menu item":"Add menu item")+'</h2></div><button class="icon-button" type="button" data-close="detailDialog" aria-label="Close">×</button></div><p class="subtext">Demo changes apply only to your browser.</p><input type="hidden" name="id" value="'+(item?item.id:"")+'"><label class="form-label">Item name<input name="name" maxlength="70" value="'+esc(item?item.name:"")+'" required></label><div class="field-row"><label>Category<select name="category">'+categories.map(c=>'<option value="'+esc(c)+'" '+(item&&c===item.category?'selected':'')+'>'+esc(c)+'</option>').join("")+'</select></label><label>Price (PHP)<input type="number" name="price" min="1" max="100000" step="1" value="'+(item?item.price:150)+'" required></label></div><label class="form-label">Description<input name="description" maxlength="160" value="'+esc(item?item.description:"")+'" required></label><label class="form-label"><input name="active" type="checkbox" '+(!item||item.active?'checked':'')+' style="width:auto;display:inline;min-height:0"> &nbsp;Available to customers</label><div class="notice">A default product image is used for new demo items; no uploads are stored.</div><button class="button primary wide" type="submit">Save sample item <span>→</span></button></form>';
  showDialog("detailDialog");
}
function render(){
  const route=currentRoute();
  renderShell(route);
  if(route==="/business"&&role!=="business"){app.innerHTML=header("Restaurant workspace","Sign in using the included restaurant-owner demo account.",'<button class="button primary" data-action="business-login">Try restaurant demo →</button>')+'<div class="panel blank"><div class="blank-emoji">🏪</div><h3>Restaurant owner access</h3><p>This workspace is part of the simulated role-based demo.</p></div>';return;}
  if(route==="/admin"&&role!=="admin"){app.innerHTML=header("Admin workspace","Sign in using the included administrator demo account.",'<button class="button primary" data-action="admin-login">Try admin demo →</button>')+'<div class="panel blank"><div class="blank-emoji">🛡️</div><h3>Admin access</h3><p>This workspace is part of the simulated role-based demo.</p></div>';return;}
  if(route==="/orders"&&role!=="customer"){app.innerHTML=header("Your orders","Sign in using the included customer demo account.",'<button class="button primary" data-action="customer-login">Try customer demo →</button>')+'<div class="panel blank"><div class="blank-emoji">📦</div><h3>Demo customer account</h3><p>Use the sample credentials to see your orders.</p></div>';return;}
  app.innerHTML=route==="/business"?business():route==="/admin"?admin():route==="/orders"?orders():explore();
}
document.addEventListener("click",event=>{
  const close=event.target.closest("[data-close]");
  if(close){closeDialog(close.dataset.close);return;}
  const choice=event.target.closest("[data-role-choice]");
  if(choice){selectRole(choice.dataset.roleChoice);return;}
  const nav=event.target.closest("[data-route]");
  if(nav){event.preventDefault();const path=nav.dataset.route;if(!authorize(path))return;navigate(path);return;}
  const action=event.target.closest("[data-action]");
  if(!action)return;
  const cmd=action.dataset.action;const id=action.dataset.id;
  if(cmd==="cart"){renderCart();showDialog("cartDialog");}
  else if(cmd==="continue"){closeDialog("cartDialog");navigate("/");}
  else if(cmd==="browse"){el("menuSection")?.scrollIntoView({behavior:"smooth"});}
  else if(cmd==="category"){category=action.dataset.category;render();}
  else if(cmd==="restaurant"){restaurantFilter=restaurantFilter===id?"All":id;render();el("menuSection")?.scrollIntoView({behavior:"smooth"});}
  else if(cmd==="add"){
    if(role!=="customer"){openLogin("customer","/");return;}
    const item=food(id);if(!item||!item.active)return;
    if(db.cart.length){const previous=food(db.cart[0].id);if(previous&&previous.restaurantId!==item.restaurantId){toast("Finish or clear your current restaurant's cart before switching.");renderCart();showDialog("cartDialog");return;}}
    const found=db.cart.find(x=>x.id===item.id);if(found)found.qty=Math.min(20,found.qty+1);else db.cart.push({id:item.id,qty:1});
    save();render();toast(item.name+" added to cart.");
  }
  else if(cmd==="qty"){
    const found=db.cart.find(x=>x.id===Number(id));if(!found)return;
    found.qty+=Number(action.dataset.delta);
    if(found.qty<=0)db.cart=db.cart.filter(x=>x!==found);else found.qty=Math.min(found.qty,20);
    save();renderCart();renderShell(currentRoute());if(currentRoute()==="/")render();
  }
  else if(cmd==="checkout")checkout();
  else if(cmd==="cancel-order"){
    const o=db.orders.find(x=>x.id===id);
    if(o&&o.status!=="Delivered"){o.cancelRequested=true;save();render();toast("Demo cancellation request submitted.");}
  }
  else if(cmd==="new-item")editor();
  else if(cmd==="edit-item")editor(id);
  else if(cmd==="toggle-item"){
    const item=food(id);if(item&&item.restaurantId==="r1"){item.active=!item.active;save();render();toast("Menu availability updated locally.");}
  }
  else if(cmd==="advance"){
    const o=db.orders.find(x=>x.id===id&&x.restaurantId==="r1");
    const next=({"Placed":"Preparing","Preparing":"Ready","Ready":"Delivered"})[o?.status];
    if(o&&next){o.status=next;save();render();toast("Sample order marked "+next+".");}
  }
  else if(cmd==="approve-cancel"){
    const o=db.orders.find(x=>x.id===id&&x.restaurantId==="r1");
    if(o&&o.cancelRequested){o.status="Cancelled";o.cancelRequested=false;save();render();toast("Sample order cancellation approved.");}
  }
  else if(cmd==="approval"){
    const r=restaurant(id),status=action.dataset.status;
    if(r&&["Active","Declined"].includes(status)){r.status=status;save();render();toast("Sample restaurant "+status.toLowerCase()+".");}
  }
  else if(cmd==="reset-confirm")reset();
  else if(cmd==="customer-login")openLogin("customer","/orders");
  else if(cmd==="business-login")openLogin("business","/business");
  else if(cmd==="admin-login")openLogin("admin","/admin");
});
document.addEventListener("input",event=>{
  if(event.target.id==="searchInput"){search=event.target.value.trim();renderCatalog();}
});
document.addEventListener("submit",event=>{
  if(event.target.id==="loginForm"){
    event.preventDefault();
    const acc=ACCOUNT_LIST.find(x=>x.role===selectedRole);
    if(el("demoEmail").value.trim().toLowerCase()!==acc.email || el("demoPassword").value!==acc.password){el("loginError").textContent="Use the displayed demo credentials to continue.";return;}
    role=selectedRole;sessionStorage.setItem(ROLE_KEY,role);
    closeDialog("loginDialog");
    const destination=afterLogin&&({"/":"customer","/orders":"customer","/business":"business","/admin":"admin"})[afterLogin]===role?afterLogin:acc.path;
    afterLogin=null;navigate(destination);toast("Signed in to the "+acc.title.toLowerCase()+" demo.");
  }
  else if(event.target.id==="checkoutForm"){
    event.preventDefault();
    if(role!=="customer"||!db.cart.length){closeDialog("checkoutDialog");return;}
    const address=el("checkoutAddress").value.trim();
    if(!address){toast("Enter a sample delivery address.");return;}
    const rest=food(db.cart[0].id);
    const order={id:"GF-"+db.nextOrder++,restaurantId:rest.restaurantId,items:db.cart.map(x=>({id:x.id,qty:x.qty})),total:cartTotal(),status:"Placed",payment:el("checkoutPayment").value,address,placedAt:new Date().toISOString(),cancelRequested:false};
    db.orders.push(order);db.cart=[];save();
    closeDialog("checkoutDialog");navigate("/orders");toast("Demo order "+order.id+" placed — no real transaction.");
  }
  else if(event.target.id==="productForm"){
    event.preventDefault();
    if(role!=="business")return;
    const fd=new FormData(event.target),name=String(fd.get("name")||"").trim(),description=String(fd.get("description")||"").trim(),price=Number(fd.get("price"));
    if(!name||!description||!Number.isFinite(price)||price<=0||price>100000){toast("Check the item name, description and price.");return;}
    const category=String(fd.get("category")||"Burgers"),active=fd.has("active"),id=Number(fd.get("id"));
    const existing=id?food(id):null;
    if(existing&&existing.restaurantId==="r1"){Object.assign(existing,{name,description,price,category,active});}
    else if(!id){db.menu.push({id:db.nextItem++,restaurantId:"r1",name,description,price,category,active,image:IMAGES.burger});}
    save();closeDialog("detailDialog");render();toast("Sample menu item saved.");
  }
});
function reset(){
  if(!confirm("Reset sample data and orders in this browser?"))return;
  db=seed();save();category="All";search="";restaurantFilter="All";closeDialog("cartDialog");navigate("/");toast("Demo sample data restored.");
}
el("loginForm").addEventListener("reset",e=>e.preventDefault());
el("accountButton").addEventListener("click",()=>openLogin(role==="guest"?"customer":role,null));
el("demoInfo").addEventListener("click",()=>showDialog("infoDialog"));
el("resetDemo").addEventListener("click",reset);
window.addEventListener("popstate",render);
render();
