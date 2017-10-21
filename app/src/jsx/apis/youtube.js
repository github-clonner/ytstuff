import google from 'googleapis';
import { api_key } from '../../../config/youtube.json';

google.options({ auth: api_key });
const youtube = google.youtube('v3');

export default youtube;