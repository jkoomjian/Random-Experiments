/* Modules can have a heirarchy.
 * Parent.js imports the properties of child
 * Then index.js imports the properties of parent.js
 */

import {helloFromChild} from './child.js';

function helloFromParent() {
 return "hello from parent module";
}

//Export this modules properties, and re-export the properties of child.js
export {helloFromChild, helloFromParent}