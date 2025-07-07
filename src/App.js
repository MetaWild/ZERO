import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState, useRef, useEffect, useCallback } from "react";
import { IntroModule } from "./Components/IntroModule";
import HumanModel from "./Components/HumanModel";
import MatrixParticles from "./Components/MatrixParticles";
import UIOverlay from "./Components/UIOverlay";
import { systems } from "./Components/systems";
import * as THREE from "three";

const zoomTargets = {

  head: new THREE.Vector3(0, 5.75, -2.5),
  lefthand: new THREE.Vector3(4, -1, -2.5),
  righthand: new THREE.Vector3(-4, -1, -2.5),
  feet: new THREE.Vector3(0, -6.5, -2.5),
  ZCon: new THREE.Vector3(0, 3, 0),
  ZLeft: new THREE.Vector3(0, 5, 0),
  ZRight: new THREE.Vector3(0, 5, 0),
};

function CameraController({
  stage,
  selectedPart,
  zoomDone,
  setZoomDone,
  returning,
  setReturning,
  setSelectedPart,
  controlsRef,
  setTransitioning,
}) {
  const { camera } = useThree();
  const controls = controlsRef.current;
  const animatingRef = useRef(false);
  const cameraTargetPos = useRef(new THREE.Vector3());
  const controlsTargetPos = useRef(new THREE.Vector3());

  const initialView = {
    full: {
      cameraPos: new THREE.Vector3(0, 0, 20),
      target: new THREE.Vector3(0, 0, 0),
    },
    expanded: {
      cameraPos: new THREE.Vector3(0, 0, 40),
      target: new THREE.Vector3(0, 0, 0),
    },
    focused: {
      cameraPos: new THREE.Vector3(0, 0, 20),
      target: new THREE.Vector3(0, 0, 0),
    },
  };

  const getPositions = useCallback(() => {
    if (selectedPart?.name && zoomTargets[selectedPart.name]) {
      const target = zoomTargets[selectedPart.name];
      return {
        cameraPos: target.clone().add(new THREE.Vector3(0, 0, 8)), // or whatever offset you want
        target: target.clone(),
      };
    } else {
      return initialView[stage] || initialView.full;
    }
  }, [selectedPart, stage]);

  const startAnimation = useCallback(() => {
    const positions = getPositions();
    cameraTargetPos.current.copy(positions.cameraPos);
    controlsTargetPos.current.copy(positions.target);
    animatingRef.current = true;
    setTransitioning(true); // mark as animating globally!
    setZoomDone(false);
    if (controls) controls.enabled = false;
  }, [getPositions, setZoomDone, setTransitioning, controls]);

  useEffect(() => {
    startAnimation();
  }, [selectedPart, stage, returning, startAnimation]);

  useFrame(() => {
    if (!animatingRef.current || !controls) return;

    const lerpFactor = 0.15;

    camera.position.lerp(cameraTargetPos.current, lerpFactor);
    controls.target.lerp(controlsTargetPos.current, lerpFactor);
    controls.update();

    const cameraReached =
      camera.position.distanceTo(cameraTargetPos.current) < 0.01;
    const targetReached =
      controls.target.distanceTo(controlsTargetPos.current) < 0.01;

    if (cameraReached && targetReached) {
      camera.position.copy(cameraTargetPos.current);
      controls.target.copy(controlsTargetPos.current); // <--- This is key!
      controls.update();
      animatingRef.current = false;
      setZoomDone(true);
      setTransitioning(false);
      if (controls) controls.enabled = true;
      if (returning) {
        setReturning(false);
        setSelectedPart(null);
      }
    }
  });

  return null;
}

function App() {
  const [selectedPart, setSelectedPart] = useState(null);
  const [hoveredPart, setHoveredPart] = useState(null);
  const [zoomDone, setZoomDone] = useState(false);
  const [returning, setReturning] = useState(false);
  const [splitView, setSplitView] = useState(false);
  const [stage, setStage] = useState("full");
  const [focusedSystem, setFocusedSystem] = useState(null);
  const [lastSelectedLabel, setLastSelectedLabel] = useState(null);
  const [labelHistory, setLabelHistory] = useState([]);
  const [transitioning, setTransitioning] = useState(false); // new state
  const [showIntro, setShowIntro] = useState(true);
  const controlsRef = useRef();

  function resetAll() {
    setSelectedPart(null);
    setFocusedSystem(null);
    setSplitView(false);
    setZoomDone(false);
    setReturning(false);
    setStage("full");
  }

  useEffect(() => {
    setHoveredPart(null);
  }, [stage]);

  function getLabel(partKey) {
    if (partKey === "all") return systems.fullBody.label;
    for (const system of Object.values(systems.fullBody.systems)) {
      if (system.parts[partKey]) return system.parts[partKey].label;
    }
    if (systems.fullBody.systems[partKey])
      return systems.fullBody.systems[partKey].label;
    return null;
  }

  return (
    <>
      {showIntro && <IntroModule onContinue={() => setShowIntro(false)} />}
      {!showIntro && (
        <>
          <Canvas
            camera={{
              position: stage === "expanded" ? [0, 0, 40] : [0, 0, 20],
              fov: 50,
            }}
            style={{ background: "black", height: "100vh", width: "100vw" }}
          >
            <OrbitControls
              ref={controlsRef}
              enableZoom={false}
              enablePan={false}
              enableRotate={true}
              enabled={!transitioning}
              makeDefault
            />

            <MatrixParticles count={75} velocityFactor={0.5} despawnRate={10} />
            <ambientLight intensity={0.4} />
            <directionalLight position={[0, 5, 5]} />

            <CameraController
              stage={stage}
              selectedPart={selectedPart}
              zoomDone={zoomDone}
              setZoomDone={setZoomDone}
              returning={returning}
              setReturning={setReturning}
              setSelectedPart={setSelectedPart}
              controlsRef={controlsRef}
              setTransitioning={setTransitioning}
            />

            {/* Full body view */}
            {stage === "full" && (
              <HumanModel
                isUnified={true}
                hoveredPart={hoveredPart}
                setHoveredPart={setHoveredPart}
                setSelectedPart={() => {
                  setLastSelectedLabel(systems.fullBody.label);
                  setStage("expanded");
                }}
                zoomDone={zoomDone}
                returning={returning}
                transitioning={transitioning}
                position={[0, 0, 0]}
                targetPosition={[0, 0, 0]}
              />
            )}

            {/* Expanded systems view */}
            {stage === "expanded" &&
              Object.keys(systems.fullBody.systems).map((key, i) => (
                <HumanModel
                  key={key}
                  systemIndex={key}
                  hoveredPart={hoveredPart}
                  setHoveredPart={setHoveredPart}
                  setSelectedPart={() => {
                    const label = getLabel(key);
                    if (label) {
                      setLastSelectedLabel(label);
                      setLabelHistory((prev) => [...prev, label]);
                    }
                    setFocusedSystem(key);
                    setStage("focused");
                  }}
                  zoomDone={zoomDone}
                  returning={returning}
                  highlightAsWhole={true}
                  transitioning={transitioning}
                  position={[0, 0, 0]}
                  targetPosition={[i * 7.5 - 30, 0, 0]}
                />
              ))}

            {/* Focused system or part view */}
            {stage === "focused" && focusedSystem && (
              <group position={[0, 0, 0]}>
                {selectedPart && selectedPart.name ? (
                  <HumanModel
                    partNodeName={
                      systems.fullBody.systems[focusedSystem]?.parts[
                        selectedPart.name
                      ]?.nodeName
                    }
                    hoveredPart={hoveredPart}
                    setHoveredPart={setHoveredPart}
                    setSelectedPart={setSelectedPart}
                    zoomDone={zoomDone}
                    returning={returning}
                    highlightAsWhole={false}
                    transitioning={transitioning}
                    selectedPart={selectedPart}
                  />
                ) : (
                  <HumanModel
                    systemIndex={focusedSystem}
                    hoveredPart={hoveredPart}
                    setHoveredPart={setHoveredPart}
                    setSelectedPart={(part) => {
                      const label = getLabel(part.name);
                      if (label) {
                        setLastSelectedLabel(label);
                        setLabelHistory((prev) => [...prev, label]);
                      }
                      setSelectedPart({ name: part.name });
                      setZoomDone(false);
                    }}
                    zoomDone={zoomDone}
                    returning={returning}
                    highlightAsWhole={false}
                    transitioning={transitioning}
                  />
                )}
              </group>
            )}
          </Canvas>
          <UIOverlay
            hoveredPart={hoveredPart}
            selectedPart={selectedPart}
            zoomDone={zoomDone}
            focusedSystem={focusedSystem}
            setSelectedPart={setSelectedPart}
            setFocusedSystem={setFocusedSystem}
            setSplitView={setSplitView}
            stage={stage}
            setStage={setStage}
            resetAll={resetAll}
            lastSelectedLabel={lastSelectedLabel}
            setLastSelectedLabel={setLastSelectedLabel}
            setLabelHistory={setLabelHistory}
            setHoveredPart={setHoveredPart}
          />
        </>
      )}
    </>
  );
}

export default App;
