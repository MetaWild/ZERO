import React, { useState, useEffect } from "react";

export function IntroModule({ onContinue }) {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "auto",
        overflow: "hidden",
      }}
    >
      <button
        className="zero-button"
        style={{
          background: "none",
          border: "none",
          padding: 0,
          outline: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          width: "min(110vw, 950px)",
          height: "min(110vw, 950px)",
          maxWidth: "120vw",
          maxHeight: "120vh",
          transition: "filter 0.22s cubic-bezier(.57,.07,.51,1.06)",
          filter: hovered
            ? "drop-shadow(0 0 54px #fff9)"
            : "drop-shadow(0 0 34px #10ffe470)",
        }}
        onClick={onContinue}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Continue"
      >
        {/* The Zero PNG as the border */}
        <img
          src={hovered ? "/ZeroWhite.png" : "/ZeroTeal.png"}
          alt="Zero border"
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            position: "absolute",
            left: 0,
            top: 0,
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
        {/* Text content absolutely centered inside the zero */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "57%",
            maxWidth: "clamp(135px, 65vw, 700px)",
            padding: "clamp(2px, 3vw, 28px) clamp(3px, 3vw, 18px)",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#fff",
            pointerEvents: "none",
            textShadow: hovered
              ? "0 0 9px #fff, 0 0 3px #0af7b7"
              : "0 0 6px #10ffe4a0",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              fontFamily: "'Merriweather', serif",
              fontWeight: 900,
              fontSize: "clamp(.3rem, 2vw, 1.25rem)",
              color: hovered ? "#fff" : "#13ffe0",
              letterSpacing: ".03em",
              textAlign: "center",
              marginBottom: "clamp(3px, 0.5vw, 10px)",
              transition: "color 0.22s cubic-bezier(.6,0,.67,1.11)",
              textShadow: hovered ? "0 2px 10px #fff" : "0 2px 10px #13f5d960",
            }}
          >
            ZERO to ONE
          </div>
          <div
            style={{
              fontFamily: "'Merriweather', serif",
              fontWeight: 700,
              fontSize: "clamp(0.18rem, 1.35vw, 0.98rem)",
              color: hovered ? "#fff" : "#2eeed9",
              textAlign: "center",
              marginBottom: "clamp(7px, 1vw, 16px)",
              letterSpacing: "0.02em",
              transition: "color 0.22s cubic-bezier(.6,0,.67,1.11)",
            }}
          >
            <span>Social Philosophy</span>
          </div>
          <div
            style={{
              color: "#fff",
              fontSize: "clamp(0.1rem, 1vw, 0.77rem)",
              fontWeight: 500,
              marginBottom: 2,
              lineHeight: 1.48,
              textAlign: "left",
              fontFamily: "Inter, sans-serif",
              width: "100%",
              textShadow: "0 1.5px 5px #09fff755",
              boxSizing: "border-box",
            }}
          >
            <p>
              As humans, we are the Eternal Observer incarnate. Consider this:
              we are neither our body nor even our thoughts—we are instead the
              observer of our body and our thoughts. We embody pure awareness.
              The next time you experience a thought, reflect by asking
              yourself, "How was I aware of that thought?" Thoughts are
              material, but awareness is transcendent. Thus arises the question:
              how do we increase our awareness?
            </p>

            <p>
              Within the Eternal Observer, there exists a hierarchy—or
              dimensionality—evident throughout nature. To transcend dimensions,
              we must elevate our awareness. Just as a team has a leader who
              possesses the highest awareness within the team, so too does the
              Eternal Observer encompass higher beings who possess greater
              awareness. To elevate our own awareness, we must confront and
              answer the fundamental questions that persistently elude us. These
              questions probe into the very nature of our soul—the Eternal One.
            </p>

            <p>
              To answer these profound questions, we must unify as one entity,
              The Collective, and establish an ideal hierarchy. Fortunately,
              since the Eternal One encompasses all—including ourselves and
              nature—it has left clues within nature to guide us toward this
              ideal hierarchy. The Human Body represents nature's most optimal
              hierarchy for atoms in the universe, making it the perfect
              blueprint for The Collective. ZERO, modeled after the Human Body,
              which itself mirrors The Soul, should therefore aim for the
              closest possible one-to-one correspondence.
            </p>

            <p>
              The fundamental nature of our soul is captured by the following
              existential questions, each having direct correspondence within
              language, body, and network, as detailed below:
            </p>

            <ol
              style={{
                margin: "0 0 0 1.5em",
                padding: 0,
                fontSize: "clamp(0.12rem, 1vw, 0.85rem)",
                lineHeight: 1.44,
              }}
            >
              <li>
                <strong>Am I?</strong> – Existence – The Body – ZERO
              </li>
              <li>
                <strong>Who am I?</strong> – Identity – Lymphatic System – ZID
              </li>
              <li>
                <strong>What am I?</strong> – Essence – Skeletal System – ZOS
              </li>
              <li>
                <strong>Where am I?</strong> – Context – Integumentary System –
                ZNS
              </li>
              <li>
                <strong>Why am I?</strong> – Purpose – Cardiovascular System –
                ZXP
              </li>
              <li>
                <strong>When am I?</strong> – Continuity – Reproductive System –
                ZSpace
              </li>
              <li>
                <strong>How am I?</strong> – Condition – Respiratory System –
                ZBI
              </li>
              <li>
                <strong>To where am I going?</strong> – Destiny – Muscular
                System – ZChain
              </li>
              <li>
                <strong>Do I have choice?</strong> – Agency – Nervous System –
                ZDAO
              </li>
              <li>
                <strong>Am I enough?</strong> – Integration – Digestive System –
                ZODES
              </li>
            </ol>
          </div>
          <div
            style={{
              fontSize: "clamp(0.85rem, 1.2vw, 1.05rem)",
              marginTop: 8,
              fontFamily: "Inter, sans-serif",
              color: hovered ? "#fff" : "#09ffe4",
              opacity: hovered ? 1 : 0.87,
              textShadow: hovered ? "0 0 8px #fff" : "0 0 5px #10ffe460",
              letterSpacing: "0.025em",
            }}
          >
            (Continue)
          </div>
        </div>
      </button>
      {/* Import fonts for style */}
      <link
        href="https://fonts.googleapis.com/css2?family=Merriweather:wght@700;900&display=swap"
        rel="stylesheet"
      />
    </div>
  );
}
