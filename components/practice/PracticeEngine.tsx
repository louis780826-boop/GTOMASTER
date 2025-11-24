
'use client';
import { useState } from 'react';

export default function PracticeEngine(){
  const [spot,setSpot]=useState(null);
  const question={position:'BTN',action:'Open',hands:'A5s',pot:1.5};
  const options=['Raise','Call','Fold'];

  return(
    <div className="card card-glow p-4 fade-in">
      <p className="text-gold mb-2">位置：{question.position}</p>
      <p className="text-gray-300 mb-4">手牌：{question.hands}</p>
      <div className="flex gap-3">
        {options.map(o=>(
          <button key={o} className="px-4 py-2 bg-[#1b1d25] border border-[#2b2e3a] rounded-lg hover-gold">{o}</button>
        ))}
      </div>
    </div>
  );
}
