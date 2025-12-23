import * as THREE from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

let cena=new THREE.Scene()

let misturador=new THREE.AnimationMixer(cena)
let acaoMover=null
let acaoRodar=null



let camara=new THREE.PerspectiveCamera(70,800/600,0.1,1000)
camara.position.set(6,4,7)
let meuCanvas=document.getElementById('meuCanvas')
let renderer=new THREE.WebGLRenderer({canvas:meuCanvas})
renderer.setSize(800,600)

let grelha=new THREE.GridHelper()
cena.add(grelha)

let controlos=new OrbitControls(camara,renderer.domElement)

let luzes=new THREE.PointLight('white',100)
luzes.position.set(5,3,5)
cena.add(luzes) 

let carregador=new GLTFLoader()
carregador.load(
    'RecordPlayerTeste3gltf.gltf',
    function(gltf){
        cena.add(gltf.scene)
        
        let clip1=THREE.AnimationClip.findByName(gltf.animations,'[Action Stash]')
        acaoMover=misturador.clipAction(clip1)
        

        let clip2=THREE.AnimationClip.findByName(gltf.animations,'LevantarAgulha')
        acaoRodar=misturador.clipAction(clip2)
        
    
    }
)
document.getElementById('btn_tampa').onclick=function(){
    acaoMover.play()
    
}
document.getElementById('btn_agulha').onclick=function(){
    
    acaoRodar.play()
}
document.getElementById('btn_stop').onclick=function(){
    acaoMover.stop()
    acaoRodar.stop()
}
document.getElementById('btn_pause').onclick=function(){
    acaoMover.paused=!acaoMover.paused
    acaoRodar.paused=!acaoRodar.paused
}
document.getElementById('btn_reverse').onclick=function(){
    acaoMover.timeScale=-acaoMover.timeScale
    acaoRodar.timeScale=-acaoRodar.timeScale
}
document.getElementById('menu_loop').onchange=function(){
    switch(this.value){
        case '1':
            acaoMover.clampWhenFinished=true
            acaoMover.setLoop(THREE.LoopOnce)

            acaoRodar.clampWhenFinished=true
            acaoRodar.setLoop(THREE.LoopOnce)
            break
        case '2':
            acaoMover.setLoop(THREE.LoopRepeat)
            acaoRodar.setLoop(THREE.LoopRepeat)
            break
        case '3':
            acaoMover.setLoop(THREE.LoopPingPong)
            acaoRodar.setLoop(THREE.LoopPingPong)
            break
    }
}


let delta=0//tempo desde a ultima frame
let relogio=new THREE.Clock()//componente que obtem o delta
let latencia_minima=1/60 //tempo minimo entre cada atualizacao

function animar(){
    requestAnimationFrame(animar)
    
    delta+=relogio.getDelta()//acumular tempo entre cada atualizacao
    if(delta<latencia_minima)
        return //nao exceder a taxa de atualizacao
    const latenciaDiscreta=Math.floor(delta/latencia_minima)*latencia_minima
    misturador.update(latenciaDiscreta)
    
    delta=delta%latencia_minima
    renderer.render( cena, camara )
    
    
}

animar()








