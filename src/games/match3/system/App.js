import * as PIXI from 'pixi.js';
import { Loader as PixiLoader } from '@pixi/loaders';
import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
import { Loader } from './Loader';

class Application {
    runCustom(config, domElement) {
        gsap.registerPlugin(PixiPlugin);
        PixiPlugin.registerPIXI(PIXI);

        this.config = config;
        this.app = new PIXI.Application({
            resizeTo: window,
            backgroundAlpha: 0,
        });

        domElement.appendChild(this.app.view);
        const pixiLoader = new PixiLoader();
        this.loader = new Loader(pixiLoader, this.config);
        this.loader.preload().then(() => this.start());
    }

    res(key) {
        const resource = this.loader.resources[key];
        if (!resource) {
            console.warn(`Resource not found for key: ${key}`);
            return PIXI.Texture.EMPTY;
        }
        return resource.texture;
    }

    sprite(key) {
        return new PIXI.Sprite(this.res(key));
    }

    start() {
        this.scene = new this.config["startScene"]();
        this.app.stage.addChild(this.scene.container);
    }
}

export const App = new Application();
