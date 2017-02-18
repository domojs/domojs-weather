
export { Weather } from './service';
import { Language } from '../../../chat';
import * as path from 'path';
import './api/get';
import * as di from 'akala-core'

di.injectWithName(['language'], function (language: Language)
{
    language.name = 'weather';
    language.path = path.resolve(__dirname, './interpreter');
    language.register();
})();
