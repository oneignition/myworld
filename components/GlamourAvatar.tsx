"use client"

import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

// Create a star shape for sparkle effects
function createStarShape() {
  const shape = new THREE.Shape()
  const outerRadius = 0.05
  const innerRadius = 0.02
  const points = 5
  const angleStep = Math.PI / points

  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius
    const angle = i * angleStep
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius

    if (i === 0) {
      shape.moveTo(x, y)
    } else {
      shape.lineTo(x, y)
    }
  }

  shape.closePath()
  return shape
}

// GlamourAvatar component
export function GlamourAvatar({
  animation = "idle",
  isJumping = false,
  customization = {
    skinTone: "#FFDAB9",
    hairStyle: "waves",
    hairColor: "#FFB6C1",
    eyeColor: "#8B4513",
    lipColor: "#FF0000",
    blushColor: "#FF69B4",
    outfitStyle: "pink",
    outfitColor: "#FF69B4",
    accessoryStyle: "sunglasses",
    accessoryColor: "#FFFFFF",
    legwearStyle: "fluffy",
    legwearColor: "#FFFFFF",
    shoesStyle: "platforms",
    shoesColor: "#FF69B4",
    bagStyle: "designer",
    bagColor: "#FFFFFF",
    headwearStyle: "beret",
    headwearColor: "#FFFFFF",
    necklaceStyle: "pearls",
    necklaceColor: "#FFFFFF",
    glitterEffect: true,
  },
}) {
  const avatarRef = useRef()
  const sparklesRef = useRef([])
  const animationTimeRef = useRef(0)

  // Create and update sparkle effects
  useEffect(() => {
    if (customization.glitterEffect && avatarRef.current) {
      // Clear existing sparkles
      if (sparklesRef.current.length > 0) {
        sparklesRef.current.forEach((sparkle) => {
          if (sparkle.parent) sparkle.parent.remove(sparkle)
        })
        sparklesRef.current = []
      }

      // Create new sparkles
      const starShape = createStarShape()
      const starGeometry = new THREE.ShapeGeometry(starShape)
      const sparkleCount = 15

      for (let i = 0; i < sparkleCount; i++) {
        const material = new THREE.MeshBasicMaterial({
          color: Math.random() > 0.5 ? "#FFD700" : "#FFFFFF",
          side: THREE.DoubleSide,
          transparent: true,
          opacity: Math.random() * 0.5 + 0.5,
        })

        const sparkle = new THREE.Mesh(starGeometry, material)

        // Random position around the avatar
        const theta = Math.random() * Math.PI * 2
        const radius = Math.random() * 1.5 + 0.5
        const height = Math.random() * 2.5

        sparkle.position.set(Math.cos(theta) * radius, height, Math.sin(theta) * radius)

        sparkle.rotation.z = Math.random() * Math.PI
        sparkle.scale.setScalar(Math.random() * 0.5 + 0.5)

        // Add to avatar
        avatarRef.current.add(sparkle)
        sparklesRef.current.push(sparkle)
      }
    }

    return () => {
      // Cleanup sparkles
      if (sparklesRef.current.length > 0) {
        sparklesRef.current.forEach((sparkle) => {
          if (sparkle.parent) sparkle.parent.remove(sparkle)
        })
        sparklesRef.current = []
      }
    }
  }, [customization.glitterEffect])

  // Animation loop
  useFrame((state, delta) => {
    if (!avatarRef.current) return

    // Update animation time
    animationTimeRef.current += delta

    // Animate sparkles
    if (customization.glitterEffect && sparklesRef.current.length > 0) {
      sparklesRef.current.forEach((sparkle, i) => {
        // Pulsing opacity
        const material = sparkle.material
        material.opacity = 0.5 + Math.sin(animationTimeRef.current * 2 + i) * 0.5

        // Slow rotation
        sparkle.rotation.z += delta * 0.5
      })
    }

    // Handle different animations
    if (animation === "idle") {
      // Subtle idle animation - gentle bobbing
      avatarRef.current.position.y = Math.sin(animationTimeRef.current) * 0.05
    } else if (animation === "walk") {
      // Walking animation - slight bounce and sway
      avatarRef.current.position.y = Math.abs(Math.sin(animationTimeRef.current * 5)) * 0.1
      avatarRef.current.rotation.z = Math.sin(animationTimeRef.current * 5) * 0.05
    } else if (animation === "run") {
      // Running animation - more pronounced bounce and sway
      avatarRef.current.position.y = Math.abs(Math.sin(animationTimeRef.current * 10)) * 0.15
      avatarRef.current.rotation.z = Math.sin(animationTimeRef.current * 10) * 0.08
    } else if (animation === "jump") {
      // Jump animation handled by physics
    } else if (animation === "dance") {
      // Dance animation - fun bouncing and swaying
      avatarRef.current.position.y = Math.abs(Math.sin(animationTimeRef.current * 3)) * 0.2
      avatarRef.current.rotation.z = Math.sin(animationTimeRef.current * 2) * 0.15
      avatarRef.current.rotation.x = Math.sin(animationTimeRef.current * 2 + 1) * 0.05
    }
  })

  return (
    <group ref={avatarRef}>
      {/* Head - much larger for DTI style */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={customization.skinTone} />
      </mesh>

      {/* Face features */}
      {/* Eyes */}
      <mesh position={[-0.15, 1.85, 0.35]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={customization.eyeColor} />
      </mesh>
      <mesh position={[0.15, 1.85, 0.35]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={customization.eyeColor} />
      </mesh>

      {/* Blush */}
      <mesh position={[-0.25, 1.75, 0.35]} rotation={[0, 0, 0.5]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={customization.blushColor} transparent opacity={0.4} />
      </mesh>
      <mesh position={[0.25, 1.75, 0.35]} rotation={[0, 0, -0.5]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={customization.blushColor} transparent opacity={0.4} />
      </mesh>

      {/* Lips */}
      <mesh position={[0, 1.65, 0.38]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={customization.lipColor} />
      </mesh>

      {/* Hair based on style */}
      {customization.hairStyle === "waves" && (
        <>
          {/* Long wavy hair */}
          <mesh position={[0, 1.9, 0]}>
            <sphereGeometry args={[0.45, 32, 32]} />
            <meshStandardMaterial color={customization.hairColor} />
          </mesh>
          <mesh position={[0, 1.4, -0.1]}>
            <cylinderGeometry args={[0.4, 0.3, 1.2, 16]} />
            <meshStandardMaterial color={customization.hairColor} />
          </mesh>
        </>
      )}

      {customization.hairStyle === "ponytail" && (
        <>
          {/* High ponytail */}
          <mesh position={[0, 2.1, 0]}>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial color={customization.hairColor} />
          </mesh>
          <mesh position={[0, 2.3, -0.2]} rotation={[0.5, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.1, 0.8, 16]} />
            <meshStandardMaterial color={customization.hairColor} />
          </mesh>
        </>
      )}

      {/* Body - thinner for DTI style */}
      <mesh position={[0, 1.2, 0]}>
        <capsuleGeometry args={[0.15, 0.6, 16, 16]} />
        <meshStandardMaterial color={customization.outfitColor} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.25, 1.3, 0]} rotation={[0, 0, -0.2]}>
        <capsuleGeometry args={[0.05, 0.6, 8, 8]} />
        <meshStandardMaterial color={customization.skinTone} />
      </mesh>
      <mesh position={[0.25, 1.3, 0]} rotation={[0, 0, 0.2]}>
        <capsuleGeometry args={[0.05, 0.6, 8, 8]} />
        <meshStandardMaterial color={customization.skinTone} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.1, 0.5, 0]}>
        <capsuleGeometry args={[0.05, 0.8, 8, 8]} />
        <meshStandardMaterial color={customization.skinTone} />
      </mesh>
      <mesh position={[0.1, 0.5, 0]}>
        <capsuleGeometry args={[0.05, 0.8, 8, 8]} />
        <meshStandardMaterial color={customization.skinTone} />
      </mesh>

      {/* Leg warmers if selected */}
      {customization.legwearStyle === "fluffy" && (
        <>
          <mesh position={[-0.1, 0.2, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
            <meshStandardMaterial color={customization.legwearColor} />
          </mesh>
          <mesh position={[0.1, 0.2, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
            <meshStandardMaterial color={customization.legwearColor} />
          </mesh>
        </>
      )}

      {/* Shoes based on style */}
      {customization.shoesStyle === "platforms" && (
        <>
          <mesh position={[-0.1, 0.05, 0]}>
            <boxGeometry args={[0.1, 0.1, 0.2]} />
            <meshStandardMaterial color={customization.shoesColor} />
          </mesh>
          <mesh position={[0.1, 0.05, 0]}>
            <boxGeometry args={[0.1, 0.1, 0.2]} />
            <meshStandardMaterial color={customization.shoesColor} />
          </mesh>
        </>
      )}

      {customization.shoesStyle === "heels" && (
        <>
          <mesh position={[-0.1, 0.05, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.1, 16]} />
            <meshStandardMaterial color={customization.shoesColor} />
          </mesh>
          <mesh position={[-0.1, 0.02, 0.05]}>
            <boxGeometry args={[0.05, 0.04, 0.15]} />
            <meshStandardMaterial color={customization.shoesColor} />
          </mesh>
          <mesh position={[0.1, 0.05, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.1, 16]} />
            <meshStandardMaterial color={customization.shoesColor} />
          </mesh>
          <mesh position={[0.1, 0.02, 0.05]}>
            <boxGeometry args={[0.05, 0.04, 0.15]} />
            <meshStandardMaterial color={customization.shoesColor} />
          </mesh>
        </>
      )}

      {/* Accessories */}
      {/* Sunglasses */}
      {customization.accessoryStyle === "sunglasses" && (
        <mesh position={[0, 1.85, 0.4]}>
          <boxGeometry args={[0.5, 0.1, 0.05]} />
          <meshStandardMaterial color={customization.accessoryColor} />
        </mesh>
      )}

      {/* Beret */}
      {customization.headwearStyle === "beret" && (
        <mesh position={[0.1, 2.1, 0]}>
          <sphereGeometry args={[0.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={customization.headwearColor} />
        </mesh>
      )}

      {/* Pearl necklace */}
      {customization.necklaceStyle === "pearls" && (
        <mesh position={[0, 1.5, 0.2]}>
          <torusGeometry args={[0.15, 0.02, 16, 32]} />
          <meshStandardMaterial color={customization.necklaceColor} />
        </mesh>
      )}

      {/* Designer bag */}
      {customization.bagStyle === "designer" && (
        <mesh position={[-0.3, 1.1, 0.1]}>
          <boxGeometry args={[0.1, 0.15, 0.05]} />
          <meshStandardMaterial color={customization.bagColor} />
        </mesh>
      )}
    </group>
  )
}

export default GlamourAvatar
// Glamour Face component - Exaggerated features like in Dress to Impress
function GlamourFace({
  position = [0, 0, 0],
  eyeColor = "#8B4513",
  lipColor = "#FF0000",
  blushColor = "#FF69B4",
  skinTone = "#FFDAB9",
}: {
  position: [number, number, number]
  eyeColor?: string
  lipColor?: string
  blushColor?: string
  skinTone?: string
}) {
  const faceRef = useRef<THREE.Group>(null)

  return (
    <group position={position as any} ref={faceRef}>
      {/* Big eyes - much larger for DTI style */}
      <mesh position={[-0.25, 0.05, 0.25]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.25, 0.05, 0.25]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Iris and pupils - larger and more colorful */}
      <mesh position={[-0.25, 0.05, 0.45]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color={eyeColor} />
      </mesh>
      <mesh position={[0.25, 0.05, 0.45]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color={eyeColor} />
      </mesh>

      {/* Pupils - larger */}
      <mesh position={[-0.25, 0.05, 0.55]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[0.25, 0.05, 0.55]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Eye highlights - larger and more prominent */}
      <mesh position={[-0.3, 0.1, 0.6]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.2, 0.1, 0.6]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Eyelashes - more dramatic for DTI style */}
      <mesh position={[-0.25, 0.25, 0.45]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.25, 0.04, 0.02]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[0.25, 0.25, 0.45]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.25, 0.04, 0.02]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Additional eyelashes for more glamour */}
      <mesh position={[-0.35, 0.2, 0.45]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.1, 0.02, 0.02]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[0.35, 0.2, 0.45]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.1, 0.02, 0.02]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Nose - very small like DTI style */}
      <mesh position={[0, -0.05, 0.5]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color={skinTone} />
      </mesh>

      {/* Lips - much fuller for DTI style */}
      <group position={[0, -0.3, 0.5]}>
        <mesh>
          <sphereGeometry args={[0.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={lipColor} roughness={0.3} metalness={0.2} />
        </mesh>
      </group>

      {/* Blush - more prominent */}
      <mesh position={[-0.35, -0.15, 0.3]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={blushColor} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0.35, -0.15, 0.3]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={blushColor} transparent opacity={0.6} />
      </mesh>
    </group>
  )
}

// Glamour Hair component - More voluminous and styled
function GlamourHair({ hairStyle = "waves", hairColor = "#FFB6C1" }: { hairStyle?: string; hairColor?: string }) {
  switch (hairStyle) {
    case "waves":
      return (
        <group>
          {/* Base hair - larger and more voluminous */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.72, 32, 32]} />
            <meshStandardMaterial color={hairColor} roughness={0.6} metalness={0.2} />
          </mesh>

          {/* Long flowing hair - more voluminous and wavy */}
          <mesh position={[0, -0.8, -0.1]}>
            <capsuleGeometry args={[0.5, 1.5, 16, 16]} />
            <meshStandardMaterial color={hairColor} roughness={0.6} metalness={0.2} />
          </mesh>

          {/* Side hair strands - more defined */}
          <mesh position={[-0.5, -0.4, 0.1]}>
            <capsuleGeometry args={[0.2, 0.9, 8, 8]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
          <mesh position={[0.5, -0.4, 0.1]}>
            <capsuleGeometry args={[0.2, 0.9, 8, 8]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>

          {/* Front bangs - DTI style often has defined bangs */}
          <mesh position={[0, 0.2, 0.5]}>
            <boxGeometry args={[0.9, 0.25, 0.25]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>

          {/* Hair strands framing face */}
          <mesh position={[-0.4, -0.2, 0.4]} rotation={[0, 0, Math.PI / 6]}>
            <capsuleGeometry args={[0.1, 0.6, 8, 8]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
          <mesh position={[0.4, -0.2, 0.4]} rotation={[0, 0, -Math.PI / 6]}>
            <capsuleGeometry args={[0.1, 0.6, 8, 8]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
        </group>
      )

    case "ponytail":
      return (
        <group>
          {/* Base hair - larger */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.72, 32, 32]} />
            <meshStandardMaterial color={hairColor} roughness={0.6} metalness={0.2} />
          </mesh>

          {/* High ponytail */}
          <mesh position={[0, 0.3, -0.4]}>
            <capsuleGeometry args={[0.3, 1.2, 16, 16]} />
            <meshStandardMaterial color={hairColor} roughness={0.6} metalness={0.2} />
          </mesh>

          {/* Front bangs */}
          <mesh position={[0, 0.2, 0.5]}>
            <boxGeometry args={[0.9, 0.25, 0.25]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>

          {/* Hair strands framing face */}
          <mesh position={[-0.4, -0.2, 0.4]} rotation={[0, 0, Math.PI / 6]}>
            <capsuleGeometry args={[0.1, 0.6, 8, 8]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
          <mesh position={[0.4, -0.2, 0.4]} rotation={[0, 0, -Math.PI / 6]}>
            <capsuleGeometry args={[0.1, 0.6, 8, 8]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>

          {/* Ponytail tie */}
          <mesh position={[0, 0.3, -0.3]}>
            <torusGeometry args={[0.15, 0.05, 16, 16]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
      )

    default:
      return (
        <group>
          {/* Default glamorous hair */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.72, 32, 32]} />
            <meshStandardMaterial color={hairColor} roughness={0.6} metalness={0.2} />
          </mesh>

          {/* Front styling */}
          <mesh position={[0, 0.2, 0.5]}>
            <boxGeometry args={[0.9, 0.25, 0.25]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
        </group>
      )
  }
}

// Glamour Beret component
function GlamourBeret({ color = "#FFFFFF" }: { color?: string }) {
  return (
    <group position={[0, 0.6, 0]}>
      {/* Beret base */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 8, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.6, 0.2, 32]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>

      {/* Beret top */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>

      {/* Beret accent */}
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}

// Glamour Sunglasses component
function GlamourSunglasses({ color = "#FFFFFF" }: { color?: string }) {
  return (
    <group position={[0, 0.5, 0.3]}>
      {/* Left lens - cat eye style */}
      <mesh position={[-0.25, 0, 0]}>
        <boxGeometry args={[0.3, 0.15, 0.05]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Right lens - cat eye style */}
      <mesh position={[0.25, 0, 0]}>
        <boxGeometry args={[0.3, 0.15, 0.05]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Bridge */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.15, 0.03, 0.03]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Frame top - cat eye style */}
      <mesh position={[-0.25, 0.08, 0]}>
        <boxGeometry args={[0.3, 0.03, 0.05]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.25, 0.08, 0]}>
        <boxGeometry args={[0.3, 0.03, 0.05]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Cat eye corners */}
      <mesh position={[-0.38, 0.05, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.1, 0.03, 0.05]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.38, 0.05, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.1, 0.03, 0.05]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Temples */}
      <mesh position={[-0.4, 0, -0.15]}>
        <boxGeometry args={[0.03, 0.03, 0.4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.4, 0, -0.15]}>
        <boxGeometry args={[0.03, 0.03, 0.4]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}

// Glamour Dress component
function GlamourDress({ color = "#FF69B4", glitter = true }: { color?: string; glitter?: boolean }) {
  return (
    <group>
      {/* Dress bodice - fitted */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.15, 0.2, 16, 8]} />
        <meshStandardMaterial color={color} roughness={glitter ? 0.3 : 0.6} metalness={glitter ? 0.7 : 0.2} />
      </mesh>

      {/* Dress skirt - flared */}
      <mesh position={[0, -0.4, 0]}>
        <coneGeometry args={[0.4, 0.6, 16, 1, false, 0, Math.PI * 2]} />
        <meshStandardMaterial color={color} roughness={glitter ? 0.3 : 0.6} metalness={glitter ? 0.7 : 0.2} />
      </mesh>

      {/* Dress details - sparkles */}
      {glitter && (
        <>
          <mesh position={[0.1, -0.2, 0.15]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#FFFFFF" metalness={1} roughness={0.2} />
          </mesh>
          <mesh position={[-0.15, -0.3, 0.2]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#FFFFFF" metalness={1} roughness={0.2} />
          </mesh>
          <mesh position={[0.2, -0.5, 0.1]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#FFFFFF" metalness={1} roughness={0.2} />
          </mesh>
          <mesh position={[-0.1, -0.6, 0.15]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#FFFFFF" metalness={1} roughness={0.2} />
          </mesh>
        </>
      )}
    </group>
  )
}

// Glamour Necklace component
function GlamourNecklace({ color = "#FFFFFF" }: { color?: string }) {
  return (
    <group position={[0, 0.3, 0.15]}>
      {/* Pearl strand */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI
        const x = Math.sin(angle) * 0.15
        const y = -Math.cos(angle) * 0.05
        return (
          <mesh key={i} position={[x, y, 0]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshStandardMaterial color={color} metalness={0.2} roughness={0.3} />
          </mesh>
        )
      })}

      {/* Center pearl - larger */}
      <mesh position={[0, -0.05, 0.03]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.3} />
      </mesh>
    </group>
  )
}

// Glamour Bag component
function GlamourBag({
  position = [0, 0, 0],
  color = "#FFFFFF",
}: { position?: [number, number, number]; color?: string }) {
  return (
    <group position={position as any}>
      {/* Bag body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.15, 0.15, 0.05]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Bag handle */}
      <mesh position={[0, 0.1, 0]}>
        <torusGeometry args={[0.05, 0.01, 16, 16, Math.PI]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Designer logo */}
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[0.05, 0.05, 0.01]} />
        <meshStandardMaterial color="gold" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

// Glamour Leg component
function GlamourLeg({
  side = "left",
  legwearStyle = "fluffy",
  legwearColor = "#FFFFFF",
  skinTone = "#FFDAB9",
  shoesStyle = "platforms",
  shoesColor = "#FF69B4",
}: {
  side?: string
  legwearStyle?: string
  legwearColor?: string
  skinTone?: string
  shoesStyle?: string
  shoesColor?: string
}) {
  const legOffset = side === "left" ? -0.05 : 0.05

  return (
    <group position={[legOffset, 0, 0]}>
      {/* Leg - much longer and thinner for DTI proportions */}
      <mesh position={[0, -0.9, 0]}>
        <capsuleGeometry args={[0.03, 1.8, 8, 8]} />
        <meshStandardMaterial color={skinTone} />
      </mesh>

      {/* Leg warmers if applicable */}
      {legwearStyle === "fluffy" && (
        <group>
          <mesh position={[0, -1.5, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
            <meshStandardMaterial color={legwearColor} roughness={0.9} />
          </mesh>

          {/* Fluffy texture details */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2
            const x = Math.sin(angle) * 0.08
            const z = Math.cos(angle) * 0.08
            return (
              <mesh key={i} position={[x, -1.5, z]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshStandardMaterial color={legwearColor} />
              </mesh>
            )
          })}
        </group>
      )}

      {/* Shoes - platform heels */}
      {shoesStyle === "platforms" && (
        <group position={[0, -1.8, 0.05]}>
          {/* Platform base */}
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[0.1, 0.1, 0.2]} />
            <meshStandardMaterial color={shoesColor} roughness={0.4} metalness={0.3} />
          </mesh>

          {/* Heel */}
          <mesh position={[0, -0.1, -0.05]}>
            <boxGeometry args={[0.08, 0.15, 0.05]} />
            <meshStandardMaterial color={shoesColor} roughness={0.4} metalness={0.3} />
          </mesh>
        </group>
      )}
    </group>
  )
}

