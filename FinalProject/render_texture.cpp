#include <OpenGL/gl.h>
#include <OpenGL/glu.h>
#include "glut.h"
#include "glslprogramP5.h"


class TextureRender {
    private:


    public:

    GLuint FrameBuffer;
    GLuint ColorBuffer;
    GLuint DepthBuffer;
    unsigned char *Image;

    int RenderWidth;
    int RenderHeight;

    TextureRender(int width, int height) {
        RenderWidth = width;
        RenderHeight = height;
        Image = new unsigned char [ 4*width*height ];
    }

    void Init() {
        glGenFramebuffers( 1, &FrameBuffer );
        glGenTextures( 1, &ColorBuffer );
        // glGenRenderBuffers( 1, &DepthBuffer );

        // glBindFramebuffer( GL_FRAMEBUFFER, FrameBuffer );

        // InitTextures();

        // glBindFramebuffer( GL_FRAMEBUFFER, 0 );
    }

    void Use(bool clear = true) {
                //glBindFramebuffer( GL_FRAMEBUFFER, 0 );

        glBindFramebuffer( GL_FRAMEBUFFER, FrameBuffer );
        // BindTextures();

        // if (clear) {
         glClear( GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT );
        // } else {
        //     glClearColor( 0.0, 0.0, 0.0, 0.0);
        //     glClear( GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT );
        // }
        // glViewport( 0, 0, RenderWidth, RenderHeight );

        // glBindFramebuffer( GL_FRAMEBUFFER, FrameBuffer );
             //    glBindTexture( GL_TEXTURE_2D, ColorBuffer );

        // glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, RenderWidth, RenderHeight, 0, GL_RGBA, GL_UNSIGNED_BYTE, Image);
        //         glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
        // glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
        // glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
        // glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

          //              glBindFramebuffer( GL_FRAMEBUFFER, FrameBuffer );


        glBindTexture( GL_TEXTURE_2D, ColorBuffer );

        glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, RenderWidth, RenderHeight, 0, GL_RGBA, GL_UNSIGNED_BYTE, Image);
                glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

        

        // glClear( GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT );

        // glBindTexture( GL_TEXTURE_2D, ColorBuffer );

        // glPixelStorei( GL_PACK_ALIGNMENT, 1 );

        // glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, ColorBuffer, 0);
        
        // glBindTexture( GL_TEXTURE_2D, DepthBuffer );
        // glTexImage2D(GL_TEXTURE_2D, 0, GL_DEPTH_COMPONENT, RenderWidth, RenderHeight, 0, GL_DEPTH_COMPONENT, GL_FLOAT, NULL);glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
        // glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
        // glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
        // glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
       //  glFramebufferTexture2D(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_TEXTURE_2D, DepthBuffer, 0);
        
        

        // glEnable( GL_DEPTH_TEST );
        // glShadeModel( GL_SMOOTH );

    }

    void UnUse() {

glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, ColorBuffer, 0);
                glBindFramebuffer( GL_FRAMEBUFFER, FrameBuffer );
                glReadPixels( 0, 0, RenderWidth, RenderHeight, GL_RGBA, GL_UNSIGNED_BYTE, Image );

        // glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, ColorBuffer, 0);
glReadPixels( 0, 0, RenderWidth, RenderHeight, GL_RGBA, GL_UNSIGNED_BYTE, Image );
// glBindFramebuffer( GL_FRAMEBUFFER, FrameBuffer );
//                 glPixelStorei( GL_PACK_ALIGNMENT, 1 );
//     glReadPixels( 0, 0, RenderWidth, RenderHeight, GL_RGB, GL_UNSIGNED_BYTE, Image );

// glPixelStorei( GL_PACK_ALIGNMENT, 1 );
    glViewport( 0, 0, RenderWidth, RenderHeight );

printf("Image: %d %d %d\n", Image[0], Image[1], Image[2]);
        glBindFramebuffer( GL_FRAMEBUFFER, 0 );
    }


    
    void BindTextures() {
        // glActiveTexture( GL_TEXTURE0 );
        // glBindTexture( GL_TEXTURE_2D, ColorBuffer );
	    // glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, ColorBuffer, 0);
        
        // glActiveTexture( GL_TEXTURE5 );
	    // glBindTexture( GL_TEXTURE_2D, DepthBuffer );
	    // glFramebufferTexture2D(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_TEXTURE_2D, DepthBuffer, 0);
    }

    void InitTextures() {
        // glPixelStorei( GL_PACK_ALIGNMENT, 1 );
        
        // glBindTexture( GL_TEXTURE_2D, ColorBuffer );
        // glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, RenderWidth, RenderHeight, 0, GL_RGB, GL_UNSIGNED_BYTE, NULL);
        // glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
        // glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
        // glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
        // glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
        // glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, ColorBuffer, 0);

        // glBindTexture( GL_TEXTURE_2D, DepthBuffer );
        // glTexImage2D(GL_TEXTURE_2D, 0, GL_DEPTH_COMPONENT, RenderWidth, RenderHeight, 0, GL_DEPTH_COMPONENT, GL_FLOAT, NULL);glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
        // glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
        // glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
        // glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
        // glFramebufferTexture2D(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_TEXTURE_2D, DepthBuffer, 0);

        GLenum status = glCheckFramebufferStatus( GL_FRAMEBUFFER );
        if( status != GL_FRAMEBUFFER_COMPLETE )
            fprintf( stderr, "FrameBuffer is not complete.\n" );

        
    }
};

