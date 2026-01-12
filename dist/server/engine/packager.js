"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Packager = void 0;
const archiver_1 = __importDefault(require("archiver"));
const stream_1 = require("stream");
class Packager {
    /**
     * Creates a ZIP stream from an array of file entries.
     * @param files Array of files to include in the zip
     * @param rootDirName Optional root directory name inside the zip (not used if flattening)
     */
    async createZipStream(files, _rootDirName = 'project') {
        const archive = (0, archiver_1.default)('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });
        const stream = new stream_1.PassThrough();
        // Handle error events
        archive.on('error', (err) => {
            throw err;
        });
        // Pipe archive data to the stream
        archive.pipe(stream);
        // Append files
        files.forEach(file => {
            // Ensure path doesn't start with slash to avoid issues
            const safePath = file.path.startsWith('/') ? file.path.slice(1) : file.path;
            archive.append(file.content, { name: safePath });
        });
        // Finalize the archive (this triggers the end of the stream)
        await archive.finalize();
        return stream;
    }
}
exports.Packager = Packager;
