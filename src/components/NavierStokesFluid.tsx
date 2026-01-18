import { useEffect, useRef } from 'react';

const NavierStokesFluid = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl2');
        if (!gl) {
            console.error('WebGL 2 not supported');
            return;
        }

        // Configuration
        const config = {
            dyeResolution: 1024,
            simResolution: 128,
            densityDissipation: 0.97,
            velocityDissipation: 0.98,
            pressure: 0.8,
            pressureIterations: 20,
            curl: 30,
            splatRadius: 0.25,
            splatForce: 6000,
            shading: true,
            colorful: true,
            colorUpdateSpeed: 10,
            backColor: { r: 0, g: 0, b: 0 },
            transparent: false,
        };

        // Pointers for interaction
        class Pointer {
            id = -1;
            texcoordX = 0;
            texcoordY = 0;
            prevTexcoordX = 0;
            prevTexcoordY = 0;
            deltaX = 0;
            deltaY = 0;
            down = false;
            moved = false;
            color = [30, 0, 300];
        }

        const pointers: Pointer[] = [new Pointer()];
        let w = canvas.width;
        let h = canvas.height;

        // Shader Source Code
        const baseVertexShader = `
      #version 300 es
      layout(location = 0) in vec2 aPosition;
      void main () {
          gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

        const copyShader = `
      #version 300 es
      precision mediump float;
      precision mediump sampler2D;
      out vec4 FragColor;
      uniform sampler2D uTexture;
      uniform vec2 uTexelSize;
      
      void main () {
          FragColor = texture(uTexture, gl_FragCoord.xy * uTexelSize);
      }
    `;

        const splatShader = `
      #version 300 es
      precision highp float;
      precision highp sampler2D;
      out vec4 FragColor;
      uniform sampler2D uTarget;
      uniform float uAspectRatio;
      uniform vec3 uColor;
      uniform vec2 uPoint;
      uniform float uRadius;
      uniform vec2 uTexelSize; // Added uTexelSize declaration
      
      void main () {
          vec2 p = gl_FragCoord.xy * uTexelSize - uPoint.xy;
          p.x *= uAspectRatio;
          vec3 splat = exp(-dot(p, p) / uRadius) * uColor;
          vec3 base = texture(uTarget, gl_FragCoord.xy * uTexelSize).xyz;
          FragColor = vec4(base + splat, 1.0);
      }
    `;

        const advectionShader = `
      #version 300 es
      precision highp float;
      precision highp sampler2D;
      out vec4 FragColor;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 uTexelSize;
      uniform vec2 uDyeTexelSize;
      uniform float uDt;
      uniform float uDissipation;
      
      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
          vec2 st = uv / tsize - 0.5;
          vec2 iuv = floor(st);
          vec2 fuv = fract(st);
          vec4 a = texture(sam, (iuv + vec2(0.5, 0.5)) * tsize);
          vec4 b = texture(sam, (iuv + vec2(1.5, 0.5)) * tsize);
          vec4 c = texture(sam, (iuv + vec2(0.5, 1.5)) * tsize);
          vec4 d = texture(sam, (iuv + vec2(1.5, 1.5)) * tsize);
          return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }
      
      void main () {
          vec2 coord = gl_FragCoord.xy * uTexelSize; // Use uTexelSize for velocity lookup
          
          float decay = 1.0 + uDissipation * uDt;
          vec2 velocity = bilerp(uVelocity, coord, uTexelSize).xy;
          
          vec2 backCoord = gl_FragCoord.xy * uDyeTexelSize - velocity * uDt * uDyeTexelSize; // Correct advection logic
          
          vec4 result = bilerp(uSource, backCoord, uDyeTexelSize);
          FragColor = result / decay;
      }
    `;

        // Simplification: Using raw GL mostly, but to save tokens, I'll setup necessary infrastructure
        // Helper functions
        function createShader(gl: WebGL2RenderingContext, type: number, source: string) {
            const shader = gl.createShader(type)!;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                throw new Error(gl.getShaderInfoLog(shader)!);
            }
            return shader;
        }

        function createProgram(gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string) {
            const program = gl.createProgram()!;
            const vs = createShader(gl, gl.VERTEX_SHADER, vertexSource);
            const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
            gl.attachShader(program, vs);
            gl.attachShader(program, fs);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                throw new Error(gl.getProgramInfoLog(program)!);
            }
            return program;
        }

        // Main initialization logic (abbreviated for the purpose of this file creation first)
        // We will need a FULL implementation. For now, I'll write the complete component.

        const curlShader = `
      #version 300 es
      precision mediump float;
      precision mediump sampler2D;
      out vec4 FragColor;
      uniform sampler2D uVelocity;
      uniform vec2 uTexelSize;
      
      void main () {
          float L = texture(uVelocity, (gl_FragCoord.xy - vec2(1.0, 0.0)) * uTexelSize).y;
          float R = texture(uVelocity, (gl_FragCoord.xy + vec2(1.0, 0.0)) * uTexelSize).y;
          float T = texture(uVelocity, (gl_FragCoord.xy + vec2(0.0, 1.0)) * uTexelSize).x;
          float B = texture(uVelocity, (gl_FragCoord.xy - vec2(0.0, 1.0)) * uTexelSize).x;
          float vorticity = R - L - T + B;
          FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `;

        const vorticityShader = `
      #version 300 es
      precision highp float;
      precision highp sampler2D;
      out vec4 FragColor;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float uCurl;
      uniform float uDt;
      uniform vec2 uTexelSize;
      
      void main () {
          float L = texture(uCurl, (gl_FragCoord.xy - vec2(1.0, 0.0)) * uTexelSize).x;
          float R = texture(uCurl, (gl_FragCoord.xy + vec2(1.0, 0.0)) * uTexelSize).x;
          float T = texture(uCurl, (gl_FragCoord.xy + vec2(0.0, 1.0)) * uTexelSize).x;
          float B = texture(uCurl, (gl_FragCoord.xy - vec2(0.0, 1.0)) * uTexelSize).x;
          float C = texture(uCurl, gl_FragCoord.xy * uTexelSize).x;

          vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
          force /= length(force) + 0.0001;
          force *= uCurl * C;
          force.y *= -1.0;

          vec2 velocity = texture(uVelocity, gl_FragCoord.xy * uTexelSize).xy;
          FragColor = vec4(velocity + force * uDt, 0.0, 1.0);
      }
    `;

        const divergenceShader = `
      #version 300 es
      precision mediump float;
      precision mediump sampler2D;
      out vec4 FragColor;
      uniform sampler2D uVelocity;
      uniform vec2 uTexelSize;
      
      void main () {
          float L = texture(uVelocity, (gl_FragCoord.xy - vec2(1.0, 0.0)) * uTexelSize).x;
          float R = texture(uVelocity, (gl_FragCoord.xy + vec2(1.0, 0.0)) * uTexelSize).x;
          float T = texture(uVelocity, (gl_FragCoord.xy + vec2(0.0, 1.0)) * uTexelSize).y;
          float B = texture(uVelocity, (gl_FragCoord.xy - vec2(0.0, 1.0)) * uTexelSize).y;

          float div = 0.5 * (R - L + T - B);
          FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `;

        const clearShader = `
      #version 300 es
      precision mediump float;
      precision mediump sampler2D;
      out vec4 FragColor;
      uniform float uPressure;
      
      void main () {
          FragColor = vec4(uPressure, 0.0, 0.0, 1.0);
      }
    `;

        const pressureShader = `
      #version 300 es
      precision mediump float;
      precision mediump sampler2D;
      out vec4 FragColor;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      uniform vec2 uTexelSize;
      
      void main () {
          float L = texture(uPressure, (gl_FragCoord.xy - vec2(1.0, 0.0)) * uTexelSize).x;
          float R = texture(uPressure, (gl_FragCoord.xy + vec2(1.0, 0.0)) * uTexelSize).x;
          float T = texture(uPressure, (gl_FragCoord.xy + vec2(0.0, 1.0)) * uTexelSize).x;
          float B = texture(uPressure, (gl_FragCoord.xy - vec2(0.0, 1.0)) * uTexelSize).x;
          float C = texture(uPressure, gl_FragCoord.xy * uTexelSize).x;
          float divergence = texture(uDivergence, gl_FragCoord.xy * uTexelSize).x;
          float pressure = (L + R + B + T - divergence) * 0.25;
          FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `;

        const gradientSubtractShader = `
      #version 300 es
      precision mediump float;
      precision mediump sampler2D;
      out vec4 FragColor;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      uniform vec2 uTexelSize;
      
      void main () {
          float L = texture(uPressure, (gl_FragCoord.xy - vec2(1.0, 0.0)) * uTexelSize).x;
          float R = texture(uPressure, (gl_FragCoord.xy + vec2(1.0, 0.0)) * uTexelSize).x;
          float T = texture(uPressure, (gl_FragCoord.xy + vec2(0.0, 1.0)) * uTexelSize).x;
          float B = texture(uPressure, (gl_FragCoord.xy - vec2(0.0, 1.0)) * uTexelSize).x;
          vec2 velocity = texture(uVelocity, gl_FragCoord.xy * uTexelSize).xy;
          velocity.xy -= vec2(R - L, T - B);
          FragColor = vec4(velocity, 0.0, 1.0);
      }
    `;

        let simWidth: number;
        let simHeight: number;
        let dyeWidth: number;
        let dyeHeight: number;
        let velocity: any;
        let density: any;
        let divergence: any;
        let curl: any;
        let pressure: any;

        let copyProgram: WebGLProgram;
        let splatProgram: WebGLProgram;
        let curlProgram: WebGLProgram;
        let vorticityProgram: WebGLProgram;
        let divergenceProgram: WebGLProgram;
        let clearProgram: WebGLProgram;
        let pressureProgram: WebGLProgram;
        let gradienSubtractProgram: WebGLProgram;
        let advectionProgram: WebGLProgram;

        function initFramebuffers() {
            const simRes = getResolution(config.simResolution);
            const dyeRes = getResolution(config.dyeResolution);

            simWidth = simRes.width;
            simHeight = simRes.height;
            dyeWidth = dyeRes.width;
            dyeHeight = dyeRes.height;

            velocity = createDoubleFBO(2, simWidth, simHeight); // RG16F
            density = createDoubleFBO(2, dyeWidth, dyeHeight); // RGBA16F
            divergence = createFBO(2, simWidth, simHeight); // R16F
            curl = createFBO(2, simWidth, simHeight); // R16F
            pressure = createDoubleFBO(2, simWidth, simHeight); // R16F
        }

        function getResolution(resolution: number) {
            let aspectRatio = gl!.drawingBufferWidth / gl!.drawingBufferHeight;
            if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;
            const min = Math.round(resolution);
            const max = Math.round(resolution * aspectRatio);
            if (gl!.drawingBufferWidth > gl!.drawingBufferHeight)
                return { width: max, height: min };
            else
                return { width: min, height: max };
        }

        function createFBO(texId: number, w: number, h: number) {
            gl!.activeTexture(gl!.TEXTURE0 + texId);
            const texture = gl!.createTexture();
            gl!.bindTexture(gl!.TEXTURE_2D, texture);
            gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
            gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
            gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
            gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
            // Determine format based on texId (simplified logic)
            let internalFormat = gl!.RGBA16F;
            let format = gl!.RGBA;
            if (texId === 2) {
                internalFormat = gl!.RG16F; format = gl!.RG;
            }

            gl!.texImage2D(gl!.TEXTURE_2D, 0, internalFormat as any, w, h, 0, format as any, gl!.HALF_FLOAT, null);

            const fbo = gl!.createFramebuffer();
            gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
            gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, texture, 0);
            gl!.viewport(0, 0, w, h);
            gl!.clear(gl!.COLOR_BUFFER_BIT);

            return {
                texture, fbo, width: w, height: h,
                attach: (id: number) => {
                    gl!.activeTexture(gl!.TEXTURE0 + id);
                    gl!.bindTexture(gl!.TEXTURE_2D, texture);
                    return id;
                }
            };
        }

        function createDoubleFBO(texId: number, w: number, h: number) {
            let fbo1 = createFBO(texId, w, h);
            let fbo2 = createFBO(texId, w, h);
            return {
                width: w, height: h,
                texId: texId,
                read: fbo1, write: fbo2,
                swap: () => {
                    let temp = fbo1;
                    fbo1 = fbo2;
                    fbo2 = temp;
                    return { read: fbo1, write: fbo2 }; // Return current state after swap
                }
            };
        }

        function resizeCanvas() {
            if (!canvas) return;
            const width = window.innerWidth;
            const height = window.innerHeight;
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
                initFramebuffers();
            }
        }

        try {
            // --- Programs Init ---
            // (Here I would compile all shaders. For brevity, assuming createProgram works)
            // Actually need to check for extensions like EXT_color_buffer_float and OES_texture_float_linear
            // But WebGL2 supports most by default.
            gl.getExtension('EXT_color_buffer_float');
            gl.getExtension('OES_texture_float_linear');

            copyProgram = createProgram(gl, baseVertexShader, copyShader);
            splatProgram = createProgram(gl, baseVertexShader, splatShader);
            curlProgram = createProgram(gl, baseVertexShader, curlShader);
            vorticityProgram = createProgram(gl, baseVertexShader, vorticityShader);
            divergenceProgram = createProgram(gl, baseVertexShader, divergenceShader);
            clearProgram = createProgram(gl, baseVertexShader, clearShader);
            pressureProgram = createProgram(gl, baseVertexShader, pressureShader);
            gradienSubtractProgram = createProgram(gl, baseVertexShader, gradientSubtractShader);
            advectionProgram = createProgram(gl, baseVertexShader, advectionShader);

            // Quad buffer
            const blit = (() => {
                gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
                gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(0);
                return (destination: WebGLFramebuffer | null) => {
                    gl.bindFramebuffer(gl.FRAMEBUFFER, destination);
                    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
                }
            })();

            initFramebuffers();

            let lastTime = Date.now();
            let colorIndex = 0;
            const colors = [
                [0.98, 0.45, 0.08], // Orange
                [0.98, 0.85, 0.08], // Yellow
                [0.55, 0.98, 0.08], // Lime
                [0.08, 0.95, 0.98], // Cyan
                [0.08, 0.45, 0.98], // Blue
                [0.65, 0.08, 0.98], // Purple
            ];

            function update() {
                const dt = Math.min((Date.now() - lastTime) / 1000, 0.016);
                lastTime = Date.now();

                // Viewport config
                gl!.viewport(0, 0, simWidth, simHeight);

                // Advection - Velocity
                const advection = (target: any, source: any, dissipation: number, vel: any, res: any) => {
                    gl!.useProgram(advectionProgram);
                    gl!.uniform2f(gl!.getUniformLocation(advectionProgram, 'uTexelSize'), 1.0 / simWidth, 1.0 / simHeight); // Velocity Texel Size (Sim Resolution)
                    gl!.uniform2f(gl!.getUniformLocation(advectionProgram, 'uDyeTexelSize'), 1.0 / res.width, 1.0 / res.height); // Dye/Target Texel Size (Target Resolution)
                    gl!.uniform1i(gl!.getUniformLocation(advectionProgram, 'uVelocity'), vel.read.attach(0));
                    gl!.uniform1i(gl!.getUniformLocation(advectionProgram, 'uSource'), source.read.attach(1));
                    gl!.uniform1f(gl!.getUniformLocation(advectionProgram, 'uDt'), dt);
                    gl!.uniform1f(gl!.getUniformLocation(advectionProgram, 'uDissipation'), dissipation);
                    blit(target.write.fbo);
                    target.swap();
                }

                advection(velocity, velocity, config.velocityDissipation, velocity, velocity);

                gl!.viewport(0, 0, dyeWidth, dyeHeight);
                advection(density, density, config.densityDissipation, velocity, density);

                // Splat (Input)
                gl!.viewport(0, 0, simWidth, simHeight);
                for (let i = 0; i < pointers.length; i++) {
                    const p = pointers[i];
                    if (p.moved) {
                        p.moved = false;
                        // Splat velocity
                        gl!.useProgram(splatProgram);
                        gl!.uniform1i(gl!.getUniformLocation(splatProgram, 'uTarget'), velocity.read.attach(0));
                        gl!.uniform1f(gl!.getUniformLocation(splatProgram, 'uAspectRatio'), canvas!.width / canvas!.height);
                        gl!.uniform2f(gl!.getUniformLocation(splatProgram, 'uPoint'), p.texcoordX, p.texcoordY);
                        gl!.uniform3f(gl!.getUniformLocation(splatProgram, 'uColor'), p.deltaX * config.splatForce, p.deltaY * config.splatForce, 0.0);
                        gl!.uniform1f(gl!.getUniformLocation(splatProgram, 'uRadius'), config.splatRadius / 100.0);
                        gl!.uniform2f(gl!.getUniformLocation(splatProgram, 'uTexelSize'), 1.0 / simWidth, 1.0 / simHeight);
                        blit(velocity.write.fbo);
                        velocity.swap();

                        // Splat density
                        gl!.viewport(0, 0, dyeWidth, dyeHeight);
                        gl!.useProgram(splatProgram);
                        gl!.uniform1i(gl!.getUniformLocation(splatProgram, 'uTarget'), density.read.attach(0));
                        gl!.uniform3f(gl!.getUniformLocation(splatProgram, 'uColor'), p.color[0], p.color[1], p.color[2]);
                        gl!.uniform2f(gl!.getUniformLocation(splatProgram, 'uTexelSize'), 1.0 / dyeWidth, 1.0 / dyeHeight);
                        blit(density.write.fbo);
                        density.swap();

                        gl!.viewport(0, 0, simWidth, simHeight);
                    }
                }

                // Curl
                gl!.useProgram(curlProgram);
                gl!.uniform2f(gl!.getUniformLocation(curlProgram, 'uTexelSize'), 1.0 / simWidth, 1.0 / simHeight);
                gl!.uniform1i(gl!.getUniformLocation(curlProgram, 'uVelocity'), velocity.read.attach(0));
                blit(curl.fbo);

                // Vorticity
                gl!.useProgram(vorticityProgram);
                gl!.uniform2f(gl!.getUniformLocation(vorticityProgram, 'uTexelSize'), 1.0 / simWidth, 1.0 / simHeight);
                gl!.uniform1i(gl!.getUniformLocation(vorticityProgram, 'uVelocity'), velocity.read.attach(0));
                gl!.uniform1i(gl!.getUniformLocation(vorticityProgram, 'uCurl'), curl.attach(1));
                gl!.uniform1f(gl!.getUniformLocation(vorticityProgram, 'uCurl'), config.curl);
                gl!.uniform1f(gl!.getUniformLocation(vorticityProgram, 'uDt'), dt);
                blit(velocity.write.fbo);
                velocity.swap();

                // Divergence
                gl!.useProgram(divergenceProgram);
                gl!.uniform2f(gl!.getUniformLocation(divergenceProgram, 'uTexelSize'), 1.0 / simWidth, 1.0 / simHeight);
                gl!.uniform1i(gl!.getUniformLocation(divergenceProgram, 'uVelocity'), velocity.read.attach(0));
                blit(divergence.fbo);

                // Clear Pressure
                gl!.useProgram(clearProgram);
                gl!.uniform1f(gl!.getUniformLocation(clearProgram, 'uPressure'), config.pressure);
                blit(pressure.write.fbo);
                pressure.swap();

                // Pressure (Jacobi)
                gl!.useProgram(pressureProgram);
                gl!.uniform2f(gl!.getUniformLocation(pressureProgram, 'uTexelSize'), 1.0 / simWidth, 1.0 / simHeight);
                gl!.uniform1i(gl!.getUniformLocation(pressureProgram, 'uDivergence'), divergence.attach(0));
                for (let i = 0; i < config.pressureIterations; i++) {
                    gl!.uniform1i(gl!.getUniformLocation(pressureProgram, 'uPressure'), pressure.read.attach(1));
                    blit(pressure.write.fbo);
                    pressure.swap();
                }

                // Gradient Subtract
                gl!.useProgram(gradienSubtractProgram);
                gl!.uniform2f(gl!.getUniformLocation(gradienSubtractProgram, 'uTexelSize'), 1.0 / simWidth, 1.0 / simHeight);
                gl!.uniform1i(gl!.getUniformLocation(gradienSubtractProgram, 'uPressure'), pressure.read.attach(0));
                gl!.uniform1i(gl!.getUniformLocation(gradienSubtractProgram, 'uVelocity'), velocity.read.attach(1));
                blit(velocity.write.fbo);
                velocity.swap();

                // Render to Screen
                gl!.viewport(0, 0, gl!.drawingBufferWidth, gl!.drawingBufferHeight);
                // Clear background
                gl!.clearColor(0, 0, 0, 1);
                gl!.clear(gl!.COLOR_BUFFER_BIT);

                // Display density
                gl!.useProgram(copyProgram);
                gl!.uniform1i(gl!.getUniformLocation(copyProgram, 'uTexture'), density.read.attach(0));
                gl!.uniform2f(gl!.getUniformLocation(copyProgram, 'uTexelSize'), 1.0 / gl!.drawingBufferWidth, 1.0 / gl!.drawingBufferHeight);
                // Note: For display, we use screen texel size usually, but here uTexture is density which is dyeWidth/Height. 
                // We want to map UV 0-1 to density texture. 
                // The copy shader uses gl_FragCoord * uTexelSize.
                // So uTexelSize should be 1.0 / windowDimension.

                blit(null);

                requestAnimationFrame(update);
            }

            // Input handling
            function updatePointerDownData(x: number, y: number) {
                pointers[0].id = -1;
                pointers[0].down = true;
                pointers[0].moved = false;
                pointers[0].texcoordX = x / canvas!.width;
                pointers[0].texcoordY = 1.0 - y / canvas!.height;
                pointers[0].prevTexcoordX = pointers[0].texcoordX;
                pointers[0].prevTexcoordY = pointers[0].texcoordY;
                pointers[0].deltaX = 0;
                pointers[0].deltaY = 0;
                // Random color
                const c = colors[Math.floor(Math.random() * colors.length)];
                pointers[0].color = c; // No intensity mult for now, handle in shader or here
            }

            function updatePointerMoveData(x: number, y: number) {
                pointers[0].prevTexcoordX = pointers[0].texcoordX;
                pointers[0].prevTexcoordY = pointers[0].texcoordY;
                pointers[0].texcoordX = x / canvas!.width;
                pointers[0].texcoordY = 1.0 - y / canvas!.height;
                pointers[0].deltaX = pointers[0].texcoordX - pointers[0].prevTexcoordX;
                pointers[0].deltaY = pointers[0].texcoordY - pointers[0].prevTexcoordY;
                pointers[0].moved = Math.abs(pointers[0].deltaX) > 0 || Math.abs(pointers[0].deltaY) > 0;
            }

            function updatePointerUpData() {
                pointers[0].down = false;
            }

            canvas.addEventListener('mousedown', e => {
                updatePointerDownData(e.clientX, e.clientY);
            });

            canvas.addEventListener('mousemove', e => {
                updatePointerMoveData(e.clientX, e.clientY);
            });

            window.addEventListener('mouseup', () => {
                updatePointerUpData();
            });

            // Touch support
            canvas.addEventListener('touchstart', e => {
                e.preventDefault();
                const touch = e.targetTouches[0];
                updatePointerDownData(touch.clientX, touch.clientY);
            }, { passive: false });

            canvas.addEventListener('touchmove', e => {
                e.preventDefault();
                const touch = e.targetTouches[0];
                updatePointerMoveData(touch.clientX, touch.clientY);
            }, { passive: false });

            // Initial resize
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);

            // Start loop
            update();
        } catch (e) {
            console.error("Fluid WebGL Error:", e);
        }

        // Clean up
        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-auto z-[-1]" />;
};

export default NavierStokesFluid;
