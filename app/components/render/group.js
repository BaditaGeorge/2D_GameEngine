import Component from '@glimmer/component';
import { tracked, setPropertyDidChange } from '@glimmer/tracking';
import { A } from '@ember/array';
import Ember from 'ember';

export default class RenderGroupComponent extends Component {
    @tracked models = [];
    arrModels = [];
    constructor() {
        super(...arguments);
        this.models = this.args.object_set;
        // for (let i = 0; i < this.args.object_set.length; i++) {
        //     let tmpObj = {};
        //     let keys = Object.keys(this.args.object_set[i]);
        //     for (let j = 0; j < keys.length; j++) {
        //         tmpObj[keys[j]] = this.args.object_set[i][keys[j]];
        //     }
        //     this.models.pushObject(tmpObj);
        // }
        // console.log(this.arrModels[0]);
        // this.dispatchInterval();
    }

    display() {
        let obj = Object.assign({}, this.models[0]);
        this.models.popObject();
        obj['x'] += 5;
        // console.log(this.models);
        this.models.pushObject(obj);
        // this.models[0]['x'] += 5;
        // console.log(this.models[0]);
        // this.actualModels.popObject();
        // this.actualModels.pushObject(Object.assign({}, this.arrModels[0]));
    }

    dispatchInterval() {
        setInterval(() => {
            this.display();
        }, 20);
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