/** @odoo-module **/

import GanttModel from '@project_enterprise/js/task_gantt_model';

export default GanttModel.extend({

    _fetchDataPostProcess() {
        const proms = this._super.apply(this, arguments);
        proms.push(this._fetchEmployeePlanningInfo());
        return proms;
    },    

    _fetchEmployeePlanningInfo() {
        const userIds = this._getEmployeeIdsFromRows(this.ganttData.rows)
        return this._rpc({
            model: 'hr.employee',
            method: 'gantt_planning_shift_info',
            args: [
                userIds,
            ],
            context: Object.assign({}, this.context, {
                'default_start_datetime': this.getStartDate(),
                'default_end_datetime': this.getEndDate(),
            }),
        }).then((result) => {
            console.log('::: result ', result, this)
            this.ganttData.planning = result
        });
    },


    /**
     * Get the employee ids from the provided rows.
     *
     * @param {Object} rows in the format of ganttData.rows.
     * @returns {Array} the employee ids.
     * @private
     */
    _getEmployeeIdsFromRows(rows) {
        console.log('rows: ', rows)
        const employeeIds = (rows || []).map(row => row.resId).filter(row => row)
        return employeeIds
    }, 

    /**
     * Get the ids from the provided rows.
     *
     * @param {Object} rows in the format of ganttData.rows.
     * @returns {Array} the slot ids.
     * @private
     */
    _getSlotIdsFromRows(rows) {
        const result = rows.reduce(
            (accumulator, current) => {
                if (current.rows) {
                    for (const slotId in this._getSlotIdsFromRows(current.rows)) {
                        accumulator.add(slotId);
                    }
                }
                for (const record of Object.values(current.records)) {
                    if (record.id) {
                        accumulator.add(record.id);
                    }
                }
                return accumulator;
            },
            new Set()
        );
        return [...result];
    },

    /**
     * @public
     * @returns {moment} startDate
     */
    getStartDate() {
        return this.convertToServerTime(this.get().startDate);
    },
    /**
     * @public
     * @returns {moment} endDate
     */
    getEndDate() {
        return this.convertToServerTime(this.get().stopDate);
    },



})