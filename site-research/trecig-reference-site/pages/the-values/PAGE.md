# The Values – TRECIG

*TRECIG (design reference site)* · URL: https://trecig.com/the-values/ · captured 2026-11-08 00:38:55 · HTTP 200

- **Meta description:** —
- **Page size (desktop 1440px):** 1440×1768 px · tablet (820px): 1981 px · mobile (390px): 1950 px
- **Screenshots:** [desktop](screenshots/desktop-full.png) · [tablet](screenshots/tablet-full.png) · [mobile](screenshots/mobile-full.png) · [desktop top](screenshots/desktop-viewport-top.png) · [desktop scrolled](screenshots/desktop-viewport-scrolled.png)
- **Files:** [raw.html](raw.html) (server HTML) · [rendered.html](rendered.html) (DOM after JS) · [content.txt](content.txt) (all visible text) · layout-*.json (full element tree with computed styles) · page.json (everything)

## 1. Section map (top → bottom, desktop 1440px)

| # | Role | Y from top | Height | Heading / first text | Mobile height | Screenshot |
|---|---|---|---|---|---|---|
| 0 | header | 0 | 170 | HOME ABOUT AWARDS & RECOGNITION EXPERTISE PRESS & MEDIA CONTACT | 170 | [img](screenshots/desktop-sec00-header.png) |
| 1 | section | 170 | 400 | THE VALUES | 220 | [img](screenshots/desktop-sec01-section.png) |
| 2 | section | 570 | 600 | OUR VALUES: THE CORE OF OUR PURPOSE | 870 | [img](screenshots/desktop-sec02-section.png) |
| 3 | footer | 1170 | 598 | LET'S TALK: | 690 | [img](screenshots/desktop-sec03-footer.png) |
| 4 | floating (fixed, z 1000003) | 875 | 38 |  |  |  |

## 2. Section-by-section layout (desktop)

Legend: each line is an element in DOM order. `@x,y w×h` = position/size in px on the 1440px-wide page. Text lines show *font size/weight, line-height, colour*. Boxes show layout (flex/grid), background, padding, radius, shadow, etc. Pass-through wrappers are collapsed.

### 2.0 HEADER — HOME ABOUT AWARDS & RECOGNITION EXPERTISE PRESS & MEDIA CONTACT

Element: `<header class="elementor elementor-13 elementor-location-header">` at y=0, 1440×170px · ![section](screenshots/desktop-sec00-header.png)

- section.elementor-section [bg:#FFFFFF · shadow:#000000 @10% 0px 0px 12px 0px · z:9999 · transition:background, border, border-radius, box-shadow 0.3s, 0.3s, 0.3s, 0.3s ease, ease, ease, ease] `@0,0 1440×170`
  - div.elementor-container [flex row · margin:0px 85px 0px 85px · max-w:1270px] `@85,0 1270×170`
    - div.elementor-column [flex row · min-h:1px] `@85,0 1270×170`
      - div.elementor-widget-wrap [flex row wrap] `@85,0 1270×170`
        - div.elementor-container [flex row · max-w:1270px] `@85,0 1270×170`
          - div.elementor-column [flex row · min-h:1px] `@85,0 127×170`
            - div.elementor-widget-wrap [flex row wrap · align:center · pad:10px 10px 10px 10px] `@85,0 127×170`
              - a (link→/) [inline-block · align-text:center] `@95,10 200×150`
                - **IMG** `TRECIG_Logo_Registered.png` alt="" natural 1440×1080 · inline-block · max-w:200px · overflow:clip · align-text:center `@95,10 200×150`
          - div.elementor-column [flex row · min-h:1px] `@212,0 1143×170`
            - div.elementor-widget-wrap [flex row wrap · align:center · pad:10px 10px 10px 10px] `@212,0 1143×170`
              - div.elementor-widget-container [flex column · transition:background, border, border-radius, box-shadow, transform 0.3s, 0.3s, 0.3s, 0.3s, 0.4s ease, ease, ease, ease, ease] `@222,75 1123×20`
                - ul.elementor-nav-menu [flex row wrap · justify:flex-end · margin:0px 0px 0px 411.234px · z:2] · pseudo:::after{{"content": "\" \"", "w": "0px", "h": "0px"}} `@633,75 712×20`
                  - **A→/** "HOME" — Poppins 14px/400 lh 20px · #000000 · textTransform:uppercase ‖ flex row · margin:0px 15px 0px 0px · transition:all 0.4s ease `@633,75 40×20`
                  - **A→/about/** "ABOUT" — Poppins 14px/400 lh 20px · #000000 · textTransform:uppercase ‖ flex row · margin:0px 15px 0px 15px · transition:all 0.4s ease `@703,75 70×20`
                  - **A→/awards-recognition/** "AWARDS & RECOGNITION" — Poppins 14px/400 lh 20px · #000000 · textTransform:uppercase ‖ flex row · margin:0px 15px 0px 15px · transition:all 0.4s ease `@803,75 195×20`
                  - **A→/expertise/** "EXPERTISE" — Poppins 14px/400 lh 20px · #000000 · textTransform:uppercase ‖ flex row · margin:0px 15px 0px 15px · transition:all 0.4s ease `@1028,75 90×20`
                  - **A→/press-media/** "PRESS & MEDIA" — Poppins 14px/400 lh 20px · #000000 · textTransform:uppercase ‖ flex row · margin:0px 15px 0px 15px · transition:all 0.4s ease `@1148,75 100×20`
                  - **A→/contact/** "CONTACT" — Poppins 14px/400 lh 20px · #000000 · textTransform:uppercase ‖ flex row · margin:0px 0px 0px 15px · transition:all 0.4s ease `@1278,75 67×20`

### 2.1 SECTION — THE VALUES

Element: `<section class="elementor-section elementor-top-section elementor-element elementor-element-12626bb elementor-section-height-min-height elementor-section-bo">` at y=170, 1440×400px · ![section](screenshots/desktop-sec01-section.png)

- section.elementor-section [transition:background, border, border-radius, box-shadow 0.3s, 0.3s, 0.3s, 0.3s ease, ease, ease, ease] `@0,170 1440×400`
  - div.elementor-background-video-container [pos:absolute · z:0 · overflow:hidden · transition:opacity 1s ease] `@0,170 1440×400`
    - **IFRAME** https://www.youtube.com/embed/3fULGgGOVf8?controls=0&rel=0&playsinline=1&cc_load_policy=0&enablejsapi=1&origin=https%3A%2F%2Ftrecig.com&widgetid=1&forigin=https%3A%2F%2Ftrecig.com%2Fthe-values%2F&aoriginsup=1&vf=6 The Value Top Banner Video `@0,-35 1440×810`
  - div.elementor-background-overlay [bg:#000000 · pos:absolute · opacity:0.5 · transition:background, border-radius, opacity 0.3s, 0.3s, 0.3s ease, ease, ease] `@0,170 1440×400` (empty/decorative)
  - div.elementor-container [flex row · align:center · margin:0px 345px 0px 345px · max-w:750px · min-h:400px] `@345,170 750×400`
    - div.elementor-column [flex row · min-h:1px] `@345,270 750×200`
      - div.elementor-widget-wrap [flex row wrap · pad:10px 10px 10px 10px · margin:80px 0px 0px 0px] `@345,350 750×120`
        - div.elementor-widget-heading [margin:0px 0px 20px 0px · align-text:center] `@355,360 730×36`
          - **H2** "THE VALUES" — Poppins 36px/800 lh 36px · #FFFFFF · textTransform:uppercase · textAlign:center ‖ inline-block `@613,360 215×36`
        - div.elementor-widget-heading [margin:0px 0px 20px 0px · align-text:center] `@355,416 730×24`
          - **H2** "TRECIG IS MORE THAN A NAME—IT’S A PROMISE." — Poppins 18px/600 lh 18px · #FFFFFF · textTransform:uppercase · textAlign:center ‖ inline-block `@510,419 420×18`

### 2.2 SECTION — OUR VALUES: THE CORE OF OUR PURPOSE

Element: `<section class="elementor-section elementor-top-section elementor-element elementor-element-b5dc9b0 elementor-section-full_width tilt-sec2 elementor-section">` at y=570, 1440×600px · ![section](screenshots/desktop-sec02-section.png)

- section.elementor-section [bg:transparent · transition:background, border, border-radius, box-shadow 0.3s, 0.3s, 0.3s, 0.3s ease, ease, ease, ease] `@0,570 1440×600`
  - div.elementor-container [flex row] `@0,570 1440×600`
    - div.elementor-column [flex row · min-h:1px] `@0,570 706×600`
      - div.elementor-widget-wrap [flex row wrap · align:center · pad:10px 10px 10px 10px] `@0,570 706×600`
        - div.elementor-container [flex row · margin:0px 67.7969px 0px 67.7969px · max-w:550px] `@78,588 550×565`
          - div.elementor-column [flex row · min-h:1px] `@78,588 550×565`
            - div.elementor-widget-wrap [flex row wrap · pad:10px 10px 10px 10px] `@78,588 550×565`
              - div.elementor-widget-heading [margin:0px 0px 20px 0px] `@88,598 530×72`
                - **H2** "OUR VALUES: THE CORE OF OUR PURPOSE" — Poppins 36px/800 lh 36px · #000000 · textTransform:uppercase ‖ inline-block · highlights: "OUR VALUES:" #B22239 `@88,598 416×72`
              - ul.elementor-icon-list-items `@88,690 530×453`
                - li.elementor-icon-list-item [flex row · justify:start · align:flex-start · pad:0px 0px 7.5px 0px] `@88,690 530×104`
                  - **SPAN** "Integrity Above All Else: In a world often swayed by shortcuts, we stand steadfast in our commitment to truth. Integrity isn’t just a value here—it is the be…" — Poppins 16px/400 lh 24px · #000000 ‖ pad:0px 0px 0px 5px · transition:color 0.3s ease · highlights: "Integrity Above All Else:"  600 `@123,690 495×96`
                - li.elementor-icon-list-item [flex row · justify:start · align:flex-start · pad:0px 0px 7.5px 0px · margin:7.5px 0px 0px 0px] `@88,801 530×128`
                  - **SPAN** "Empowerment Through Collaboration: Alone, we are sparks. Together, we are an unyielding blaze of innovation and progress. At TRECIG, we cultivate an environm…" — Poppins 16px/400 lh 24px · #000000 ‖ pad:0px 0px 0px 5px · transition:color 0.3s ease · highlights: "Empowerment Through Collaboration:"  600 `@123,801 495×120`
                - li.elementor-icon-list-item [flex row · justify:start · align:flex-start · pad:0px 0px 7.5px 0px · margin:7.5px 0px 0px 0px] `@88,936 530×104`
                  - **SPAN** "Relentless Pursuit of Excellence: To us, excellence is a discipline, not a destination. It is the fuel that propels us to raise the bar, challenge the status…" — Poppins 16px/400 lh 24px · #000000 ‖ pad:0px 0px 0px 5px · transition:color 0.3s ease · highlights: "Relentless Pursuit of Excellence:"  600 `@123,936 495×96`
                - li.elementor-icon-list-item [flex row · justify:start · align:flex-start · margin:7.5px 0px 0px 0px] `@88,1047 530×96`
                  - **SPAN** "Service With Purpose: Our work is not merely about delivering results; it is about serving humanity with intention and honor. Every project, every goal, is i…" — Poppins 16px/400 lh 24px · #000000 ‖ pad:0px 0px 0px 5px · transition:color 0.3s ease · highlights: "Service With Purpose:"  600 `@123,1047 495×96`
    - div.elementor-column [flex row · min-h:1px] `@706,570 734×600`
      - div.elementor-widget-wrap [flex row wrap · align:center · transition:background, border, border-radius, box-shadow 0.3s, 0.3s, 0.3s, 0.3s ease, ease, ease, ease] `@706,570 734×600`
        - div.elementor-widget-container [overflow:hidden · transform:matrix(1, 0, 0, 1, 0, 0) · transition:background, border, border-radius, box-shadow, transform 0.3s, 0.3s, 0.3s, 0.3s, 0.4s ease, ease, ease, ease, ease] `@706,570 734×600`
          - **IFRAME** https://www.youtube.com/embed/lO_9s4rW3lA?controls=0&rel=0&playsinline=1&cc_load_policy=0&autoplay=1&enablejsapi=1&origin=https%3A%2F%2Ftrecig.com&widgetid=5&forigin=https%3A%2F%2Ftrecig.com%2Fthe-values%2F&aoriginsup=1&vf=1 Trecig   The Values `@706,570 1080×600`

### 2.3 FOOTER — LET'S TALK:

Element: `<footer class="elementor elementor-15 elementor-location-footer">` at y=1170, 1440×598px · ![section](screenshots/desktop-sec03-footer.png)

- section.elementor-section [transition:background, border, border-radius, box-shadow 0.3s, 0.3s, 0.3s, 0.3s ease, ease, ease, ease] `@0,1170 1440×598`
  - div.elementor-background-video-container [pos:absolute · z:0 · overflow:hidden · transition:opacity 1s ease] `@0,1170 1440×598`
    - **IFRAME** https://www.youtube.com/embed/OzwCnEEadts?controls=0&rel=0&playsinline=1&cc_load_policy=0&enablejsapi=1&origin=https%3A%2F%2Ftrecig.com&widgetid=3&forigin=https%3A%2F%2Ftrecig.com%2Fthe-values%2F&aoriginsup=1&vf=1 Triceg   Expertise Slider 1 `@0,1064 1440×810`
  - div.elementor-background-overlay [bg:#FFFFFF · pos:absolute · opacity:0.7 · transition:background, border-radius, opacity 0.3s, 0.3s, 0.3s ease, ease, ease] `@0,1170 1440×598` (empty/decorative)
  - div.elementor-container [flex row · margin:0px 85px 0px 85px · max-w:1270px] `@85,1170 1270×598`
    - div.elementor-column [flex row · min-h:1px] `@85,1170 1270×598`
      - div.elementor-widget-wrap [flex row wrap] `@85,1170 1270×598`
        - section.elementor-section [pad:40px 0px 40px 0px] `@85,1170 1270×467`
          - div.elementor-container [flex row · max-w:1270px] `@85,1210 1270×387`
            - div.elementor-column [flex row · min-h:1px] `@85,1210 324×387`
              - div.elementor-widget-wrap [flex row wrap · pad:10px 10px 10px 10px] `@85,1210 324×387`
                - div.elementor-widget-theme-site-logo [margin:0px 0px 20px 0px] `@95,1220 304×300`
                  - a (link→/) [inline-block] `@95,1220 400×300`
                    - **IMG** `TRECIG_Logo_Registered.png` alt="" natural 1440×1080 · inline-block · max-w:400px · overflow:clip `@95,1220 400×300`
                - div.elementor-button-wrapper [grid cols[134.078px]] `@95,1540 134×47`
                  - **A→/contact/** "LET’S TALK" — Poppins 15px/400 lh 15px · #000000 · textTransform:uppercase · textAlign:center ‖ pad:15px 30px 15px 30px · radius:30px · border:1px 1px 1px 1px solid #000000 · transition:all 0.3s ease `@95,1540 134×47`
            - div.elementor-column [flex row · min-h:1px] `@409,1210 371×387`
              - div.elementor-widget-wrap [flex row wrap · pad:10px 10px 10px 10px · margin:0px 0px 0px 50px] `@459,1210 321×387`
                - div.elementor-widget-heading [margin:0px 0px 20px 0px] `@469,1220 301×24`
                  - **H2** "LET'S TALK:" — Poppins 18px/700 lh 18px · #000000 · textTransform:uppercase ‖ inline-block `@469,1223 98×18`
                - ul.elementor-icon-list-items `@469,1264 301×52`
                  - li.elementor-icon-list-item [flex row · align:center · pad:0px 0px 5px 0px] `@469,1264 301×26`
                    - **A→tel:(254)%20338-6131** "(469)653-9009" — Poppins 14px/600 lh 21px · #CC3366 ‖ flex row · highlights: "(469)653-9009" #000000 `@469,1264 301×21`
                  - li.elementor-icon-list-item [flex row · align:center · margin:5px 0px 0px 0px] `@469,1295 301×21`
                    - **A→mailto:info@trecig.com** "info@trecig.com" — Poppins 14px/600 lh 21px · #CC3366 ‖ flex row · highlights: "info@trecig.com" #000000 `@469,1295 301×21`
            - div.elementor-column [flex row · min-h:1px] `@781,1210 310×387`
              - div.elementor-widget-wrap [flex row wrap · pad:10px 10px 10px 10px · margin:0px 50px 0px 0px] `@781,1210 260×387`
                - div.elementor-widget-heading [margin:0px 0px 20px 0px] `@791,1220 240×24`
                  - **H2** "TRECIG HQ:" — Poppins 18px/700 lh 18px · #000000 · textTransform:uppercase ‖ inline-block `@791,1223 101×18`
                - ul.elementor-icon-list-items `@791,1264 240×42`
                  - li.elementor-icon-list-item [flex row · align:center] `@791,1264 240×42`
                    - **SPAN** "Rockwall, Texas, United States" — Poppins 14px/400 lh 21px · #000000 ‖ transition:color 0.3s ease `@791,1264 110×42`
            - div.elementor-column [flex row · min-h:1px] `@1090,1210 264×387`
              - div.elementor-widget-wrap [flex row wrap · pad:10px 10px 10px 10px] `@1090,1210 264×387`
                - div.elementor-widget-heading [margin:0px 0px 20px 0px] `@1100,1220 244×24`
                  - **H2** "CONNECT WITH US:" — Poppins 18px/700 lh 18px · #000000 · textTransform:uppercase ‖ inline-block `@1100,1223 174×18`
                - **A→/the-values/** "Linkedin-in" +icon[e-font-icon-svg e-fab-linkedin-in] — -apple-system 16px/400 lh 16px · #69727D · textAlign:center ‖ flex row · bg:#000000 · radius:100% · transition:all 0.3s ease `@1100,1264 32×32`
        - section.elementor-section [pad:15px 0px 15px 0px · border:1px 0px 0px 0px solid #000000 @20%] `@85,1637 1270×131`
          - div.elementor-container [flex row · max-w:1270px] `@85,1653 1270×100`
            - div.elementor-column [flex row · min-h:1px] `@85,1653 1270×100`
              - div.elementor-widget-wrap [flex row wrap · align:center · pad:10px 10px 10px 10px] `@85,1653 1270×100`
                - div.elementor-element [margin:0px 0px 20px 0px · align-text:center] `@95,1663 1250×10`
                  - div.elementor-widget-container [margin:0px 0px -10px 0px · overflow:hidden · align-text:center · transition:background, border, border-radius, box-shadow, transform 0.3s, 0.3s, 0.3s, 0.3s, 0.4s ease, ease, ease, ease, ease] `@95,1663 1250×20`
                    - ul.elementor-icon-list-items [flex row wrap · justify:center · gap:30px · margin:0px -8px 0px -8px · align-text:center] `@87,1663 1266×20`
                      - li.elementor-icon-list-item [flex row · justify:center · align:center · margin:0px 8px 0px 8px · align-text:center] `@589,1663 89×20`
                        - **A→/privacy-policy/** "Privacy Policy" — Poppins 13px/400 lh 19.5px · #CC3366 · textAlign:center ‖ flex row · highlights: "Privacy Policy" #000000 `@589,1663 88×20`
                      - li.elementor-icon-list-item [flex row · justify:center · align:center · margin:0px 8px 0px 8px · align-text:center] `@724,1663 127×20`
                        - **A→/terms-conditions/** "Terms & Conditions" — Poppins 13px/400 lh 19.5px · #CC3366 · textAlign:center ‖ flex row · highlights: "Terms & Conditions" #000000 `@724,1663 127×20`
                - **P** "©2026 TRECIG, LLC" — Poppins 12px/400 lh 18px · #000000 · textTransform:uppercase · textAlign:center ‖ margin:0px 0px 14.4px 0px `@95,1693 1250×36`

### Floating / fixed elements
- `div.` fixed at [1348, 875, 92, 38] z-index 1000003 — ""

## 3. Header, navigation & interaction behaviour

- **atTop** `header.elementor.elementor-13.elementor-location-header` position:static top:0 height:170 bg:transparent shadow:none backdrop:none z:auto
- **afterScroll1400** `header.elementor.elementor-13.elementor-location-header` position:static top:-698 height:0 bg:transparent shadow:none backdrop:none z:auto
- **afterScroll1400** `section.elementor-section.elementor-top-section.elementor-element.elementor-elem` position:fixed top:0 height:170 bg:#FFFFFF @90% shadow:#000000 @10% 0px 0px 12px 0px backdrop:none z:9999

| Menu item | Link | Dropdown | Style | Hover change |
|---|---|---|---|---|
| HOME | / | — | Poppins 14px/400 #000000 uppercase ls normal | color: #000000 → #B22239 |
| ABOUT (current) | /about/ | The Mission (/the-mission/); The Values (/the-values/); The Legacy (/the-legacy/); The Trecig Team (/the-trecig-team/); Careers (/careers/) | Poppins 14px/400 #000000 uppercase ls normal | color: #000000 → #B22239 |
| AWARDS & RECOGNITION | /awards-recognition/ | Partnerships (/partnerships/) | Poppins 14px/400 #000000 uppercase ls normal | color: #000000 → #B22239 |
| EXPERTISE | /expertise/ | Industries We Serve (/industries-we-serve/) | Poppins 14px/400 #000000 uppercase ls normal | color: #000000 → #B22239 |
| PRESS & MEDIA | /press-media/ | — | Poppins 14px/400 #000000 uppercase ls normal | color: #000000 → #B22239 |
| CONTACT | /contact/ | — | Poppins 14px/400 #000000 uppercase ls normal | color: #000000 → #B22239 |

- **Mobile menu:** toggle `.elementor-menu-toggle` → [screenshot](screenshots/mobile-menu-open.png) · items: HOME, ABOUT, AWARDS & RECOGNITION, EXPERTISE, PRESS & MEDIA, CONTACT

### Hover states (measured by hovering in Chrome)

| Element | Text | Normal | On hover |
|---|---|---|---|
| `a.elementor-item` | HOME | color #000000 · bg transparent · radius 0px · pad 0px · border 0px #000000 · transition 0.4s | color: #000000 → #B22239; borderTopColor: #000000 → #B22239 |
| `a.elementor-item` | ABOUT | color #000000 · bg transparent · radius 0px · pad 0px · border 0px #000000 · transition 0.4s | color: #000000 → #B22239; borderTopColor: #000000 → #B22239 |
| `a.elementor-item` | CONTACT | color #000000 · bg transparent · radius 0px · pad 0px · border 0px #000000 · transition 0.4s | color: #000000 → #B22239; borderTopColor: #000000 → #B22239 |
| `a.` |  | color #CC3366 · bg transparent · radius 0px · pad 0px · border 0px #CC3366 · transition all | color: #CC3366 → #B22239; borderTopColor: #CC3366 → #B22239; childColor: #CC3366 → #B22239 |
| `a.elementor-button` | LET’S TALK | color #000000 · bg transparent · radius 30px · pad 15px 30px · border 1px #000000 · transition 0.3s | color: #000000 → #FFFFFF; borderTopColor: #000000 → #B22239 |
| `a.` | (469)653-9009 | color #CC3366 · bg transparent · radius 0px · pad 0px · border 0px #CC3366 · transition all | color: #CC3366 → #B22239; borderTopColor: #CC3366 → #B22239 |
| `a.elementor-icon` | Linkedin-in | color #69727D · bg #000000 · radius 100% · pad 0px · border 0px #69727D · transition 0.3s | color: #69727D → #B22239; backgroundColor: #000000 → #B22239; borderTopColor: #69727D → #B22239; opacity: 1 → 0.9; childColor: #69727D → #B22239 |
| `a.` | Privacy Policy | color #CC3366 · bg transparent · radius 0px · pad 0px · border 0px #CC3366 · transition all | color: #CC3366 → #B22239; borderTopColor: #CC3366 → #B22239 |

## 4. Typography & colour used on this page (weighted by amount of text / area)

| Font · weight · size / line-height | chars |
|---|---|
| Poppins | 400 | 16px / 24px | 762 |
| Poppins | 600 | 16px / 24px | 113 |
| Poppins | 400 | 14px / 20px | 58 |
| Poppins | 800 | 36px / 36px | 43 |
| Poppins | 600 | 18px / 18px | 42 |
| Poppins | 700 | 18px / 18px | 37 |
| Poppins | 400 | 13px / 19.5px | 32 |
| Poppins | 400 | 14px / 21px | 29 |
| Poppins | 600 | 14px / 21px | 28 |
| Poppins | 400 | 12px / 18px | 17 |
| -apple-system | 400 | 16px / 24px | 15 |
| -apple-system | 400 | 16px / 16px | 11 |
| Poppins | 400 | 15px / 15px | 10 |

- **Text colours:** #000000 (1108), #FFFFFF (52), #CC3366 (15), #B22239 (11), #69727D (11)
- **Background colours (by area):** #000000 (1225), #FFFFFF (1109), transparent (864)
- **Border radii:** 30px (1), 100% (1), 2px 0px 0px (1)
- **Shadows:** #000000 @10% 0px 0px 12px 0px (1) | #000000 @20% 0px 0px 5px 0px (1)
- **Mobile text styles:** Poppins | 400 | 14px / 21px (791); Poppins | 600 | 14px / 21px (141); Poppins | 800 | 28px / 28px (43); Poppins | 600 | 16px / 16px (42); Poppins | 700 | 16px / 16px (37); Poppins | 400 | 12px / 18px (32); Poppins | 400 | 10px / 15px (17); -apple-system | 400 | 16px / 24px (15); -apple-system | 400 | 16px / 16px (11); Poppins | 400 | 14px / 14px (10)

## 6. Images on the page

- `TRECIG_Logo_Registered.png` natural 1440×1080 → shown 200×150 · alt="" · https://trecig.com/wp-content/uploads/2026/10/TRECIG_Logo_Registered.png
- background on `div.`: https://cdn.ywxi.net/meter/trecig.com/205.svg?ts=1784975038086&l=en

## 7. Links on the page

- [body] "Skip to content" → /the-values/#content
- [header] "(icon/image)" → /
- [header] "HOME" → /
- [header] "ABOUT" → /about/
- [header] "The Mission" → /the-mission/
- [header] "The Values" → /the-values/
- [header] "The Legacy" → /the-legacy/
- [header] "The Trecig Team" → /the-trecig-team/
- [header] "Careers" → /careers/
- [header] "AWARDS & RECOGNITION" → /awards-recognition/
- [header] "Partnerships" → /partnerships/
- [header] "EXPERTISE" → /expertise/
- [header] "Industries We Serve" → /industries-we-serve/
- [header] "PRESS & MEDIA" → /press-media/
- [header] "CONTACT" → /contact/
- [header] "Home" → /
- [header] "About" → /about/
- [header] "Awards & Recognition" → /awards-recognition/
- [header] "Expertise" → /expertise/
- [header] "Press & Media" → /press-media/
- [header] "Contact" → /contact/
- [footer] "LET’S TALK" → /contact/
- [footer] "(469)653-9009" → tel:(254)%20338-6131
- [footer] "info@trecig.com" → mailto:info@trecig.com
- [footer] "Linkedin-in" → /the-values/ (target _blank)
- [footer] "Privacy Policy" → /privacy-policy/
- [footer] "Terms & Conditions" → /terms-conditions/

## 8. Mobile layout (390px) — condensed outline

### 8.0 header — HOME ABOUT AWARDS & RECOGNITION EXPERTISE PRESS & MEDIA CONTACT (y 0, h 170)
- section.elementor-section [bg:#FFFFFF · shadow:#000000 @10% 0px 0px 12px 0px · z:9999 · transition:background, border, border-radius, box-shadow 0.3s, 0.3s, 0.3s, 0.3s ease, ease, ease, ease] `@0,0 390×170`
  - div.elementor-container [flex row wrap · max-w:767px] `@0,0 390×170`
    - div.elementor-column [flex row · min-h:1px] `@0,0 390×170`
      - div.elementor-widget-wrap [flex row wrap] `@0,0 390×170`
        - div.elementor-container [flex row wrap · max-w:767px] `@0,0 390×170`
          - div.elementor-column [flex row · min-h:1px] `@0,0 234×170`
            - div.elementor-widget-wrap [flex row wrap · align:center · pad:10px 10px 10px 10px] `@0,0 234×170`
              - a (link→/) [inline-block · align-text:center] `@17,10 200×150`
                - **IMG** `TRECIG_Logo_Registered-1024x768.png` alt="" natural 390×292 · inline-block · max-w:200px · overflow:clip · align-text:center `@17,10 200×150`
          - div.elementor-column [flex row · min-h:1px] `@234,0 156×170`
            - div.elementor-widget-wrap [flex row wrap · align:center · pad:10px 10px 10px 10px] `@234,0 156×170`
              - div.elementor-widget-container [flex column · transition:background, border, border-radius, box-shadow, transform 0.3s, 0.3s, 0.3s, 0.3s, 0.4s ease, ease, ease, ease, ease] `@244,70 136×30`
                - nav.elementor-nav-menu--dropdown [bg:#FFFFFF · margin:16px 0px 0px 0px · pos:absolute · z:9997 · overflow:hidden · transform:matrix(1, 0, 0, 0, 0, 0) · transition:max-height, transform 0.3s, 0.3s ease, ease] `@0,116 390×0`
                  - ul.elementor-nav-menu [z:2] · pseudo:::after{{"content": "\" \"", "w": "390px", "h": "0px"}} `@0,116 390×0`
                    - **A→/** "HOME" — Poppins 14px/400 lh 20px · #000000 · textTransform:uppercase ‖ flex row · pad:10px 20px 10px 20px `@0,116 390×0`
                    - **A→/about/** "ABOUT" — Poppins 14px/400 lh 20px · #000000 · textTransform:uppercase ‖ flex row · pad:10px 20px 10px 20px `@0,116 390×0`
                    - **A→/awards-recognition/** "AWARDS & RECOGNITION" — Poppins 14px/400 lh 20px · #000000 · textTransform:uppercase ‖ flex row · pad:10px 20px 10px 20px `@0,116 390×0`
                    - **A→/expertise/** "EXPERTISE" — Poppins 14px/400 lh 20px · #000000 · textTransform:uppercase ‖ flex row · pad:10px 20px 10px 20px `@0,116 390×0`
                    - **A→/press-media/** "PRESS & MEDIA" — Poppins 14px/400 lh 20px · #000000 · textTransform:uppercase ‖ flex row · pad:10px 20px 10px 20px `@0,116 390×0`
                    - **A→/contact/** "CONTACT" — Poppins 14px/400 lh 20px · #000000 · textTransform:uppercase ‖ flex row · pad:10px 20px 10px 20px `@0,116 390×0`

### 8.1 section — THE VALUES (y 170, h 220)
- section.elementor-section [transition:background, border, border-radius, box-shadow 0.3s, 0.3s, 0.3s, 0.3s ease, ease, ease, ease] `@0,170 390×220`
  - div.elementor-background-overlay [bg:#000000 · pos:absolute · opacity:0.5 · transition:background, border-radius, opacity 0.3s, 0.3s, 0.3s ease, ease, ease] `@0,170 390×220` (empty/decorative)
  - div.elementor-container [flex row wrap · align:center · max-w:750px · min-h:220px] `@0,170 390×220`
    - div.elementor-column [flex row · min-h:1px] `@0,196 390×169`
      - div.elementor-widget-wrap [flex row wrap · pad:10px 10px 10px 10px · margin:65px 0px 0px 0px] `@0,261 390×104`
        - div.elementor-widget-heading [margin:0px 0px 20px 0px · align-text:center] `@10,271 370×29`
          - **H2** "THE VALUES" — Poppins 28px/800 lh 28px · #FFFFFF · textTransform:uppercase · textAlign:center ‖ inline-block `@112,271 167×28`
        - div.elementor-widget-heading [margin:0px 0px 20px 0px · align-text:center] `@10,320 370×15`
          - div.elementor-widget-container [margin:-10px 0px -10px 0px · align-text:center · transition:background, border, border-radius, box-shadow, transform 0.3s, 0.3s, 0.3s, 0.3s, 0.4s ease, ease, ease, ease, ease] `@10,310 370×35`
            - **H2** "TRECIG IS MORE THAN A NAME—IT’S A PROMISE." — Poppins 16px/600 lh 16px · #FFFFFF · textTransform:uppercase · textAlign:center ‖ inline-block `@10,310 370×32`

### 8.2 section — OUR VALUES: THE CORE OF OUR PURPOSE (y 390, h 870)
- section.elementor-section [bg:transparent · transition:background, border, border-radius, box-shadow 0.3s, 0.3s, 0.3s, 0.3s ease, ease, ease, ease] `@0,390 390×870`
  - div.elementor-container [flex row wrap] `@0,390 390×870`
    - div.elementor-column [flex row · min-h:1px] `@0,390 390×630`
      - div.elementor-widget-wrap [flex row wrap · align:center · pad:10px 10px 10px 10px] `@0,390 390×630`
        - div.elementor-container [flex row wrap · max-w:550px] `@10,400 370×610`
          - div.elementor-column [flex row · min-h:1px] `@10,400 370×610`
            - div.elementor-widget-wrap [flex row wrap · pad:10px 10px 10px 10px] `@10,400 370×610`
              - div.elementor-widget-heading [margin:0px 0px 20px 0px] `@20,410 350×57`
                - **H2** "OUR VALUES: THE CORE OF OUR PURPOSE" — Poppins 28px/800 lh 28px · #000000 · textTransform:uppercase ‖ inline-block · highlights: "OUR VALUES:" #B22239 `@20,410 350×56`
              - ul.elementor-icon-list-items `@20,487 350×513`
                - li.elementor-icon-list-item [flex row · justify:start · align:flex-start · pad:0px 0px 5px 0px] `@20,487 350×131`
                  - **SPAN** "Integrity Above All Else: In a world often swayed by shortcuts, we stand steadfast in our commitment to truth. Integrity isn’t just a value here—it is the be…" — Poppins 14px/400 lh 21px · #000000 ‖ pad:0px 0px 0px 5px · transition:color 0.3s ease · highlights: "Integrity Above All Else:"  600 `@55,487 315×126`
                - li.elementor-icon-list-item [flex row · justify:start · align:flex-start · pad:0px 0px 5px 0px · margin:5px 0px 0px 0px] `@20,623 350×131`
                  - **SPAN** "Empowerment Through Collaboration: Alone, we are sparks. Together, we are an unyielding blaze of innovation and progress. At TRECIG, we cultivate an environm…" — Poppins 14px/400 lh 21px · #000000 ‖ pad:0px 0px 0px 5px · transition:color 0.3s ease · highlights: "Empowerment Through Collaboration:"  600 `@55,623 315×126`
                - li.elementor-icon-list-item [flex row · justify:start · align:flex-start · pad:0px 0px 5px 0px · margin:5px 0px 0px 0px] `@20,759 350×110`
                  - **SPAN** "Relentless Pursuit of Excellence: To us, excellence is a discipline, not a destination. It is the fuel that propels us to raise the bar, challenge the status…" — Poppins 14px/400 lh 21px · #000000 ‖ pad:0px 0px 0px 5px · transition:color 0.3s ease · highlights: "Relentless Pursuit of Excellence:"  600 `@55,759 315×105`
                - li.elementor-icon-list-item [flex row · justify:start · align:flex-start · margin:5px 0px 0px 0px] `@20,874 350×126`
                  - **SPAN** "Service With Purpose: Our work is not merely about delivering results; it is about serving humanity with intention and honor. Every project, every goal, is i…" — Poppins 14px/400 lh 21px · #000000 ‖ pad:0px 0px 0px 5px · transition:color 0.3s ease · highlights: "Service With Purpose:"  600 `@55,874 315×126`
    - div.elementor-column [flex row · min-h:1px] `@0,1020 390×240`
      - div.elementor-widget-wrap [flex row wrap · align:center · transition:background, border, border-radius, box-shadow 0.3s, 0.3s, 0.3s, 0.3s ease, ease, ease, ease] `@0,1020 390×240`
        - div.elementor-widget-container [overflow:hidden · transform:matrix(1, 0, 0, 1, 0, 0) · transition:background, border, border-radius, box-shadow, transform 0.3s, 0.3s, 0.3s, 0.3s, 0.4s ease, ease, ease, ease, ease] `@0,1020 390×240`
          - **IFRAME** https://www.youtube.com/embed/lO_9s4rW3lA?controls=0&rel=0&playsinline=1&cc_load_policy=0&autoplay=1&enablejsapi=1&origin=https%3A%2F%2Ftrecig.com&widgetid=1&forigin=https%3A%2F%2Ftrecig.com%2Fthe-values%2F&aoriginsup=1&vf=1 Trecig   The Values `@0,1020 390×240`

### 8.3 footer — LET'S TALK: (y 1260, h 690)
- section.elementor-section [transition:background, border, border-radius, box-shadow 0.3s, 0.3s, 0.3s, 0.3s ease, ease, ease, ease] `@0,1260 390×690`
  - div.elementor-background-overlay [bg:#FFFFFF · pos:absolute · opacity:0.7 · transition:background, border-radius, opacity 0.3s, 0.3s, 0.3s ease, ease, ease] `@0,1260 390×690` (empty/decorative)
  - div.elementor-container [flex row wrap · max-w:767px] `@0,1260 390×690`
    - div.elementor-column [flex row · min-h:1px] `@0,1260 390×690`
      - div.elementor-widget-wrap [flex row wrap] `@0,1260 390×690`
        - section.elementor-section [pad:20px 0px 0px 0px] `@0,1260 390×612`
          - div.elementor-container [flex row wrap · max-w:767px] `@0,1280 390×592`
            - div.elementor-column [flex row · min-h:1px] `@0,1280 390×380`
              - div.elementor-widget-wrap [flex row wrap · pad:10px 10px 10px 10px] `@0,1280 390×380`
                - div.elementor-widget-theme-site-logo [margin:0px 0px 20px 0px · align-text:center] `@10,1290 370×300`
                  - a (link→/) [inline-block · align-text:center] `@10,1290 400×300`
                    - **IMG** `TRECIG_Logo_Registered-1024x768.png` alt="" natural 390×292 · inline-block · max-w:400px · overflow:clip · align-text:center `@10,1290 400×300`
                - div.elementor-button-wrapper [grid cols[119.281px] · align-text:center] `@135,1610 119×40`
                  - **A→/contact/** "LET’S TALK" — Poppins 14px/400 lh 14px · #000000 · textTransform:uppercase · textAlign:center ‖ pad:12px 25px 12px 25px · radius:30px · border:1px 1px 1px 1px solid #000000 · transition:all 0.3s ease `@135,1610 119×40`
            - div.elementor-column [flex row · min-h:1px] `@0,1660 195×116`
              - div.elementor-widget-wrap [flex row wrap · pad:10px 10px 10px 10px] `@0,1660 195×116`
                - div.elementor-widget-heading [margin:0px 0px 20px 0px] `@10,1670 175×24`
                  - **H2** "LET'S TALK:" — Poppins 16px/700 lh 16px · #000000 · textTransform:uppercase ‖ inline-block `@10,1675 87×16`
                - ul.elementor-icon-list-items `@10,1714 175×52`
                  - li.elementor-icon-list-item [flex row · align:center · pad:0px 0px 5px 0px] `@10,1714 175×26`
                    - **A→tel:(254)%20338-6131** "(469)653-9009" — Poppins 14px/600 lh 21px · #CC3366 ‖ flex row · highlights: "(469)653-9009" #000000 `@10,1714 175×21`
                  - li.elementor-icon-list-item [flex row · align:center · margin:5px 0px 0px 0px] `@10,1745 175×21`
                    - **A→mailto:info@trecig.com** "info@trecig.com" — Poppins 14px/600 lh 21px · #CC3366 ‖ flex row · highlights: "info@trecig.com" #000000 `@10,1745 175×21`
            - div.elementor-column [flex row · min-h:1px] `@195,1660 195×116`
              - div.elementor-widget-wrap [flex row wrap · pad:10px 10px 10px 10px] `@195,1660 195×116`
                - div.elementor-widget-heading [margin:0px 0px 20px 0px] `@205,1670 175×24`
                  - **H2** "TRECIG HQ:" — Poppins 16px/700 lh 16px · #000000 · textTransform:uppercase ‖ inline-block `@205,1675 90×16`
                - ul.elementor-icon-list-items `@205,1714 175×42`
                  - li.elementor-icon-list-item [flex row · align:center] `@205,1714 175×42`
                    - **SPAN** "Rockwall, Texas, United States" — Poppins 14px/400 lh 21px · #000000 ‖ transition:color 0.3s ease `@205,1714 175×42`
            - div.elementor-column [flex row · min-h:1px] `@0,1776 390×96`
              - div.elementor-widget-wrap [flex row wrap · pad:10px 10px 10px 10px] `@0,1776 390×96`
                - div.elementor-widget-heading [margin:0px 0px 20px 0px] `@10,1786 370×24`
                  - **H2** "CONNECT WITH US:" — Poppins 16px/700 lh 16px · #000000 · textTransform:uppercase ‖ inline-block `@10,1791 154×16`
                - **A→/the-values/** "Linkedin-in" +icon[e-font-icon-svg e-fab-linkedin-in] — -apple-system 16px/400 lh 16px · #69727D · textAlign:center ‖ flex row · bg:#000000 · radius:100% · transition:all 0.3s ease `@10,1830 32×32`
        - section.elementor-section [border:1px 0px 0px 0px solid #000000 @20%] `@0,1872 390×78`
          - div.elementor-container [flex row wrap · max-w:767px] `@0,1873 390×77`
            - div.elementor-column [flex row · min-h:1px] `@0,1873 390×77`
              - div.elementor-widget-wrap [flex row wrap · align:center · pad:10px 10px 10px 10px] `@0,1873 390×77`
                - div.elementor-element [margin:0px 0px 20px 0px · align-text:center] `@10,1883 370×8`
                  - div.elementor-widget-container [margin:0px 0px -10px 0px · overflow:hidden · align-text:center · transition:background, border, border-radius, box-shadow, transform 0.3s, 0.3s, 0.3s, 0.3s, 0.4s ease, ease, ease, ease, ease] `@10,1883 370×18`
                    - ul.elementor-icon-list-items [flex row wrap · justify:center · gap:30px · margin:0px -7.5px 0px -7.5px · align-text:center] `@3,1883 385×18`
                      - li.elementor-icon-list-item [flex row · justify:center · align:center · margin:0px 7.5px 0px 7.5px · align-text:center] `@73,1883 82×18`
                        - **A→/privacy-policy/** "Privacy Policy" — Poppins 12px/400 lh 18px · #CC3366 · textAlign:center ‖ flex row · highlights: "Privacy Policy" #000000 `@73,1883 81×18`
                      - li.elementor-icon-list-item [flex row · justify:center · align:center · margin:0px 7.5px 0px 7.5px · align-text:center] `@200,1883 117×18`
                        - **A→/terms-conditions/** "Terms & Conditions" — Poppins 12px/400 lh 18px · #CC3366 · textAlign:center ‖ flex row · highlights: "Terms & Conditions" #000000 `@200,1883 117×18`
                - **P** "©2026 TRECIG, LLC" — Poppins 10px/400 lh 15px · #000000 · textTransform:uppercase · textAlign:center ‖ margin:0px 0px 14.4px 0px `@10,1911 370×15`
