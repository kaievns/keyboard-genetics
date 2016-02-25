/**
 * Imports data and builds the library
 */

import { exec, execSync } from "child_process";

const CMD = "find . -type f -name *.js -o -name *.md | xargs cat $1";

export default execSync(CMD, {timeout: 0, maxBuffer: 1024 * 1024 * 1024}).toString();
