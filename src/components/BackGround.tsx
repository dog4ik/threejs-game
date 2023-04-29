import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  MathUtils,
  Mesh,
  SphereGeometry,
  MeshStandardMaterial,
  PointLight,
  GridHelper,
  PointLightHelper,
  PlaneGeometry,
  Vector3,
  DoubleSide,
  TetrahedronGeometry,
  SpotLight,
  SpotLightHelper,
} from "three";
import Stats from "stats.js";
import { degToRad } from "three/src/math/MathUtils";
const BackGround = () => {
  const stats = new Stats();
  stats.showPanel(0);
  document.body.appendChild(stats.dom);
  let PLAYER_SPEED = 0.5;
  let ACCELERATION_SPEED = 0.02;
  let PLAYER_SLOWDOWN = 0.2;
  let MAX_SPEED = 1;

  const canvas = document.querySelector("#bg");
  if (!canvas) return null;
  const scene = new Scene();
  const camera = new PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
  });
  const stars: Mesh<SphereGeometry, MeshStandardMaterial>[] = [];
  function moveCamera() {
    const movementVector = new Vector3(0, 0, 0);

    if (moveState.forward) {
      movementVector.z -= 1;
    }
    if (moveState.left) {
      movementVector.x -= 1;
    }
    if (moveState.back) {
      movementVector.z += 1;
    }
    if (moveState.right) {
      movementVector.x += 1;
    }
    if (Object.values(moveState).some((dir) => dir === true)) {
      PLAYER_SPEED = Math.min(PLAYER_SPEED + ACCELERATION_SPEED, MAX_SPEED);
    } else {
      PLAYER_SPEED = Math.max(PLAYER_SPEED - ACCELERATION_SPEED, 0);
    }
    if (movementVector.length() > 0) {
      movementVector.normalize();
    }
    console.log(PLAYER_SPEED);

    const scaledVector = movementVector.multiplyScalar(PLAYER_SPEED);
    player.position.add(scaledVector);
    camera.position.add(scaledVector);
    pointLight.position.add(scaledVector);
    spotLight.position.add(scaledVector);
    const [x, y, z] = [player.position.x, player.position.y, player.position.z];
    spotLight.target.position.set(x, y, z + -10);
    spotLight.target.updateMatrixWorld();
  }
  function handleControls(e: KeyboardEvent, isPressed: boolean) {
    e.preventDefault();
    switch (e.code) {
      case "KeyW":
        moveState.forward = isPressed;
        break;
      case "KeyA":
        moveState.left = isPressed;
        break;
      case "KeyS":
        moveState.back = isPressed;
        break;
      case "KeyD":
        moveState.right = isPressed;
        break;

      default:
        break;
    }
  }
  function addStar() {
    const geometry = new SphereGeometry(0.5, 24, 24);
    const material = new MeshStandardMaterial({ color: 0xff0000 });
    const star = new Mesh(geometry, material);

    const [x, y, z] = [...Array(3)].map(() => MathUtils.randFloatSpread(100));
    console.log(x, y, z);

    star.position.set(x, 0, z);
    stars.push(star);
    scene.add(star);
  }

  const moveState = {
    forward: false,
    left: false,
    back: false,
    right: false,
  };
  const playerGeometry = new TetrahedronGeometry(3);
  const playerMaterial = new MeshStandardMaterial({ color: 0xff00ff });
  const player = new Mesh(playerGeometry, playerMaterial);
  const groundGeometry = new PlaneGeometry(100, 200);
  const groundMaterial = new MeshStandardMaterial({
    color: 0xffff00,
    side: DoubleSide,
  });
  const ground = new Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = Math.PI / 2;
  player.rotateY(degToRad(-45));
  player.position.setY(3);

  scene.add(player, ground);

  [...Array(100)].forEach(addStar);

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.setX(0);
  camera.position.setY(20);
  camera.rotateX(-degToRad(90));
  function handleResize(e: UIEvent) {}
  document.addEventListener("keydown", (e) => handleControls(e, true));
  document.addEventListener("keyup", (e) => handleControls(e, false));
  window.addEventListener("resize", handleResize);

  renderer.render(scene, camera);
  const pointLight = new PointLight(0xffffff, 1, 40);
  const spotLight = new SpotLight(0xffffff, 10, 40, 20);
  spotLight.angle = Math.PI / 4;
  pointLight.position.set(0, 10, 0);

  scene.add(pointLight, spotLight);

  const grid = new GridHelper(100);
  const lightHelper = new PointLightHelper(pointLight);
  const spotLightHelper = new SpotLightHelper(spotLight);
  scene.add(grid, lightHelper, spotLightHelper);

  function animate() {
    requestAnimationFrame(animate);
    stats.update();
    moveCamera();

    stars.forEach((star) => {
      //star.translateZ(0.2);
    });

    // controls.update();

    renderer.render(scene, camera);
  }

  animate();
};

export default BackGround;
