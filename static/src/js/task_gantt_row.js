/** @odoo-module **/

import GanttRow from '@project_enterprise/js/task_gantt_row';

export default GanttRow.extend({
    
    /**
     * @override
    */
    _prepareSlots: function () {
        this._super(...arguments);
        this.slots.forEach((slot, index) => {
            const resId = this.resId
            const planning = this.state.planning || []
            const slotStartDatetime = slot.start && slot.start.format('YYYY-MM-DD HH:mm:ss')
            const hasPlanning = planning.find(p => p.resId == resId && (slotStartDatetime >= p.startDatetime && slotStartDatetime <= p.endDatetime))

            const style = hasPlanning ? 'background: white': 'background: grey'
            slot.style = style            
        });

    },

});
