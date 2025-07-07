import { useGLTF } from "@react-three/drei";
import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { systems } from "./systems";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";

// --- Utility Functions ---
function findNodeByPath(root, path) {
  if (!root || !path) return root;
  const parts = path.split("/");
  let node = root;
  for (const part of parts) {
    if (!node) break;
    node = node.children.find((child) => child.name === part);
  }
  return node;
}

function cloneWithWorldTransform(node) {
  if (!node) return null;
  // 1. Clone
  const cloned = clone(node);
  // 2. Bake world matrix into local
  node.updateWorldMatrix(true, false);
  cloned.matrix.copy(node.matrixWorld);
  cloned.matrixAutoUpdate = false;
  cloned.position.set(0, 0, 0);
  cloned.rotation.set(0, 0, 0);
  cloned.scale.set(1, 1, 1);
  return cloned;
}

// --- Interactive/Highlightable Meshes ---
function InteractiveMesh({ node, highlight, onPointerOver, onPointerOut, onClick, interactive = true }) {
  useEffect(() => {
    node.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshBasicMaterial({
          color: highlight ? "white" : "#01f4cc",
          opacity: highlight ? 0.7 : 0.45,
          transparent: true,
          depthWrite: false,
        });
      }
    });
  }, [highlight, node]);

  return (
    <primitive
      object={node}
      onPointerOver={interactive ? onPointerOver : undefined}
      onPointerOut={interactive ? onPointerOut : undefined}
      onClick={interactive ? onClick : undefined}
    />
  );
}

// --- Main Exported Component ---
export default function HumanModel({
  setHoveredPart,
  setSelectedPart,
  hoveredPart,
  selectedPart,
  systemIndex,
  isUnified = false,
  highlightAsWhole = false,
  partNodeName,
  position = [0, 0, 0],
  targetPosition = [0, 0, 0],
  transitioning = false,
}) {
  const glbPath = systems.fullBody.glbPath;
  const { scene } = useGLTF(glbPath);
  useGLTF.preload(glbPath);

  const groupRef = useRef();
  const targetVec = useMemo(() => new THREE.Vector3(...targetPosition), [targetPosition]);
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.lerp(targetVec, 0.15);
    }
  });

  const canInteract = !transitioning;

  // Pre-bake all possible nodes
  const unifiedNode = useMemo(() => {
    if (!isUnified) return null;
    return cloneWithWorldTransform(scene);
  }, [scene, isUnified]);

  const systemNode = useMemo(() => {
    if (!systemIndex) return null;
    const sys = systems.fullBody.systems[systemIndex];
    if (!sys) return null;
    const node = findNodeByPath(scene, sys.groupPath);
    return cloneWithWorldTransform(node);
  }, [scene, systemIndex]);

  const partNode = useMemo(() => {
    if (!partNodeName) return null;
    // Find by searching in all systems
    for (const system of Object.values(systems.fullBody.systems)) {
      const part = system.parts && Object.values(system.parts).find((p) => p.nodeName === partNodeName);
      if (part) {
        const node = findNodeByPath(scene, part.nodeName);
        return cloneWithWorldTransform(node);
      }
    }
    // Fallback: try path directly
    const node = findNodeByPath(scene, partNodeName);
    return cloneWithWorldTransform(node);
  }, [scene, partNodeName]);

  const partMeshes = useMemo(() => {
    if (!systemIndex || partNodeName) return [];
    const parts = systems.fullBody.systems[systemIndex]?.parts || {};
    return Object.entries(parts).map(([key, part]) => {
      const node = findNodeByPath(scene, part.nodeName);
      return { key, node: cloneWithWorldTransform(node) };
    });
  }, [scene, systemIndex, partNodeName]);

  // Rendering (all nodes will be at correct position in world)
  return (
    <group ref={groupRef} position={position} scale={[6, 6, 6]}>
      {/* Unified (full body) view */}
      {isUnified && unifiedNode && (
        <InteractiveMesh
          node={unifiedNode}
          highlight={hoveredPart === "all"}
          onPointerOver={() => canInteract && setHoveredPart("all")}
          onPointerOut={() => canInteract && setHoveredPart(null)}
          onClick={() => canInteract && setSelectedPart(null)}
          interactive={true}
        />
      )}

      {/* Expanded view: all systems, each clickable */}
      {highlightAsWhole && systemIndex && systemNode && (
        <InteractiveMesh
          node={systemNode}
          highlight={hoveredPart === systemIndex}
          onPointerOver={() => canInteract && setHoveredPart(systemIndex)}
          onPointerOut={() => canInteract && setHoveredPart(null)}
          onClick={() => canInteract && setSelectedPart && setSelectedPart(null)}
          interactive={true}
        />
      )}

      {/* Focused system view: show full system as background, clickable overlays for parts */}
      {!isUnified && !highlightAsWhole && systemIndex && systemNode && (
        <>
          {/* Full system as background, not interactive */}
          <InteractiveMesh
            node={systemNode}
            highlight={false}
            interactive={false}
          />
          {/* Only clickable parts, correctly placed */}
          {partMeshes.map(({ key, node }) =>
            node ? (
              <InteractiveMesh
                key={key}
                node={node}
                highlight={hoveredPart === key}
                onPointerOver={() => canInteract && setHoveredPart(key)}
                onPointerOut={() => canInteract && setHoveredPart(null)}
                onClick={() => canInteract && setSelectedPart({ name: key })}
                interactive={true}
              />
            ) : null
          )}
        </>
      )}

      {/* Focused part view: only the selected part */}
      {/* Focused part view: only the selected part, not hoverable/clickable */}
{partNodeName && partNode && (
  <InteractiveMesh
    node={partNode}
    highlight={false}
    interactive={false}
  />
)}
    </group>
  );
}