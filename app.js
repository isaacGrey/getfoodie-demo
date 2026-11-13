/* GetFoodie v2 UI. Demonstration data and sessions are local to this browser. */
"use strict";
const C=globalThis.FoodieCore;
if(!C)throw new Error("GetFoodie core missing");
let state=C.load(localStorage);
let session=null;
try{session=JSON.parse(sessionStorage.getItem(C.SESSION)||"null");}catch(_){}
const $=id=>document.getElementById(id);
const root=$("root");
const price=n=>new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP",maximumFractionDigits:2}).format(n||0);
const fmt=d=>{const t=new Date(d);return Number.isNaN(t.getTime())?"—":t.toLocaleString("en-PH",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"});};
const h=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const roleHome={customer:"/customer",vendor:"/vendor",admin:"/admin"};
const icon={home:"⌂",orders:"▤",menu:"☷",settings:"⚙",profile:"♙",users:"♙",restaurants:"▦",reports:"◫"};
let search="",cat="All",storeFilter="All",orderFilter="All",fulfilment="Delivery";
function persist(){C.save(localStorage,state);}
function toast(message,type="info"){
 const node=$("toast");node.textContent=message;node.className="toast show "+(type==="error"?"toast-error":"");
 clearTimeout(toast.timer);toast.timer=setTimeout(()=>node.classList.remove("show"),3800);
}
function error(e){toast(e?.message||"Something went wrong.","error");}
function account(){return session&&state.accounts.find(x=>x.id===session.id&&x.role===session.role&&x.enabled);}
function syncSession(){const a=account();if(!a){session=null;sessionStorage.removeItem(C.SESSION);}else session={id:a.id,role:a.role,email:a.email,name:a.name};}
function path(){return location.pathname.replace(/\/+$/,"")||"/";}
function navigate(to,replace=false){
 if(!to.startsWith("/"))return;
 history[replace?"replaceState":"pushState"]({},"",to);
 render();window.scrollTo(0,0);
}
function signout(){session=null;sessionStorage.removeItem(C.SESSION);navigate("/login");toast("Signed out. Demo data remains in this browser.");}
function item(id){return C.item(state,id);}
function store(id){return C.byId(state,id);}
function ownStore(){return session?C.vendorStore(state,session):null;}
function badge(value){const key=String(value).toLowerCase().replace(/[^a-z]+/g,"-");return '<span class="badge status-'+h(key)+'">'+h(value)+'</span>';}
function btn(text,act,id,style="outline",extra=""){return '<button type="button" class="button '+style+'" data-act="'+h(act)+'"'+(id!=null?' data-id="'+h(id)+'"':"")+' '+extra+'>'+text+'</button>';}
function title(kicker,heading,sub,action=""){return '<header class="page-header"><div><div class="eyebrow">'+h(kicker)+'</div><h1>'+h(heading)+'</h1><p>'+h(sub)+'</p></div><div class="page-tools">'+action+'</div></header>';}
function empty(emoji,headline,text,action=""){return '<div class="panel blank"><div class="blank-emoji">'+emoji+'</div><h3>'+h(headline)+'</h3><p>'+h(text)+'</p>'+action+'</div>';}
function panelHeading(label,meta=""){return '<div class="section-heading"><div><h2>'+h(label)+'</h2><p>'+h(meta)+'</p></div></div>';}
function metric(label,val,caption,ic="◈"){return '<article class="panel metric"><span class="metric-label">'+ic+' &nbsp; '+h(label)+'</span><strong>'+val+'</strong><small>'+h(caption)+'</small></article>';}
function breadcrumb(p){return p.split("/").filter(Boolean).map(x=>x[0].toUpperCase()+x.slice(1)).join(" / ");}
function navItems(role){
 if(role==="customer")return [{to:"/customer",i:"home",text:"Discover food"},{to:"/customer/orders",i:"orders",text:"My orders"},{to:"/customer/profile",i:"profile",text:"Account & address"}];
 if(role==="vendor")return [{to:"/vendor",i:"home",text:"Overview"},{to:"/vendor/orders",i:"orders",text:"Order fulfilment"},{to:"/vendor/menu",i:"menu",text:"Menu & inventory"},{to:"/vendor/reports",i:"reports",text:"Sales reports"},{to:"/vendor/settings",i:"settings",text:"Restaurant setup"}];
 return [{to:"/admin",i:"home",text:"Platform overview"},{to:"/admin/vendors",i:"restaurants",text:"Restaurant approvals"},{to:"/admin/users",i:"users",text:"Accounts & access"},{to:"/admin/settings",i:"settings",text:"Platform setup"}];
}
function loginScreen(){
 const accounts=C.CREDENTIALS;
 return '<div class="auth-page"><section class="auth-story"><div class="auth-brand"><span class="brand-icon">✳</span><b>getfoodie<span class="brand-period">.</span></b><span class="auth-tag">INTERACTIVE DEMO</span></div><div class="auth-story-body"><span class="overline">A FOOD ORDERING PLATFORM · CASE STUDY</span><h1>Good food.<br>All the way <em>to your door.</em></h1><p>Explore a complete ordering and fulfilment journey. Three real demo screens, one shared fictional workspace.</p><div class="auth-feature">✓ Discover and order local favorites</div><div class="auth-feature">✓ Manage a restaurant from order to delivery</div><div class="auth-feature">✓ Configure and oversee the platform</div></div><div class="auth-story-foot"><span>✦ Portfolio practice project</span><span>No real purchases or payments</span></div></section><section class="auth-box"><div class="auth-card"><span class="eyebrow">WELCOME TO GETFOODIE</span><h2>Sign in to explore</h2><p>Choose one of the demo accounts below, then sign in with the sample credentials.</p><div class="demo-user-list">'+accounts.map(a=>'<button type="button" class="demo-user" data-act="fill-login" data-id="'+a.role+'"><span class="role-emoji">'+({customer:"🍔",vendor:"🏪",admin:"🛡️"})[a.role]+'</span><span><strong>'+({customer:"Customer",vendor:"Restaurant owner",admin:"Platform administrator"})[a.role]+'</strong><small>'+h(a.email)+'</small></span><span class="use-link">Use ↗</span></button>').join("")+'</div><form id="loginForm" class="auth-form"><label>Email address<input type="email" id="loginEmail" name="email" placeholder="you@example.com" autocomplete="username" required></label><label>Password<div class="pass-wrap"><input id="loginPassword" type="password" name="password" placeholder="Enter the demo password" autocomplete="current-password" required><button type="button" class="show-pass" data-act="show-password">Show</button></div></label><button class="button primary wide" type="submit">Sign in to demo <span>→</span></button></form><div class="auth-help"><span>All three accounts use <b>Demo123!</b></span><span>This is browser-local demo authentication, not a production identity service.</span></div></div></section></div>';
}
function shell(main,p){
 const role=session.role,nav=navItems(role),label={customer:"CUSTOMER",vendor:"RESTAURANT OWNER",admin:"PLATFORM ADMIN"}[role];
 const r=ownStore();
 return '<div class="demo-strip"><span class="strip-dot"></span><b>PORTFOLIO DEMO</b><span>Fictional orders and customers · No live payments</span><button data-act="about">About this demo</button></div><div class="shell app-shell theme-'+role+'"><aside class="sidebar"><a class="brand" href="'+roleHome[role]+'" data-link="'+roleHome[role]+'"><span class="brand-icon">✳</span>getfoodie<span class="brand-period">.</span></a><div class="sidebar-label">'+label+' WORKSPACE</div><nav class="side-nav">'+nav.map(n=>'<a class="nav-link '+((p===n.to||n.to!==roleHome[role]&&p.startsWith(n.to+"/"))?"active":"")+'" href="'+n.to+'" data-link="'+n.to+'"><span class="nav-icon">'+icon[n.i]+'</span><span class="nav-text">'+n.text+'</span></a>').join("")+'</nav><div class="side-bottom"><div class="portfolio-note"><span>✦ &nbsp; PRACTICE PROJECT</span><p>'+({customer:"Place a sample order, then explore order tracking.",vendor:"Accept, prepare, dispatch and complete orders.",admin:"Approve partners and configure the demo platform."})[role]+'</p></div>'+btn("↻ &nbsp; Reset browser data","reset",null,"side-link")+'</div></aside><div class="main-area"><header class="topbar"><span class="mobile-brand"><span class="brand-icon">✳</span><b>getfoodie.</b></span><span class="crumb">'+h(breadcrumb(p))+'</span><div class="top-actions"><span class="status-live"><span></span> Demo environment</span>'+(role==="customer"?btn("🛒 Cart ("+C.getCart(state,session).reduce((n,i)=>n+i.qty,0)+")","cart",null,"top-cart"):"")+'<div class="user-info"><span class="avatar">'+h(session.name[0]||"D")+'</span><span class="account-name"><strong>'+h(session.name)+'</strong><small>'+h(label.toLowerCase())+'</small></span></div>'+btn("Sign out","signout",null,"button-sm")+'</div></header><main id="app" class="page-content">'+main+'</main><footer class="footer"><span>'+h(state.settings.name)+' · Interactive portfolio demonstration</span><span>All activity stays in this browser.</span></footer></div></div>';
}
function restaurantTiles(){
 const avail=state.restaurants.filter(r=>r.status==="Approved");
 const matches=avail.filter(r=>(storeFilter==="All"||storeFilter===r.id)&&(search===""||(r.name+" "+r.category).toLowerCase().includes(search.toLowerCase())));
 return matches.map(r=>'<button class="panel restaurant-tile '+(storeFilter===r.id?"selected":"")+'" data-act="filter-store" data-id="'+h(r.id)+'"><img src="'+h(r.image)+'" alt="'+h(r.name)+'" loading="lazy"><span class="restaurant-detail"><b>'+h(r.name)+'</b><small>'+h(r.category)+'</small><span class="rating">★ '+r.rating.toFixed(1)+' <span>· ~'+r.eta+' min</span></span></span>'+(!r.open?'<span class="badge status-cancelled">Closed</span>':'')+'</button>').join("")||empty("🔎","No restaurants found","Try a different search.");
}
function dishes(){
 const available=state.menu.filter(f=>{
  const r=store(f.restaurantId);
  return f.active&&f.stock>0&&r&&r.status==="Approved"&&r.open&&(storeFilter==="All"||f.restaurantId===storeFilter)&&(cat==="All"||f.category===cat)&&(search===""||(f.name+" "+f.description+" "+f.category+" "+r.name).toLowerCase().includes(search.toLowerCase()));
 });
 return available.map(f=>'<article class="panel food-card"><img class="food-image" src="'+h(f.image)+'" alt="'+h(f.name)+'" loading="lazy"><div class="food-body"><div class="food-type">'+h(f.category)+' <span>· '+h(store(f.restaurantId)?.name)+'</span></div><h3>'+h(f.name)+'</h3><p>'+h(f.description)+'</p><div class="food-footer"><strong>'+price(f.price)+'</strong>'+btn("+ Add","add",f.id,"soft small")+'</div></div></article>').join("")||empty("🍴","Nothing in this category","Try another category, restaurant or search.");
}
function customerHome(){
 const rcount=state.restaurants.filter(x=>x.status==="Approved").length;
 const categories=["All",...new Set(state.menu.map(f=>f.category))];
 return title("CUSTOMER / DISCOVER","Find your next craving","Explore restaurants, build a cart, and place an entirely fictional order.",btn("My orders →","go-orders",null,"outline"))+
 '<div class="panel hero-panel"><div class="hero-copy"><span class="eyebrow">FRESH PICKS, EVERY DAY</span><h2>Hungry? <span class="highlight">We’ve got you.</span></h2><p>'+h(state.settings.announcement)+'</p>'+btn("Explore the menu ↓","browse",null,"primary")+'</div><img class="hero-image" src="'+h(C.IMAGES.burger)+'" alt="Delicious burger"></div>'+
 '<div class="mini-stats">'+metric("Demo restaurants",String(rcount),"Approved partners","▦")+metric("Available dishes",String(state.menu.filter(f=>f.active&&f.stock>0).length),"Browse the menu","◈")+metric("Your orders",String(state.orders.filter(x=>x.customerId===session.id).length),"Track any time","▤")+'</div>'+
 '<div class="section-heading" id="restaurants"><div><h2>Restaurants near you</h2><p>Made-up locations, real UI interactions</p></div><div class="search"><span>⌕</span><input id="catalogSearch" type="search" value="'+h(search)+'" placeholder="Search food or restaurants…" aria-label="Search"></div></div><div class="restaurant-grid" id="restaurantTiles">'+restaurantTiles()+'</div>'+
 '<div class="section-heading" id="menu-section"><div><h2>Popular dishes</h2><p>Browse and add something delicious</p></div>'+btn("Clear filters","clear-filters",null,"button-sm")+'</div><div id="categoryChips" class="filters">'+categories.map(c=>'<button class="chip '+(c===cat?"active":"")+'" data-act="filter-category" data-id="'+h(c)+'">'+h(c)+'</button>').join("")+'</div><div class="food-grid" id="foodGrid">'+dishes()+'</div>';
}
function cartMarkup(){
 const info=C.cartInfo(state,session);
 if(!info.lines.length)return empty("🛒","Your cart is empty","Add a dish from the menu to begin.",btn("Browse dishes","close-cart",null,"primary"));
 return '<div class="cart-items"><p class="subtext">Ordering from <strong>'+h(info.restaurant?.name)+'</strong></p>'+info.lines.map(x=>'<div class="cart-product"><img src="'+h(x.food.image)+'" alt=""><div class="body"><h3>'+h(x.food.name)+'</h3><p>'+price(x.food.price)+' each</p><div class="qty-stepper">'+btn("−","qty",x.food.id,"qty-btn",'data-step="-1"')+'<b>'+x.qty+'</b>'+btn("+","qty",x.food.id,"qty-btn",'data-step="1"')+'</div></div><strong>'+price(x.food.price*x.qty)+'</strong></div>').join("")+'</div><div class="cart-summary"><div class="summary-line"><span>Food subtotal</span><b>'+price(info.subtotal)+'</b></div><div class="summary-line"><span>Delivery fee</span><span>From '+price(state.settings.deliveryFee)+'</span></div><div class="summary-line total"><b>Subtotal</b><b>'+price(info.subtotal)+'</b></div><div class="notice warning">No real orders or payments. All changes are local to this browser.</div>'+btn("Continue to checkout →","checkout",null,"primary wide")+'<div style="margin-top:8px">'+btn("Clear cart","clear-cart",null,"button-sm")+'</div></div>';
}
function customerCheckout(){
 const info=C.cartInfo(state,session,fulfilment);
 if(!info.lines.length)return title("CUSTOMER / CHECKOUT","Your cart is empty","Add items from a restaurant before checking out.",btn("Go shopping →","shop",null,"primary"));
 const isDelivery=fulfilment==="Delivery";
 const profile=C.account(state,"customer");
 return title("CUSTOMER / CHECKOUT","Review & place your order","One final check. No payment is processed by this demo.",btn("← Back to menu","shop",null))+
 '<div class="two-col"><form id="checkoutForm" class="panel form-panel"><div class="panel-label">01 &nbsp; Fulfilment method</div><div class="switch-row"><label class="method '+(isDelivery?"chosen":"")+'"><input type="radio" name="fulfilment" value="Delivery" '+(isDelivery?"checked":"")+' required><span>🛵 Delivery<small>Delivered to a sample address</small></span></label><label class="method '+(!isDelivery?"chosen":"")+'"><input type="radio" name="fulfilment" value="Pickup" '+(!isDelivery?"checked":"")+'><span>🏪 Pickup<small>Collect from the restaurant</small></span></label></div>'+
 (isDelivery?'<label class="form-label">Delivery address<input type="text" name="address" required minlength="6" maxlength="160" value="'+h(profile?.address||"")+'" placeholder="Enter a fictional address"></label>':'<div class="notice">Collection point: '+h(info.restaurant?.address)+'</div>')+
 '<label class="form-label">Special instructions<textarea name="notes" maxlength="200" rows="3" placeholder="Optional note to the restaurant"></textarea></label><div class="panel-label second">02 &nbsp; Payment</div><div class="notice warning"><b>'+(!isDelivery?"Pay on pickup":"Cash on delivery")+'</b> · No online payment, credit-card details, or money collection is supported.</div><label class="check"><input type="checkbox" required> I understand this is only a simulated purchase.</label><button type="submit" class="button primary wide">Place demo order <span>'+price(info.total)+' →</span></button></form>'+
 '<aside class="panel order-summary"><h3>Order summary</h3><p class="subtext">'+h(info.restaurant?.name)+'</p>'+info.lines.map(x=>'<div class="summary-line"><span>'+h(x.qty+" × "+x.food.name)+'</span><b>'+price(x.food.price*x.qty)+'</b></div>').join("")+'<hr><div class="summary-line"><span>Food subtotal</span><b>'+price(info.subtotal)+'</b></div><div class="summary-line"><span>'+ (isDelivery?"Delivery fee":"Pickup fee")+'</span><b>'+price(info.deliveryFee)+'</b></div><div class="summary-line"><span>Service fee</span><b>'+price(info.serviceFee)+'</b></div><div class="summary-line total"><b>Total</b><b>'+price(info.total)+'</b></div><p class="help-line">All items and totals are fictitious. Payment remains unpaid until the sample vendor marks the order delivered.</p></aside></div>';
}
function orderCard(o){
 const r=store(o.restaurantId);
 return '<article class="panel order-card"><div class="order-header"><div><strong>'+h(o.id)+'</strong><p>'+h(r?.name)+' · '+fmt(o.createdAt)+'</p></div>'+badge(o.status)+'</div><p>'+o.items.map(i=>h(i.qty+" × "+i.name)).join(" · ")+'</p><div class="progress-track">'+C.FLOW.map(st=>'<span class="'+(C.FLOW.indexOf(st)<=C.FLOW.indexOf(o.status)?"done":"")+'"></span>').join("")+'</div><div class="order-actions"><span><strong>'+price(o.total)+'</strong><small>'+h(o.fulfilment)+' · '+h(o.paymentStatus)+'</small></span><a href="/customer/orders/'+h(o.id)+'" data-link="/customer/orders/'+h(o.id)+'" class="button outline">View details →</a></div></article>';
}
function customerOrders(){
 const orders=state.orders.filter(o=>o.customerId===session.id).slice().reverse();
 return title("CUSTOMER / ORDERS","Your order history","Every order appears here, including live changes made by the demo vendor.",btn("New order +","shop",null,"primary"))+
 '<div class="toolbar filters">'+["All","Active","Completed","Cancelled"].map(v=>'<button class="chip '+(orderFilter===v?"active":"")+'" data-act="order-filter" data-id="'+v+'">'+v+'</button>').join("")+'</div><div class="orders-list">'+(orders.filter(o=>orderFilter==="All"||orderFilter==="Active"&&!C.DONE.includes(o.status)||orderFilter==="Completed"&&o.status==="Delivered"||orderFilter==="Cancelled"&&["Cancelled","Rejected"].includes(o.status)).map(orderCard).join("")||empty("📦","No matching orders","Try a different filter or place an order.",btn("Explore food","shop",null,"primary")))+'</div>';
}
function orderDetail(id){
 let o;try{o=C.ownOrder(state,session,id);}catch(_){return empty("🔎","Order not found","Only your own orders are visible.");}
 const idx=C.FLOW.indexOf(o.status);
 const isDone=C.DONE.includes(o.status);
 return title("CUSTOMER / ORDER DETAILS","Order "+o.id,"Placed "+fmt(o.createdAt),btn("← All orders","go-orders",null))+
 '<div class="two-col"><div class="panel form-panel"><div class="order-header"><h3>Order progress</h3>'+badge(o.status)+'</div><div class="timeline">'+o.history.map(e=>'<div class="timeline-item"><span class="timeline-dot"></span><div><strong>'+h(e.status)+'</strong><small>'+fmt(e.at)+'</small>'+(e.reason?'<p>'+h(e.reason)+'</p>':"")+'</div></div>').join("")+'</div>'+
 (o.cancelRequested?'<div class="notice warning">Cancellation requested. The vendor can approve or decline it.</div>':"")+
 (!isDone&&!o.cancelRequested&&o.status!=="Out for delivery"?btn("Request cancellation","cancel",o.id,"danger"):"")+
 (o.status==="Delivered"?'<div class="rating-section"><h3>How was your order?</h3><p class="subtext">Leave a demo rating for the completed order.</p><div class="stars">'+[1,2,3,4,5].map(n=>'<button type="button" data-act="rate" data-id="'+o.id+'" data-rating="'+n+'" aria-label="Rate '+n+' stars" class="'+(o.rating&&n<=o.rating?"lit":"")+'">★</button>').join("")+'</div></div>':"")+
 '</div><aside class="panel order-summary"><h3>Receipt · demo</h3><p class="subtext">'+h(store(o.restaurantId)?.name)+'</p><hr>'+o.items.map(x=>'<div class="summary-line"><span>'+x.qty+' × '+h(x.name)+'</span><b>'+price(x.price*x.qty)+'</b></div>').join("")+'<hr><div class="summary-line"><span>Subtotal</span><b>'+price(o.subtotal)+'</b></div><div class="summary-line"><span>Delivery</span><b>'+price(o.deliveryFee)+'</b></div><div class="summary-line"><span>Service fee</span><b>'+price(o.serviceFee)+'</b></div><div class="summary-line total"><b>Total</b><b>'+price(o.total)+'</b></div><div class="order-meta"><b>Fulfilment</b><span>'+h(o.fulfilment)+'</span><b>Payment</b><span>'+h(o.payment)+' · '+h(o.paymentStatus)+'</span><b>Address / pickup point</b><span>'+h(o.address)+'</span><b>Instructions</b><span>'+h(o.notes||"None")+'</span></div>'+btn("↻ Reorder these items","reorder",o.id,"wide")+'</aside></div>';
}
function customerProfile(){
 const a=C.account(state,"customer");
 return title("CUSTOMER / ACCOUNT","Your profile","Manage the fictional delivery contact details used by the demo.")+
 '<div class="settings-grid"><form id="profileForm" class="panel form-panel"><h3>Contact & delivery</h3><label class="form-label">Full name<input name="name" value="'+h(a.name)+'" required maxlength="60"></label><label class="form-label">Email<input value="'+h(a.email)+'" disabled></label><label class="form-label">Phone<input name="phone" value="'+h(a.phone)+'" maxlength="30"></label><label class="form-label">Default sample address<textarea name="address" maxlength="160" rows="3">'+h(a.address)+'</textarea></label><button type="submit" class="button primary">Save profile</button></form><div class="panel form-panel"><h3>Account information</h3><p>Role: <strong>Customer</strong></p><p>This sample account can be disabled or re-enabled from the administrator workspace.</p><div class="notice">Changes are stored locally in this browser. No private information should be entered.</div></div></div>';
}
function vendorDashboard(){
 const r=ownStore(),orders=state.orders.filter(o=>o.restaurantId===r?.id),open=orders.filter(o=>!C.DONE.includes(o.status)),sales=orders.filter(o=>o.status==="Delivered").reduce((n,o)=>n+o.subtotal,0);
 return title("VENDOR / OVERVIEW","Welcome back, "+session.name.split(" ")[0],"Here's what's happening at "+(r?.name||"your restaurant")+".",btn("Manage orders →","vendor-orders",null,"primary"))+
 '<div class="notice '+(!r?.open?"warning":"")+'"><b>Store is '+(r?.open?"accepting orders":"temporarily closed")+'.</b> '+(r?.open?"Customers can view and order your available dishes.":"Reopen it in Restaurant setup.")+' '+btn("Store settings","vendor-settings",null,"button-sm")+'</div>'+
 '<div class="stats-row">'+metric("Incoming orders",String(orders.filter(o=>o.status==="Placed").length),"Awaiting acceptance","▤")+metric("In progress",String(open.filter(o=>o.status!=="Placed").length),"Prepare and dispatch","◷")+metric("Demo sales",price(sales),"Delivered subtotal","₱")+metric("Menu items",String(state.menu.filter(f=>f.restaurantId===r?.id).length),"Inventory items","☷")+'</div>'+
 panelHeading("Order queue","Prioritize new and in-progress orders")+'<div class="panel table-wrap">'+vendorTable(open.slice().reverse().slice(0,7))+'</div>'+
 '<div class="two-col dashboard-bottom"><section><div class="section-heading"><div><h2>Menu availability</h2><p>Stock and visibility at a glance</p></div>'+btn("Open menu →","vendor-menu",null,"button-sm")+'</div><div class="panel compact-list">'+state.menu.filter(f=>f.restaurantId===r?.id).slice(0,5).map(f=>'<div class="list-row"><div class="item-cell"><img src="'+h(f.image)+'" alt=""><div><b>'+h(f.name)+'</b><small>'+h(f.category)+'</small></div></div><span class="stock-tag">'+f.stock+' left</span></div>').join("")+'</div></section><section>'+panelHeading("Store snapshot","Adjust working hours in settings")+'<div class="panel form-panel"><div class="summary-line"><span>Store status</span>'+badge(r?.open?"Open":"Closed")+'</div><div class="summary-line"><span>Opening hours</span><b>'+h(r?.opening)+' – '+h(r?.closing)+'</b></div><div class="summary-line"><span>Preparation time</span><b>'+r?.prep+' min</b></div><div class="summary-line"><span>Fulfilment</span><b>'+(r?.delivery?"Delivery ":"")+(r?.pickup?"Pickup":"")+'</b></div>'+btn("Configure store →","vendor-settings",null,"outline wide")+'</div></section></div>';
}
function vendorTable(orders){
 if(!orders.length)return '<div class="blank"><div class="blank-emoji">📦</div><h3>No orders in this view</h3><p>Customer demo orders will appear here.</p></div>';
 return '<table class="data-table"><thead><tr><th>Order</th><th>Items</th><th>Fulfilment</th><th>Total</th><th>Status</th><th></th></tr></thead><tbody>'+orders.map(o=>'<tr><td><b>'+h(o.id)+'</b><small>'+fmt(o.createdAt)+'</small></td><td>'+o.items.map(i=>h(i.qty+" × "+i.name)).join(", ")+'</td><td>'+h(o.fulfilment)+'</td><td><b>'+price(o.total)+'</b></td><td>'+badge(o.status)+(o.cancelRequested?'<small class="danger-text">Cancellation requested</small>':"")+'</td><td><a class="button small" data-link="/vendor/orders/'+h(o.id)+'" href="/vendor/orders/'+h(o.id)+'">Manage →</a></td></tr>').join("")+'</tbody></table>';
}
function vendorOrders(){
 const r=ownStore(),orders=state.orders.filter(o=>o.restaurantId===r?.id).slice().reverse();
 const filter=orderFilter;
 const filtered=orders.filter(o=>filter==="All"||filter==="New"&&o.status==="Placed"||filter==="In progress"&&!C.DONE.includes(o.status)&&o.status!=="Placed"||filter==="Completed"&&C.DONE.includes(o.status)||filter==="Cancellations"&&o.cancelRequested);
 return title("VENDOR / FULFILMENT","Orders & fulfilment","Accept, reject, prepare, dispatch and complete each fictional order.",btn("Refresh","refresh",null))+
 '<div class="filters toolbar">'+["All","New","In progress","Completed","Cancellations"].map(x=>'<button class="chip '+(x===filter?"active":"")+'" data-act="order-filter" data-id="'+h(x)+'">'+h(x)+' '+(x==="Cancellations"?'('+orders.filter(o=>o.cancelRequested).length+')':"")+'</button>').join("")+'</div><div class="panel table-wrap">'+vendorTable(filtered)+'</div>';
}
function vendorOrderDetail(id){
 let o;try{o=C.vendorOrder(state,session,id);}catch(_){return empty("🔎","Order not found","This order does not belong to your restaurant.");}
 let actions="";
 const next={"Placed":"Accepted","Accepted":"Preparing","Preparing":"Ready","Ready":o.fulfilment==="Pickup"?"Delivered":"Out for delivery","Out for delivery":"Delivered"}[o.status];
 if(o.cancelRequested)actions='<div class="notice warning"><b>Cancellation requested by customer</b><p>Choose whether to approve the cancellation.</p>'+btn("Approve cancellation","advance",o.id,"danger",'data-status="Cancelled"')+" "+btn("Decline request","decline-cancel",o.id)+'</div>';
 else if(next)actions=btn("Mark "+next+" →","advance",o.id,"primary",'data-status="'+h(next)+'"')+(o.status==="Placed"?btn("Reject order","reject",o.id,"danger"):"");
 return title("VENDOR / ORDER DETAILS","Order "+o.id,"Received "+fmt(o.createdAt),btn("← Order queue","vendor-orders",null))+
 '<div class="two-col"><section class="panel form-panel"><div class="order-header"><h3>Fulfilment status</h3>'+badge(o.status)+'</div><div class="timeline">'+o.history.map(x=>'<div class="timeline-item"><span class="timeline-dot"></span><div><b>'+h(x.status)+'</b><small>'+fmt(x.at)+'</small>'+(x.reason?'<p>'+h(x.reason)+'</p>':"")+'</div></div>').join("")+'</div><div class="fulfil-actions">'+actions+'</div><div class="notice">Only this restaurant&#39;s orders can be managed from the vendor workspace. Updates are immediately reflected in the customer demo.</div></section><aside class="panel order-summary"><h3>Order details</h3><p class="subtext">'+h(o.fulfilment)+' · '+h(o.payment)+'</p><hr>'+o.items.map(x=>'<div class="summary-line"><span>'+x.qty+' × '+h(x.name)+'</span><b>'+price(x.price*x.qty)+'</b></div>').join("")+'<hr><div class="summary-line"><span>Subtotal</span><b>'+price(o.subtotal)+'</b></div><div class="summary-line"><span>Delivery fee</span><b>'+price(o.deliveryFee)+'</b></div><div class="summary-line total"><b>Customer total</b><b>'+price(o.total)+'</b></div><div class="order-meta"><b>Payment</b><span>'+h(o.paymentStatus)+' · '+h(o.payment)+'</span><b>Destination</b><span>'+h(o.address)+'</span><b>Customer notes</b><span>'+h(o.notes||"No notes")+'</span></div></aside></div>';
}
function vendorMenu(){
 const r=ownStore(),foods=state.menu.filter(f=>f.restaurantId===r?.id);
 return title("VENDOR / CATALOG","Menu & inventory","Manage categories, stock, item visibility and prices.",btn("+ Add menu item","edit-item",null,"primary"))+
 '<div class="panel table-wrap"><table class="data-table"><thead><tr><th>Menu item</th><th>Category</th><th>Price</th><th>Stock</th><th>Visibility</th><th>Actions</th></tr></thead><tbody>'+foods.map(f=>'<tr><td><div class="item-cell"><img src="'+h(f.image)+'" alt=""><div><b>'+h(f.name)+'</b><small>'+h(f.description.slice(0,55))+'</small></div></div></td><td>'+h(f.category)+'</td><td><b>'+price(f.price)+'</b></td><td><span class="stock-tag '+(f.stock<=5?"low-stock":"")+'">'+f.stock+' in stock</span></td><td>'+badge(f.active?"Active":"Hidden")+'</td><td>'+btn("Edit","edit-item",f.id,"small")+" "+btn(f.active?"Hide":"Show","toggle-item",f.id,"soft small")+'</td></tr>').join("")+'</tbody></table></div>';
}
function vendorSettings(){
 const r=ownStore();
 return title("VENDOR / RESTAURANT","Restaurant setup","Update your storefront, operating hours and ordering preferences.")+
 '<form id="storeForm" class="settings-grid"><div class="panel form-panel"><h3>Restaurant identity</h3><label class="form-label">Store name<input name="name" value="'+h(r.name)+'" required maxlength="65"></label><label class="form-label">Description<textarea name="description" required minlength="8" maxlength="250" rows="3">'+h(r.description)+'</textarea></label><label class="form-label">Fictional address<input name="address" value="'+h(r.address)+'" maxlength="160"></label><label class="form-label">Demo contact number<input name="phone" value="'+h(r.phone)+'" maxlength="30"></label></div><div class="panel form-panel"><h3>Operating setup</h3><div class="field-row"><label class="form-label">Opens<input type="time" name="opening" value="'+h(r.opening)+'"></label><label class="form-label">Closes<input type="time" name="closing" value="'+h(r.closing)+'"></label></div><label class="form-label">Average prep time (minutes)<input type="number" min="5" max="180" name="prep" value="'+r.prep+'"></label><label class="switch-label"><input name="open" type="checkbox" '+(r.open?"checked":"")+'> Accept new orders</label><label class="switch-label"><input name="delivery" type="checkbox" '+(r.delivery?"checked":"")+'> Offer delivery</label><label class="switch-label"><input name="pickup" type="checkbox" '+(r.pickup?"checked":"")+'> Offer pickup</label><div class="notice">Closing the store hides its products from customer ordering, but keeps existing orders manageable.</div><button type="submit" class="button primary wide">Save restaurant setup →</button></div></form>';
}
function vendorReports(){
 const r=ownStore(),orders=state.orders.filter(o=>o.restaurantId===r.id),completed=orders.filter(o=>o.status==="Delivered");
 const gross=completed.reduce((v,o)=>v+o.subtotal,0),fees=round(gross*state.settings.commission/100),net=round(gross-fees);
 return title("VENDOR / ANALYTICS","Sales report","Illustrative figures derived from completed sample orders.",btn("Export CSV","export-vendor",null))+
 '<div class="stats-row">'+metric("Completed orders",completed.length,"Illustrative totals","▤")+metric("Food revenue",price(gross),"Excludes delivery fees","₱")+metric("Platform commission",price(fees),state.settings.commission+"% configured","◈")+metric("Vendor proceeds",price(net),"Revenue less commission","↗")+'</div>'+
 panelHeading("Completed order ledger","Download the sample records using Export CSV")+'<div class="panel table-wrap">'+vendorTable(completed.slice().reverse())+'</div>';
}
function round(n){return Math.round(n*100)/100;}
function adminDashboard(){
 const delivered=state.orders.filter(o=>o.status==="Delivered"),rev=delivered.reduce((n,o)=>n+o.subtotal,0);
 return title("ADMIN / DASHBOARD","Platform overview","Configure the example marketplace and approve vendor applications.",btn("Platform setup →","admin-settings",null,"primary"))+
 '<div class="stats-row">'+metric("Restaurants",state.restaurants.length,"In this demo","▦")+metric("Pending applications",state.restaurants.filter(r=>r.status==="Pending").length,"Awaiting review","◷")+metric("Customer orders",state.orders.length,"Across sample stores","▤")+metric("Demo GMV",price(rev),"Delivered food subtotals","₱")+'</div>'+
 '<div class="dashboard-bottom two-col"><section>'+panelHeading("Pending vendor applications","Approve before they appear to customers")+'<div class="panel compact-list">'+(state.restaurants.filter(x=>x.status==="Pending").map(r=>'<div class="list-row"><div class="item-cell"><img src="'+h(r.image)+'" alt=""><div><b>'+h(r.name)+'</b><small>'+h(r.category)+'</small></div></div>'+btn("Review →","admin-vendors",null,"small")+'</div>').join("")||empty("✓","All caught up","No pending restaurant applications."))+'</div></section><section>'+panelHeading("Recent activity","Changes across the browser demo")+'<div class="panel activity-feed">'+state.activity.slice(0,6).map(a=>'<div class="activity-row"><span class="activity-dot"></span><div><b>'+h(a.message)+'</b><small>'+fmt(a.at)+'</small></div></div>').join("")+'</div></section></div>';
}
function adminVendors(){
 return title("ADMIN / RESTAURANTS","Restaurant approvals","Approve, suspend or decline fictional restaurant listings.",btn("+ New sample applicant","new-restaurant",null,"primary"))+
 '<div class="panel table-wrap"><table class="data-table"><thead><tr><th>Restaurant</th><th>Category</th><th>Status</th><th>Hours</th><th>Action</th></tr></thead><tbody>'+state.restaurants.map(r=>'<tr><td><div class="item-cell"><img src="'+h(r.image)+'" alt=""><div><b>'+h(r.name)+'</b><small>'+h(r.description.slice(0,65))+'</small></div></div></td><td>'+h(r.category)+'</td><td>'+badge(r.status)+'</td><td>'+h(r.opening)+'–'+h(r.closing)+'</td><td><div class="row-buttons">'+(r.status!=="Approved"?btn("Approve","restaurant-status",r.id,"soft small",'data-status="Approved"'):"")+(r.status!=="Suspended"?btn("Suspend","restaurant-status",r.id,"danger small",'data-status="Suspended"'):"")+(r.status!=="Declined"?btn("Decline","restaurant-status",r.id,"small",'data-status="Declined"'):"")+'</div></td></tr>').join("")+'</tbody></table></div><div class="notice">The sample vendor account manages The Burger Corner. Additional applications are fictional listings only, not new login identities.</div>';
}
function adminUsers(){
 return title("ADMIN / ACCOUNTS","Accounts & access","Enable or disable the sample customer and vendor account. The admin remains accessible.")+
 '<div class="panel table-wrap"><table class="data-table"><thead><tr><th>Account</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead><tbody>'+state.accounts.map(a=>'<tr><td><b>'+h(a.name)+'</b></td><td>'+h(a.email)+'</td><td>'+badge(a.role)+'</td><td>'+badge(a.enabled?"Active":"Disabled")+'</td><td>'+(a.role==="admin"?"<span class='help-line'>Protected demo admin</span>":btn(a.enabled?"Disable":"Enable","enable-account",a.id,a.enabled?"danger small":"soft small"))+'</td></tr>').join("")+'</tbody></table></div><div class="notice warning">Account access is simulated in browser storage. Do not use these demo passwords or role checks to protect real user data.</div>';
}
function adminSettings(){
 const x=state.settings;
 return title("ADMIN / CONFIGURATION","Platform setup","Configure branding, delivery charges, marketplace operations and contact details.")+
 '<form id="platformForm" class="settings-grid"><div class="panel form-panel"><h3>Brand & communication</h3><label class="form-label">Platform name<input name="name" value="'+h(x.name)+'" maxlength="80" required></label><label class="form-label">Tagline<input name="tagline" value="'+h(x.tagline)+'" maxlength="100"></label><label class="form-label">Homepage announcement<textarea name="announcement" maxlength="180" rows="3">'+h(x.announcement)+'</textarea></label><label class="form-label">Support email (example)<input type="email" name="supportEmail" value="'+h(x.supportEmail)+'"></label><h3 class="section-gap">Pricing rules</h3><div class="field-row"><label class="form-label">Delivery fee (₱)<input type="number" min="0" max="5000" name="deliveryFee" value="'+x.deliveryFee+'" step="0.01"></label><label class="form-label">Service fee (₱)<input type="number" min="0" max="5000" name="serviceFee" value="'+x.serviceFee+'" step="0.01"></label></div><div class="field-row"><label class="form-label">Minimum food subtotal (₱)<input type="number" min="0" max="5000" name="minOrder" value="'+x.minOrder+'" step="0.01"></label><label class="form-label">Vendor commission (%)<input type="number" min="0" max="100" name="commission" value="'+x.commission+'" step="0.1"></label></div></div><div class="panel form-panel"><h3>Marketplace operations</h3><label class="switch-label"><input type="checkbox" name="orderingEnabled" '+(x.orderingEnabled?"checked":"")+'> Enable customer checkout</label><label class="switch-label"><input type="checkbox" name="pickupEnabled" '+(x.pickupEnabled?"checked":"")+'> Allow pickup fulfilment</label><label class="switch-label"><input type="checkbox" name="autoApprove" '+(x.autoApprove?"checked":"")+'> Auto-approve new applicants (demo setting)</label><p class="help-line">Vendor approvals can still be reviewed manually from the Restaurants tab.</p><div class="notice">Editing these settings changes the customer checkout and vendor revenue calculations throughout this browser session.</div><button type="submit" class="button primary wide">Save platform configuration →</button><div class="section-gap"><h3>Demo maintenance</h3><p>Restore original restaurants, orders, menu and settings for your next showcase.</p>'+btn("Reset all sample data","reset",null,"danger")+'</div></div></form>';
}
function renderPage(p){
 if(session.role==="customer"){
  if(p==="/customer"||p==="/customer/")return customerHome();
  if(p==="/customer/checkout")return customerCheckout();
  if(p==="/customer/orders")return customerOrders();
  if(p.startsWith("/customer/orders/"))return orderDetail(decodeURIComponent(p.split("/").pop()));
  if(p==="/customer/profile")return customerProfile();
 }
 if(session.role==="vendor"){
  if(p==="/vendor")return vendorDashboard();
  if(p==="/vendor/orders")return vendorOrders();
  if(p.startsWith("/vendor/orders/"))return vendorOrderDetail(decodeURIComponent(p.split("/").pop()));
  if(p==="/vendor/menu")return vendorMenu();
  if(p==="/vendor/settings")return vendorSettings();
  if(p==="/vendor/reports")return vendorReports();
 }
 if(session.role==="admin"){
  if(p==="/admin")return adminDashboard();
  if(p==="/admin/vendors")return adminVendors();
  if(p==="/admin/users")return adminUsers();
  if(p==="/admin/settings")return adminSettings();
 }
 return empty("◈","Page unavailable","Return to the main dashboard.",btn("Back home","home",null,"primary"));
}
function render(){
 syncSession();const p=path();
 if(!session){root.innerHTML=loginScreen();if(p!=="/login")history.replaceState({},"","/login");document.title="Sign in · GetFoodie Demo";return;}
 if(!p.startsWith("/"+session.role)){history.replaceState({},"",roleHome[session.role]);}
 const current=path();root.innerHTML=shell(renderPage(current),current);
 document.title=breadcrumb(current)+" · GetFoodie Demo";
}
function showModal(content){
 const m=$("modal");m.innerHTML='<div class="dialog-pad">'+content+'</div>';
 if(!m.open)m.showModal();
}
function closeModal(){const m=$("modal");if(m.open)m.close();}
function modalTitle(kicker,label){return '<div class="dialog-heading"><div><span class="eyebrow">'+h(kicker)+'</span><h2>'+h(label)+'</h2></div><button class="icon-button" data-act="close-modal" aria-label="Close" type="button">×</button></div>';}
function openCart(){showModal(modalTitle("CUSTOMER / CART","Your basket")+'<div class="drawer-content">'+cartMarkup()+'</div>');}
function openItemEditor(id){
 const f=id?item(id):null,r=ownStore();if(f&&f.restaurantId!==r.id)throw Error("Not your item.");
 const categories=[...new Set([...r.categories,"Burgers","Sides","Drinks"])];
 showModal('<form id="itemForm">'+modalTitle("VENDOR / MENU",f?"Edit menu item":"Add menu item")+'<input type="hidden" name="id" value="'+(f?f.id:"")+'"><label class="form-label">Dish name<input name="name" required maxlength="75" value="'+h(f?.name||"")+'"></label><label class="form-label">Description<textarea name="description" maxlength="220" required rows="3">'+h(f?.description||"")+'</textarea></label><div class="field-row"><label class="form-label">Category<select name="category">'+categories.map(c=>'<option value="'+h(c)+'" '+(f?.category===c?"selected":"")+'>'+h(c)+'</option>').join("")+'</select></label><label class="form-label">Price (₱)<input type="number" name="price" min="1" max="20000" step="0.01" required value="'+(f?.price||"")+'"></label></div><label class="form-label">Quantity in stock<input name="stock" type="number" min="0" max="9999" required value="'+(f?.stock??20)+'"></label><label class="switch-label"><input type="checkbox" name="active" '+(!f||f.active?"checked":"")+'> Show in customer menu</label><div class="notice">Sample food photos are provided for the demo. Existing images are retained when editing.</div><button type="submit" class="button primary wide">Save menu item →</button></form>');
}
function askReject(id){
 showModal('<form id="rejectForm">'+modalTitle("VENDOR / FULFILMENT","Reject order "+id)+'<input type="hidden" name="id" value="'+h(id)+'"><p class="subtext">Rejecting this order restores its sample stock. The customer will see the rejection.</p><label class="form-label">Reason<textarea name="reason" rows="3" maxlength="150" required placeholder="e.g. Item unavailable"></textarea></label><button type="submit" class="button danger wide">Reject this order →</button></form>');
}
function addApplicant(){
 showModal('<form id="applicantForm">'+modalTitle("ADMIN / APPLICATIONS","Create a vendor application")+'<p class="subtext">Adds a fictional pending listing for administrator review.</p><label class="form-label">Restaurant name<input name="name" required minlength="3" maxlength="65" placeholder="Sample Kitchen"></label><label class="form-label">Category<input name="category" maxlength="60" value="Casual dining"></label><label class="form-label">Description<input name="description" maxlength="180" value="An example restaurant awaiting approval."></label><button type="submit" class="button primary wide">Create application →</button></form>');
}
function info(){
 showModal(modalTitle("PORTFOLIO DEMO","How this demo works")+'<p class="subtext">GetFoodie is a practice and portfolio project, not a live delivery service. You can sign in as a sample customer, vendor, or administrator to walk through a complete fictional order life cycle.</p><div class="notice warning">Accounts, password checks, orders, status changes and settings are stored in your browser only. No real sign-in server, multi-user sync, food delivery, or financial transactions are connected.</div>'+btn("Got it","close-modal",null,"primary wide"));
}
function downloadCsv(rows){
 const data=rows.map(r=>r.map(v=>'"'+String(v??"").replace(/"/g,'""')+'"').join(",")).join("\r\n");
 const blob=new Blob([data],{type:"text/csv;charset=utf-8;"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="getfoodie-demo-sales.csv";a.click();URL.revokeObjectURL(url);
}
function refreshCatalog(){const tiles=$("restaurantTiles"),grid=$("foodGrid");if(tiles)tiles.innerHTML=restaurantTiles();if(grid)grid.innerHTML=dishes();}
function act(node){
 const type=node.dataset.act,id=node.dataset.id;
 if(type==="fill-login"){const acct=C.CREDENTIALS.find(x=>x.role===id);if(!acct)return;$("loginEmail").value=acct.email;$("loginPassword").value=acct.password;toast("Sample "+acct.role+" credentials filled. Click Sign in.");return;}
 if(type==="show-password"){const input=$("loginPassword");input.type=input.type==="password"?"text":"password";node.textContent=input.type==="password"?"Show":"Hide";return;}
 if(type==="signout")return signout();
 if(type==="reset"){if(!confirm("Restore the original sample accounts, menu, orders and settings?"))return;state=C.seed();persist();search="";cat="All";storeFilter="All";orderFilter="All";render();toast("Demo sample data restored.");return;}
 if(type==="close-modal"){closeModal();return;}
 if(type==="about"){info();return;}
 if(type==="home")return navigate(roleHome[session.role]);
 if(!session)return;
 if(type==="browse")return $("menu-section")?.scrollIntoView({behavior:"smooth"});
 if(type==="shop")return navigate("/customer");
 if(type==="go-orders")return navigate("/customer/orders");
 if(type==="cart")return openCart();
 if(type==="close-cart"){closeModal();return navigate("/customer");}
 if(type==="checkout"){closeModal();fulfilment="Delivery";return navigate("/customer/checkout");}
 if(type==="clear-cart"){C.clearCart(state,session);persist();closeModal();render();toast("Cart cleared.");return;}
 if(type==="filter-store"){storeFilter=storeFilter===id?"All":id;refreshCatalog();return $("menu-section")?.scrollIntoView({behavior:"smooth"});}
 if(type==="filter-category"){cat=id;render();return $("menu-section")?.scrollIntoView();}
 if(type==="clear-filters"){cat="All";search="";storeFilter="All";render();return;}
 if(type==="order-filter"){orderFilter=id;render();return;}
 if(type==="add"){C.addToCart(state,session,id);persist();render();toast("Added to basket.");return;}
 if(type==="qty"){const current=C.getCart(state,session).find(i=>i.id===Number(id));if(!current)return;C.setQty(state,session,id,current.qty+Number(node.dataset.step));persist();render();openCart();return;}
 if(type==="cancel"){C.requestCancel(state,session,id);persist();render();toast("Cancellation request sent to vendor.");return;}
 if(type==="rate"){C.rateOrder(state,session,id,Number(node.dataset.rating));persist();render();toast("Thank you for your demo rating!");return;}
 if(type==="reorder"){
  const o=C.ownOrder(state,session,id);
  C.clearCart(state,session);
  let added=0;for(const line of o.items){try{C.addToCart(state,session,line.id,Math.min(line.qty,item(line.id)?.stock||0));added++;}catch(_){}}
  persist();navigate("/customer");toast(added?"Available items moved into your cart.":"No items are currently available.");return;
 }
 if(type==="vendor-orders")return navigate("/vendor/orders");
 if(type==="vendor-menu")return navigate("/vendor/menu");
 if(type==="vendor-settings")return navigate("/vendor/settings");
 if(type==="admin-settings")return navigate("/admin/settings");
 if(type==="admin-vendors")return navigate("/admin/vendors");
 if(type==="edit-item")return openItemEditor(id);
 if(type==="toggle-item"){const f=item(id);if(!f||f.restaurantId!==ownStore().id)throw Error("Item not found.");f.active=!f.active;persist();render();toast(f.active?"Item now visible.":"Item hidden from customer menu.");return;}
 if(type==="advance"){C.transition(state,session,id,node.dataset.status);persist();render();toast("Order status updated.");return;}
 if(type==="reject")return askReject(id);
 if(type==="decline-cancel"){C.declineCancel(state,session,id);persist();render();toast("Cancellation request declined.");return;}
 if(type==="new-restaurant")return addApplicant();
 if(type==="restaurant-status"){C.adminRestaurant(state,session,id,node.dataset.status);persist();render();toast("Restaurant status updated.");return;}
 if(type==="enable-account"){const a=state.accounts.find(x=>x.id===id);C.setAccountEnabled(state,session,id,!a.enabled);persist();render();toast("Demo account access changed.");return;}
 if(type==="export-vendor"){const r=ownStore();downloadCsv([["Order","Date","Status","Food subtotal","Delivery fee","Total","Payment"]].concat(state.orders.filter(o=>o.restaurantId===r.id).map(o=>[o.id,o.createdAt,o.status,o.subtotal,o.deliveryFee,o.total,o.paymentStatus])));return;}
 if(type==="refresh"){state=C.load(localStorage);render();toast("Order list refreshed.");return;}
}
function formHandler(form){
 const fd=new FormData(form),val=k=>fd.get(k),checked=k=>fd.has(k);
 if(form.id==="loginForm"){
  const result=C.login(state,val("email"),val("password"));
  session=result;sessionStorage.setItem(C.SESSION,JSON.stringify(session));navigate(roleHome[session.role]);toast("Welcome back, "+session.name+"!");return;
 }
 if(!session)return;
 if(form.id==="checkoutForm"){
  const o=C.checkout(state,session,{fulfilment:val("fulfilment"),address:val("address"),notes:val("notes")});
  persist();navigate("/customer/orders/"+encodeURIComponent(o.id));toast("Demo order "+o.id+" placed! No real order was created.");return;
 }
 if(form.id==="profileForm"){
  C.updateProfile(state,session,{name:val("name"),phone:val("phone"),address:val("address")});persist();render();toast("Sample profile saved.");return;
 }
 if(form.id==="itemForm"){
  C.saveItem(state,session,{id:val("id")||null,name:val("name"),description:val("description"),category:val("category"),price:val("price"),stock:val("stock"),active:checked("active")});persist();closeModal();render();toast("Menu item saved.");return;
 }
 if(form.id==="storeForm"){
  C.updateStore(state,session,{name:val("name"),description:val("description"),address:val("address"),phone:val("phone"),opening:val("opening"),closing:val("closing"),prep:val("prep"),open:checked("open"),delivery:checked("delivery"),pickup:checked("pickup")});persist();render();toast("Restaurant setup saved.");return;
 }
 if(form.id==="rejectForm"){
  C.transition(state,session,val("id"),"Rejected",val("reason"));persist();closeModal();render();toast("Order rejected and stock restored.");return;
 }
 if(form.id==="applicantForm"){
  C.addRestaurant(state,session,{name:val("name"),category:val("category"),description:val("description")});persist();closeModal();render();toast("New sample applicant created.");return;
 }
 if(form.id==="platformForm"){
  C.adminSettings(state,session,{name:val("name"),tagline:val("tagline"),announcement:val("announcement"),supportEmail:val("supportEmail"),deliveryFee:val("deliveryFee"),serviceFee:val("serviceFee"),minOrder:val("minOrder"),commission:val("commission"),orderingEnabled:checked("orderingEnabled"),pickupEnabled:checked("pickupEnabled"),autoApprove:checked("autoApprove")});persist();render();toast("Platform configuration saved.");return;
 }
}
document.addEventListener("click",e=>{
 const link=e.target.closest("[data-link]");
 if(link){e.preventDefault();navigate(link.dataset.link);return;}
 const btn=e.target.closest("[data-act]");
 if(!btn)return;
 try{act(btn);}catch(err){error(err);}
});
document.addEventListener("submit",e=>{
 e.preventDefault();
 try{formHandler(e.target);}catch(err){error(err);}
});
document.addEventListener("change",e=>{
 if(e.target.name==="fulfilment"&&e.target.form?.id==="checkoutForm"){fulfilment=e.target.value;render();}
});
document.addEventListener("input",e=>{
 if(e.target.id==="catalogSearch"){search=e.target.value.toLowerCase().trim();refreshCatalog();}
});
window.addEventListener("popstate",render);
window.addEventListener("storage",e=>{if(e.key===C.KEY){state=C.load(localStorage);render();}});
$("modal").addEventListener("click",e=>{if(e.target===$("modal"))closeModal();});
render();
