export class Loader {
    constructor(loader, config) {
        this.loader = loader; // это PixiLoader из @pixi/loaders
        this.config = config;
        this.resources = {};
    }

    preload() {
        for (const asset of this.config.loader) {
            this.loader.add(asset.key, asset.path);
        }

        return new Promise((resolve) => {
            this.loader.load((loader, resources) => {
                this.resources = resources;
                resolve();
            });
        });
    }
}
