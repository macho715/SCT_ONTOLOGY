```diff
--- a/hvdc_tr_report_web_ready (2).html
+++ b/hvdc_tr_report_web_ready (2).html
@@ -4116,7 +4116,7 @@
       <div style="font-size:52px;font-family:var(--font-serif,Georgia,serif);color:var(--status-ok);line-height:1;">7</div>
       <p class="card-body">Planned Units</p>
       <div class="card-footer">
-        <span class="card-status status-ok">All Clear</span>
+        <span class="card-status status-ok">Planned Scope</span>
       </div>
     </div>
 
@@ -4137,7 +4137,7 @@
     </div>
 
     <div class="glass-card" style="text-align: center; translate: none; rotate: none; scale: none; transform: translate(0px, 12px); opacity: 0; filter: blur(6px);">
-      <div style="font-size:52px;font-family:var(--font-serif,Georgia,serif);color:var(--status-info);line-height:1;">4</div>
+      <div style="font-size:52px;font-family:var(--font-serif,Georgia,serif);color:var(--status-info);line-height:1;">6</div>
       <p class="card-body">TR1-TR6 TSV Scope Reviewed</p>
       <div class="card-footer">
         <span class="card-status status-info">Reviewed</span>
@@ -4199,17 +4199,17 @@
         </div>
         <div class="data-point">
           <span class="data-point-num">5</span>
-          <span class="data-point-unit"> units</span>
+          <span class="data-point-unit"> packages</span>
           <span class="data-point-label">Document Packages</span>
         </div>
         <div class="data-point">
           <span class="data-point-num">3</span>
-          <span class="data-point-unit"> units</span>
+          <span class="data-point-unit"> gates</span>
           <span class="data-point-label">Gate</span>
         </div>
         <div class="data-point">
           <span class="data-point-num">7</span>
-          <span class="data-point-unit"> units</span>
+          <span class="data-point-unit"> hold points</span>
           <span class="data-point-label">Hold Point</span>
         </div>
       </div>
@@ -4313,7 +4313,7 @@
     <div class="ev-row"><span class="ev-dot ev-dot--blue"></span><span class="ev-col-code">C</span><span>Linkspan Load Test Evidence</span><span class="ev-col-gate">G2</span><span style="color:var(--text-muted);font-size:12px;">Port / MWS</span></div>
     <div class="ev-row"><span class="ev-dot ev-dot--blue"></span><span class="ev-col-code">C</span><span>Ramp Certificate</span><span class="ev-col-gate">G2</span><span style="color:var(--text-muted);font-size:12px;">Shipowner / KR</span></div>
     <div class="ev-row"><span class="ev-dot ev-dot--blue"></span><span class="ev-col-code">C</span><span>SPMT / Equipment Certificates</span><span class="ev-col-gate">G1</span><span style="color:var(--text-muted);font-size:12px;">Mammoet</span></div>
-    <div class="ev-row"><span class="ev-dot ev-dot--blue"></span><span class="ev-col-code">C</span><span>Welder / Firewatcher Certificates</span><span class="ev-col-gate">G2</span><span style="color:var(--text-muted);font-size:12px;">DAS</span></div>
+    <div class="ev-row"><span class="ev-dot ev-dot--blue"></span><span class="ev-col-code">C</span><span>Welder / Firewatcher Certificates</span><span class="ev-col-gate">G2</span><span style="color:var(--text-muted);font-size:12px;">Mammoet / OFCO</span></div>
     <!-- Package D: Voyage / Close-out (green dot) -->
     <div class="ev-row"><span class="ev-dot ev-dot--green"></span><span class="ev-col-code">D</span><span>Cargo Manifest / Packing List</span><span class="ev-col-gate">G2</span><span style="color:var(--text-muted);font-size:12px;">Operations</span></div>
     <div class="ev-row"><span class="ev-dot ev-dot--green"></span><span class="ev-col-code">D</span><span>Voyage Plan / Route Map</span><span class="ev-col-gate">G3</span><span style="color:var(--text-muted);font-size:12px;">Shipowner / Operations</span></div>
@@ -4544,7 +4544,7 @@
     <!-- Route distance must be updated only after Method Statement confirmation. -->
     <span class="route-badge rb-dist">Distance: TBC</span>
     <span class="route-badge rb-vessel">LCT Bushra</span>
-    <span class="route-badge rb-status">4 / 7 Trips Complete</span>
+    <span class="route-badge rb-status">5 / 7 Trips Complete</span>
     <span class="route-badge">LCT + SPMT</span>
   </div>
 
@@ -4741,7 +4741,7 @@
           <rect x="0" y="0" width="172" height="3" rx="4" fill="rgba(201,168,76,0.5)"></rect>
           <text x="10" y="14" font-family="'JetBrains Mono',monospace" font-size="8" font-weight="700" fill="var(--accent-gold)" letter-spacing="0.8">Shuweihat</text>
           <text x="10" y="26" font-family="'Inter',sans-serif" font-size="7" fill="#a8b0cc">24.160°N 52.573°E</text>
-          <text x="10" y="38" font-family="'Inter',sans-serif" font-size="7" fill="#a8b0cc">Cable landing · RoRo arrival</text>
+          <text x="10" y="38" font-family="'Inter',sans-serif" font-size="7" fill="#a8b0cc">Cable landing · not RoRo arrival</text>
         </g>
       </g>
 
@@ -4765,7 +4765,7 @@
           <rect x="0" y="0" width="188" height="3" rx="4" fill="rgba(196,181,253,0.5)"></rect>
           <text x="10" y="14" font-family="'JetBrains Mono',monospace" font-size="8" font-weight="700" fill="#c4b5fd" letter-spacing="0.8">Al Ghallan Island</text>
           <text x="10" y="26" font-family="'Inter',sans-serif" font-size="7" fill="#a8b0cc">24.841°N 53.659°E</text>
-          <text x="10" y="38" font-family="'Inter',sans-serif" font-size="7" fill="#a8b0cc">HVDC offshore terminal · Upper Zakum</text>
+          <text x="10" y="38" font-family="'Inter',sans-serif" font-size="7" fill="#a8b0cc">HVDC offshore terminal · Al Ghallan Island</text>
         </g>
       </g>
 
@@ -4824,8 +4824,8 @@
         <rect x="0" y="0" width="128" height="3" rx="7" fill="rgba(245,158,11,0.55)"></rect>
         <circle cx="16" cy="21" r="4.5" fill="rgba(245,158,11,0.2)" stroke="rgba(245,158,11,0.7)" stroke-width="1"></circle>
         <circle cx="16" cy="21" r="2" fill="rgba(245,158,11,0.9)"></circle>
-        <text x="27" y="17.5" font-family="'JetBrains Mono',monospace" font-size="10" font-weight="700" fill="rgba(245,158,11,0.96)" letter-spacing="0.5">4 / 7 TRIPS</text>
-        <text x="27" y="28.5" font-family="'Inter',sans-serif" font-size="7.5" fill="rgba(255,255,255,0.48)">TR1–TR4 Complete</text>
+        <text x="27" y="17.5" font-family="'JetBrains Mono',monospace" font-size="10" font-weight="700" fill="rgba(245,158,11,0.96)" letter-spacing="0.5">5 / 7 TRIPS</text>
+        <text x="27" y="28.5" font-family="'Inter',sans-serif" font-size="7.5" fill="rgba(255,255,255,0.48)">TR1–TR5 Complete</text>
       </g>
 
       <!-- MZP data badge — enhanced label reinforcement -->
@@ -4978,8 +4978,8 @@
     <div class="rmap-stat-label">Sea transit distance · MZP → AGI · Source confirmation required</div>
   </div>
   <div class="rmap-stat-item gsap-fade-up" style="translate: none; rotate: none; scale: none; transform: translate(0px, 30px); opacity: 0;">
-    <span class="rmap-stat-num">4<span class="rmap-stat-unit">voyages</span></span>
-    <div class="rmap-stat-label">Voyages TR1–TR4 reviewed · LCT Bushra</div>
+    <span class="rmap-stat-num">6<span class="rmap-stat-unit">voyages</span></span>
+    <div class="rmap-stat-label">Voyages TR1–TR6 reviewed · LCT Bushra</div>
   </div>
   <div class="rmap-stat-item gsap-fade-up" style="translate: none; rotate: none; scale: none; transform: translate(0px, 30px); opacity: 0;">
     <span class="rmap-stat-num">217<span class="rmap-stat-unit">t</span></span>
@@ -5514,7 +5514,7 @@
   <div style="margin-bottom: 24px;">
     <span class="editorial-section-tag">Voyage Go/No-Go Decision History</span>
     <h3 class="editorial-heading" style="font-size: clamp(22px,2.5vw,32px); margin-top: 12px;">Actual Go/No-Go Decision Record</h3>
-    <p style="color: var(--text-muted); font-size: 13px; margin-top: 8px;">Operational delay and departure summary for TR1–TR4, aligned to Mammoet DPR milestone evidence.</p>
+    <p style="color: var(--text-muted); font-size: 13px; margin-top: 8px;">Operational delay and departure summary for TR1–TR6, aligned to Mammoet DPR / TSV milestone evidence.</p>
   </div>
   <div class="go-nogo-history">
     <!-- 헤더 -->
@@ -5640,8 +5640,8 @@
     </div>
     <div class="card-title">MWS Certificate of Compliance Expired</div>
     <div class="card-body">
-      If the Maritime Warranty Surveyor certificate renewal is delayed, load-out authorisation cannot be obtained.
-      Renewal must be completed before D-14.
+      If the Marine Warranty Surveyor COA is not issued or revalidated for the voyage, sail-away authorisation cannot be obtained.
+      COA attendance and voyage-specific validity must be confirmed before sail-away.
     </div>
     <div class="card-footer">
 
@@ -5656,8 +5656,8 @@
     </div>
     <div class="card-title">Ramp Linkspan Not Certified</div>
     <div class="card-body">
-      If the destination ramp linkspan load certification is absent, berthing cannot proceed.
-      The contract should specify CoS submission before D-12.
+      If the AGI linkspan / ramp load certification is absent, load-in cannot proceed.
+      The contract should specify certificate submission before the applicable load-in readiness gate.
     </div>
     <div class="card-footer">
 
@@ -5769,7 +5769,7 @@
   <div class="chapter-opener-text" style="translate: none; rotate: none; scale: none; transform: translate(0px, 0px); opacity: 1;">
     <span class="chapter-tag">Chapter 04</span>
     <h2 class="chapter-title"><span class="word"><span class="word-inner" style="translate: none; rotate: none; scale: none; transform: translate(0px, 110%); opacity: 0;">Per Voyage</span></span> <span class="word"><span class="word-inner" style="translate: none; rotate: none; scale: none; transform: translate(0px, 110%); opacity: 0;">Operations</span></span> <span class="word"><span class="word-inner" style="translate: none; rotate: none; scale: none; transform: translate(0px, 110%); opacity: 0;">Performance</span></span></h2>
-    <p class="chapter-desc">TR1–TR4 Reviewed · Delays Accumulated</p>
+    <p class="chapter-desc">TR1–TR6 Reviewed · TR5 Complete · TR6 AMBER</p>
   </div>
 </section>
 
@@ -6125,14 +6125,14 @@
 <div class="optimus-marquee-wrap" style="overflow:hidden; border-top:1px solid var(--glass-border); border-bottom:1px solid var(--glass-border); padding:12px 0; margin-bottom:0;">
   <div class="optimus-marquee-track" style="display:flex; gap:64px; width:max-content; animation: marquee-left 28s linear infinite;">
     <span style="font-family:var(--font-mono); font-size:11px; color:var(--text-muted); letter-spacing:1px; white-space:nowrap;"><strong style="color:var(--accent-gold-lt); font-size:16px;">7</strong>&nbsp;Planned Units</span>
-    <span style="font-family:var(--font-mono); font-size:11px; color:var(--text-muted); letter-spacing:1px; white-space:nowrap;"><strong style="color:var(--accent-gold-lt); font-size:16px;">4</strong>&nbsp;Completed</span>
-    <span style="font-family:var(--font-mono); font-size:11px; color:var(--text-muted); letter-spacing:1px; white-space:nowrap;"><strong style="color:var(--accent-gold-lt); font-size:16px;">3</strong>&nbsp;Suspended</span>
+    <span style="font-family:var(--font-mono); font-size:11px; color:var(--text-muted); letter-spacing:1px; white-space:nowrap;"><strong style="color:var(--accent-gold-lt); font-size:16px;">5</strong>&nbsp;Completed</span>
+    <span style="font-family:var(--font-mono); font-size:11px; color:var(--text-muted); letter-spacing:1px; white-space:nowrap;"><strong style="color:var(--accent-gold-lt); font-size:16px;">1</strong>&nbsp;AMBER&nbsp;/&nbsp;1&nbsp;Evidence&nbsp;Gap</span>
     <span style="font-family:var(--font-mono); font-size:11px; color:var(--text-muted); letter-spacing:1px; white-space:nowrap;"><strong style="color:var(--accent-gold-lt); font-size:16px;">217.0 t</strong>&nbsp;per Unit</span>
     <span style="font-family:var(--font-mono); font-size:11px; color:var(--text-muted); letter-spacing:1px; white-space:nowrap;"><strong style="color:var(--accent-gold-lt); font-size:16px;">12 m</strong>&nbsp;Linkspan</span>
     <span style="font-family:var(--font-mono); font-size:11px; color:var(--text-muted); letter-spacing:1px; white-space:nowrap;"><strong style="color:var(--accent-gold-lt); font-size:16px;">201.6 t</strong>&nbsp;Maximum Reaction</span>
     <span style="font-family:var(--font-mono); font-size:11px; color:var(--text-muted); letter-spacing:1px; white-space:nowrap;"><strong style="color:var(--accent-gold-lt); font-size:16px;">7</strong>&nbsp;Planned Units</span>
-    <span style="font-family:var(--font-mono); font-size:11px; color:var(--text-muted); letter-spacing:1px; white-space:nowrap;"><strong style="color:var(--accent-gold-lt); font-size:16px;">4</strong>&nbsp;Completed</span>
-    <span style="font-family:var(--font-mono); font-size:11px; color:var(--text-muted); letter-spacing:1px; white-space:nowrap;"><strong style="color:var(--accent-gold-lt); font-size:16px;">3</strong>&nbsp;Suspended</span>
+    <span style="font-family:var(--font-mono); font-size:11px; color:var(--text-muted); letter-spacing:1px; white-space:nowrap;"><strong style="color:var(--accent-gold-lt); font-size:16px;">5</strong>&nbsp;Completed</span>
+    <span style="font-family:var(--font-mono); font-size:11px; color:var(--text-muted); letter-spacing:1px; white-space:nowrap;"><strong style="color:var(--accent-gold-lt); font-size:16px;">1</strong>&nbsp;AMBER&nbsp;/&nbsp;1&nbsp;Evidence&nbsp;Gap</span>
     <span style="font-family:var(--font-mono); font-size:11px; color:var(--text-muted); letter-spacing:1px; white-space:nowrap;"><strong style="color:var(--accent-gold-lt); font-size:16px;">217.0 t</strong>&nbsp;per Unit</span>
     <span style="font-family:var(--font-mono); font-size:11px; color:var(--text-muted); letter-spacing:1px; white-space:nowrap;"><strong style="color:var(--accent-gold-lt); font-size:16px;">12 m</strong>&nbsp;Linkspan</span>
     <span style="font-family:var(--font-mono); font-size:11px; color:var(--text-muted); letter-spacing:1px; white-space:nowrap;"><strong style="color:var(--accent-gold-lt); font-size:16px;">201.6 t</strong>&nbsp;Maximum Reaction</span>
@@ -6227,22 +6227,22 @@
     <div class="glass-card gsap-fade-up" style="border-left: 4px solid var(--accent-gold-lt); transition-delay: 0.12s; translate: none; rotate: none; scale: none; transform: translate(0px, 12px); opacity: 0; filter: blur(6px);">
       <div class="card-title">Weather and Tide Verification</div>
       <div class="card-body">
-        NO-GO patterns from TR2 and TR3 (fog and strong winds) are used to predict optimal working windows for subsequent voyages.
+        NO-GO patterns from TR2 and TR3 (fog and strong winds) are used as reference cases when screening subsequent weather and tide windows.
 
       </div>
       <div class="card-footer">
-        <span style="color:var(--text-muted); font-size:12px;">AI-Native Workflows</span>
-        <span class="card-status" style="background:rgba(232,201,122,0.12); color:var(--accent-gold-lt);">AI</span>
+        <span style="color:var(--text-muted); font-size:12px;">Operational Pattern Review</span>
+        <span class="card-status" style="background:rgba(232,201,122,0.12); color:var(--accent-gold-lt);">REVIEW</span>
       </div>
     </div>
 
     <div class="glass-card gsap-fade-up" style="border-left: 4px solid var(--status-ok); transition-delay: 0.18s; translate: none; rotate: none; scale: none; transform: translate(0px, 12px); opacity: 0; filter: blur(6px);">
       <div class="card-title">Post-Voyage Document Distribution</div>
       <div class="card-body">
-        Upon completion of the G6 Close-out Gate, the operations report is automatically uploaded to the Samsung C&amp;T and ADNOC portals within 30 seconds. Manual document transmission is eliminated.
+        Upon completion of the post-voyage close-out gate, the operations report package shall be uploaded to the agreed project portals and retained with email backup where required.
       </div>
       <div class="card-footer">
-        <span style="color:var(--text-muted); font-size:12px;">Instant Deployment</span>
+        <span style="color:var(--text-muted); font-size:12px;">Controlled Distribution</span>
         
       </div>
     </div>
@@ -6250,11 +6250,11 @@
     <div class="glass-card gsap-fade-up" style="border-left: 4px solid var(--accent-blue); transition-delay: 0.24s; translate: none; rotate: none; scale: none; transform: translate(0px, 12px); opacity: 0; filter: blur(6px);">
       <div class="card-title">Operational Performance Tracking</div>
       <div class="card-body">
-        Four KPIs — completion rate, average cycle, delay reason and cost impact — are automatically updated on completion of each voyage.
+        Four KPIs — completion rate, average cycle, delay reason and delay driver — are updated after voyage close-out review.
       </div>
       <div class="card-footer">
-        <span style="color:var(--text-muted); font-size:12px;">Live Metrics</span>
-        <span class="card-status" style="background:rgba(59,130,246,0.12); color:var(--accent-blue);">AUTO</span>
+        <span style="color:var(--text-muted); font-size:12px;">Reviewed Metrics</span>
+        <span class="card-status" style="background:rgba(59,130,246,0.12); color:var(--accent-blue);">REVIEW</span>
       </div>
     </div>
 
@@ -6750,11 +6750,11 @@
     <span class="section-kicker">THE PROOF</span>
     <div class="ew-close-badge">
       <span class="ew-close-dot"></span>
-      OPERATION CLOSED · 2026-03-14
+      STATUS RECONCILED · 2026-06-05
     </div>
   </div>
   <h2>Evidence Wall</h2>
-  <p>The operation is closed through repeatable movement evidence, route completion, and decision-gate control. All values are per source report and confirmed delivery records.</p>
+  <p>The operation status is reconciled through repeatable movement evidence, route completion, and decision-gate control. TR7 remains outside the TSV source scope until matching evidence is added.</p>
 
   <div class="evidence-grid ew-grid-enhanced">
     <article>
@@ -6770,7 +6770,7 @@
     <article>
       <span>Route</span>
       <strong>MZP → AGI</strong>
-      <p>Mina Zayed Port to Al Ghallan Island · Distance: TBC — pending Method Statement confirmation</p>
+      <p>Mina Zayed Port to Al Ghallan Island · Distance: TBC — Method Statement confirms route, not distance</p>
     </article>
     <article>
       <span>Transport Mode</span>
@@ -6779,7 +6779,7 @@
     </article>
     <article>
       <span>Trips</span>
-      <strong>5 / 6</strong>
+      <strong>5 complete / 6 reviewed</strong>
       <p>TSV 2026-06-05: TR1-TR5 completed · TR6 AMBER pending weather and NCM/ADNOC approval</p>
     </article>
     <article>
```
