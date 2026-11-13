const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const path=require("node:path");
const C=require("../core.js");
const source=fs.readFileSync(path.join(__dirname,"..","app.js"),"utf8");
function boot(role){
 const data=new Map();
 const storage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)};
 const sessionData=new Map();
 const sessionStore={getItem:k=>sessionData.get(k)||null,setItem:(k,v)=>sessionData.set(k,String(v)),removeItem:k=>sessionData.delete(k)};
 if(role){
  const s=C.seed();storage.setItem(C.KEY,JSON.stringify(s));
  const user=C.login(s,C.CREDENTIALS.find(x=>x.role===role).email,"Demo123!");
  sessionStore.setItem(C.SESSION,JSON.stringify(user));
 }
 const root={innerHTML:"",addEventListener(){}},modal={innerHTML:"",open:false,addEventListener(){},showModal(){this.open=true},close(){this.open=false}},toast={textContent:"",className:"",classList:{add(){},remove(){}}};
 const elements={root,modal,toast};
 const doc={title:"",getElementById(id){return elements[id]||null},addEventListener(){}};
 const location={pathname:role?"/"+role:"/login"};
 const history={pushState(_a,_b,to){location.pathname=to},replaceState(_a,_b,to){location.pathname=to}};
 const context=vm.createContext({FoodieCore:C,document:doc,location,history,localStorage:storage,sessionStorage:sessionStore,window:{addEventListener(){},scrollTo(){}},setTimeout(){return 1},clearTimeout(){},console,Intl,Date,Math,JSON,Blob,URL});
 vm.runInContext(source,context,{filename:"app.js",timeout:1000});
 return {context,root,location,doc,run:s=>vm.runInContext(s,context,{timeout:1000})};
}
test("sign-in screen shows explicit credentials and no auto-login",()=>{
 const x=boot(null);
 assert.match(x.root.innerHTML,/Sign in to explore/);
 assert.match(x.root.innerHTML,/loginForm/);
 assert.match(x.root.innerHTML,/type="password"/);
 assert.match(x.root.innerHTML,/customer@demo\.getfoodie\.app/);
 assert.doesNotMatch(x.root.innerHTML,/Place demo order/);
});
test("customer receives customer navigation, menu and checkout",()=>{
 const x=boot("customer");
 assert.match(x.root.innerHTML,/Find your next craving/);
 assert.match(x.root.innerHTML,/My orders/);
 assert.doesNotMatch(x.root.innerHTML,/Restaurant approvals/);
 x.run('FoodieCore.addToCart(state,session,1);persist();navigate("/customer/checkout")');
 assert.match(x.root.innerHTML,/Review &amp; place your order|Review & place your order/);
 assert.match(x.root.innerHTML,/Cash on delivery/);
 assert.match(x.root.innerHTML,/I understand this is only a simulated purchase/);
});
test("vendor receives its own navigation and order fulfilment screen",()=>{
 const x=boot("vendor");
 assert.match(x.root.innerHTML,/Restaurant overview|Welcome back/);
 assert.match(x.root.innerHTML,/Menu &amp; inventory|Menu & inventory/);
 x.run('navigate("/vendor/orders/GF-1002")');
 assert.match(x.root.innerHTML,/Fulfilment status/);
 assert.match(x.root.innerHTML,/Mark Ready/);
});
test("admin can view vendor approvals, account access and platform setup",()=>{
 const x=boot("admin");
 assert.match(x.root.innerHTML,/Platform overview/);
 x.run('navigate("/admin/vendors")');
 assert.match(x.root.innerHTML,/Bowl &amp; Beyond|Bowl & Beyond/);
 assert.match(x.root.innerHTML,/Approve/);
 x.run('navigate("/admin/users")');
 assert.match(x.root.innerHTML,/Accounts &amp; access|Accounts & access/);
 x.run('navigate("/admin/settings")');
 assert.match(x.root.innerHTML,/Platform setup/);
 assert.match(x.root.innerHTML,/Delivery fee/);
});
test("role-based routing does not render another role's workspace",()=>{
 const x=boot("customer");
 x.run('navigate("/admin/settings")');
 assert.equal(x.location.pathname,"/customer");
 assert.doesNotMatch(x.root.innerHTML,/Platform setup/);
});
