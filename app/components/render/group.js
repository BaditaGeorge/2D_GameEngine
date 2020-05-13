import Component from '@glimmer/component';

export default class RenderGroupComponent extends Component {
    models = [];

    constructor() {
        super(...arguments);
        if (this.isJson(this.args.object_set) === true) {
            this.models = JSON.parse(this.args.object_set);
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