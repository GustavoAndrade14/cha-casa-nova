"use client";

import { ContactShadows, Float, Sparkles } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

function createHeartShape() {
    const shape = new THREE.Shape();

    shape.moveTo(0, 0.35);
    shape.bezierCurveTo(0, 0.35, -0.68, -0.08, -0.68, 0.55);
    shape.bezierCurveTo(-0.68, 1.03, -0.18, 1.24, 0, 0.85);
    shape.bezierCurveTo(0.18, 1.24, 0.68, 1.03, 0.68, 0.55);
    shape.bezierCurveTo(0.68, -0.08, 0, 0.35, 0, 0.35);

    return shape;
}

function FloatingHeart() {
    const heartRef = useRef<THREE.Mesh>(null);
    const heartShape = useMemo(() => createHeartShape(), []);
    const extrudeSettings = useMemo(
        () => ({
            depth: 0.22,
            bevelEnabled: true,
            bevelSegments: 5,
            steps: 2,
            bevelSize: 0.05,
            bevelThickness: 0.05,
        }),
        [],
    );

    useFrame((state) => {
        if (!heartRef.current) return;

        heartRef.current.rotation.y = state.clock.elapsedTime * 0.42;
        heartRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.7) * 0.08;
    });

    return (
        <Float speed={2.2} rotationIntensity={0.35} floatIntensity={0.55}>
            <mesh
                ref={heartRef}
                position={[0, 1.22, 0.28]}
                rotation={[Math.PI, 0, 0]}
                scale={0.56}
                castShadow
            >
                <extrudeGeometry args={[heartShape, extrudeSettings]} />
                <meshPhysicalMaterial
                    color="#facc15"
                    emissive="#a16207"
                    emissiveIntensity={0.28}
                    metalness={0.85}
                    roughness={0.2}
                    clearcoat={1}
                    clearcoatRoughness={0.16}
                />
            </mesh>
        </Float>
    );
}

function HouseModel() {
    const groupRef = useRef<THREE.Group>(null);
    const { pointer } = useThree();

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        const targetRotationY = pointer.x * 0.25;
        const targetRotationX = pointer.y * -0.12;

        groupRef.current.rotation.y = THREE.MathUtils.damp(
            groupRef.current.rotation.y,
            targetRotationY,
            4,
            delta,
        );
        groupRef.current.rotation.x = THREE.MathUtils.damp(
            groupRef.current.rotation.x,
            targetRotationX,
            4,
            delta,
        );
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.72) * 0.07;
    });

    return (
        <group ref={groupRef} position={[0, -0.15, 0]}>
            <Float speed={1.35} rotationIntensity={0.08} floatIntensity={0.22}>
                <group rotation={[0, -0.18, 0]}>
                    <mesh position={[0, -0.34, 0]} castShadow receiveShadow>
                        <boxGeometry args={[2.25, 1.55, 1.65]} />
                        <meshPhysicalMaterial
                            color="#211d12"
                            metalness={0.48}
                            roughness={0.28}
                            clearcoat={0.65}
                            clearcoatRoughness={0.24}
                        />
                    </mesh>

                    <mesh position={[0, 0.66, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
                        <coneGeometry args={[1.72, 1.18, 4]} />
                        <meshPhysicalMaterial
                            color="#facc15"
                            emissive="#713f12"
                            emissiveIntensity={0.2}
                            metalness={0.9}
                            roughness={0.2}
                            clearcoat={1}
                        />
                    </mesh>

                    <mesh position={[0, -0.52, 0.84]} castShadow>
                        <boxGeometry args={[0.48, 0.92, 0.08]} />
                        <meshStandardMaterial
                            color="#b98918"
                            emissive="#facc15"
                            emissiveIntensity={0.16}
                            metalness={0.72}
                            roughness={0.28}
                        />
                    </mesh>

                    {[-0.7, 0.7].map((x) => (
                        <group key={x} position={[x, -0.24, 0.85]}>
                            <mesh>
                                <boxGeometry args={[0.42, 0.46, 0.07]} />
                                <meshStandardMaterial
                                    color="#fff7cc"
                                    emissive="#facc15"
                                    emissiveIntensity={1.7}
                                    toneMapped={false}
                                />
                            </mesh>
                            <mesh position={[0, 0, 0.045]}>
                                <boxGeometry args={[0.035, 0.47, 0.025]} />
                                <meshStandardMaterial color="#2a2417" />
                            </mesh>
                            <mesh position={[0, 0, 0.045]}>
                                <boxGeometry args={[0.43, 0.035, 0.025]} />
                                <meshStandardMaterial color="#2a2417" />
                            </mesh>
                        </group>
                    ))}

                    <mesh position={[0, -1.16, 0]} receiveShadow>
                        <cylinderGeometry args={[1.75, 2.05, 0.16, 64]} />
                        <meshPhysicalMaterial
                            color="#17140d"
                            metalness={0.62}
                            roughness={0.36}
                            clearcoat={0.5}
                        />
                    </mesh>
                </group>
            </Float>

            <FloatingHeart />
        </group>
    );
}

function OrbitalRings() {
    const ringsRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!ringsRef.current) return;
        ringsRef.current.rotation.z = state.clock.elapsedTime * 0.08;
        ringsRef.current.rotation.y = state.clock.elapsedTime * -0.05;
    });

    return (
        <group ref={ringsRef} position={[0, 0.05, -0.35]}>
            <mesh rotation={[Math.PI / 2.7, 0.1, 0]}>
                <torusGeometry args={[2.05, 0.015, 12, 120]} />
                <meshBasicMaterial color="#facc15" transparent opacity={0.42} />
            </mesh>
            <mesh rotation={[Math.PI / 2.15, 0.55, 0.15]}>
                <torusGeometry args={[2.48, 0.008, 10, 120]} />
                <meshBasicMaterial color="#fde68a" transparent opacity={0.2} />
            </mesh>
        </group>
    );
}

function Scene() {
    return (
        <>
            <ambientLight intensity={0.8} />
            <directionalLight
                position={[4, 6, 4]}
                intensity={2.8}
                color="#fff3c4"
                castShadow
            />
            <pointLight position={[-3, 1, 3]} intensity={18} distance={8} color="#f59e0b" />
            <pointLight position={[3, -1, 1]} intensity={9} distance={6} color="#fde68a" />

            <Sparkles
                count={75}
                scale={[6.5, 5, 4]}
                size={2.6}
                speed={0.28}
                opacity={0.72}
                color="#fde68a"
            />

            <OrbitalRings />
            <HouseModel />

            <ContactShadows
                position={[0, -1.28, 0]}
                opacity={0.52}
                scale={7}
                blur={2.8}
                far={4.5}
                color="#000000"
            />
        </>
    );
}

export function HeroThreeScene() {
    return (
        <div className="h-full min-h-[420px] w-full sm:min-h-[520px]">
            <Canvas
                dpr={[1, 1.75]}
                camera={{ position: [0, 0.45, 5.7], fov: 38 }}
                gl={{
                    alpha: true,
                    antialias: true,
                    powerPreference: "high-performance",
                }}
                shadows
            >
                <Suspense fallback={null}>
                    <Scene />
                </Suspense>
            </Canvas>
        </div>
    );
}