'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Custom shader for particle hands
const particleVertexShader = `
  uniform float uTime;
  uniform float uProgress;
  uniform float uIntensity;
  
  attribute float aSize;
  attribute float aOffset;
  attribute vec3 aTargetPosition;
  
  varying float vAlpha;
  varying float vProgress;
  
  void main() {
    vProgress = uProgress;
    
    // Breathing animation
    float breathe = sin(uTime * 0.5 + aOffset) * 0.02;
    
    // Movement based on progress
    vec3 pos = mix(position, aTargetPosition, uProgress * 0.5);
    
    // Add subtle drift
    pos.x += sin(uTime * 0.3 + position.y * 0.5 + aOffset) * 0.03 * uIntensity;
    pos.y += cos(uTime * 0.4 + position.x * 0.3 + aOffset) * 0.03 * uIntensity;
    pos.z += sin(uTime * 0.2 + position.z * 0.5 + aOffset) * 0.02 * uIntensity;
    
    // Scale breathing
    pos *= 1.0 + breathe * uIntensity;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Size animation
    float size = aSize * (1.0 + uProgress * 0.3);
    size *= (1.0 + sin(uTime * 2.0 + aOffset) * 0.1 * uIntensity);
    
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    
    // Alpha based on distance and progress
    vAlpha = 0.6 + 0.4 * sin(aOffset * 3.14159);
    vAlpha *= (1.0 - smoothstep(0.0, 1.0, uProgress) * 0.3);
  }
`;

const particleFragmentShader = `
  uniform vec3 uColor;
  uniform vec3 uGlowColor;
  uniform float uProgress;
  
  varying float vAlpha;
  varying float vProgress;
  
  void main() {
    // Circular particle
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    
    // Soft edge
    float alpha = smoothstep(0.5, 0.1, dist) * vAlpha;
    
    // Glow effect on interaction
    float glow = smoothstep(0.3, 0.0, dist) * vProgress * 0.5;
    
    vec3 color = mix(uColor, uGlowColor, glow + vProgress * 0.3);
    
    gl_FragColor = vec4(color, alpha * (0.7 + vProgress * 0.3));
  }
`;

interface ParticleHandProps {
  isLeft: boolean;
  progress: number;
  isHovering: boolean;
}

export function ParticleHand({ isLeft, progress, isHovering }: ParticleHandProps) {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Generate hand particles
  const { positions, sizes, offsets, targetPositions } = useMemo(() => {
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const offsets = new Float32Array(particleCount);
    const targetPositions = new Float32Array(particleCount * 3);
    
    const direction = isLeft ? -1 : 1;
    
    for (let i = 0; i < particleCount; i++) {
      let x, y, z;
      
      if (i < particleCount * 0.1) {
        // Thumb - slightly spread
        const angle = isLeft ? 0.3 : Math.PI - 0.3;
        const dist = 0.4 + Math.random() * 0.15;
        x = Math.cos(angle) * dist * direction;
        y = Math.sin(angle) * dist - 0.3;
        z = (Math.random() - 0.5) * 0.15;
      } else if (i < particleCount * 0.5) {
        // Fingers (4 fingers)
        const fingerIndex = Math.floor((i - particleCount * 0.1) / (particleCount * 0.4 / 4));
        const segment = ((i - particleCount * 0.1) % (particleCount * 0.4 / 4)) / (particleCount * 0.4 / 4);
        
        const fingerLength = 0.5 + Math.random() * 0.1;
        const fingerSpread = isLeft 
          ? [-0.4, -0.2, 0.1, 0.25]
          : [Math.PI + 0.4, Math.PI + 0.2, Math.PI - 0.1, Math.PI - 0.25];
        
        const angle = fingerSpread[fingerIndex];
        x = Math.cos(angle) * fingerLength * (0.2 + segment * 0.8) * direction;
        y = Math.sin(angle) * fingerLength * (0.2 + segment * 0.8) - 0.4 - segment * 0.3;
        z = (Math.random() - 0.5) * 0.08 * (1 - segment);
      } else {
        // Palm
        const palmAngle = (Math.random() - 0.5) * Math.PI * 0.7;
        const palmDist = 0.25 + Math.random() * 0.15;
        x = Math.cos(palmAngle) * palmDist * direction * 0.8;
        y = Math.sin(palmAngle) * palmDist * 0.6;
        z = (Math.random() - 0.5) * 0.2;
      }
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Target position for interaction (closer to center)
      targetPositions[i * 3] = x - direction * 0.3 * progress;
      targetPositions[i * 3 + 1] = y - 0.1 * progress;
      targetPositions[i * 3 + 2] = z;
      
      sizes[i] = 3 + Math.random() * 4;
      offsets[i] = Math.random() * Math.PI * 2;
    }
    
    return { positions, sizes, offsets, targetPositions };
  }, [isLeft, progress]);
  
  // Shader uniforms
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uIntensity: { value: 1 },
    uColor: { value: isLeft ? new THREE.Color('#ffffff') : new THREE.Color('#7BA7FF') },
    uGlowColor: { value: isLeft ? new THREE.Color('#e0e8ff') : new THREE.Color('#a8d4ff') },
  }), [isLeft]);
  
  // Animate
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uProgress.value = progress;
      materialRef.current.uniforms.uIntensity.value = 1 + progress * 0.5;
    }
  });
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aOffset"
          count={offsets.length}
          array={offsets}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aTargetPosition"
          count={targetPositions.length / 3}
          array={targetPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Floating ambient particles
export function AmbientParticles({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.Points>(null);
  
  const { positions, sizes, offsets } = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const offsets = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3 - 1;
      
      sizes[i] = 1 + Math.random() * 2;
      offsets[i] = Math.random() * Math.PI * 2;
    }
    
    return { positions, sizes, offsets };
  }, []);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aOffset"
          count={offsets.length}
          array={offsets}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={`
          uniform float uTime;
          uniform float uProgress;
          attribute float aSize;
          attribute float aOffset;
          varying float vAlpha;
          
          void main() {
            vAlpha = 0.3 + 0.2 * sin(uTime * 0.5 + aOffset);
            vec3 pos = position;
            pos.y += sin(uTime * 0.3 + aOffset) * 0.1;
            pos.x += cos(uTime * 0.2 + aOffset) * 0.05;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = aSize * (200.0 / -mvPosition.z) * (1.0 + uProgress * 0.5);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying float vAlpha;
          
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            
            float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
            gl_FragColor = vec4(0.5, 0.6, 1.0, alpha * 0.5);
          }
        `}
        uniforms={{
          uTime: { value: 0 },
          uProgress: { value: 0 },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Contact point glow effect
export function ContactGlow({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const scale = 0.3 + progress * 0.7;
      meshRef.current.scale.setScalar(scale);
    }
  });
  
  if (progress < 0.5) return null;
  
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshBasicMaterial
        color="#7BA7FF"
        transparent
        opacity={progress * 0.3}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
