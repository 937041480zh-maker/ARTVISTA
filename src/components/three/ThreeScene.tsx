'use client';

import { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

// Vertex Shader
const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

// Fragment Shader - 紫色霓虹流线 + 鼠标交互
const fragmentShader = `
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform bool uMouseOn;
    varying vec2 vUv;
    
    // Simplex noise functions
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
    float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        
        i = mod289(i);
        vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        
        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        
        vec4 s0 = floor(b0) * 2.0 + 1.0;
        vec4 s1 = floor(b1) * 2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        
        vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
        
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,p3)));
    }
    
    void main() {
        vec2 uv = vUv;
        vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
        
        // 时间缩放 - 流动速度
        float time = uTime * 0.7;
        
        // 鼠标交互：光标周围产生涟漪
        float mouseDist = distance(uv, uMouse);
        float mouseGlow = uMouseOn ? smoothstep(0.4, 0.0, mouseDist) : 0.0;
        float ripple = sin(mouseDist * 30.0 - uTime * 5.0) * 0.5 + 0.5;
        ripple *= smoothstep(0.4, 0.1, mouseDist);
        mouseGlow += ripple * 0.3;
        
        // 流线方向1：从左上角到右下角的对角线
        float flow1 = sin((uv.x - uv.y) * 6.0 + time * 2.5) * 0.5 + 0.5;
        float flow2 = sin((uv.x + uv.y) * 4.0 - time * 2.0) * 0.5 + 0.5;
        float flow3 = sin((uv.x - uv.y * 0.3) * 8.0 + time * 1.5) * 0.5 + 0.5;
        
        float lines1 = flow1 * 0.5 + flow2 * 0.3 + flow3 * 0.2;
        
        // 流线方向2：从上端中心到右侧中心
        float flow4 = sin((uv.y + uv.x) * 5.0 - time * 2.2) * 0.5 + 0.5;
        float flow5 = sin((uv.y - uv.x * 0.5) * 6.0 + time * 1.8) * 0.5 + 0.5;
        float flow6 = sin((uv.y + uv.x * 0.3) * 4.0 - time * 1.2) * 0.5 + 0.5;
        
        float lines2 = flow4 * 0.4 + flow5 * 0.35 + flow6 * 0.25;
        
        // 遮罩区域
        float diagonalMask1 = smoothstep(0.0, 0.2, uv.x) * smoothstep(1.0, 0.8, uv.x) * smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.8, uv.y);
        float diagonalMask2 = smoothstep(0.3, 0.7, uv.x) * smoothstep(1.0, 0.2, uv.y) * smoothstep(0.0, 0.3, uv.x + uv.y * 0.5);
        
        // 组合流线
        float lines = lines1 * diagonalMask1 + lines2 * diagonalMask2;
        
        // 边缘淡化
        float edgeFade = smoothstep(0.0, 0.15, uv.x) * smoothstep(0.15, 0.3, uv.x);
        
        // 深紫色霓虹
        vec3 purpleColor = vec3(0.45, 0.08, 0.5);
        vec3 purpleBright = vec3(0.7, 0.25, 0.85);
        
        // 流线强度
        float lineIntensity = lines * edgeFade;
        
        // 加上鼠标交互效果
        lineIntensity += mouseGlow;
        
        // 8%自发光效果
        float selfGlow = lineIntensity * 0.08;
        
        // 呼吸效果
        float breathe = sin(uTime * 1.5) * 0.08 + 0.92;
        
        // 发光效果
        float glow = pow(lineIntensity, 1.5) * 0.8 * breathe;
        
        // 最终颜色
        vec3 finalColor = purpleColor * lineIntensity * 1.5 + purpleBright * glow + purpleBright * selfGlow * breathe;
        
        // 透明度
        float alpha = lineIntensity * 0.95;
        
        gl_FragColor = vec4(finalColor, alpha);
    }
`;

// 着色器平面组件
function ShaderPlane({ mousePos, mouseOn }: { mousePos: [number, number], mouseOn: boolean }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const { viewport, size } = useThree();
    
    const uniforms = useRef({
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(size.width, size.height) },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uMouseOn: { value: false }
    });
    
    useEffect(() => {
        uniforms.current.uResolution.value.set(size.width, size.height);
    }, [size]);
    
    useEffect(() => {
        uniforms.current.uMouse.value.set(mousePos[0], mousePos[1]);
        uniforms.current.uMouseOn.value = mouseOn;
    }, [mousePos, mouseOn]);
    
    useFrame((state) => {
        uniforms.current.uTime.value = state.clock.elapsedTime;
    });
    
    return (
        <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry args={[1, 1]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms.current}
                transparent={true}
            />
        </mesh>
    );
}

// 场景内容
function SceneContent({ mousePos, mouseOn }: { mousePos: [number, number], mouseOn: boolean }) {
    return (
        <>
            <ShaderPlane mousePos={mousePos} mouseOn={mouseOn} />
        </>
    );
}

// 后期效果
function Effects() {
    return (
        <EffectComposer>
            <Bloom 
                intensity={0.7} 
                luminanceThreshold={0.2} 
                luminanceSmoothing={0.9} 
                radius={0.9} 
            />
            <Vignette 
                offset={0.35} 
                darkness={0.25} 
            />
        </EffectComposer>
    );
}

// 加载状态
function LoadingFallback() {
    return <mesh><planeGeometry args={[1, 1]} /><meshBasicMaterial color="#000000" /></mesh>;
}

// 主组件
interface ThreeSceneProps {
    progress: number;
}

export function ThreeScene({ progress }: ThreeSceneProps) {
    const [isClient, setIsClient] = useState(false);
    const [mousePos, setMousePos] = useState<[number, number]>([0.5, 0.5]);
    const [mouseOn, setMouseOn] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        setIsClient(true);
    }, []);
    
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1 - (e.clientY - rect.top) / rect.height;
        setMousePos([x, y]);
        setMouseOn(true);
    }, []);
    
    const handleMouseLeave = useCallback(() => {
        setMouseOn(false);
    }, []);
    
    if (!isClient) {
        return <div className="absolute inset-0 bg-black" />;
    }
    
    return (
        <div 
            ref={containerRef}
            className="absolute inset-0"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <Canvas
                dpr={[1, 2]}
                gl={{ 
                    antialias: false,
                    alpha: false,
                    powerPreference: 'high-performance',
                }}
                style={{ background: '#000000' }}
                camera={{ position: [0, 0, 1], fov: 75 }}
            >
                <Suspense fallback={<LoadingFallback />}>
                    <SceneContent mousePos={mousePos} mouseOn={mouseOn} />
                    <Effects />
                </Suspense>
            </Canvas>
        </div>
    );
}
