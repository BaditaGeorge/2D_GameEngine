import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { substring } from 'game-engine/helpers/substring';

// import '@ember/render-modifiers';

export default class RenderShapeComponent extends Component {

    @tracked path;

    constructor() {
        super(...arguments);
        if (this.args.model !== undefined) {
            this.model = this.args.model;
            this.usedProps = [];
            this.createPath(this.model.type, this.model);
            this.createStyle(this.model);
            // this.dispatchInterval();
        }
    }

    @action
    showSomething() {
        console.log('here');
    }

    dispatchInterval() {
        let step = () => {
            let arr = this.path.split(' ');
            for (let i = 1; i < arr.length; i += 3) {
                arr[i] = (parseInt(arr[i]) + 5).toString();
            }
            this.path = arr.join(' ');
            requestAnimationFrame(step);
        }
        step();
    }

    createStyle(config) {
        let keys = Object.keys(config);
        this.style = '';
        for (let i = 0; i < keys.length; i++) {
            if (!this.usedProps.includes(keys[i])) {
                this.style += (keys[i] + ':' + config[keys[i]] + ';');
            }
        }
    }

    createPath(type, config) {
        //creez un factory
        if (type === 'circle') {
            this.usedProps = ['r', 'cx', 'cy'];
            let r = parseInt(config['r']);
            let cx = parseInt(config['cx']);
            let cy = parseInt(config['cy']);
            this.path = [
                'M', cx, cy,
                'm', -1 * r, 0,
                'a', r, r, 0, 1, 0, (r * 2), 0,
                'a', r, r, 0, 1, 0, -1 * (r * 2), 0,
            ].join(' ');
            console.log(this.path);
        } else if (type === 'rect') {
            this.usedProps = ['w', 'h', 'x', 'y'];
            let w = parseInt(config['w']);
            let h = parseInt(config['h']);
            let x = parseInt(config['x']);
            let y = parseInt(config['y']);
            this.path = [
                'M', x, y,
                'L', x + w, y,
                'L', x + w, y + h,
                'L', x, y + h,
            ].join(' ');
        } else if (type === 'polygon') {
            this.usedProps = ['points'];
            this.path = [];
            this.path.push('M');
            this.path.push(config.points[0]);
            this.path.push(config.points[1]);
            for (let i = 2; i < config.points.length; i += 2) {
                this.path.push('L');
                this.path.push(config.points[i]);
                this.path.push(config.points[i + 1]);
            }
            this.path = this.path.join(' ');
        }
    }

    isJson(chunk) {
        try {
            JSON.parse(chunk);
        } catch (e) {
            return false;
        }
        return true;
    }
}