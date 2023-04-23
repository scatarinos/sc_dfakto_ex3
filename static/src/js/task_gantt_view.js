/** @odoo-module **/

import GanttView from '@project_enterprise/js/task_gantt_view';
import TaskGanttRenderer from './task_gantt_renderer'
import TaskGanttModel from './task_gantt_model';


import viewRegistry from 'web.view_registry';

const TaskGanttView = GanttView.extend({
    config: Object.assign({}, GanttView.prototype.config, {
        Renderer: TaskGanttRenderer,
        Model: TaskGanttModel,
    }),

});

viewRegistry.add('task_gantt', TaskGanttView);

export default TaskGanttView;
