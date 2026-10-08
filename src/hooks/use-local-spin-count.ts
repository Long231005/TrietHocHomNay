import {useEffect,useState,useCallback,useRef} from 'react';
import type {Quote} from '@/lib/quotes';
import {readCookie,writeCookie} from '@/lib/cookies';
function savedCount(){const n=readCookie<number>('spins');return Number.isSafeInteger(n)&&Number(n)>=0?Number(n):0}
export function useLocalSpinCount(){
 const[count,setCount]=useState(0),current=useRef(0);
 useEffect(()=>{current.current=savedCount();setCount(current.current)},[]);
 const recordSpin=useCallback((quote:Quote)=>{
  const next=Math.min(Number.MAX_SAFE_INTEGER,Math.max(current.current,savedCount())+1);
  try{writeCookie('spins',next);writeCookie('last-choice',{id:quote.id,at:Date.now()})}catch{}
  current.current=next;setCount(next);
 },[]);
 return{count,enabled:true,recordSpin};
}
