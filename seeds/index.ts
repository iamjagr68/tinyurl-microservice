import * as fs from "fs";
import * as util from "util";
import * as path from "path";
import * as mongoose from "mongoose";

const readDir = util.promisify(fs.readdir).bind(fs);

export async function seedDatabase (runSaveMiddleware: boolean = false) {
    const dir: string[] = await readDir(__dirname);
    const seedFiles = dir.filter(f => f.endsWith(".seed.ts"));

    for (const file of seedFiles) {
        const modelName = file.split(".seed.ts")[0];
        const model = mongoose.models[modelName];

        if (!model) throw new Error(`Cannot find Model '${modelName}'`);
        const fileContents = require(path.join(__dirname, file)).default; // eslint-disable-line

        runSaveMiddleware
            ? await model.create(fileContents)
            : await model.insertMany(fileContents);
    }
}