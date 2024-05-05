import * as THREE from "three"
import WindowContext from "./js/WindowContext"
import SceneBouncingBubbles from "./js/scenarios/BouncingBubbles/SceneBouncingBubbles"
import { askMotionAccess } from "./js/utils/device/DeviceAccess"
import SceneScenario3D from "./js/scenarios/Scenario3D/SceneScenario3D"

/** device access */
const btn = document.getElementById("btn-access")
btn.addEventListener("click", askMotionAccess(), false)

/** reload */
const btnReload = document.getElementById("btn-reload")
btnReload.addEventListener(
  "click",
  function () {
    window.location.reload()
  },
  false
)

/** scenarios */
const scene1 = new SceneBouncingBubbles(20)
const scene2 = new SceneScenario3D("canvas-scene-3d")
const scene3 = new SceneBouncingBubbles(10, "canvas-scene-2")

const windowContext = new WindowContext()
console.log(windowContext.scenes)
const time = windowContext.time

const update = () => {
  const outFromScene1 = scene1.bubbles.filter((b) => b.y > scene1.height - 20)
  console.log("Bubbles moving from Scene 1 to Scene 3:", outFromScene1.length)
  scene1.bubbles = scene1.bubbles.filter((b) => b.y <= scene1.height - 20)

  outFromScene1.forEach((bubble) => {
    bubble.y -= scene3.height
    scene3.addBubble(bubble.x, bubble.y, bubble.vx, bubble.vy)
    console.log(
      `Adding rectangle for bubble at x: ${bubble.x}, y: ${
        scene2.height - bubble.radius
      }`
    )
    scene2.addRectangle(
      bubble.x,
      scene2.height - bubble.radius,
      "green",
      50,
      50
    ) // Customize color and size as needed
  })

  const outFromScene3 = scene3.bubbles.filter((b) => b.y > scene3.height - 20)
  console.log("Bubbles moving from Scene 3 to Scene 1:", outFromScene3.length)
  scene3.bubbles = scene3.bubbles.filter((b) => b.y <= scene3.height - 20)

  outFromScene3.forEach((bubble) => {
    bubble.y -= scene1.height
    scene1.addBubble(bubble.x, bubble.y, bubble.vx, bubble.vy)
    console.log(
      `Adding rectangle for bubble at x: ${bubble.x}, y: ${
        scene3.height - bubble.radius
      }`
    )
    scene2.addRectangle(bubble.x, scene3.height - bubble.radius, "red", 50, 10) // Different color to indicate different direction
  })
}

function animate() {
  requestAnimationFrame(animate)
  scene1.update()
  scene2.update() // This should update the physics world and render the scene
  scene3.update()
}

// Start the animation loop
animate()

time.on("update", update)
