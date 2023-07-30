import COS from 'cos-js-sdk-v5';
import {cosConfig} from "../config/index.js";

var cos = new COS({
    SecretId: cosConfig['sid'],
    SecretKey: cosConfig['sk'],
});


export default cos