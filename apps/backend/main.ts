import { NestFactory } from '@nestjs/core'
import { AppModule } from './src/app.module'
import { config } from 'dotenv'
import * as path from 'path';
import * as express from 'express'; // ✅ This ensures 'static' will be defined
import { Request, Response } from 'express';
import http from 'http'

if (process.env.RENDER) {
    config({ path: '/etc/secrets/.env' })
} else {
    config()
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    //const server = http.createServer(app)

    app.setGlobalPrefix('api')

    app.enableCors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    })


  //if (process.env.NODE_ENV === 'production') {
      const expressApp = app.getHttpAdapter().getInstance(); // ✅ get native express app
      const publicPath = path.join(__dirname, '..', 'public');
      console.log('publicPath', publicPath)
      //const publicPath = path.join(__dirname, 'public');
      //expressApp.use(express.static(publicPath));
      app.use(express.static(publicPath));

        // Only handle non-API routes (exclude anything starting with /api)
    expressApp.get(/^\/(?!api).*/, (req: Request, res: Response) => {
        console.log('Serving frontend for:', req.url);
        res.sendFile(path.join(publicPath, 'index.html'));
    });
    //   expressApp.get(/(.*)/, (req: Request, res: Response) => {
    //     console.log('Request URL:', req.url);
    //     if (req.url.startsWith('/api')) {
    //         return res.
    //       }
    //     res.sendFile(path.join(publicPath, 'index.html'));
    //   });

    const port = process.env.PORT || 3030;
    await app.listen(port,
        () => {
            console.log(`✅ Backend running on port ${port}`)
        }
    )

}
bootstrap()
