import React, {useState, useEffect} from 'react'
import Hydra from 'hydra-synth'
import p5 from 'p5'
import axios from 'axios'

import './style.css'

let videos = []
let ref
let mainObj = []

const html = require('nanohtml')
let canvasIn = false
let hydra

const App = () => {
  const [evalCode, setEvalCode] = useState(false)
  const [code, setCode] = useState('')
  const [v_active, setv_active] = useState([0,0,0,0,0,0,0,0,0,0])
  const [fontS, setFontS] = useState(1)
  const [fontC, setFontC] = useState('rgb(0,0,0)')
  const [hideCode, setHideCode] = useState(false)
  const [p5canvas, setp5Canvas] = useState(null)
  const [displayError, setDisplayError] = useState('')
  const [menu,setMenu] = useState(false)
  const [file0,setFile0] = useState('')
  const [file1,setFile1] = useState('')
  const [file2,setFile2] = useState('')
  const [file3,setFile3] = useState('')
  const [file4,setFile4] = useState('')
  const [file5,setFile5] = useState('')
  const [file6,setFile6] = useState('')
  const [file7,setFile7] = useState('')
  const [file8,setFile8] = useState('')
  const [file9,setFile9] = useState('')

  useEffect(()=>{
    if(canvasIn){
      const canvasHydra = html`<canvas style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index:5000; overflow: hidden"></canvas>`
      canvasHydra.width = window.innerWidth
      canvasHydra.height = window.innerHeight
      document.body.appendChild(canvasHydra)
      hydra = new Hydra({
       detectAudio: false, canvas: canvasHydra
      })
      canvasIn = false
      hydra.eval('hush()')
    }
  },[])

  const video = (objMain) => {
      if(typeof ref !== 'undefined'){
        ref.remove()
      }
      const code = (s) => {
        let loadedV
        s.setup = () => {
          loadedV = [false,false,false,false,false,false,false,false,false,false]
          for(let i = 0; i < 10; i++){
            if(objMain[i].active && objMain[i].type === 'video'){
              axios.get(objMain[i].url).then((e)=> {
                videos[objMain[i].pos] = s.createVideo(e.config.url,()=>{
                  loadedV[objMain[i].pos] = true
                  videos[objMain[i].pos].hide()
                  videos[objMain[i].pos].volume(1)
                  videos[objMain[i].pos].loop()
                })
              })
            }
            if(objMain[i].active && objMain[i].type === 'image'){
              axios.get(objMain[i].url).then((e)=> {
                videos[objMain[i].pos] = s.createImg(e.config.url,'','',()=>{
                  loadedV[objMain[i].pos] = true
                  videos[objMain[i].pos].hide()
                })
              })
            }
            if(objMain[i].active && objMain[i].type === 'camera'){
              videos[objMain[i].pos] = s.createCapture(s.VIDEO);
              loadedV[objMain[i].pos] = true
              videos[objMain[i].pos].hide()
            }
          }

          let cnv = s.createCanvas(window.innerWidth,window.innerHeight, s.WEBGL)
          cnv.style('background-color','rgba(255,255,255,0)')
          cnv.style('background','rgba(255,255,255,0)')
          cnv.style('position','fixed')
          // cnv.style('top','-100vh')
          cnv.id('p5canvas')
          setp5Canvas(cnv.canvas)
          // hydra.s[3].init({src: p5canvas})
          // hydra.eval('src(s3).out()')
        }
        s.draw = () => {
          s.strokeWeight(0)
          s.background(0,0,0,0)
          for(let i = 0; i < 10; i++){
            if(loadedV[i]){
              let sc = typeof objMain[i].scale !== 'undefined' ? objMain[i].scale : 1
              s.tint(
                typeof objMain[i].r !== 'undefined' ? objMain[i].r : 255,
                typeof objMain[i].g !== 'undefined' ? objMain[i].g : 255,
                typeof objMain[i].b !== 'undefined' ? objMain[i].b : 255,
                typeof objMain[i].opacity !== 'undefined' ? objMain[i].opacity : 255
              )
              s.push()
              if(objMain[i].shape === 'rect'){
                s.translate(-s.width/2,-s.height/2)
              }
              if(typeof objMain[i].rotSpeedX !== 'undefined'){
                s.rotateX(
                  typeof objMain[i].rotX !== 'undefined' ? objMain[i].rotX * s.frameCount * objMain[i].rotSpeedX: 0
                )
              }
              if(typeof objMain[i].rotSpeedX === 'undefined'){
                s.rotateX(
                  typeof objMain[i].rotX !== 'undefined' ? objMain[i].rotX * s.frameCount * 0.1: 0
                )
              }
              if(typeof objMain[i].rotSpeedY === 'undefined'){
                s.rotateY(
                  typeof objMain[i].rotY !== 'undefined' ? objMain[i].rotY * s.frameCount * 0.1: 0
                )
              }
              if(typeof objMain[i].rotSpeedY !== 'undefined'){
                s.rotateY(
                  typeof objMain[i].rotY !== 'undefined' ? objMain[i].rotY * s.frameCount * objMain[i].rotSpeedY: 0
                )
              }
              s.texture(videos[objMain[i].pos])
              // s.quad(
              //   typeof objMain[i].posX !== 'undefined' ? objMain[i].posX : 0,
              //   typeof objMain[i].posY !== 'undefined' ? objMain[i].posY : 0,
              //   typeof objMain[i].width !== 'undefined' ? objMain[i].width : window.innerWidth,
              //   0,
              //   typeof objMain[i].width !== 'undefined' ? objMain[i].width : window.innerWidth,
              //   typeof objMain[i].height !== 'undefined' ? objMain[i].height : window.innerHeight,
              //   0,
              //   typeof objMain[i].height !== 'undefined' ? objMain[i].height : window.innerHeight,
              // )
              if(objMain[i].shape === 'rect'){
                s.rect(
                  typeof objMain[i].posX !== 'undefined' ? objMain[i].posX : 0,
                  typeof objMain[i].posY !== 'undefined' ? objMain[i].posY : 0,
                  typeof objMain[i].width !== 'undefined' ? objMain[i].width * sc : window.innerWidth,
                  typeof objMain[i].height !== 'undefined' ? objMain[i].height * sc : window.innerHeight,
                )
              }
              if(objMain[i].shape === 'box'){
                s.box(
                  typeof objMain[i].width !== 'undefined' ? objMain[i].width : window.innerWidth,
                  typeof objMain[i].height !== 'undefined' ? objMain[i].height : window.innerHeight
                )
              }
              if(objMain[i].shape === 'sphere'){
                s.sphere(
                  typeof objMain[i].width !== 'undefined' ? objMain[i].width : window.innerWidth
                )
              }
              if(objMain[i].shape === 'cylinder'){
                s.cylinder(
                  typeof objMain[i].width !== 'undefined' ? objMain[i].width : window.innerWidth,
                  typeof objMain[i].height !== 'undefined' ? objMain[i].height : window.innerHeight
                )
              }
              if(objMain[i].shape === 'cone'){
                s.cone(
                  typeof objMain[i].width !== 'undefined' ? objMain[i].width : window.innerWidth,
                  typeof objMain[i].height !== 'undefined' ? objMain[i].height : window.innerHeight
                )
              }
              if(objMain[i].shape === 'torus'){
                s.torus(
                  typeof objMain[i].width !== 'undefined' ? objMain[i].width : window.innerWidth,
                  typeof objMain[i].height !== 'undefined' ? objMain[i].height : window.innerHeight
                )
              }
              s.pop()
            }
          }
        }
      }
      ref = new p5(code)
  }

  const parseP5 = (text) => {
    evalHydra(text)
    let lines = text.split('\n')
    let toReturn = {
      0:{pos:0,active:false,shape:'rect'},
      1:{pos:1,active:false,shape:'rect'},
      2:{pos:2,active:false,shape:'rect'},
      3:{pos:3,active:false,shape:'rect'},
      4:{pos:4,active:false,shape:'rect'},
      5:{pos:5,active:false,shape:'rect'},
      6:{pos:6,active:false,shape:'rect'},
      7:{pos:7,active:false,shape:'rect'},
      8:{pos:8,active:false,shape:'rect'},
      9:{pos:9,active:false,shape:'rect'},
    }
    for(let i = 0; i < lines.length; i++){
      let line = lines[i].split(' ')
      for(let j = 0; j < line.length; j++){
        if(line.length === 2){
          if(line[1] === 'show'){
            console.log(ref[line[0]])
          }
          if(line[0] === 'fontSize'){
            setFontS(line[1])
          }
          if(line[0] === 'fontColor'){
            setFontC(line[1])
          }
        }
        if(line.length === 3){
          var t = line[0]
          if(line[1] === 'load'){
            if(line[2] !== 'file0' && line[2] !== 'file1' && line[2] !== 'file2' && line[2] !== 'file3' && line[2] !== 'file4' && line[2] !== 'file5' && line[2] !== 'file6' && line[2] !== 'file7' && line[2] !== 'file8' && line[2] !== 'file9' && line[2] !== 'camera'){
              toReturn[t].url = line[2]
              toReturn[t].type = checkExt(line[2])
              toReturn[t].active = true
            }
            if(line[2] === 'file0'){
              toReturn[t].url = file0
              toReturn[t].type = 'video'
              toReturn[t].active = true
            }
            if(line[2] === 'file1'){
              toReturn[t].url = file1
              toReturn[t].type = 'video'
              toReturn[t].active = true
            }
            if(line[2] === 'file2'){
              toReturn[t].url = file2
              toReturn[t].type = 'video'
              toReturn[t].active = true
            }
            if(line[2] === 'file3'){
              toReturn[t].url = file3
              toReturn[t].type = 'video'
              toReturn[t].active = true
            }
            if(line[2] === 'file4'){
              toReturn[t].url = file4
              toReturn[t].type = 'video'
              toReturn[t].active = true
            }
            if(line[2] === 'file5'){
              toReturn[t].url = file5
              toReturn[t].type = 'video'
              toReturn[t].active = true
            }
            if(line[2] === 'file6'){
              toReturn[t].url = file6
              toReturn[t].type = 'video'
              toReturn[t].active = true
            }
            if(line[2] === 'file7'){
              toReturn[t].url = file7
              toReturn[t].type = 'video'
              toReturn[t].active = true
            }
            if(line[2] === 'file8'){
              toReturn[t].url = file8
              toReturn[t].type = 'video'
              toReturn[t].active = true
            }
            if(line[2] === 'file9'){
              toReturn[t].url = file9
              toReturn[t].type = 'video'
              toReturn[t].active = true
            }
            if(line[2] === 'camera'){
              toReturn[t].type = 'camera'
              toReturn[t].active = true
            }
          }
          if(line[1] === 'posX'){
            toReturn[t].posX = line[2]
          }
          if(line[1] === 'posY'){
            toReturn[t].posY = line[2]
          }
          if(line[1] === 'opacity'){
            toReturn[t].opacity = parseFloat(line[2])
          }
          if(line[1] === 'width'){
            toReturn[t].width = parseFloat(line[2])
          }
          if(line[1] === 'height'){
            toReturn[t].height = parseFloat(line[2])
          }
          if(line[1] === 'scale'){
            toReturn[t].scale = parseFloat(line[2])
          }
          if(line[1] === 'rotX'){
            toReturn[t].rotX = parseFloat(line[2])
          }
          if(line[1] === 'rotY'){
            toReturn[t].rotY = parseFloat(line[2])
          }
          if(line[1] === 'rotSpeedX'){
            toReturn[t].rotSpeedX = parseFloat(line[2])
          }
          if(line[1] === 'rotSpeedY'){
            toReturn[t].rotSpeedY = parseFloat(line[2])
          }
          if(line[1] === 'shape'){
            toReturn[t].shape = line[2]
          }
        }
        if(line.length === 5){
          if(line[1] === 'color'){
            toReturn[t].r = parseFloat(line[2])
            toReturn[t].g = parseFloat(line[3])
            toReturn[t].b = parseFloat(line[4])
          }
        }
      }
    }
    video(toReturn)
  }

  const evalHydra = (code) => {
    let temp = code.split('#>')

    for (let i = 0; i < temp.length; i++){
      if(temp[i].includes('hydra')){
        try {
          hydra.eval(temp[i+1].replace('CineVivo','s3'))
        } catch (err) {
          setDisplayError(err)
        }
      }
    }
  }

  const eventHandler = (e) => {
    if(e.ctrlKey){
      if(e.key === 'Enter'){
        parseP5(code)
      }
      if(e.shiftKey){
        if(e.key === 'T'){
          setHideCode(!hideCode)
        }
      }
    }
  }

  const checkExt = (file) => {
    let temp = file.split('.')
    const videoValid = ['mov','webm','mp4']
    const imgValid = ['jpg','jpeg','png']
    if(imgValid.includes(temp[temp.length - 1])){
      return 'image'
    }
    if(videoValid.includes(temp[temp.length - 1])){
      return 'video'
    }
  }

  return (
    <>
    <button
      className="buttonMenu"
      onClick={() => setMenu(!menu)}
      >?</button>
    {menu &&
      <div
        className="menu"
        >
        <div style={{display:'flex',alignItems:'center',alignContent:'center'}}>
          <label htmlFor="file0" style={{margin:'0.5rem',display:'block'}}>file0
          <input id="file0" type="file" className="inputs" onChange={e => setFile0(URL.createObjectURL(e.target.files[0]))}/>
          </label>
        </div>
        <div style={{display:'flex',alignItems:'center',alignContent:'center'}}>
          <label htmlFor="file1" style={{margin:'0.5rem',display:'block'}}>file1
          <input id="file1" type="file" className="inputs" onChange={e => setFile1(URL.createObjectURL(e.target.files[0]))}/>
          </label>
        </div>
        <div style={{display:'flex',alignItems:'center',alignContent:'center'}}>
          <label htmlFor="file2" style={{margin:'0.5rem',display:'block'}}>file2
          <input id="file2" type="file" className="inputs" onChange={e => setFile2(URL.createObjectURL(e.target.files[0]))}/>
          </label>
        </div>
        <div style={{display:'flex',alignItems:'center',alignContent:'center'}}>
          <label htmlFor="file3" style={{margin:'0.5rem',display:'block'}}>file3
          <input id="file3" type="file" className="inputs" onChange={e => setFile3(URL.createObjectURL(e.target.files[0]))}/>
          </label>
        </div>
        <div style={{display:'flex',alignItems:'center',alignContent:'center'}}>
          <label htmlFor="file4" style={{margin:'0.5rem',display:'block'}}>file4
          <input id="file4" type="file" className="inputs" onChange={e => setFile4(URL.createObjectURL(e.target.files[0]))}/>
          </label>
        </div>
        <div style={{display:'flex',alignItems:'center',alignContent:'center'}}>
          <label htmlFor="file5" style={{margin:'0.5rem',display:'block'}}>file5
          <input id="file5" type="file" className="inputs" onChange={e => setFile5(URL.createObjectURL(e.target.files[0]))}/>
          </label>
        </div>
        <div style={{display:'flex',alignItems:'center',alignContent:'center'}}>
          <label htmlFor="file6" style={{margin:'0.5rem',display:'block'}}>file6
          <input id="file6" type="file" className="inputs" onChange={e => setFile6(URL.createObjectURL(e.target.files[0]))}/>
          </label>
        </div>
        <div style={{display:'flex',alignItems:'center',alignContent:'center'}}>
          <label htmlFor="file7" style={{margin:'0.5rem',display:'block'}}>file7
          <input id="file7" type="file" className="inputs" onChange={e => setFile7(URL.createObjectURL(e.target.files[0]))}/>
          </label>
        </div>
        <div style={{display:'flex',alignItems:'center',alignContent:'center'}}>
          <label htmlFor="file8" style={{margin:'0.5rem',display:'block'}}>file8
          <input id="file8" type="file" className="inputs" onChange={e => setFile8(URL.createObjectURL(e.target.files[0]))}/>
          </label>
        </div>
        <div style={{display:'flex',alignItems:'center',alignContent:'center'}}>
          <label htmlFor="file9" style={{margin:'0.5rem',display:'block'}}>file9
          <input id="file9" type="file" className="inputs" onChange={e => setFile9(URL.createObjectURL(e.target.files[0]))}/>
          </label>
        </div>
      </div>
    }
    <textarea
        onKeyDown={e => eventHandler(e)}
        className="area"
        onChange={e => {setCode(e.target.value); setDisplayError('')}}
        style={{fontSize:`${fontS}rem`, color:`${fontC}`, opacity:`${hideCode ? 0 : 1}`}}
      />
    <p
      style={{position:'fixed',zIndex:'4000',bottom:'10px',left:'10px',backgroundColor:'rgba(100,100,100,0.4)'}}
      >{`${displayError}`}</p>
    </>
  )
}

export default App
