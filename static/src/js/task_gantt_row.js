/** @odoo-module **/

import GanttRow from '@project_enterprise/js/task_gantt_row';

export default GanttRow.extend({

    /**
     * @override
    */
    _prepareSlots: function () {
        this._super(...arguments);
        this.slots.forEach((slot, index) => {

            // console.log(':::: slot ', index, slot)

            //  TODO: change style here (based on planning.slot)
            const style = index % 2 ? 'background: green': 'background: red'
            slot.style = style
        });

    },

});
