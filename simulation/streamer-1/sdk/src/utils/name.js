"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeName = exports.encodeName = void 0;
const MAX_NAME_LENGTH = 32;
const encodeName = (name) => {
    if (name.length > MAX_NAME_LENGTH) {
        throw Error(`Name (${name}) longer than 32 characters`);
    }
    const buffer = Buffer.alloc(32);
    buffer.fill(name);
    buffer.fill(' ', name.length);
    return Array(...buffer);
};
exports.encodeName = encodeName;
const decodeName = (bytes) => {
    const buffer = Buffer.from(bytes);
    return buffer.toString('utf8').trim();
};
exports.decodeName = decodeName;
