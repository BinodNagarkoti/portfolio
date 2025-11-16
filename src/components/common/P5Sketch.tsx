
'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import type p5 from 'p5';

let p5Instance: p5 | null = null;
let p5PrototypeModified = false;

const P5Sketch: React.FC = () => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);

  const applyPrototypeModification = useCallback(() => {
    if (typeof window !== 'undefined' && !p5PrototypeModified && window.p5 && (window.p5 as any).RendererGL) {
      try {
        const p5Global = window.p5 as any;
        p5Global.RendererGL.prototype._initContext = function() {
          try {
            // Ensure glAttributes exists and enable alpha
            if (!this._pInst._glAttributes) {
              this._pInst._glAttributes = {};
            }
            this._pInst._glAttributes.alpha = true;

            this.drawingContext =
              this.canvas.getContext('webgl2', this._pInst._glAttributes) ||
              this.canvas.getContext('webgl', this._pInst._glAttributes) ||
              this.canvas.getContext('experimental-webgl', this._pInst._glAttributes);
            if (this.drawingContext === null) {
              console.error('p5.js: Error creating webgl context');
              throw new Error('Error creating webgl context');
            } else {
              const gl = this.drawingContext;
              gl.enable(gl.DEPTH_TEST);
              gl.depthFunc(gl.LEQUAL);
              gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
              this._viewport = this.drawingContext.getParameter(
                this.drawingContext.VIEWPORT
              );
            }
          } catch (er) {
            console.error('p5.js: Error in _initContext:', er);
            throw er;
          }
        };
        p5PrototypeModified = true;
        console.log('p5.RendererGL.prototype._initContext modified for alpha.');
      } catch (e) {
        console.error('Failed to modify p5.RendererGL.prototype._initContext:', e);
      }
    }
  }, []);


  useEffect(() => {
    let sketch: p5;
    
    const loadP5 = async () => {
      const p5Constructor = (await import('p5')).default;
      applyPrototypeModification(); 

      if (sketchRef.current && !p5InstanceRef.current) {
        while (sketchRef.current.firstChild) {
          sketchRef.current.removeChild(sketchRef.current.firstChild);
        }

        const s = (p: p5) => {
          let myShader: p5.Shader;

          p.preload = () => {
            try {
              myShader = p.loadShader('/basic.vert', '/basic.frag');
            } catch (e) {
              console.error("Error loading shaders:", e);
            }
          };

          p.setup = () => {
            if (sketchRef.current) {
              const parentRect = sketchRef.current.getBoundingClientRect();
              const canvas = p.createCanvas(parentRect.width, parentRect.height, p.WEBGL);
              canvas.elt.style.backgroundColor = 'transparent'; // Optional, container div style should prevail

              // Ensure WebGL context is cleared transparently after canvas creation
              if (p.drawingContext) {
                const gl = p.drawingContext as WebGLRenderingContext;
                gl.clearColor(0, 0, 0, 0); // Set clear color to transparent black
              }
              
              p.pixelDensity(1);
              
              if (myShader) {
                p.shader(myShader);
                p.noStroke(); 
                myShader.setUniform('u_resolution', [p.width, p.height]);
              } else {
                console.warn("Shader not loaded, p5 sketch might not render as expected.");
              }
            }
          };

          p.draw = () => {
            if (p.drawingContext) {
              const gl = p.drawingContext as WebGLRenderingContext;
              // Clear the canvas with the transparent color set in setup
              gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            } else {
              p.clear(); // Fallback clear for non-WebGL or if context not ready
            }

            if (myShader) {
              myShader.setUniform('u_resolution', [p.width, p.height]);
              myShader.setUniform('u_time', p.millis() / 1000.0); 
              p.rect(0, 0, p.width, p.height); 
            } else {
              p.fill(0); // Fallback text color if shader fails
              p.textAlign(p.CENTER, p.CENTER);
              p.text("Shader not loaded", 0,0);
            }
          };

          p.windowResized = () => {
            if (sketchRef.current) {
              const parentRect = sketchRef.current.getBoundingClientRect();
              p.resizeCanvas(parentRect.width, parentRect.height);
               if (myShader) {
                myShader.setUniform('u_resolution', [p.width, p.height]);
              }
               // Re-apply clear color on resize if context is available
              if (p.drawingContext) {
                const gl = p.drawingContext as WebGLRenderingContext;
                gl.clearColor(0, 0, 0, 0);
              }
            }
          };
        };
        
        sketch = new p5Constructor(s, sketchRef.current);
        p5InstanceRef.current = sketch;
      }
    };

    loadP5();

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, [applyPrototypeModification]);

  return <div ref={sketchRef} className="w-full h-[300px] md:h-[400px] bg-muted/30" />;
};

export default P5Sketch;

