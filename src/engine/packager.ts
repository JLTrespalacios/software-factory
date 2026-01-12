import archiver from 'archiver';
import { PassThrough } from 'stream';

export interface FileEntry {
    path: string;
    content: string;
}

export class Packager {
    /**
     * Creates a ZIP stream from an array of file entries.
     * @param files Array of files to include in the zip
     * @param rootDirName Optional root directory name inside the zip (not used if flattening)
     */
    async createZipStream(files: FileEntry[], _rootDirName: string = 'project'): Promise<NodeJS.ReadableStream> {
        const archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });

        const stream = new PassThrough();
        
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
