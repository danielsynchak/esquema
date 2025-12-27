import * as THREE from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ---------- Cena e mixer ----------
let cena = new THREE.Scene();
let misturador = new THREE.AnimationMixer(cena);
let acaoMover = null;
let acaoRodar = null;
let acaoDisco = null;

/*
let materialBlackMatte;
let materialOther; // vai guardar o material chamado "BlackMattePlastic"
       // exemplo de outro material*/
let materiais = {};   // vai guardar todos os materiais
   



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

let luzesTraseira = new THREE.PointLight('white', 100);
luzesTraseira.position.set(-5, -3, -5);
cena.add(luzesTraseira);

let luzesBaixo = new THREE.PointLight('white', 100);
luzesBaixo.position.set(-5, -3, -20);
cena.add(luzesBaixo);



// ---------- Fundo 360° (esfera invertida) ----------
let skySphere;
const loaderTextura = new THREE.TextureLoader();
loaderTextura.load('images/cena.png', function (texture) {
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


carregador.load('blender/RecordPlayerTeste1.gltf', function (gltf) {
    cena.add(gltf.scene);

    // encontrar a mesh pelo nome
    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            // 1️⃣ Guardar o material pelo nome
            if (child.material && child.material.name) {
                materiais[child.material.name] = child.material;
            }

            // 2️⃣ Guardar a mesh "Base"
            if (child.name === "Base") {
                baseMesh = child;
            }
            /*
                        // verificar o nome do material
                        if (child.material.name === "BlackMattePlastic") {
                            materialBlackMatte = child.material;
                        }
            
                        if (child.material.name === "BlackGlossyPlasticBaked") {
                            materialOther = child.material;
                        }
            
                        // se for a mesh que você quer manipular
                        if (child.name === "Base") {
                            baseMesh = child; // salvar a mesh Base
                        }*/
        }
    });
    console.log(materiais);
    console.log(baseMesh);

    let clip1 = THREE.AnimationClip.findByName(gltf.animations, 'Abrir');
    acaoMover = misturador.clipAction(clip1);

    let clip2 = THREE.AnimationClip.findByName(gltf.animations, 'LevantarAgulha');
    acaoRodar = misturador.clipAction(clip2);

    let clip3 = THREE.AnimationClip.findByName(gltf.animations, 'VinylDiskAction');
    acaoDisco = misturador.clipAction(clip3);
});

/*
document.getElementById('btn_BlackMattePlastic').onclick = function () {
    if (baseMesh && materiais[nomeMaterial]) {
            baseMesh.material = materiais[nomeMaterial];
            baseMesh.material.needsUpdate = true;
        }
};
document.getElementById('btn_BlackGlossyPlasticBaked').onclick = function () {
    if (baseMesh && materiais[nomeMaterial]) {
            baseMesh.material = materiais[nomeMaterial];
            baseMesh.material.needsUpdate = true;
        }
};*/

document.querySelectorAll('[id^="btn_"]').forEach((botao) => {
    botao.addEventListener('click', () => {

        // tira "btn_" do id
        const nomeMaterial = botao.id.replace('btn_', '');

        // verifica se existe
        if (baseMesh && materiais[nomeMaterial]) {
            baseMesh.material = materiais[nomeMaterial];
            baseMesh.material.needsUpdate = true;
        }
    });
});




// ---------- Botões de controle ----------
document.getElementById('btn_tampa').onclick = function () {
    acaoMover.reset();
    acaoMover.play();
};

document.getElementById('btn_disco').onclick = function () {
    acaoDisco.reset();
    acaoDisco.play();
};

document.getElementById('btn_agulha').onclick = function () {
    acaoRodar.reset();
    acaoRodar.play();
};

document.getElementById('btn_stop').onclick = function () {
    acaoMover.stop();
    acaoRodar.stop();
    acaoDisco.stop();
};

document.getElementById('btn_pause').onclick = function () {
    acaoMover.paused = !acaoMover.paused;
    acaoRodar.paused = !acaoRodar.paused;
    acaoDisco.paused = !acaoDisco.paused;
};

document.getElementById('btn_reverse').onclick = function () {
    acaoMover.timeScale = -acaoMover.timeScale;
    acaoRodar.timeScale = -acaoRodar.timeScale;
    acaoDisco.timeScale = -acaoDisco.timeScale;
};

document.getElementById('menu_loop').onchange = function () {
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
            acaoDisco.setLoop(THREE.LoopRepeat);
            break;
        case '3':
            acaoMover.setLoop(THREE.LoopPingPong);
            acaoRodar.setLoop(THREE.LoopPingPong);
            acaoDisco.setLoop(THREE.LoopPingPong);
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


