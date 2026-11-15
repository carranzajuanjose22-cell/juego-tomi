import { memo } from 'react';
export default memo(function Court() {
 return <g>
 <defs>
 <linearGradient id="sky" x2="0" y2="1"><stop stopColor="#163d38"/><stop offset="1" stopColor="#8a9c77"/></linearGradient>
 <linearGradient id="wall" x2="0" y2="1"><stop stopColor="#b6a387"/><stop offset="1" stopColor="#726d5c"/></linearGradient>
 <linearGradient id="sand" x2="0" y2="1"><stop stopColor="#bd9e70"/><stop offset="1" stopColor="#e0c59a"/></linearGradient>
 <radialGradient id="rubber"><stop stopColor="#51504a"/><stop offset=".45" stopColor="#262f2b"/><stop offset="1" stopColor="#101b19"/></radialGradient>
 <pattern id="blocks" width="112" height="62" patternUnits="userSpaceOnUse"><path d="M0 0H112V62H0Z M56 0V30 M0 30H112" fill="none" stroke="#403e33" strokeOpacity=".3" strokeWidth="2"/><path d="M4 4H108" stroke="#f4dfb4" strokeOpacity=".16"/></pattern>
 <pattern id="frieze" width="64" height="38" patternUnits="userSpaceOnUse"><path d="M4 32V7H48V25H20V17H36 M56 0V38" fill="none" stroke="#c9b98f" strokeWidth="4"/></pattern>
 <filter id="ball-shadow"><feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity=".4"/></filter>
 </defs>
 <path fill="url(#sky)" d="M0 0H1024V576H0Z"/>
 {[20,110,215,310,430,620,740,870,985].map((x,i)=><path key={x} fill={i%2?'#23483e':'#30564a'} d={`M${x-60} 190Q${x-100} 30 ${x} 65Q${x+85} 10 ${x+80} 180Z`}/>)}
 <g fill="#737c61" stroke="#435b4e" strokeWidth="3"><path d="M410 180H665L630 150H445Z M442 149H632L603 120H470Z M470 119H603L577 90H495Z M506 62H569V90H506Z"/><path d="M532 92L510 181H555L545 92" fill="#405d4e"/></g>
 <path d="M0 168L675 192V402L0 456Z" fill="#8a8d73"/><path d="M0 168L675 192V402L0 456Z" fill="url(#blocks)"/>
 <path d="M674 164L1024 82V457L674 405Z" fill="url(#wall)"/><path d="M674 164L1024 82V457L674 405Z" fill="url(#blocks)"/>
 <path d="M0 179L674 201L1024 117" fill="none" stroke="#3b5145" strokeWidth="44"/><path d="M0 179L674 201L1024 117" fill="none" stroke="url(#frieze)" strokeWidth="30"/>
 <path d="M0 446L675 392L1024 439V576H0Z" fill="url(#sand)"/>
 <path d="M0 457L675 405L1024 450 M0 510L680 430L1024 496 M90 576L700 451L910 576 M430 576L720 475L1024 547" fill="none" stroke="#927b56" strokeOpacity=".5" strokeWidth="2"/>
 <path d="M0 424L675 374L1024 418V442L675 398L0 451Z" fill="#696e59" stroke="#cec19b" strokeWidth="2"/>
 {[70,235,400,565].map(x=><g key={x} transform={`translate(${x} 280)`} fill="none" stroke="#485947" strokeWidth="4" opacity=".65"><rect x="-24" y="-26" width="48" height="58" rx="13"/><path d="M-14-7H14V15H-14Z M-6 24H7 M0-23V-13"/></g>)}
 <path d="M791 238H900" stroke="#5d6251" strokeWidth="20"/>
 <path d="M1024 0Q967 120 990 217 M0 0Q38 74 16 229" fill="none" stroke="#284f3b" strokeWidth="8"/>
 {[12,45,80,115,150].map(y=><g key={y} fill="#406444"><ellipse cx="20" cy={y} rx="23" ry="7" transform={`rotate(-25 20 ${y})`}/><ellipse cx="996" cy={y} rx="24" ry="8" transform={`rotate(30 996 ${y})`}/></g>)}
 </g>;
});
export function Player() {
 return <g stroke="#332d21" strokeWidth="3" strokeLinejoin="round">
 <ellipse cy="92" rx="40" ry="9" fill="#3b3929" opacity=".22" stroke="none"/>
 <path d="M-26 22L-33 62L-43 87H-25L-10 59L0 35 M10 26L25 59L40 85H57L40 50L32 20" fill="#ba7c4f"/>
 <path d="M-20-37Q-7-49 13-36L29 16L-23 24Z" fill="#c88a56"/>
 <path d="M-19-30L-39-8L-26 8 M12-32L37-17L46-36" fill="none" stroke="#c88a56" strokeWidth="14" strokeLinecap="round"/>
 <path d="M-24 9L28 0L35 29L-22 35Z" fill="#335f50"/><path d="M-8 11L15 7L23 37L3 44Z" fill="#e3c89a"/><path d="M3 19L13 25L7 32Z" fill="#ae5e3f"/>
 <path d="M-25 6L27-4L30 7L-24 18Z" fill="#8c4935"/>
 <ellipse cx="-6" cy="-62" rx="18" ry="23" fill="#c88a56"/><path d="M-24-65Q-27-90-4-87L13-75V-60L3-69Z" fill="#202f29"/>
 <path d="M-23-79L-39-113L-14-94L-13-126L0-94L14-116L12-80" fill="#397866"/><path d="M-24-79L12-83L14-72L-23-69Z" fill="#bb7b45"/>
 <circle cx="8" cy="-56" r="4" fill="#69a084"/>
 </g>;
}
