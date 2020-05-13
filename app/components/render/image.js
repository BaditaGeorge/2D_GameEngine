import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Person from '../Person';

export default class RenderImageComponent extends Component {
    constructor() {
        super(...arguments);
        console.log('created');
        let a = document.createElement('p');
        a.innerHTML = 'skunl';
        document.body.appendChild(a);
        this.isLarge = false;
    }
    @tracked isLarge = false;
    @tracked height = '250';
    @tracked width = '250';
    value = this.args;
    @action toggleSize() {
        (new Person()).speak();
        console.log(this.args.type);
        if (this.isLarge == false) {
            this.height = '500';
            this.width = '500';
        } else {
            this.height = '250';
            this.width = '250';
        }
        this.isLarge = !this.isLarge;
    }
}