import React, { useState, useEffect } from "react";
import { systems } from "./systems";
import { color } from "three/tsl";

function getPartMetadata(key) {
  if (!key) return null;
  if (key === "all") return systems.fullBody;
  for (const system of Object.values(systems.fullBody.systems)) {
    if (system.parts && system.parts[key]) return system.parts[key];
  }
  if (systems.fullBody.systems[key]) return systems.fullBody.systems[key];
  return null;
}

function getMetaByLabel(label) {
  if (!label) return null;
  if (label === systems.fullBody.label) return systems.fullBody;
  for (const sys of Object.values(systems.fullBody.systems)) {
    if (sys.label === label) return sys;
    for (const part of Object.values(sys.parts || {})) {
      if (part.label === label) return part;
    }
  }
  return null;
}

// Customize your intro
const INTRO_META = {
  label: "ZERO Citizens (The Collective)",
  title: "The Soul",
  description: [
    "ZERO Citizens are The Eternal Layer of The Network. Just as The Soul is the way, the truth and the light of the body, ZERO Citizens are the the way, the truth and the light of The Network.",
    "Just as The Soul is the eternal observer of The Body, ZERO Citizens are the eternal observers of The Network.",
    "Just as The Body without The Soul is but a vessel — hollow and aimless, ZERO without its Citizens is but a framework - hollow and aimless.",
    //"Explore the major systems and discover how each aspect of the human body corresponds to an aspect of the ZERO network.",
    //"Click a system to zoom in, then click a part to learn its unique role. ",
    //"Use the info button (top right) at any stage for details about your current selection."
  ],
};

export default function UIOverlay({
  hoveredPart,
  selectedPart,
  zoomDone,
  setSelectedPart,
  focusedSystem,
  setFocusedSystem,
  setSplitView,
  stage,
  setStage,
  resetAll,
  lastSelectedLabel,
  setLastSelectedLabel,
  setLabelHistory,
  setHoveredPart,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [hamburgerHover, setHamburgerHover] = useState(false);
  const [isZDAO2D, setIsZDAO2D] = useState(false);

  const hoveredMeta = hoveredPart ? getPartMetadata(hoveredPart) : null;
  const selectedMeta = selectedPart ? getPartMetadata(selectedPart) : null;
  const isZDAOFocused = stage === "focused" && focusedSystem === "nervous";

  // Modal content always matches what's shown in the top-center label
  let modalMeta = null;
  if (stage === "full") {
    modalMeta = INTRO_META;
  } else if (lastSelectedLabel) {
    modalMeta = getMetaByLabel(lastSelectedLabel);
  }
  if (!modalMeta) modalMeta = systems.fullBody;

  useEffect(() => {
    if (!modalOpen) setIsHovered(false);
  }, [modalOpen, stage, resetAll]);

  useEffect(() => {
    if (!isZDAOFocused && isZDAO2D) setIsZDAO2D(false);
  }, [isZDAOFocused]);

  // When going back, always close modal and update label as needed
  function handleBack() {
    setModalOpen(false);

    setLabelHistory((prev) => {
      const newHistory = [...prev];
      newHistory.pop();
      const previous = newHistory[newHistory.length - 1] || null;
      if (selectedPart) {
        let parentSystemLabel = null;
        for (const [sysKey, sys] of Object.entries(systems.fullBody.systems)) {
          if (sys.parts && sys.parts[selectedPart.name]) {
            parentSystemLabel = sys.label;
            break;
          }
        }
        setLastSelectedLabel(parentSystemLabel || systems.fullBody.label);
      } else if (stage === "focused" && !selectedPart) {
        setLastSelectedLabel(systems.fullBody.label);
      } else if (stage === "expanded") {
        setLastSelectedLabel(null);
      } else {
        setLastSelectedLabel(previous);
      }
      return newHistory;
    });

    if (selectedPart) {
      setSelectedPart(null);
      if (typeof setHoveredPart === "function") setHoveredPart(null);
    } else if (stage === "focused") {
      setFocusedSystem(null);
      setStage("expanded");
      if (typeof setHoveredPart === "function") setHoveredPart(null);
    } else if (stage === "expanded") {
      resetAll();
      if (typeof setHoveredPart === "function") setHoveredPart(null);
    }
  }

  // Hamburger shows everywhere except when modal is open
  const showHamburger = !modalOpen;

  return (
    <>
      {/* Hamburger menu button (4 dots, with spread animation on hover/click) */}
      {showHamburger && (
        <button
          onClick={() => setModalOpen(true)}
          onMouseEnter={() => setHamburgerHover(true)}
          onMouseLeave={() => setHamburgerHover(false)}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            width: 40,
            height: 40,
            background: "rgba(0,0,0,1)",
            border: "rgba(0,0,0,1)",
            zIndex: 2002,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            padding: 0,
            outline: "none",
          }}
          aria-label="Show Info"
        >
          <div
            style={{
              width: 28,
              height: 28,
              position: "relative",
            }}
          >
            {/* Dots */}
            <span
              style={{
                position: "absolute",
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#01f4cc",
                left: hamburgerHover || modalOpen ? 3 : 4,
                top: hamburgerHover || modalOpen ? 3 : 4,
                transition: "all 0.28s cubic-bezier(.9,0,.45,1)",
              }}
            />
            <span
              style={{
                position: "absolute",
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#01f4cc",
                right: hamburgerHover || modalOpen ? 3 : 4,
                top: hamburgerHover || modalOpen ? 3 : 4,
                transition: "all 0.28s cubic-bezier(.9,0,.45,1)",
              }}
            />
            <span
              style={{
                position: "absolute",
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#01f4cc",
                left: hamburgerHover || modalOpen ? 3 : 4,
                bottom: hamburgerHover || modalOpen ? 3 : 4,
                transition: "all 0.28s cubic-bezier(.9,0,.45,1)",
              }}
            />
            <span
              style={{
                position: "absolute",
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#01f4cc",
                right: hamburgerHover || modalOpen ? 3 : 4,
                bottom: hamburgerHover || modalOpen ? 3 : 4,
                transition: "all 0.28s cubic-bezier(.9,0,.45,1)",
              }}
            />
          </div>
        </button>
      )}

      {/* Modal with sliding animation and card style */}
      <div
        className="animated-modal-card"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "110vh",
          width: "clamp(140px, 75vw, 750px)",
          zIndex: 3000,
          transform: modalOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.38s cubic-bezier(.62,.1,.63,1.12)",
          pointerEvents: modalOpen ? "auto" : "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          background: "none", // Background handled by card for effect
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
            padding:
              "clamp(19px, 4vw, 44px) clamp(11px, 3vw, 42px) clamp(10px, 2.8vw, 38px) clamp(10px, 2.5vw, 38px)",
            background: "rgba(0,0,0,0.96)",
            borderRadius: "clamp(12px, 2vw, 24px) 0 0 clamp(12px, 2vw, 24px)",
            boxShadow: "0 10px 54px 0 #15ffd740, 0 2.5px 16px 0 #01f4cc44",
            overflow: "hidden",
            zIndex: 2,
            marginLeft: "auto",
            marginRight: 0,
            minWidth: "clamp(180px, 36vw, 370px)",
            maxWidth: "clamp(220px, 43vw, 450px)",
            boxSizing: "border-box",
          }}
        >
          {/* Animated Border */}
          <div className="modal-animated-border" />

          <button
            onClick={() => setModalOpen(false)}
            style={{
              position: "absolute",
              top: 18,
              right: 20,
              background: "transparent",
              color: "#01f4cc",
              border: "none",
              fontSize: "2.2rem",
              cursor: "pointer",
              zIndex: 10,
            }}
            aria-label="Close Info"
          >
            ×
          </button>
          <div
            style={{
              marginTop: "clamp(14px, 2.7vw, 34px)",
              fontSize: "clamp(0.75rem, 2.5vw, 1.4rem)",
              fontFamily: "sans-serif",
              fontWeight: 600,
              color: "rgb(236, 236, 238)",
              textAlign: "left",
              letterSpacing: "0.02em",
              zIndex: 2,
              position: "relative",
              textShadow: "0 1.5px 4px #01f4cc50",
            }}
          >
            {modalMeta?.label}
          </div>
          <div
            style={{
              margin: "clamp(10px, 2vw, 30px) 0 0 0",
              fontSize: "clamp(.7rem, 2vw, 1.05rem)",
              fontFamily: "sans-serif",
              color: "#51ffd2",
              fontWeight: 500,
              textAlign: "left",
              zIndex: 2,
              position: "relative",
              textShadow: "0 1.5px 4px #15ffd740",
            }}
          >
            {modalMeta?.title}
          </div>
          <div
            style={{
              margin: "clamp(10px, 1.5vw, 24px) 0 0 0",
              fontSize: "clamp(0.66rem, 1.4vw, .85rem)",
              fontFamily: "sans-serif",
              color: "#eafff9",
              fontWeight: 500,
              lineHeight: 1.5,
              textAlign: "left",
              zIndex: 2,
              position: "relative",
              textShadow: "0 1.5px 4px #01f4cc40",
            }}
          >
            {Array.isArray(modalMeta?.description) ? (
              <ul
                style={{
                  margin: 0,
                  paddingLeft: 0,
                  listStyle: "none",
                }}
              >
                {modalMeta.description.map((desc, i) => (
                  <li
                    key={i}
                    style={{
                      marginBottom: "clamp(5px, 0.7vw, 11px)",
                      display: "flex",
                      alignItems: "start",
                      fontSize: "inherit",
                    }}
                  >
                    <span
                      style={{
                        marginRight: 10,
                        fontWeight: "bold",
                        color: "#01f4cc",
                      }}
                    >
                      -
                    </span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            ) : (
              modalMeta?.description
            )}
          </div>
        </div>

        {/* Animated border styles (one time only is fine) */}
        <style>{`
    .animated-modal-card {
      background: none;
    }
    .animated-modal-card .modal-animated-border {
      content: '';
      pointer-events: none;
      position: absolute;
      inset: 0px;
      border-radius: 28px 0 0 28px;
      z-index: 1;
      background: conic-gradient(
        from 0deg,
        #01f4cc,
        #28ffe4,
        #01f4cc,
        #0af7b7,
        #01f4cc
      );
      filter: blur(1.1px);
      mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      mask-composite: exclude;
      -webkit-mask-composite: xor;
      animation: border-rotate 2.5s linear infinite;
      opacity: 0.8;
    }
    @keyframes border-rotate {
      0%   { transform: rotate(0deg);}
      100% { transform: rotate(360deg);}
    }
  `}</style>
      </div>

      {/* Overlay UI */}
      {lastSelectedLabel && (
        <div
          style={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "sans-serif",
            fontWeight: 500,
            color: "rgb(236, 236, 238)",
            fontSize: "1.25rem",
            background: "rgba(0, 0, 0, 0.5)",
            padding: "6px 12px",
            borderRadius: 6,
            pointerEvents: "none",
            zIndex: 999,
          }}
        >
          {lastSelectedLabel}
        </div>
      )}

      {hoveredMeta && !selectedPart && (
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 40,
            zIndex: 1002,
            pointerEvents: "none", // so you don't block hovers
          }}
        >
          <div className="animated-hover-card">
            <div style={{ position: "relative", zIndex: 2 }}>
              <strong style={{ color: "#01f4cc" }}>{hoveredMeta.label}</strong>
              <br />
              {hoveredMeta.title}
            </div>
          </div>
          {/* --- STYLE INJECTION (one time per app, safe here) --- */}
          <style>{`
      .animated-hover-card {
        min-width: 180px;
        min-height: 54px;
        background: rgba(0, 0, 0, 0.93);
        color: rgb(236, 236, 238);
        border-radius: 18px;
        padding: 14px 26px;
        font-size: 1.1rem;
        box-shadow:
          0 4px 32px 0 #13f5d966,
          0 1.5px 6px 0 #2af2dd44;
        position: relative;
        overflow: visible;
      }
      .animated-hover-card::before {
        content: '';
        position: absolute;
        inset: -2.5px;
        border-radius: 21px;
        padding: 0;
        z-index: 1;
        background: conic-gradient(
          from 0deg,
          #01f4cc,
          #28ffe4,
          #01f4cc,
          #0af7b7,
          #01f4cc
        );
        filter: blur(0.8px);
        mask:
          linear-gradient(#fff 0 0) content-box,
          linear-gradient(#fff 0 0);
        -webkit-mask:
          linear-gradient(#fff 0 0) content-box,
          linear-gradient(#fff 0 0);
        mask-composite: exclude;
        -webkit-mask-composite: xor;
        animation: border-rotate 2.2s linear infinite;
      }
      @keyframes border-rotate {
        0%   { transform: rotate(0deg);}
        100% { transform: rotate(360deg);}
      }
    `}</style>
        </div>
      )}

      {(stage === "expanded" || stage === "focused") && (
        <button
          onClick={handleBack}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            background: "transparent",
            color: isHovered ? "white" : "#01f4cc",
            border: "none",
            fontSize: "2.0rem",
            cursor: "pointer",
            zIndex: 1000,
          }}
        >
          ←
        </button>
      )}

      {selectedMeta && zoomDone && (
        <>
          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              color: "#01f4cc",
              fontSize: "1.2rem",
            }}
          >
            {selectedMeta.label}
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 20,
              right: 20,
              background: "transparent",
              color: "#01f4cc",
              padding: "15px",
              borderRadius: 8,
              maxWidth: "300px",
              border: ".5px solid #01f4cc",
            }}
          >
            <h3>{selectedMeta.title}</h3>
            <p>{selectedMeta.description}</p>
          </div>
        </>
      )}

      {isZDAOFocused && (
        <div
          style={{
            position: "absolute",
            top: 64,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2020,
            display: "flex",
            alignItems: "center",
            background: "rgba(0,0,0,0.7)",
            padding: "7px 28px 7px 20px",
            borderRadius: 16,
            boxShadow: "0 2px 18px #01f4cc40",
            gap: 13,
            minWidth: 246,
            fontFamily: "inherit",
          }}
        >
          <span
            style={{
              color: "#01f4cc",
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: "0.01em",
            }}
          >
            View Mode:
          </span>
          {/* Slider toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              fontFamily: "inherit",
            }}
          >
            <span
              style={{
                color: !isZDAO2D ? "#01f4cc" : "#eee",
                fontWeight: !isZDAO2D ? 700 : 400,
                fontSize: 15,
                transition: "color 0.19s",
              }}
            >
              3D
            </span>
            {/* Custom slider */}
            <div
              onClick={() => setIsZDAO2D((v) => !v)}
              tabIndex={0}
              aria-label="Toggle 3D/2D view"
              onKeyPress={(e) =>
                (e.key === " " || e.key === "Enter") && setIsZDAO2D((v) => !v)
              }
              style={{
                width: 44,
                height: 22,
                background: isZDAO2D
                  ? "linear-gradient(90deg, #13ffe0 0%, #01f4cc 100%)"
                  : "linear-gradient(90deg, #242c32 0%, #1a2227 100%)",
                borderRadius: 18,
                border: `2.2px solid #01f4cc`,
                cursor: "pointer",
                position: "relative",
                boxShadow: isZDAO2D
                  ? "0 0 9px 1.7px #13ffe052"
                  : "0 0 7px 1px #222",
                outline: "none",
                display: "flex",
                alignItems: "center",
                transition: "background 0.23s, box-shadow 0.22s, border 0.17s",
              }}
              role="switch"
              aria-checked={isZDAO2D}
            >
              <div
                style={{
                  width: 17,
                  height: 17,
                  borderRadius: "50%",
                  background: isZDAO2D
                    ? "radial-gradient(circle, #fff 65%, #01f4cc 100%)"
                    : "radial-gradient(circle, #01f4cc 40%, #222 100%)",
                  boxShadow: isZDAO2D
                    ? "0 1px 10px 0 #12ffe8bb"
                    : "0 0px 5px 0 #0af7b770",
                  position: "absolute",
                  top: 1.8,
                  left: isZDAO2D ? 23 : 3,
                  transition:
                    "left 0.24s cubic-bezier(.77,0,.53,1.12), background 0.22s, box-shadow 0.22s",
                }}
              />
            </div>
            <span
              style={{
                color: isZDAO2D ? "#01f4cc" : "#eee",
                fontWeight: isZDAO2D ? 700 : 400,
                fontSize: 15,
                transition: "color 0.19s",
              }}
            >
              2D
            </span>
          </div>
        </div>
      )}

      {/* If 2D mode and focused on ZDAO, show 2D diagram */}
      {isZDAOFocused && isZDAO2D && (
        <div
          style={{
            position: "absolute",
            top: 140,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1010,
            background: "rgba(0,0,0,0.93)",
            borderRadius: 22,
            padding: "18px 22px",
            boxShadow: "0 6px 28px #01f4cc30",
            maxWidth: "82vw",
            width: 650,
            textAlign: "center",
            border: "1.5px solid #01f4cc",
          }}
        >
          {/* Use an <img> if you exported as PNG/SVG to public/; or inline SVG/React component! */}
          <img
            src="/ZDAO_Tree.png"
            alt="ZDAO 2D Diagram"
            style={{
              width: "60%",
              maxWidth: 500,
              margin: "0 auto",
              display: "block",
              height: "60%",
              maxHeight: 700,
            }}
          />
          {/* <ZDAO2DDiagram style={{ width: "100%", maxWidth: 500 }} /> */}
          <div
            style={{
              color: "#01f4cc",
              marginTop: 10,
              fontSize: 14,
              opacity: 0.84,
            }}
          >
            {/* Optional: a little caption, or nothing */}
            <em>ZDAO Structure - 2D View</em>
          </div>
        </div>
      )}
    </>
  );
}
