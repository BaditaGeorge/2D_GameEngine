import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
    location = config.locationType;
    rootURL = config.rootURL;
}

Router.map(function() {
    this.route('about');
    this.route('home', { path: '' });
    this.route('yourapp', { path: '/app' });
    this.route('snake');
    this.route('cargame');
});