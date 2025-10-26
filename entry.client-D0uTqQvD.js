import{r,j as p}from"./index-CgYkI0WL.js";import{h as v}from"./client-B7_6Uz0H.js";import{E as R,i as h,d as C,c as M,m as y,s as g,a as E,g as S,b,e as F,f as P,u as k,R as D,h as z,j,k as H}from"./components-DLgDYPcF.js";/**
 * @remix-run/react v2.17.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function L(u){if(!u)return null;let m=Object.entries(u),s={};for(let[a,e]of m)if(e&&e.__type==="RouteErrorResponse")s[a]=new R(e.status,e.statusText,e.data,e.internal===!0);else if(e&&e.__type==="Error"){if(e.__subType){let o=window[e.__subType];if(typeof o=="function")try{let i=new o(e.message);i.stack=e.stack,s[a]=i}catch{}}if(s[a]==null){let o=new Error(e.message);o.stack=e.stack,s[a]=o}}else s[a]=e;return s}/**
 * @remix-run/react v2.17.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */let n,t,f=!1,c;new Promise(u=>{c=u}).catch(()=>{});function O(u){if(!t){if(window.__remixContext.future.v3_singleFetch){if(!n){let d=window.__remixContext.stream;h(d,"No stream found for single fetch decoding"),window.__remixContext.stream=void 0,n=C(d,window).then(_=>{window.__remixContext.state=_.value,n.value=!0}).catch(_=>{n.error=_})}if(n.error)throw n.error;if(!n.value)throw n}let o=M(window.__remixManifest.routes,window.__remixRouteModules,window.__remixContext.state,window.__remixContext.future,window.__remixContext.isSpaMode),i;if(!window.__remixContext.isSpaMode){i={...window.__remixContext.state,loaderData:{...window.__remixContext.state.loaderData}};let d=y(o,window.location,window.__remixContext.basename);if(d)for(let _ of d){let l=_.route.id,x=window.__remixRouteModules[l],w=window.__remixManifest.routes[l];x&&g(w,x,window.__remixContext.isSpaMode)&&(x.HydrateFallback||!w.hasLoader)?i.loaderData[l]=void 0:w&&!w.hasLoader&&(i.loaderData[l]=null)}i&&i.errors&&(i.errors=L(i.errors))}t=E({routes:o,history:F(),basename:window.__remixContext.basename,future:{v7_normalizeFormMethod:!0,v7_fetcherPersist:window.__remixContext.future.v3_fetcherPersist,v7_partialHydration:!0,v7_prependBasename:!0,v7_relativeSplatPath:window.__remixContext.future.v3_relativeSplatPath,v7_skipActionErrorRevalidation:window.__remixContext.future.v3_singleFetch===!0},hydrationData:i,mapRouteProperties:H,dataStrategy:window.__remixContext.future.v3_singleFetch&&!window.__remixContext.isSpaMode?b(window.__remixManifest,window.__remixRouteModules,()=>t):void 0,patchRoutesOnNavigation:S(window.__remixManifest,window.__remixRouteModules,window.__remixContext.future,window.__remixContext.isSpaMode,window.__remixContext.basename)}),t.state.initialized&&(f=!0,t.initialize()),t.createRoutesForHMR=P,window.__remixRouter=t,c&&c(t)}let[m,s]=r.useState(void 0),[a,e]=r.useState(t.state.location);return r.useLayoutEffect(()=>{f||(f=!0,t.initialize())},[]),r.useLayoutEffect(()=>t.subscribe(o=>{o.location!==a&&e(o.location)}),[a]),k(t,window.__remixManifest,window.__remixRouteModules,window.__remixContext.future,window.__remixContext.isSpaMode),r.createElement(r.Fragment,null,r.createElement(D.Provider,{value:{manifest:window.__remixManifest,routeModules:window.__remixRouteModules,future:window.__remixContext.future,criticalCss:m,isSpaMode:window.__remixContext.isSpaMode}},r.createElement(z,{location:a},r.createElement(j,{router:t,fallbackElement:null,future:{v7_startTransition:!0}}))),window.__remixContext.future.v3_singleFetch?r.createElement(r.Fragment,null):null)}r.startTransition(()=>{v(document,p.jsx(r.StrictMode,{children:p.jsx(O,{})}))});
