"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const fs = require("fs");
const path = require("path");
const MAX_PARALLEL_DIR = 16;
const MAX_PARALLEL_FILE = 4;
const BUFFER_SIZE = 256 * 1024;
function copyFile(source, destination, callback) {
    const readStream = fs.createReadStream(source, { highWaterMark: BUFFER_SIZE });
    const writeStream = fs.createWriteStream(destination, { highWaterMark: BUFFER_SIZE });
    const onError = (err) => {
        readStream.close();
        writeStream.close();
        callback(err);
    };
    readStream.on('error', onError);
    writeStream.on('error', onError);
    writeStream.on('open', () => readStream.pipe(writeStream));
    writeStream.once('close', () => callback(null));
}
function copyDir(sourcePath, destinationPath, relPath, callback) {
    fs.mkdir(path.join(destinationPath, relPath), err => {
        if ((err !== null) && (err.code !== 'EEXIST')) {
            return callback(err);
        }
        fs.readdir(path.join(sourcePath, relPath), (readErr, files) => {
            if (readErr !== null) {
                return callback(readErr);
            }
            let numDone = 0;
            if (files.length === 0) {
                return callback(null, []);
            }
            const entries = [];
            files.forEach(file => {
                fs.stat(path.join(sourcePath, relPath, file), (statErr, stats) => {
                    if (statErr === null) {
                        // TODO: ignoring error
                        entries.push({
                            relPath: path.join(relPath, file),
                            isDir: stats.isDirectory(),
                        });
                    }
                    ++numDone;
                    if (numDone === files.length) {
                        callback(null, entries);
                    }
                });
            });
        });
    });
}
/**
 * custom implementation of recursive directory copying.
 * copy from fs-extra does this already, but that function has no limit on the number
 * of files it will copy at once making it fairly inefficient, especially on spinning
 * disks and unpredictable in regards to memory usage.
 *
 * TODO: This implementation could do with more real world testing and optimization
 *   (maybe even adapting to whether copying many small files or few large ones and
 *    the disk type and different OSes)
 *
 * @param {string} source source path to copy from
 * @param {string} destination destination path to copy to
 */
function copyRecursive(source, destination) {
    return new Promise((resolve, reject) => {
        const queue = {
            dir: [],
            file: [],
        };
        const slots = {
            dir: MAX_PARALLEL_DIR,
            file: MAX_PARALLEL_FILE,
        };
        function next(type) {
            --slots[type];
            const job = queue[type].shift();
            if (type === 'dir') {
                copyDir(source, destination, job, (err, entries) => {
                    if (err !== null) {
                        return reject(err);
                    }
                    entries.forEach(entry => {
                        queue[entry.isDir ? 'dir' : 'file'].push(entry.relPath);
                    });
                    done(type);
                });
            }
            else {
                copyFile(path.join(source, job), path.join(destination, job), (err) => {
                    if (err !== null) {
                        return reject(err);
                    }
                    done(type);
                });
            }
        }
        function done(type) {
            ++slots[type];
            while ((slots['dir'] > 0) && (queue['dir'].length > 0)) {
                next('dir');
            }
            while ((slots['file'] > 0) && (queue['file'].length > 0)) {
                next('file');
            }
            if ((slots['dir'] === MAX_PARALLEL_DIR) && (slots['file'] === MAX_PARALLEL_FILE)) {
                return resolve();
            }
        }
        queue['dir'].push('');
        next('dir');
    });
}
exports.default = copyRecursive;
