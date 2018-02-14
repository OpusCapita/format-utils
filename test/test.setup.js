import chai from 'chai';
import chaiImmutable from 'chai-immutable';

import mockStorage from './storage.mock';

global.localStorage = mockStorage();
global.sessionStorage = mockStorage();

chai.use(chaiImmutable);
