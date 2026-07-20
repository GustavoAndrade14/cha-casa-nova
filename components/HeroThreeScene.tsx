"use client";

import {
    ContactShadows,
    Float,
    RoundedBox,
    Sparkles,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
    Suspense,
    useEffect,
    useMemo,
    useRef,
} from "react";
import * as THREE from "three";

const COLORS = {
    background: "#090805",
    wall: "#262116",
    wallSecondary: "#332b19",
    roof: "#a96f12",
    roofHighlight: "#e3b341",
    gold: "#facc15",
    softGold: "#fde68a",
    wood: "#6f431f",
    woodDark: "#3e2414",
    glass: "#fff1b8",
    frame: "#17130c",
    garden: "#4e5c25",
    gardenDark: "#273114",
    stone: "#514936",
} as const;

function createHeartShape() {
    const shape = new THREE.Shape();

    shape.moveTo(0, 0.35);
    shape.bezierCurveTo(0, 0.35, -0.68, -0.08, -0.68, 0.55);
    shape.bezierCurveTo(-0.68, 1.03, -0.18, 1.24, 0, 0.85);
    shape.bezierCurveTo(0.18, 1.24, 0.68, 1.03, 0.68, 0.55);
    shape.bezierCurveTo(0.68, -0.08, 0, 0.35, 0, 0.35);

    return shape;
}

function createGableShape(width: number, height: number) {
    const shape = new THREE.Shape();

    shape.moveTo(-width / 2, 0);
    shape.lineTo(0, height);
    shape.lineTo(width / 2, 0);
    shape.closePath();

    return shape;
}

function Window({
    position,
    size = [0.48, 0.54],
    side = false,
}: {
    position: [number, number, number];
    size?: [number, number];
    side?: boolean;
}) {
    const [width, height] = size;

    return (
        <group
            position={position}
            rotation={side ? [0, Math.PI / 2, 0] : [0, 0, 0]}
        >
            <RoundedBox
                args={[width + 0.12, height + 0.12, 0.075]}
                radius={0.035}
                smoothness={4}
                castShadow
            >
                <meshStandardMaterial
                    color={COLORS.frame}
                    metalness={0.45}
                    roughness={0.34}
                />
            </RoundedBox>

            <RoundedBox
                args={[width, height, 0.082]}
                radius={0.025}
                smoothness={4}
                position={[0, 0, 0.046]}
            >
                <meshStandardMaterial
                    color={COLORS.glass}
                    emissive={COLORS.gold}
                    emissiveIntensity={2.4}
                    toneMapped={false}
                    roughness={0.1}
                />
            </RoundedBox>

            <mesh position={[0, 0, 0.094]}>
                <boxGeometry args={[0.035, height, 0.025]} />
                <meshStandardMaterial color={COLORS.frame} roughness={0.42} />
            </mesh>

            <mesh position={[0, 0, 0.094]}>
                <boxGeometry args={[width, 0.035, 0.025]} />
                <meshStandardMaterial color={COLORS.frame} roughness={0.42} />
            </mesh>

            <mesh position={[0, -(height / 2) - 0.075, 0.04]} castShadow>
                <boxGeometry args={[width + 0.18, 0.06, 0.16]} />
                <meshStandardMaterial
                    color={COLORS.roofHighlight}
                    metalness={0.65}
                    roughness={0.28}
                />
            </mesh>
        </group>
    );
}

function FrontDoor() {
    return (
        <group position={[0, -0.48, 0.986]}>
            <RoundedBox
                args={[0.66, 1.24, 0.12]}
                radius={0.045}
                smoothness={6}
                castShadow
            >
                <meshPhysicalMaterial
                    color={COLORS.woodDark}
                    metalness={0.16}
                    roughness={0.34}
                    clearcoat={0.55}
                    clearcoatRoughness={0.3}
                />
            </RoundedBox>

            <RoundedBox
                args={[0.52, 0.92, 0.04]}
                radius={0.025}
                smoothness={4}
                position={[0, -0.1, 0.082]}
            >
                <meshStandardMaterial
                    color={COLORS.wood}
                    roughness={0.36}
                    metalness={0.18}
                />
            </RoundedBox>

            <RoundedBox
                args={[0.42, 0.26, 0.045]}
                radius={0.025}
                smoothness={4}
                position={[0, 0.38, 0.084]}
            >
                <meshStandardMaterial
                    color={COLORS.glass}
                    emissive={COLORS.gold}
                    emissiveIntensity={1.65}
                    toneMapped={false}
                />
            </RoundedBox>

            <mesh position={[0, -0.1, 0.11]}>
                <boxGeometry args={[0.035, 0.9, 0.025]} />
                <meshStandardMaterial color={COLORS.woodDark} />
            </mesh>

            <mesh position={[0, -0.1, 0.11]}>
                <boxGeometry args={[0.48, 0.032, 0.025]} />
                <meshStandardMaterial color={COLORS.woodDark} />
            </mesh>

            <mesh position={[0.205, -0.13, 0.145]} castShadow>
                <sphereGeometry args={[0.052, 20, 20]} />
                <meshPhysicalMaterial
                    color={COLORS.gold}
                    metalness={1}
                    roughness={0.16}
                    clearcoat={1}
                />
            </mesh>

            <mesh position={[0.205, -0.13, 0.105]} castShadow>
                <cylinderGeometry args={[0.025, 0.025, 0.13, 16]} />
                <meshStandardMaterial
                    color={COLORS.roofHighlight}
                    metalness={0.92}
                    roughness={0.2}
                />
            </mesh>
        </group>
    );
}

function Porch() {
    return (
        <group>
            <RoundedBox
                args={[1.36, 0.12, 0.72]}
                radius={0.045}
                smoothness={4}
                position={[0, 0.26, 1.14]}
                castShadow
            >
                <meshPhysicalMaterial
                    color={COLORS.roof}
                    metalness={0.68}
                    roughness={0.24}
                    clearcoat={0.7}
                />
            </RoundedBox>

            {[-0.56, 0.56].map((x) => (
                <group key={x}>
                    <mesh position={[x, -0.42, 1.18]} castShadow>
                        <cylinderGeometry args={[0.055, 0.07, 1.28, 20]} />
                        <meshPhysicalMaterial
                            color={COLORS.roofHighlight}
                            metalness={0.75}
                            roughness={0.25}
                        />
                    </mesh>

                    <mesh position={[x, 0.19, 1.18]}>
                        <sphereGeometry args={[0.09, 20, 20]} />
                        <meshStandardMaterial
                            color={COLORS.softGold}
                            emissive={COLORS.gold}
                            emissiveIntensity={1.8}
                            toneMapped={false}
                        />
                    </mesh>
                </group>
            ))}

            <RoundedBox
                args={[1.52, 0.12, 0.72]}
                radius={0.04}
                smoothness={4}
                position={[0, -1.2, 1.17]}
                receiveShadow
            >
                <meshStandardMaterial
                    color={COLORS.stone}
                    roughness={0.72}
                    metalness={0.12}
                />
            </RoundedBox>

            {[0, 1].map((step) => (
                <RoundedBox
                    key={step}
                    args={[1.25 + step * 0.22, 0.1, 0.34]}
                    radius={0.035}
                    smoothness={4}
                    position={[0, -1.25 - step * 0.09, 1.52 + step * 0.24]}
                    receiveShadow
                >
                    <meshStandardMaterial
                        color={step === 0 ? "#5f5540" : "#494131"}
                        roughness={0.76}
                    />
                </RoundedBox>
            ))}
        </group>
    );
}

function Roof() {
    const roofShape = useMemo(() => createGableShape(3.18, 1.12), []);
    const settings = useMemo(
        () => ({
            depth: 2.16,
            bevelEnabled: true,
            bevelSegments: 4,
            steps: 1,
            bevelSize: 0.045,
            bevelThickness: 0.045,
        }),
        [],
    );

    return (
        <group position={[0, 0.49, 0]}>
            <mesh position={[0, 0, -1.08]} castShadow receiveShadow>
                <extrudeGeometry args={[roofShape, settings]} />
                <meshPhysicalMaterial
                    color={COLORS.roof}
                    emissive="#4c2f08"
                    emissiveIntensity={0.16}
                    metalness={0.78}
                    roughness={0.22}
                    clearcoat={1}
                    clearcoatRoughness={0.2}
                />
            </mesh>

            <mesh position={[0, 1.1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.055, 0.055, 2.28, 18]} />
                <meshPhysicalMaterial
                    color={COLORS.roofHighlight}
                    metalness={0.9}
                    roughness={0.18}
                    clearcoat={1}
                />
            </mesh>

            {[-1.53, 1.53].map((x) => (
                <mesh
                    key={x}
                    position={[x, 0.05, 0]}
                    rotation={[0, 0, x < 0 ? -0.63 : 0.63]}
                    castShadow
                >
                    <boxGeometry args={[0.09, 1.42, 2.28]} />
                    <meshStandardMaterial
                        color={COLORS.roofHighlight}
                        metalness={0.74}
                        roughness={0.26}
                    />
                </mesh>
            ))}
        </group>
    );
}

function Chimney() {
    return (
        <group position={[0.92, 1.05, -0.28]}>
            <RoundedBox
                args={[0.34, 0.88, 0.38]}
                radius={0.04}
                smoothness={4}
                castShadow
            >
                <meshStandardMaterial
                    color="#493923"
                    roughness={0.64}
                    metalness={0.1}
                />
            </RoundedBox>

            <RoundedBox
                args={[0.44, 0.11, 0.48]}
                radius={0.03}
                smoothness={3}
                position={[0, 0.47, 0]}
                castShadow
            >
                <meshPhysicalMaterial
                    color={COLORS.roofHighlight}
                    metalness={0.72}
                    roughness={0.26}
                />
            </RoundedBox>
        </group>
    );
}

function GardenBush({
    position,
    scale = 1,
}: {
    position: [number, number, number];
    scale?: number;
}) {
    return (
        <group position={position} scale={scale}>
            {[
                [-0.13, 0, 0],
                [0.14, 0.02, 0.02],
                [0, 0.13, -0.03],
            ].map(([x, y, z], index) => (
                <mesh key={index} position={[x, y, z]} castShadow>
                    <sphereGeometry args={[0.25, 22, 18]} />
                    <meshStandardMaterial
                        color={index === 2 ? COLORS.garden : COLORS.gardenDark}
                        roughness={0.8}
                    />
                </mesh>
            ))}

            {[[-0.12, 0.18], [0.13, 0.1], [0.03, 0.28]].map(([x, y], index) => (
                <mesh key={`flower-${index}`} position={[x, y, 0.22]}>
                    <sphereGeometry args={[0.025, 12, 12]} />
                    <meshStandardMaterial
                        color={COLORS.softGold}
                        emissive={COLORS.gold}
                        emissiveIntensity={0.8}
                    />
                </mesh>
            ))}
        </group>
    );
}

function SmallTree() {
    return (
        <group position={[-1.95, -0.64, -0.3]}>
            <mesh position={[0, -0.28, 0]} castShadow>
                <cylinderGeometry args={[0.08, 0.12, 1.05, 18]} />
                <meshStandardMaterial color="#51321c" roughness={0.82} />
            </mesh>

            {[
                [0, 0.34, 0, 0.55],
                [-0.26, 0.18, 0.03, 0.4],
                [0.28, 0.18, -0.02, 0.42],
                [0.02, 0.62, -0.04, 0.36],
            ].map(([x, y, z, scale], index) => (
                <mesh key={index} position={[x, y, z]} scale={scale} castShadow>
                    <dodecahedronGeometry args={[0.7, 1]} />
                    <meshStandardMaterial
                        color={index % 2 === 0 ? COLORS.garden : COLORS.gardenDark}
                        roughness={0.88}
                    />
                </mesh>
            ))}
        </group>
    );
}

function Landscaping() {
    return (
        <group>
            <GardenBush position={[-1.15, -1.02, 1.16]} scale={0.78} />
            <GardenBush position={[1.15, -1.02, 1.12]} scale={0.78} />
            <GardenBush position={[-1.58, -1.02, 0.38]} scale={0.62} />
            <GardenBush position={[1.58, -1.02, 0.4]} scale={0.62} />
            <SmallTree />

            <mesh
                position={[0, -1.3, 2.35]}
                rotation={[-Math.PI / 2, 0, 0]}
                receiveShadow
            >
                <planeGeometry args={[1.12, 2.2]} />
                <meshStandardMaterial color="#665b43" roughness={0.88} />
            </mesh>

            {[-0.48, -0.16, 0.16, 0.48].map((x, index) => (
                <RoundedBox
                    key={x}
                    args={[0.22, 0.045, 0.5]}
                    radius={0.025}
                    smoothness={3}
                    position={[x, -1.265, 2.25 + Math.abs(index - 1.5) * 0.08]}
                    rotation={[0, index % 2 === 0 ? 0.04 : -0.04, 0]}
                    receiveShadow
                >
                    <meshStandardMaterial color="#9b8961" roughness={0.9} />
                </RoundedBox>
            ))}
        </group>
    );
}

function FloatingHeart() {
    const heartRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.PointLight>(null);
    const heartShape = useMemo(() => createHeartShape(), []);

    const extrudeSettings = useMemo(
        () => ({
            depth: 0.22,
            bevelEnabled: true,
            bevelSegments: 6,
            steps: 2,
            bevelSize: 0.045,
            bevelThickness: 0.045,
        }),
        [],
    );

    useFrame((state, delta) => {
        if (heartRef.current) {
            heartRef.current.rotation.y += delta * 0.45;
            heartRef.current.rotation.z =
                Math.sin(state.clock.elapsedTime * 0.82) * 0.07;
        }

        if (glowRef.current) {
            glowRef.current.intensity =
                6.5 + Math.sin(state.clock.elapsedTime * 2.2) * 1.3;
        }
    });

    return (
        <Float speed={1.8} rotationIntensity={0.18} floatIntensity={0.38}>
            <group position={[0, 2.18, 0.26]}>
                <pointLight
                    ref={glowRef}
                    color={COLORS.gold}
                    intensity={7}
                    distance={3.4}
                    decay={2}
                />

                <mesh
                    ref={heartRef}
                    rotation={[Math.PI, 0, 0]}
                    scale={0.48}
                    castShadow
                >
                    <extrudeGeometry args={[heartShape, extrudeSettings]} />
                    <meshPhysicalMaterial
                        color={COLORS.gold}
                        emissive="#b66a00"
                        emissiveIntensity={0.44}
                        metalness={0.92}
                        roughness={0.12}
                        clearcoat={1}
                        clearcoatRoughness={0.08}
                    />
                </mesh>

                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.15, -0.12]}>
                    <torusGeometry args={[0.58, 0.012, 10, 90]} />
                    <meshBasicMaterial
                        color={COLORS.softGold}
                        transparent
                        opacity={0.42}
                    />
                </mesh>
            </group>
        </Float>
    );
}

function HouseModel() {
    const groupRef = useRef<THREE.Group>(null);
    const { pointer } = useThree();

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        const targetRotationY = pointer.x * 0.16 - 0.08;
        const targetRotationX = pointer.y * -0.065;

        groupRef.current.rotation.y = THREE.MathUtils.damp(
            groupRef.current.rotation.y,
            targetRotationY,
            4.2,
            delta,
        );

        groupRef.current.rotation.x = THREE.MathUtils.damp(
            groupRef.current.rotation.x,
            targetRotationX,
            4.2,
            delta,
        );

        groupRef.current.position.y = THREE.MathUtils.damp(
            groupRef.current.position.y,
            Math.sin(state.clock.elapsedTime * 0.62) * 0.035 - 0.02,
            3,
            delta,
        );
    });

    return (
        <group ref={groupRef} rotation={[0, -0.08, 0]} scale={0.92}>
            <group>
                <RoundedBox
                    args={[2.86, 1.78, 1.92]}
                    radius={0.12}
                    smoothness={8}
                    position={[0, -0.39, 0]}
                    castShadow
                    receiveShadow
                >
                    <meshPhysicalMaterial
                        color={COLORS.wall}
                        metalness={0.42}
                        roughness={0.32}
                        clearcoat={0.52}
                        clearcoatRoughness={0.3}
                    />
                </RoundedBox>

                <RoundedBox
                    args={[2.42, 1.42, 0.12]}
                    radius={0.07}
                    smoothness={6}
                    position={[0, -0.41, 0.965]}
                    castShadow
                >
                    <meshPhysicalMaterial
                        color={COLORS.wallSecondary}
                        metalness={0.3}
                        roughness={0.4}
                        clearcoat={0.4}
                    />
                </RoundedBox>

                <Roof />
                <Chimney />

                <Window position={[-0.86, -0.29, 1.04]} size={[0.5, 0.56]} />
                <Window position={[0.86, -0.29, 1.04]} size={[0.5, 0.56]} />
                <Window
                    position={[-1.46, -0.28, 0.22]}
                    size={[0.44, 0.52]}
                    side
                />
                <Window
                    position={[1.46, -0.28, 0.2]}
                    size={[0.44, 0.52]}
                    side
                />

                <FrontDoor />
                <Porch />
                <Landscaping />

                <RoundedBox
                    args={[4.7, 0.2, 4.15]}
                    radius={0.16}
                    smoothness={6}
                    position={[0, -1.38, 0.58]}
                    receiveShadow
                >
                    <meshPhysicalMaterial
                        color="#17140e"
                        metalness={0.38}
                        roughness={0.5}
                        clearcoat={0.35}
                    />
                </RoundedBox>

                <mesh position={[0, -1.51, 0.58]} receiveShadow>
                    <cylinderGeometry args={[2.75, 3.05, 0.14, 72]} />
                    <meshPhysicalMaterial
                        color="#0f0d09"
                        metalness={0.5}
                        roughness={0.42}
                        clearcoat={0.42}
                    />
                </mesh>

                <FloatingHeart />
            </group>
        </group>
    );
}

function OrbitalRings() {
    const ringsRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (!ringsRef.current) return;

        ringsRef.current.rotation.z += delta * 0.045;
        ringsRef.current.rotation.y -= delta * 0.03;
        ringsRef.current.position.y =
            Math.sin(state.clock.elapsedTime * 0.45) * 0.035;
    });

    return (
        <group ref={ringsRef} position={[0, 0.12, -0.85]}>
            <mesh rotation={[Math.PI / 2.55, 0.08, 0]}>
                <torusGeometry args={[2.72, 0.012, 12, 160]} />
                <meshBasicMaterial
                    color={COLORS.gold}
                    transparent
                    opacity={0.34}
                />
            </mesh>

            <mesh rotation={[Math.PI / 2.08, 0.48, 0.15]}>
                <torusGeometry args={[3.2, 0.007, 10, 160]} />
                <meshBasicMaterial
                    color={COLORS.softGold}
                    transparent
                    opacity={0.16}
                />
            </mesh>

            <mesh rotation={[1.15, -0.36, 0.42]}>
                <torusGeometry args={[3.58, 0.005, 10, 160]} />
                <meshBasicMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.06}
                />
            </mesh>
        </group>
    );
}

function CameraRig() {
    const { camera, size, pointer } = useThree();

    useEffect(() => {
        camera.position.z = size.width < 640 ? 7.7 : 6.55;
        camera.position.y = size.width < 640 ? 0.28 : 0.42;
        camera.updateProjectionMatrix();
    }, [camera, size.width]);

    useFrame((_, delta) => {
        camera.position.x = THREE.MathUtils.damp(
            camera.position.x,
            pointer.x * 0.16,
            3.5,
            delta,
        );

        camera.position.y = THREE.MathUtils.damp(
            camera.position.y,
            (size.width < 640 ? 0.28 : 0.42) + pointer.y * 0.08,
            3.5,
            delta,
        );

        camera.lookAt(0, -0.02, 0);
    });

    return null;
}

function Scene() {
    return (
        <>
            <fog attach="fog" args={[COLORS.background, 7.2, 12]} />

            <ambientLight intensity={0.72} color="#fff4d2" />

            <hemisphereLight
                intensity={1.05}
                color="#fff6d9"
                groundColor="#120f08"
            />

            <directionalLight
                position={[4.5, 7, 5]}
                intensity={3.2}
                color="#fff2c0"
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-near={0.5}
                shadow-camera-far={18}
                shadow-camera-left={-5}
                shadow-camera-right={5}
                shadow-camera-top={5}
                shadow-camera-bottom={-5}
                shadow-bias={-0.00025}
            />

            <spotLight
                position={[-4, 4.5, 3.5]}
                intensity={42}
                angle={0.42}
                penumbra={0.82}
                distance={12}
                color="#f59e0b"
                castShadow
            />

            <pointLight
                position={[3.8, 0.2, 3.2]}
                intensity={14}
                distance={7}
                color="#fde68a"
            />

            <pointLight
                position={[-3, -0.4, 2]}
                intensity={7}
                distance={5}
                color="#a16207"
            />

            <Sparkles
                count={92}
                scale={[7.5, 5.7, 5]}
                size={2.1}
                speed={0.22}
                opacity={0.68}
                color={COLORS.softGold}
            />

            <OrbitalRings />
            <HouseModel />

            <ContactShadows
                position={[0, -1.58, 0.62]}
                opacity={0.62}
                scale={8.2}
                blur={3.1}
                far={5}
                color="#000000"
                resolution={512}
            />

            <CameraRig />
        </>
    );
}

export function HeroThreeScene() {
    return (
        <div className="h-full min-h-[440px] w-full sm:min-h-[560px] lg:min-h-[620px]">
            <Canvas
                dpr={[1, 1.6]}
                camera={{ position: [0, 0.42, 6.55], fov: 36 }}
                gl={{
                    alpha: true,
                    antialias: true,
                    powerPreference: "high-performance",
                }}
                shadows
                onCreated={({ gl }) => {
                    gl.toneMapping = THREE.ACESFilmicToneMapping;
                    gl.toneMappingExposure = 1.15;
                    gl.outputColorSpace = THREE.SRGBColorSpace;
                }}
            >
                <Suspense fallback={null}>
                    <Scene />
                </Suspense>
            </Canvas>
        </div>
    );
}