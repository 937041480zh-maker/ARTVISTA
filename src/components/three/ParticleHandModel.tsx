'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// ========== 配置参数 ==========
const CONFIG = {
    particles: {
        humanCount: 2000,
        machineCount: 2000,
        size: 0.018,
        humanColor: new THREE.Color(0xf5d0c5),
        machineColor: new THREE.Color(0xc0c0c0)
    },
    motion: {
        particleDelay: 0.12,
        particleJitter: 0.01
    }
};

// Vertex shader
const vertexShader = `
    attribute float size;
    attribute vec3 customColor;
    attribute float alpha;
    
    uniform float uTime;
    uniform float uProgress;
    
    varying vec3 vColor;
    varying float vAlpha;
    
    void main() {
        vColor = customColor;
        vAlpha = alpha;
        
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (320.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
    }
`;

// Fragment shader
const fragmentShader = `
    varying vec3 vColor;
    varying float vAlpha;
    
    void main() {
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);
        
        if (dist > 0.5) discard;
        
        float glow = 1.0 - smoothstep(0.0, 0.5, dist);
        float core = 1.0 - smoothstep(0.0, 0.1, dist);
        
        vec3 finalColor = vColor + core * 0.25;
        float finalAlpha = glow * vAlpha;
        
        gl_FragColor = vec4(finalColor, finalAlpha);
    }
`;

// 从模型提取顶点
function extractVertices(model: THREE.Group): THREE.Vector3[] {
    const vertices: THREE.Vector3[] = [];
    
    model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            const geometry = child.geometry;
            if (geometry.attributes.position) {
                const positionArray = geometry.attributes.position.array;
                
                for (let i = 0; i < positionArray.length; i += 3) {
                    vertices.push(new THREE.Vector3(
                        positionArray[i],
                        positionArray[i + 1],
                        positionArray[i + 2]
                    ));
                }
            }
        }
    });
    
    // 计算中心
    if (vertices.length > 0) {
        const center = new THREE.Vector3();
        vertices.forEach(v => center.add(v));
        center.divideScalar(vertices.length);
        vertices.forEach(v => v.sub(center));
    }
    
    return vertices;
}

// 粒子手组件
function ParticleHandModel({ 
    modelUrl, 
    isHuman, 
    progress,
    groupX,
    groupY
}: { 
    modelUrl: string; 
    isHuman: boolean; 
    progress: number;
    groupX: number;
    groupY: number;
}) {
    const pointsRef = useRef<THREE.Points>(null);
    const { scene } = useGLTF(modelUrl);
    
    const particleCount = isHuman ? CONFIG.particles.humanCount : CONFIG.particles.machineCount;
    const baseColor = isHuman ? CONFIG.particles.humanColor : CONFIG.particles.machineColor;
    
    // 提取顶点
    const vertices = useMemo(() => extractVertices(scene), [scene]);
    
    // 生成粒子
    const particleData = useMemo(() => {
        const vertexCount = vertices.length;
        const posArray = new Float32Array(particleCount * 3);
        const origArray = new Float32Array(particleCount * 3);
        const delayArray = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            const vertexIndex = i % Math.max(vertexCount, 1);
            const vertex = vertices[vertexIndex] || new THREE.Vector3(0, 0, 0);
            
            const jitter = 0.005;
            const x = vertex.x + (Math.random() - 0.5) * jitter;
            const y = vertex.y + (Math.random() - 0.5) * jitter;
            const z = vertex.z + (Math.random() - 0.5) * jitter;
            
            posArray[i * 3] = x;
            posArray[i * 3 + 1] = y;
            posArray[i * 3 + 2] = z;
            
            origArray[i * 3] = x;
            origArray[i * 3 + 1] = y;
            origArray[i * 3 + 2] = z;
            
            delayArray[i] = Math.random() * CONFIG.motion.particleDelay;
        }
        
        return { positions: posArray, originalPositions: origArray, delays: delayArray };
    }, [vertices, particleCount]);
    
    // 颜色数组
    const colors = useMemo(() => {
        const colorArray = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            colorArray[i * 3] = baseColor.r;
            colorArray[i * 3 + 1] = baseColor.g;
            colorArray[i * 3 + 2] = baseColor.b;
        }
        return colorArray;
    }, [particleCount, baseColor]);
    
    // 大小数组
    const sizes = useMemo(() => {
        const sizeArray = new Float32Array(particleCount);
        for (let i = 0; i < particleCount; i++) {
            sizeArray[i] = CONFIG.particles.size * (0.5 + Math.random() * 1.0);
        }
        return sizeArray;
    }, [particleCount]);
    
    // 动画状态
    const velocitiesRef = useRef(new Float32Array(particleCount * 3).fill(0));
    const currentPositionsRef = useRef(new Float32Array(particleData.positions));
    
    // 动画循环
    useFrame((state, delta) => {
        if (!pointsRef.current) return;
        
        const time = state.clock.elapsedTime;
        const posAttr = pointsRef.current.geometry.attributes.position;
        const colorAttr = pointsRef.current.geometry.attributes.customColor;
        const alphaAttr = pointsRef.current.geometry.attributes.alpha;
        
        const direction = isHuman ? 1 : -1;
        const targetOffsetX = direction * progress * 2.0;
        const targetOffsetY = -progress * 0.1;
        
        for (let i = 0; i < particleCount; i++) {
            const idx = i * 3;
            
            const origX = particleData.originalPositions[idx];
            const origY = particleData.originalPositions[idx + 1];
            const origZ = particleData.originalPositions[idx + 2];
            
            const targetX = origX + targetOffsetX + groupX * 0.4;
            const targetY = origY + targetOffsetY + groupY * 0.3;
            const targetZ = origZ;
            
            let currentX = currentPositionsRef.current[idx];
            let currentY = currentPositionsRef.current[idx + 1];
            let currentZ = currentPositionsRef.current[idx + 2];
            
            // 正常跟随
            const delay = particleData.delays[i];
            const followFactor = Math.max(0.1, 1 - delay / CONFIG.motion.particleDelay);
            
            let vx = velocitiesRef.current[idx];
            let vy = velocitiesRef.current[idx + 1];
            let vz = velocitiesRef.current[idx + 2];
            
            vx += (targetX - currentX) * 0.035 * followFactor;
            vy += (targetY - currentY) * 0.035 * followFactor;
            vz += (targetZ - currentZ) * 0.015;
            
            vx *= 0.92;
            vy *= 0.92;
            vz *= 0.92;
            
            currentX += vx;
            currentY += vy;
            currentZ += vz;
            
            velocitiesRef.current[idx] = vx;
            velocitiesRef.current[idx + 1] = vy;
            velocitiesRef.current[idx + 2] = vz;
            
            // 呼吸动画
            currentY += Math.sin(time * 0.4 + i * 0.008) * 0.002;
            
            // 轻微抖动
            currentX += (Math.random() - 0.5) * CONFIG.motion.particleJitter * 0.05;
            currentY += (Math.random() - 0.5) * CONFIG.motion.particleJitter * 0.05;
            
            currentPositionsRef.current[idx] = currentX;
            currentPositionsRef.current[idx + 1] = currentY;
            currentPositionsRef.current[idx + 2] = currentZ;
            
            posAttr.array[idx] = currentX;
            posAttr.array[idx + 1] = currentY;
            posAttr.array[idx + 2] = currentZ;
            
            // 颜色过渡（融合效果）
            const fusionAmount = Math.max(0, (progress - 0.3) * 1.5);
            colorAttr.array[idx] = baseColor.r + (1 - baseColor.r) * fusionAmount;
            colorAttr.array[idx + 1] = baseColor.g + (1 - baseColor.g) * fusionAmount;
            colorAttr.array[idx + 2] = baseColor.b + (1 - baseColor.b) * fusionAmount;
            
            // 透明度
            if (alphaAttr) {
                alphaAttr.array[i] = 0.5 + Math.sin(time * 0.4 + i * 0.015) * 0.15 + progress * 0.3;
            }
        }
        
        posAttr.needsUpdate = true;
        colorAttr.needsUpdate = true;
        if (alphaAttr) alphaAttr.needsUpdate = true;
    });
    
    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={particleCount} array={particleData.positions} itemSize={3} />
                <bufferAttribute attach="attributes-customColor" count={particleCount} array={colors} itemSize={3} />
                <bufferAttribute attach="attributes-size" count={particleCount} array={sizes} itemSize={1} />
                <bufferAttribute attach="attributes-alpha" count={particleCount} array={new Float32Array(particleCount).fill(0.7)} itemSize={1} />
            </bufferGeometry>
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={{
                    uTime: { value: 0 },
                    uProgress: { value: 0 }
                }}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

// 主组件
export function ParticleHand({ 
    isHuman, 
    progress,
    groupX = 0,
    groupY = 0
}: { 
    isHuman: boolean; 
    progress: number;
    groupX?: number;
    groupY?: number;
}) {
    const modelUrl = isHuman ? '/human-hand.glb' : '/robot-hand.glb';
    
    return (
        <ParticleHandModel 
            modelUrl={modelUrl} 
            isHuman={isHuman} 
            progress={progress}
            groupX={groupX}
            groupY={groupY}
        />
    );
}
