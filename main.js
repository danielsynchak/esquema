import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ---------- Cena e mixer ----------
let cena = new THREE.Scene();
let misturador = new THREE.AnimationMixer(cena);
let acaoMover = null;
let acaoRodar = null;
let acaoDisco = null;


const materialOriginal = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
const materialNovo = new THREE.MeshStandardMaterial({ color: 0xff0000 });


// ---------- Câmera ----------
let camara = new THREE.PerspectiveCamera(70, 800 / 600, 0.1, 1000);
camara.position.set(0.5, 0.5, 0.5); // posição inicial mais próxima do objeto

// ---------- Renderer ----------
let meuCanvas = document.getElementById('meuCanvas');
let renderer = new THREE.WebGLRenderer({ canvas: meuCanvas, antialias: true });
renderer.setSize(800, 600);
renderer.setClearColor(0x000000, 1); // cor padrão caso a textura falhe

// ---------- OrbitControls ----------
let controlos = new OrbitControls(camara, renderer.domElement);
controlos.target.set(0, 0, 0);
controlos.update();

// ---------- Luzes ----------
let luzes = new THREE.PointLight('white', 100);
luzes.position.set(5, 3, 5);
cena.add(luzes);

// ---------- Fundo 360° (esfera invertida) ----------
let skySphere;
const loaderTextura = new THREE.TextureLoader();
loaderTextura.load('images/cena.png', function(texture) {
    const geometria = new THREE.SphereGeometry(50, 60, 40);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide
    });
    skySphere = new THREE.Mesh(geometria, material);
    cena.add(skySphere);
});

// ---------- Carregamento do GLTF ----------
let baseMesh;
let carregador = new GLTFLoader();


carregador.load('RecordPlayerTeste3gltf.gltf', function(gltf) {
    cena.add(gltf.scene);

    // encontrar a mesh pelo nome
    gltf.scene.traverse((child) => {
        if (child.isMesh && child.name === "Base") {
            baseMesh = child;
            // opcional: setar o material original inicialmente
            baseMesh.material = materialOriginal;
        }
    });

    let clip1 = THREE.AnimationClip.findByName(gltf.animations, '[Action Stash]');
    acaoMover = misturador.clipAction(clip1);

    let clip2 = THREE.AnimationClip.findByName(gltf.animations, 'LevantarAgulha');
    acaoRodar = misturador.clipAction(clip2);

    let clip3 = THREE.AnimationClip.findByName(gltf.animations, 'VinylDiskAction');
    acaoDisco = misturador.clipAction(clip3);
});


document.getElementById('btn_mudar_base').onclick = function() {
    if (baseMesh) {
        baseMesh.material = materialNovo; // troca para o novo material
    }
};


// ---------- Botões de controle ----------
document.getElementById('btn_tampa').onclick = function() {
    acaoMover.reset();
    acaoMover.play();
};

document.getElementById('btn_disco').onclick = function() {
    acaoDisco.reset();
    acaoDisco.play();
};

document.getElementById('btn_agulha').onclick = function() {
    acaoRodar.reset();
    acaoRodar.play();
};

document.getElementById('btn_stop').onclick = function() {
    acaoMover.stop();
    acaoRodar.stop();
};

document.getElementById('btn_pause').onclick = function() {
    acaoMover.paused = !acaoMover.paused;
    acaoRodar.paused = !acaoRodar.paused;
};

document.getElementById('btn_reverse').onclick = function() {
    acaoMover.timeScale = -acaoMover.timeScale;
    acaoRodar.timeScale = -acaoRodar.timeScale;
};

document.getElementById('menu_loop').onchange = function() {
    switch (this.value) {
        case '1':
            acaoMover.clampWhenFinished = true;
            acaoMover.setLoop(THREE.LoopOnce);
            acaoRodar.clampWhenFinished = true;
            acaoRodar.setLoop(THREE.LoopOnce);
            acaoDisco.clampWhenFinished = true;
            acaoDisco.setLoop(THREE.LoopOnce);
            break;
        case '2':
            acaoMover.setLoop(THREE.LoopRepeat);
            acaoRodar.setLoop(THREE.LoopRepeat);
            break;
        case '3':
            acaoMover.setLoop(THREE.LoopPingPong);
            acaoRodar.setLoop(THREE.LoopPingPong);
            break;
    }
};

// ---------- Animação ----------
let delta = 0;
let relogio = new THREE.Clock();
let latencia_minima = 1 / 60;

function animar() {
    requestAnimationFrame(animar);

    delta += relogio.getDelta();
    if (delta < latencia_minima) return;
    const latenciaDiscreta = Math.floor(delta / latencia_minima) * latencia_minima;
    misturador.update(latenciaDiscreta);
    delta = delta % latencia_minima;

    // manter a esfera centrada na câmera (fundo 360°)
    if (skySphere) skySphere.position.copy(camara.position);

    renderer.render(cena, camara);
}

animar();
