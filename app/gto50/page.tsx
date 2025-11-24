"use client";

import React from "react";
import HexCoach from "../../components/HexCoach";
import { GTO_CHAPTERS } from "@/lib/gtoChapters";

export default function Gto50Page() {
  return (
    <div className="gto-container">
      <div className="hex-coach-panel">
        <HexCoach />
      </div>

      <h1 className="gto-card-title" style={{ textAlign: "center" }}>
        GTO 50 章完整課程
      </h1>

      <div className="gto-card">
        <div className="gto-section-text">
          這是整套課程結構，之後可以把每一章連到詳細教學頁或題庫。
        </div>
      </div>

      {GTO_CHAPTERS.map((c) => (
        <div key={c.id} className="gto-card">
          <div className="gto-section-title">第 {c.id} 章</div>
          <div className="gto-section-text">{c.title}</div>
        </div>
      ))}
    </div>
  );
}
