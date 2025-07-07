// MatrixParticles.js
import { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const glyphs = '|';

export default function MatrixParticles({ count = 150, velocityFactor = 0.01, despawnRate = 1 }) {
  const glyphRefs = useRef([]);
  const trailRefs = useRef([]);
  const bounds = 52;
  const quarterY = -bounds / 4;
  const minY = -bounds / 2;
  const maxY = bounds / 2;

  const initialGlyphs = useMemo(() => {
    return Array.from({ length: count }, () => {
      const x = (Math.random() - 0.5) * bounds;
      const y = Math.random() * bounds;
      const z = (Math.random() - 0.5) * bounds;
      const velocity = velocityFactor * (0.5 + Math.random());
      const char = glyphs[Math.floor(Math.random() * glyphs.length)];
      return { x, y, z, velocity, char };
    });
  }, [count, velocityFactor]);

  // Track elapsed time for despawn interval
  const [elapsed, setElapsed] = useState(0);

  useFrame((state, delta) => {
    setElapsed((prev) => prev + delta);

    glyphRefs.current.forEach((ref, i) => {
      if (!ref) return;

      const trail = trailRefs.current[i];
      const glyphData = initialGlyphs[i];

      ref.position.y -= glyphData.velocity;
      if (trail) {
        trail.position.set(ref.position.x, ref.position.y + 1.2, ref.position.z);
        trail.scale.set(0.1, 1.5, 0.1);
      }

      const y = ref.position.y;

      // Despawn immediately if it hits the bottom (no animation)
      if (y < minY) {
        respawnGlyph(ref, trail, glyphData, false);
      }
    });

    // Despawn one random glyph every second if eligible
    if (elapsed >= 1 / despawnRate) {
      setElapsed(0);
      const eligible = glyphRefs.current
        .map((ref, i) => ({ ref, trail: trailRefs.current[i], data: initialGlyphs[i], index: i }))
        .filter(({ ref }) => ref && ref.position.y < quarterY);

      if (eligible.length > 0) {
        const randomIndex = Math.floor(Math.random() * eligible.length);
        const { ref, trail, data } = eligible[randomIndex];
        respawnGlyph(ref, trail, data, true);
      }
    }
  });

  const respawnGlyph = (ref, trail, glyphData, withFlash) => {
    if (!ref) return;

    if (withFlash && trail) {
      trail.scale.set(0.3, 2.5, 0.3);
      trail.material.opacity = 1.0;
      setTimeout(() => {
        trail.scale.set(0.1, 1.5, 0.1);
        trail.material.opacity = 0.8;
      }, 100);
    }

    ref.position.x = (Math.random() - 0.5) * bounds;
    ref.position.y = maxY * Math.random();
    ref.position.z = (Math.random() - 0.5) * bounds;
    const newChar = glyphs[Math.floor(Math.random() * glyphs.length)];
    glyphData.char = newChar;
    ref.text = newChar;
  };

  return (
    <>
      {initialGlyphs.map((glyph, i) => (
        <>
          <Text
            key={`glyph-${i}`}
            ref={(el) => (glyphRefs.current[i] = el)}
            position={[glyph.x, glyph.y, glyph.z]}
            fontSize={0.2}
            color="#01f4cc"
            outlineColor="#01f4cc"
            outlineWidth={0.01}
            text={glyph.char}
          />
          <mesh
            key={`trail-${i}`}
            ref={(el) => (trailRefs.current[i] = el)}
            position={[glyph.x, glyph.y + 1.2, glyph.z]}
          >
            <cylinderGeometry args={[0.05, 0.05, 1.5, 8]} />
            <meshBasicMaterial color="#01f4cc" transparent opacity={0.8} />
          </mesh>
        </>
      ))}
    </>
  );
} 