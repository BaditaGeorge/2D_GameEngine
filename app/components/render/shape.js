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
        let tempConfig = Object.assign({}, config);
        let keys = Object.keys(tempConfig);
        this.style = '';
        for (let i = 0; i < keys.length; i++) {
            if (!this.usedProps.includes(keys[i])) {
                this.style += (keys[i] + ':' + tempConfig[keys[i]] + ';');
            }
        }
    }

    createPath(type, config) {
        //creez un factory
        this.usedProps = ['type', 'data'];
        if (type === 'circle') {
            let r = parseInt(config.data['r']);
            let cx = parseInt(config.data['x']);
            let cy = parseInt(config.data['y']);
            this.path = [
                'M', cx, cy,
                'm', -1 * r, 0,
                'a', r, r, 0, 1, 0, (r * 2), 0,
                'a', r, r, 0, 1, 0, -1 * (r * 2), 0,
            ].join(' ');
        } else if (type === 'rect') {
            this.usedProps = ['w', 'h', 'x', 'y'];
            let w = parseInt(config.data['w']);
            let h = parseInt(config.data['h']);
            let x = parseInt(config.data['x']);
            let y = parseInt(config.data['y']);
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
            this.path.push(config.data[0]);
            this.path.push(config.data[1]);
            for (let i = 2; i < config.data.length; i += 2) {
                this.path.push('L');
                this.path.push(config.data[i]);
                this.path.push(config.data[i + 1]);
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