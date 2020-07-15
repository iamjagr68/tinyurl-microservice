import { TinyUrl } from "../src/models/TinyUrl";
import { setupDB } from "../test-setup";

setupDB("seed_test", true);

describe("The test seeding functionality", () => {
    it("should seed the test database with 3 documents", async done => {
        const tinyUrls = await TinyUrl.find({});
        expect(tinyUrls.length).toBe(3);
        done();
    });
});