'use strict';

import setupModules from './modules'; 
import runServer from './api/app';

let db = {}; // TODO: setup database
let modules = setupModules(db);

runServer(modules);