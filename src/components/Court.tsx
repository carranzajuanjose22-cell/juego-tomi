import { memo } from 'react';
export default memo(function Court() {
 return <g>
 <defs>
 <linearGradient id="sky" x2="0" y2="1"><stop stopColor="#536e65"/><stop offset=".65" stopColor="#bec2a0"/><stop offset="1" stopColor="#d1c49f"/></linearGradient>
 <linearGradient id="wall" x2=".8" y2=".4"><stop stopColor="#c8b58c"/><stop offset=".55" stopColor="#a59876"/><stop offset="1" stopColor="#727b62"/></linearGradient>
 <linearGradient id="back-wall" x2="0" y2="1"><stop stopColor="#b4af89"/><stop offset="1" stopColor="#777f64"/></linearGradient>
 <linearGradient id="sand" x2=".3" y2="1"><stop stopColor="#a49672"/><stop offset="1" stopColor="#d9c49b"/></linearGradient>
 <linearGradient id="sunwash"><stop stopColor="#f5e3ae" stopOpacity=".2"/><stop offset="1" stopColor="#e3d39e" stopOpacity="0"/></linearGradient>
 <linearGradient id="skin" x2="1" y2=".5"><stop stopColor="#a16c47"/><stop offset=".45" stopColor="#ca9565"/><stop offset="1" stopColor="#8a5a3b"/></linearGradient>
 <radialGradient id="rubber" cx=".32" cy=".27"><stop stopColor="#657164"/><stop offset=".35" stopColor="#35483e"/><stop offset="1" stopColor="#111f19"/></radialGradient>
 <pattern id="blocks" width="112" height="62" patternUnits="userSpaceOnUse"><path d="M0 0H112V62H0Z M56 0V30 M0 30H112" fill="none" stroke="#444a37" strokeOpacity=".35" strokeWidth="2"/><path d="M4 4H108 M4 35H52" stroke="#f4dfb4" strokeOpacity=".3"/><path d="M8 24l6-3 9 1m38 23 8-2m19-31 9 2m-73 38 12-2" fill="none" stroke="#5d6349" opacity=".22"/><path d="M72 3l-3 8 7 7-3 12" fill="none" stroke="#444a37" opacity=".25"/></pattern>
 <pattern id="frieze" width="64" height="38" patternUnits="userSpaceOnUse"><path d="M4 32V7H48V25H20V17H36 M56 0V38" fill="none" stroke="#c4bc92" strokeWidth="4"/><path d="M6 34V9H46" fill="none" stroke="#212e24" strokeOpacity=".5"/></pattern>
 <pattern id="grit" width="83" height="57" patternUnits="userSpaceOnUse"><path d="M3 14h2m23 23h4m34-28h2m-2 40h5M10 49h2M45 17h3" stroke="#645c41" strokeOpacity=".2" strokeWidth="1.5"/></pattern>
 <pattern id="paving" width="160" height="70" patternUnits="userSpaceOnUse" patternTransform="skewX(-28)"><path d="M0 0H160V70H0Z M80 0V70" fill="none" stroke="#5d644a" strokeOpacity=".25" strokeWidth="2"/></pattern>
 <radialGradient id="haze"><stop stopColor="#e7ddab" stopOpacity=".34"/><stop offset="1" stopColor="#e7ddab" stopOpacity="0"/></radialGradient>
 </defs>
 <path fill="url(#sky)" d="M0 0H1024V576H0Z"/>
 <circle cx="190" cy="52" r="210" fill="url(#haze)"/>
 <path d="M0 142Q85 90 180 122T390 130T650 105T890 117T1100 100V240H0" fill="#7c9076" opacity=".6"/>
 {[20,110,215,310,430,620,740,870,985].map((x,i)=><g key={x} fill={i%2?'#3e6651':'#4a7058'}><path d={`M${x-60} 190Q${x-100} 50 ${x} 65Q${x+85} 20 ${x+80} 180Z`}/><path d={`M${x-50} 138Q${x} 77 ${x+55} 130Q${x+40} 95 ${x} 99`} fill="#6c8664" opacity=".45"/></g>)}
 <g fill="#a5a17e" stroke="#69775b" strokeWidth="2"><path d="M401 186H668L637 156H432Z M433 154H637L608 124H462Z M463 122H608L580 92H491Z M505 62H570V92H505Z"/><path d="M527 94L504 185H558L543 94" fill="#5b6d53"/>{[106,119,132,145,158,171,181].map(y=><path key={y} d={`M${527-(y-94)*.25} ${y}h${16+(y-94)*.5}`} stroke="#bbb38c"/>)}<path d="M525 72H549V92H525Z" fill="#3a5745"/></g>
 <ellipse cx="530" cy="170" rx="200" ry="45" fill="url(#haze)"/>
 <path d="M0 168L675 192V402L0 456Z" fill="url(#back-wall)"/><path d="M0 168L675 192V402L0 456Z" fill="url(#blocks)"/>
 <path d="M674 164L1024 82V457L674 405Z" fill="url(#wall)"/><path d="M674 164L1024 82V457L674 405Z" fill="url(#blocks)"/>
 <path d="M0 161L675 185L1024 101" fill="none" stroke="#d4c69e" strokeWidth="9"/>
 <path d="M0 179L674 201L1024 117" fill="none" stroke="#445a46" strokeWidth="35"/><path d="M0 179L674 201L1024 117" fill="none" stroke="url(#frieze)" strokeWidth="30"/>
 <path d="M0 202L674 224L1024 140" fill="none" stroke="#464e3c" strokeWidth="5" opacity=".6"/>
 {[44,200,356,512].map(x=><g key={x} transform={`translate(${x} ${252+x*.035})`}><rect x="-27" y="-25" width="76" height="92" rx="4" fill="#d4c39a" opacity=".15" stroke="#47553f" strokeWidth="2"/><g fill="none" stroke="#4e5c43" strokeWidth="4" opacity=".65"><path d="M-12-12h44v25H-12Z M-18 18h56v28H-18Z M-5 53h32M0-20v9M19-20v9"/><path d="M-4-3h7m12 0h7M-7 27h9v11h-9m22-11h9v11h-9"/></g><path d="M-22-20H43 M-22-20V60" fill="none" stroke="#e5d4a9" opacity=".45" strokeWidth="2"/></g>)}
 {[735,939].map(x=><g key={x} transform={`translate(${x} 308)`} fill="none" stroke="#596049" opacity=".65"><path d="M-21-27h42v60h-42Z" strokeWidth="3"/><path d="M-15-18h30v11H-4V8h19v17H-15V13h12M0-23v-9" strokeWidth="3"/><path d="M-25-32h50v70h-50Z"/></g>)}
 <path d="M0 446L675 392L1024 439V576H0Z" fill="url(#sand)"/><path d="M0 446L675 392L1024 439V576H0Z" fill="url(#paving)"/><path d="M0 446L675 392L1024 439V576H0Z" fill="url(#grit)"/>
 <path d="M0 424L675 374L1024 418V442L675 398L0 451Z" fill="#767c60" stroke="#bfb890" strokeWidth="2"/>
 <path d="M0 455L674 403L1024 448V462L674 416L0 470Z" fill="#3c4b35" opacity=".18"/>
 <path d="M0 525L675 446L1024 496" fill="none" stroke="#eee0b4" strokeWidth="2" opacity=".4"/>
 <path d="M0 559L675 462L1024 523" fill="none" stroke="#785f42" strokeWidth="2" opacity=".25"/>
 <g fill="#4b6043" opacity=".75">{[22,155,288,640,970].map(x=><path key={x} d={`M${x} 444l-8-18 3 15 5-23 1 20 9-14-5 20Z`}/>)}</g>
 <path d="M840 231L890 223L892 250L842 258" fill="#666d52" stroke="#4c563e" strokeWidth="2"/>
 <path d="M0 0H390L720 450L0 280Z" fill="url(#sunwash)" pointerEvents="none"/>
 <path d="M1024 0Q967 120 990 217 M0 0Q38 74 16 229" fill="none" stroke="#355a3c" strokeWidth="5"/>
 {[12,45,80,115,150].map(y=><g key={y} fill="#496c48"><ellipse cx="20" cy={y} rx="23" ry="7" transform={`rotate(-25 20 ${y})`}/><ellipse cx="996" cy={y} rx="24" ry="8" transform={`rotate(30 996 ${y})`}/></g>)}
 </g>;
});
