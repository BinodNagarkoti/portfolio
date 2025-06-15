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
        console.log('p5.RendererGL.prototype._initContext modified.');
      } catch (e) {
        console.error('Failed to modify p5.RendererGL.prototype._initContext:', e);
      }
    }
  }, []);


  useEffect(() => {
    let sketch: p5;
    
    const loadP5 = async () => {
      const p5Constructor = (await import('p5')).default;
      applyPrototypeModification(); // Attempt to apply modification before new p5 instance

      if (sketchRef.current && !p5InstanceRef.current) {
        // Ensure the container is empty
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
              p.createCanvas(parentRect.width, parentRect.height, p.WEBGL);
              p.pixelDensity(1);
              p.background(240, 240, 240); // Light gray background, similar to theme
              
              if (myShader) {
                p.shader(myShader);
                p.noStroke(); // Common for shader-based visuals
                 myShader.setUniform('u_resolution', [p.width, p.height]);
              } else {
                console.warn("Shader not loaded, p5 sketch might not render as expected.");
              }
            }
          };

          p.draw = () => {
            if (myShader) {
              myShader.setUniform('u_resolution', [p.width, p.height]);
              myShader.setUniform('u_time', p.millis() / 1000.0); // Time in seconds
              p.rect(0, 0, p.width, p.height); // Draw a rectangle that covers the canvas
            } else {
              // Fallback if shader isn't loaded
              p.background(200);
              p.fill(0);
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
