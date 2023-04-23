/** @odoo-module **/

import TaskGanttRow from './task_gantt_row';
import GanttRenderer from '@project_enterprise/js/task_gantt_renderer';

export default GanttRenderer.extend({

    config: Object.assign({}, GanttRenderer.prototype.config, {
        GanttRow: TaskGanttRow,
    }),

})
