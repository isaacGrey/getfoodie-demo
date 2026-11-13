/* GetFoodie demo domain model — browser-local showcase, NOT a backend or security boundary. */
(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;root.FoodieCore=api;})(typeof globalThis!=="undefined"?globalThis:this,function(){
"use strict";
const KEY="getfoodie_demo_v2";
const SESSION="getfoodie_demo_session_v2";
const CREDENTIALS=[
  {role:"customer",email:"customer@demo.getfoodie.app",password:"Demo123!",name:"Alex Rivera",id:"c1"},
  {role:"vendor",email:"business@demo.getfoodie.app",password:"Demo123!",name:"Jamie Santos",id:"v1"},
  {role:"admin",email:"admin@demo.getfoodie.app",password:"Demo123!",name:"Admin User",id:"a1"}
];
const IMAGES={
  burger:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=760&q=80&fit=crop",
  chicken:"https://images.unsplash.com/photo-1562967914-608f82629710?w=760&q=80&fit=crop",
  fries:"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=760&q=80&fit=crop",
  pizza:"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=760&q=80&fit=crop",
  pasta:"https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=760&q=80&fit=crop",
  coffee:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=760&q=80&fit=crop",
  bowl:"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=760&q=80&fit=crop",
  shop:"https://images.unsplash.com/photo-1552566626-52f8b828add9?w=760&q=80&fit=crop"
};
const FLOW=["Placed","Accepted","Preparing","Ready","Out for delivery","Delivered"];
const DONE=["Delivered","Cancelled","Rejected"];
const clone=x=>JSON.parse(JSON.stringify(x));
const money=n=>Math.round((Number(n)||0)*100)/100;
const image=k=>IMAGES[k]||IMAGES.shop;
function seed(){
 return {
  version:2,
  settings:{name:"GetFoodie",tagline:"Good food, good mood.",announcement:"Cravings delivered. Explore the menu!",deliveryFee:29,serviceFee:0,commission:10,minOrder:100,orderingEnabled:true,autoApprove:false,supportEmail:"support@getfoodie.online",currency:"PHP",pickupEnabled:true},
  accounts:CREDENTIALS.map(a=>({id:a.id,role:a.role,email:a.email,name:a.name,enabled:true,phone:a.role==="customer"?"0917 555 0101":"",address:a.role==="customer"?"18 Sample Street, Quezon City":""})),
  restaurants:[
   {id:"r1",ownerId:"v1",name:"The Burger Corner",category:"Burgers & comfort food",description:"Freshly grilled burgers and cozy classics.",image:image("burger"),rating:4.9,eta:25,open:true,status:"Approved",prep:20,opening:"09:00",closing:"22:00",delivery:true,pickup:true,phone:"0917 555 0111",address:"42 Fictional Avenue, Quezon City",categories:["Burgers","Sides","Drinks"]},
   {id:"r2",ownerId:null,name:"Slicetown Pizza",category:"Pizza & pasta",description:"Oven-baked pizza and hearty pasta.",image:image("pizza"),rating:4.8,eta:30,open:true,status:"Approved",prep:25,opening:"10:00",closing:"23:00",delivery:true,pickup:true,phone:"0917 555 0122",address:"22 Sample Road, Makati",categories:["Pizza","Pasta","Drinks"]},
   {id:"r3",ownerId:null,name:"Bowl & Beyond",category:"Rice bowls",description:"Colorful, fresh rice bowls.",image:image("bowl"),rating:4.7,eta:20,open:true,status:"Pending",prep:20,opening:"10:00",closing:"20:00",delivery:true,pickup:true,phone:"0917 555 0133",address:"10 Demo Plaza, Taguig",categories:["Rice bowls","Drinks"]}
  ],
  menu:[
   {id:1,restaurantId:"r1",name:"Classic Smash Burger",category:"Burgers",price:189,description:"Double-seared patty, melted cheese and house sauce.",image:image("burger"),stock:26,active:true},
   {id:2,restaurantId:"r1",name:"Crispy Chicken Burger",category:"Burgers",price:179,description:"Crispy chicken, slaw and lemon mayo.",image:image("chicken"),stock:18,active:true},
   {id:3,restaurantId:"r1",name:"Loaded Fries",category:"Sides",price:129,description:"Seasoned fries finished with cheese and sauce.",image:image("fries"),stock:31,active:true},
   {id:4,restaurantId:"r1",name:"House Iced Coffee",category:"Drinks",price:99,description:"Bold chilled coffee with creamy milk.",image:image("coffee"),stock:20,active:true},
   {id:5,restaurantId:"r2",name:"Margherita Pizza",category:"Pizza",price:329,description:"Mozzarella, tomato sauce and basil.",image:image("pizza"),stock:12,active:true},
   {id:6,restaurantId:"r2",name:"Creamy Garden Pasta",category:"Pasta",price:269,description:"Creamy pasta with herbs and parmesan.",image:image("pasta"),stock:15,active:true},
   {id:7,restaurantId:"r3",name:"Fresh Chicken Bowl",category:"Rice bowls",price:219,description:"Rice, vegetables, chicken and sesame dressing.",image:image("bowl"),stock:22,active:true},
   {id:8,restaurantId:"r2",name:"Iced Latte",category:"Drinks",price:115,description:"Espresso and milk served over ice.",image:image("coffee"),stock:30,active:true}
  ],
  carts:{c1:[]},orders:[
   {id:"GF-1002",customerId:"c1",restaurantId:"r1",items:[{id:1,name:"Classic Smash Burger",price:189,qty:2},{id:3,name:"Loaded Fries",price:129,qty:1}],subtotal:507,deliveryFee:29,serviceFee:0,total:536,fulfilment:"Delivery",payment:"Cash on delivery",paymentStatus:"Unpaid",address:"18 Sample Street, Quezon City",notes:"Please call when outside.",status:"Preparing",createdAt:"2026-11-13T08:45:00.000Z",history:[{status:"Placed",at:"2026-11-13T08:45:00.000Z"},{status:"Accepted",at:"2026-11-13T08:49:00.000Z"},{status:"Preparing",at:"2026-11-13T08:52:00.000Z"}],cancelRequested:false,rating:null},
   {id:"GF-1001",customerId:"c1",restaurantId:"r1",items:[{id:2,name:"Crispy Chicken Burger",price:179,qty:1}],subtotal:179,deliveryFee:29,serviceFee:0,total:208,fulfilment:"Delivery",payment:"Cash on delivery",paymentStatus:"Collected",address:"18 Sample Street, Quezon City",notes:"",status:"Delivered",createdAt:"2026-11-12T11:30:00.000Z",history:[{status:"Placed",at:"2026-11-12T11:30:00.000Z"},{status:"Accepted",at:"2026-11-12T11:32:00.000Z"},{status:"Preparing",at:"2026-11-12T11:38:00.000Z"},{status:"Ready",at:"2026-11-12T11:55:00.000Z"},{status:"Out for delivery",at:"2026-11-12T12:05:00.000Z"},{status:"Delivered",at:"2026-11-12T12:23:00.000Z"}],cancelRequested:false,rating:5}
  ],
  nextOrder:1003,nextMenu:9,nextRestaurant:4,activity:[{id:"l1",type:"order",message:"Sample order GF-1002 is preparing",at:"2026-11-13T08:52:00.000Z"}]
 };
}
function validState(s){return !!s&&s.version===2&&s.settings&&Array.isArray(s.accounts)&&Array.isArray(s.restaurants)&&Array.isArray(s.orders)&&Array.isArray(s.menu)&&s.carts&&typeof s.nextOrder==="number";}
function load(storage){try{const s=JSON.parse(storage.getItem(KEY));return validState(s)?s:seed();}catch(_){return seed();}}
function save(storage,s){storage.setItem(KEY,JSON.stringify(s));return s;}
function account(s,role){return s.accounts.find(a=>a.role===role);}
function login(s,email,password){const found=CREDENTIALS.find(x=>x.email.toLowerCase()===String(email).trim().toLowerCase()&&x.password===password);if(!found)throw Error("Incorrect email or password.");const a=s.accounts.find(x=>x.id===found.id);if(!a||!a.enabled)throw Error("This demo account is disabled. Ask the demo administrator to enable it.");return {id:a.id,role:a.role,name:a.name,email:a.email};}
function vendorStore(s,user){return s.restaurants.find(r=>r.ownerId===user.id);}
function item(s,id){return s.menu.find(f=>f.id===Number(id));}
function byId(s,id){return s.restaurants.find(r=>r.id===id);}
function getCart(s,user){return s.carts[user.id]||(s.carts[user.id]=[]);}
function addToCart(s,user,id,qty=1){
 if(user.role!=="customer")throw Error("Only customers can order.");
 const f=item(s,id),r=f&&byId(s,f.restaurantId),q=Number(qty);
 if(!f||!r||!f.active||f.stock<=0||r.status!=="Approved"||!r.open||!s.settings.orderingEnabled)throw Error("This item is unavailable.");
 if(!Number.isInteger(q)||q<1||q>20)throw Error("Invalid quantity.");
 const cart=getCart(s,user),other=cart.find(x=>item(s,x.id)?.restaurantId!==f.restaurantId);
 if(other)throw Error("Your cart can contain items from one restaurant at a time. Clear your cart to switch.");
 const current=cart.find(x=>x.id===f.id),next=(current?.qty||0)+q;
 if(next>f.stock||next>20)throw Error("Not enough stock to add this quantity.");
 if(current)current.qty=next;else cart.push({id:f.id,qty:q});
 return s;
}
function setQty(s,user,id,qty){
 const cart=getCart(s,user),x=cart.find(p=>p.id===Number(id)),f=item(s,id),q=Number(qty);
 if(!x||!f)throw Error("Item not in cart.");
 if(!Number.isInteger(q)||q<0||q>20)throw Error("Invalid quantity.");
 if(q>f.stock)throw Error("Not enough stock.");
 if(q===0)s.carts[user.id]=cart.filter(i=>i!==x);else x.qty=q;
 return s;
}
function clearCart(s,user){s.carts[user.id]=[];return s;}
function cartInfo(s,user,fulfilment="Delivery"){
 const cart=getCart(s,user),lines=cart.map(c=>({food:item(s,c.id),qty:c.qty})).filter(x=>x.food);
 const subtotal=money(lines.reduce((n,x)=>n+x.food.price*x.qty,0));
 const deliveryFee=fulfilment==="Delivery"?money(s.settings.deliveryFee):0,serviceFee=money(s.settings.serviceFee);
 return {lines,restaurant:lines.length?byId(s,lines[0].food.restaurantId):null,subtotal,deliveryFee,serviceFee,total:money(subtotal+deliveryFee+serviceFee)};
}
function addLog(s,type,message){s.activity.unshift({id:"l"+Date.now()+Math.random().toString(36).slice(2,5),type,message,at:new Date().toISOString()});s.activity=s.activity.slice(0,80);}
function checkout(s,user,input){
 if(user.role!=="customer")throw Error("Please log in as customer.");
 if(!s.settings.orderingEnabled)throw Error("Ordering is paused by the administrator.");
 const fulfilment=input.fulfilment==="Pickup"?"Pickup":"Delivery",info=cartInfo(s,user,fulfilment),r=info.restaurant;
 if(!r||!r.open||r.status!=="Approved")throw Error("Restaurant unavailable.");
 if(!info.lines.length)throw Error("Cart is empty.");
 if(info.subtotal<s.settings.minOrder)throw Error("Minimum food subtotal is "+s.settings.minOrder+" PHP.");
 if(fulfilment==="Pickup"&&(!s.settings.pickupEnabled||!r.pickup))throw Error("Pickup is not available.");
 if(fulfilment==="Delivery"&&!r.delivery)throw Error("Delivery is not available.");
 const address=String(input.address||"").trim();
 if(fulfilment==="Delivery"&&(address.length<6||address.length>160))throw Error("Please enter a sample delivery address (6–160 characters).");
 const notes=String(input.notes||"").trim().slice(0,200);
 const payment=fulfilment==="Delivery"?"Cash on delivery":"Pay on pickup";
 for(const x of info.lines)if(!x.food.active||x.qty>x.food.stock)throw Error("An item is no longer available.");
 for(const x of info.lines)x.food.stock-=x.qty;
 const at=new Date().toISOString();
 const order={id:"GF-"+s.nextOrder++,customerId:user.id,restaurantId:r.id,items:info.lines.map(x=>({id:x.food.id,name:x.food.name,price:x.food.price,qty:x.qty})),subtotal:info.subtotal,deliveryFee:info.deliveryFee,serviceFee:info.serviceFee,total:info.total,fulfilment,payment,paymentStatus:"Unpaid",address:fulfilment==="Pickup"?r.address:address,notes,status:"Placed",createdAt:at,history:[{status:"Placed",at}],cancelRequested:false,rating:null};
 s.orders.push(order);s.carts[user.id]=[];addLog(s,"order","Order "+order.id+" placed");return order;
}
function ownOrder(s,user,id){const o=s.orders.find(x=>x.id===id);if(!o||user.role!=="customer"||o.customerId!==user.id)throw Error("Order unavailable.");return o;}
function vendorOrder(s,user,id){if(user.role!=="vendor")throw Error("Vendor login required.");const store=vendorStore(s,user),o=s.orders.find(x=>x.id===id);if(!store||!o||o.restaurantId!==store.id)throw Error("Order unavailable.");return o;}
function transition(s,user,id,to,reason=""){
 const o=vendorOrder(s,user,id),from=o.status;
 const map={"Placed":["Accepted","Rejected","Cancelled"],"Accepted":["Preparing","Cancelled"],"Preparing":["Ready","Cancelled"],"Ready":[o.fulfilment==="Pickup"?"Delivered":"Out for delivery","Cancelled"],"Out for delivery":["Delivered"]};
 if(!(map[from]||[]).includes(to))throw Error("Invalid status change from "+from+" to "+to+".");
 if(o.cancelRequested&&to!=="Cancelled"&&to!=="Rejected")throw Error("Please resolve the cancellation request first.");
 if(to==="Rejected"&&!String(reason).trim())throw Error("A rejection reason is required.");
 o.status=to;o.history.push({status:to,at:new Date().toISOString(),reason:String(reason).trim().slice(0,150)});
 if(to==="Cancelled"||to==="Rejected"){for(const line of o.items){const f=item(s,line.id);if(f)f.stock+=line.qty;}o.cancelRequested=false;}
 if(to==="Delivered")o.paymentStatus="Collected";addLog(s,"fulfilment",o.id+" marked "+to);return o;
}
function requestCancel(s,user,id){
 const o=ownOrder(s,user,id);if(DONE.includes(o.status)||o.status==="Out for delivery")throw Error("This order can no longer be cancelled.");
 if(o.cancelRequested)throw Error("Cancellation already requested.");
 o.cancelRequested=true;addLog(s,"order","Customer requested cancellation for "+o.id);return o;
}
function declineCancel(s,user,id){const o=vendorOrder(s,user,id);if(!o.cancelRequested)throw Error("No cancellation request.");o.cancelRequested=false;addLog(s,"order","Cancellation declined for "+o.id);return o;}
function rateOrder(s,user,id,rating){const o=ownOrder(s,user,id),r=Number(rating);if(o.status!=="Delivered"||!Number.isInteger(r)||r<1||r>5)throw Error("You can rate delivered orders from 1 to 5.");o.rating=r;addLog(s,"review","Review added for "+o.id);return o;}
function saveItem(s,user,data){
 if(user.role!=="vendor")throw Error("Vendor login required.");
 const r=vendorStore(s,user);if(!r)throw Error("No restaurant assigned.");
 const name=String(data.name||"").trim(),description=String(data.description||"").trim(),category=String(data.category||"").trim();
 const price=Number(data.price),stock=Number(data.stock);
 if(!name||name.length>75||!description||description.length>220||!category||!Number.isFinite(price)||price<=0||price>20000||!Number.isInteger(stock)||stock<0||stock>9999)throw Error("Check name, description, category, price and stock.");
 let f=data.id?item(s,data.id):null;
 if(data.id&&(!f||f.restaurantId!==r.id))throw Error("Item unavailable.");
 const updated={name,description,category,price:money(price),stock,active:!!data.active};
 if(f)Object.assign(f,updated);
 else {f={id:s.nextMenu++,restaurantId:r.id,image:image(data.photo||"burger"),...updated};s.menu.push(f);}
 if(!r.categories.includes(category))r.categories.push(category);
 addLog(s,"menu","Menu item "+name+" saved");return f;
}
function updateStore(s,user,data){
 const r=vendorStore(s,user);if(!r)throw Error("Only restaurant owner can edit a restaurant.");
 const name=String(data.name||"").trim(),description=String(data.description||"").trim();
 if(name.length<3||name.length>65||description.length<8||description.length>250)throw Error("Enter a valid restaurant name and description.");
 const prep=Number(data.prep);
 if(!Number.isInteger(prep)||prep<5||prep>180)throw Error("Prep time must be 5–180 minutes.");
 Object.assign(r,{name,description,address:String(data.address||"").trim().slice(0,160),phone:String(data.phone||"").trim().slice(0,30),opening:String(data.opening||"09:00"),closing:String(data.closing||"22:00"),prep,open:!!data.open,delivery:!!data.delivery,pickup:!!data.pickup});
 addLog(s,"settings","Vendor updated restaurant settings");return r;
}
function adminOnly(user){if(user.role!=="admin")throw Error("Admin access required.");}
function adminRestaurant(s,user,id,status){adminOnly(user);const r=byId(s,id);if(!r||!["Approved","Pending","Suspended","Declined"].includes(status))throw Error("Invalid restaurant or status.");r.status=status;addLog(s,"admin",r.name+" marked "+status);return r;}
function addRestaurant(s,user,data){adminOnly(user);const name=String(data.name||"").trim();if(name.length<3)throw Error("Enter a restaurant name.");const r={id:"r"+s.nextRestaurant++,ownerId:null,name,category:String(data.category||"Other").trim().slice(0,60),description:String(data.description||"Pending review").trim().slice(0,180),image:image("shop"),rating:0,eta:25,open:false,status:s.settings.autoApprove?"Approved":"Pending",prep:20,opening:"09:00",closing:"21:00",delivery:true,pickup:true,phone:"",address:"Demo location",categories:["Other"]};s.restaurants.push(r);addLog(s,"admin","New restaurant application: "+name);return r;}
function adminSettings(s,user,data){adminOnly(user);const x=s.settings;for(const field of ["name","tagline","announcement","supportEmail"])if(data[field]!=null)x[field]=String(data[field]).trim().slice(0,180);for(const field of ["deliveryFee","serviceFee","commission","minOrder"]){if(data[field]!=null){const n=Number(data[field]);if(!Number.isFinite(n)||n<0||n>(field==="commission"?100:5000))throw Error("Invalid "+field);x[field]=money(n);}}for(const field of ["orderingEnabled","autoApprove","pickupEnabled"])if(data[field]!=null)x[field]=!!data[field];addLog(s,"admin","Platform configuration updated");return x;}
function setAccountEnabled(s,user,id,enabled){adminOnly(user);const a=s.accounts.find(x=>x.id===id);if(!a||a.role==="admin")throw Error("This account cannot be changed.");a.enabled=!!enabled;addLog(s,"admin",a.name+" "+(enabled?"enabled":"disabled"));return a;}
function updateProfile(s,user,data){const a=s.accounts.find(x=>x.id===user.id);if(!a)throw Error("Account unavailable.");const name=String(data.name||"").trim();if(name.length<2||name.length>60)throw Error("Enter a valid display name.");a.name=name;a.phone=String(data.phone||"").trim().slice(0,30);a.address=String(data.address||"").trim().slice(0,160);return a;}
return {KEY,SESSION,CREDENTIALS,IMAGES,FLOW,DONE,seed,load,save,account,login,vendorStore,item,byId,getCart,addToCart,setQty,clearCart,cartInfo,checkout,ownOrder,vendorOrder,transition,requestCancel,declineCancel,rateOrder,saveItem,updateStore,adminRestaurant,addRestaurant,adminSettings,setAccountEnabled,updateProfile,addLog,clone,money};
});
