//opengl shading language glsl 
//custom fragment shader and vertex shader

//https://docs.unity3d.com/510/Documentation/Manual/SL-VertexFragmentShaderExamples.html#:~:text=Vertex%20Shader%20is%20a%20shader,passed%20to%20the%20fragment%20shader.
// vertex shader is used for geometry of scene, ie. coordinates of projection (postion of object), color, textures, normals
// fragment shader is used to modify properties passed from the vertex shader 

//in 3d graphics, vectors are often refered as coordinates

//vertex shader -> fragment shader

// in threejs, each mesh (geometry and material) defined contains vertex attributes.

// position - refers to the mesh position in 3d space ... vec(x,y,z) 
// uv - refers to how a 2d texture is applied to a 3d surface, ie. 2d texture on the 3d object in space ... vec(u,v) 
// normals - refers to the 


// understanding uv maps
// a nice thought to understanding uv is taking an image of cube, this is a 3d object. the cube can be decomposed as 6 faces, which are 2d. (uv unwrapping)
// faces are composed of three vertices (a triangle) or four vertices (a quad)

// faces, its vertices and relationship to uv 
// each face contains vertices, each vertex will have a corresponding uv coordinate  ... the purpose of the uv coordinates is to put manipulate on how the texture blankets the face. 
// on each of these faces, (0,0) is as the bottom left corner. (1,1) top right corner ... (0,0) - (1,1)

// note: the uv is normalized ... 0-1 relative to the texture size, ie. image of dimensions 512x512 ... uv of (0.5, 0.5) would be (256, 256)

// example:
// a face w/ 4 vertices

// uv's
//x,y

// (0,0) bot-left
// (1,0) bot-right

// (0,1) top-left 
// (1,1) top-right

// "sample texture from range x: (0->512) y: (0->512)"
// given a 512x512 texture, with the assigned uv maps, the returned portion of texture is of the entire texture (512x512) rendered to be 512x512.


// halving the returned portion of texture
// (0,0) / 2 = (0,0) bot-left ... 0,0
// (1,0) / 2 = (0.5,0) bot-right ... 256,0

// (0,1) / 2 = (0,0.5) top-left ... 0,256
// (1,1) / 2 = (0.5,0.5) top-right ... 256,256 //end point

// "sample texture from range x: (0->256) y: (0->256)"
// given a 512x512 tecture, with the assigned uv maps, the returned portion of texture is of 256x256 sampled from the original 512x512 rendered to be 512x512.

// how does uv relate to scaling? 
// if the uv coordinates is > (1,1) then the rendering engine attempt to search for the texture in those uv coordinates, what will occur is 
// either:
//  undefined behaviour (errors / artifacts)
//  default to wrapping

// wrapping modes:
//  repeat: this is where the texture repeats itself to the contiguous uv coordinate
//  clamping: the color of the edge pixel from the contiguous uv coordinate is taken, and the textured is displayed as a single colour. 

//summary:
// by adjusting the uv coordinates, it controls the dimensions / part of the texture to be sampled, which then is scaled up/down to the original texture dimensions.

// ... for every mesh, there is a vertexShader assigned to it.


//chatgpt'd the glsl code below
export const vertexShader = 
`
    varying vec2 v_uv; //declare 2d vector for uv coordinates
    varying vec3 v_normal; // declare 3d vector normal used for lighting

    void main() {
        
        v_uv = uv; // pass mesh's geometry vertices' uv coordinates to fragment shader variable v_uv
        v_normal = normal; // pass mesh's geometry vertices' normals to fragment shader variable 

        // vec4(position, 1.0) - this converts the 3d coordinates of a vertex into a 4d homogenous coordinate (4d vector) by adding a fourth component (w) ... vec4(x,y,z,w)
        // w, is 
        
        //the purpose of this 4d homoegenous coordinate is 

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`
;


// define new textures for fragmentShader
// tfloor, tunderwater, tsurface

export const fragmentShader = 
`
    //uniform is keyword - used to pass information from glsl <-> application  
    //declare 2d texture samplers, a sampler is an object on how to retrieve information from a texture (in this instance a image).
    
    uniform sampler2D tfloor;
    uniform sampler2D tunderwater;
    uniform sampler2D tsurface;

    varying vec2 v_uv; //uv vector for textures
    varying vec3 v_normal; //normal vector (perpendicular to surface)

    void main() {
        vec4 color;
        
        if (v_normal.y < -0.1) { //if normal vector pointing downwards
            color = texture2D(tfloor, v_uv); //bottom face
        
        } else if (v_normal.y > 0.1) { //if normal vector pointing upwards
            color = texture2D(tsurface, v_uv); //top face
        
        } else if (v_normal.z > 0.1) { //if normal vector pointing towards client
            color = texture2D(tunderwater, v_uv); //front face
        
        } else if (v_normal.z < -0.1) { //if normal vector pointing away client
            color = texture2D(tunderwater, v_uv); //back face 
        
        } else if (v_normal.x > 0.1) { //if normal vector pointing to right
            color = texture2D(tunderwater, v_uv); //right face
        
        } else { //if normal vector pointing to left
            color = texture2D(tunderwater, v_uv); //left face
        }

        color.a *= 0.8; //change the texture's alpha
        gl_FragColor = color;
    }
`
;


