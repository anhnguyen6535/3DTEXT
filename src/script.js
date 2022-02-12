import './style.css'
import * as THREE from 'three'
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from '../node_modules/three/examples/jsm/loaders/FontLoader.js'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

const parameters = {
    size: 0.5,
    height: 0.5, //depth
    curveSegments: 12,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Axes Helper
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/7.png')

/**
 * Font Loader
 */
const fontLoader = new FontLoader()

//load(filepath, fc will be triggered when the font is loaded)
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        //console.log('h')
        const textGeometry = new TextGeometry(
            'Anh\'s universe',
            {
                font,
                size: 0.5,
                height: 0.5, //depth
                curveSegments: 15,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )

        // textGeometry.computeBoundingBox()
        // textGeometry.translate(
        //     - textGeometry.boundingBox.max.x * 0.5,
        //     - textGeometry.boundingBox.max.y * 0.5,
        //     - textGeometry.boundingBox.max.z * 0.5
        // )
        //console.log(textGeometry.boundingBox)
        textGeometry.center()

        const material = new THREE.MeshMatcapMaterial({matcap: matcapTexture}) //wireframe: true})
        const materialNormal = new THREE.MeshNormalMaterial()
        const text = new THREE.Mesh(textGeometry, materialNormal)

        // gui
        //     .add(parameters,'size').onChange((size) => {textGeometry.parameters.size = size})

        scene.add(text)

        const donusGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 25)
       

        for(let i = 0; i < 200; i++)
        {
            const donus = new THREE.Mesh(donusGeometry, materialNormal)

            donus.position.x = (Math.random() - 0.5) * 10
            donus.position.y = (Math.random() - 0.5) * 10
            donus.position.z = (Math.random() - 0.5) * 10

            donus.rotation.x = Math.random() * Math.PI
            donus.rotation.y = Math.random() * Math.PI

            const random = Math.random()
            donus.scale.set(random, random, random)

            scene.add(donus)
        }
    }
)


/**
 * Object
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

//scene.add(cube)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()