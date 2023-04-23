/** @odoo-module **/

import GanttModel from '@project_enterprise/js/task_gantt_model';

export default GanttModel.extend({
    // TODO: fetch data here ?


    // const promise1 = new Promise((resolve) => setTimeout(() => resolve('Promise 1 resolved'), 1000));


    /**
     * @private
    */
    async _fetchPlanningInfo() {
        console.log('::: _fetchPlanningInfo ', this)
        return Promise.resolve(1)
        // TODO: this._rpc(...).then(...)
        /*
        this.ganttData.companyHoursPerDay = await this._rpc({
            model: this.modelName,
            method: 'gantt_company_hours_per_day',
            context: this.context,
        });
        */
    },

    /**
     * @private
     * @override
     */
    _fetchDataSSS() {
        const proms = this._super(...arguments);
        const newPromsAll = Promise.all([proms, this._fetchPlanningInfo()])
        return newPromsAll
    },

    /**
     * Post `_fetchData` process that relies on `this.rows`.
     * @private
     * @returns [Promise]
     */
    _fetchDataPostProcessXX() {
        const proms = this._super(...arguments);
        console.log('::::: _fetchDataPostProcess ', this.ganttData.rows, this._getSlotIdsFromRows(this.ganttData.rows))
        return proms

    },


    _fetchDataPostProcess() {
        const proms = this._super.apply(this, arguments);
        proms.push(this._fetchEmployeePlanningInfo());
        /*
        if (!this.isSampleModel && this.ganttData.records.length) {
            proms.push(this._fetchResourceWorkInterval());
            // proms.push(this._fetchCompanyHoursPerDay());
        }
        */
        return proms;
    },    

    _fetchEmployeePlanningInfo() {
        const employeeIds = this._getEmployeeIdsFromRows(this.ganttData.rows)

        console.log(':::: employeeIds ', employeeIds)
        console.log('::::: _fetchDataPostProcess ', this, this.ganttData.rows, this._getSlotIdsFromRows(this.ganttData.rows))     

        return this._rpc({
            model: 'hr.employee',
            method: 'gantt_planning_shift_info',
            args: [
                employeeIds,
            ],
            context: Object.assign({}, this.context, {
                'default_start_datetime': this.getStartDate(),
                'default_end_datetime': this.getEndDate(),
            }),
        }).then((result) => {
            console.log('::: result ', result)
            // this._generateAndStoreWorkIntervals(result[0]);
            // this._generateAndStoreFlexibleHours(result[1]);
        });
    },

    /**
     * Fetch resources' work intervals.
     *
     * @returns {Deferred}
     * @private
     */
    _fetchResourceWorkIntervalXXX() {
        console.log(':::: ', this.getStartDate(), this.getEndDate(), this.ganttData.rows)
        return this._rpc({
            model: 'planning.slot',
            method: 'gantt_resource_work_interval',
            args: [
                this._getSlotIdsFromRows(this.ganttData.rows),
            ],
            context: Object.assign({}, this.context, {
                'default_start_datetime': this.getStartDate(),
                'default_end_datetime': this.getEndDate(),
            }),
        }).then((result) => {
            console.log('::: result ', result)
            // this._generateAndStoreWorkIntervals(result[0]);
            // this._generateAndStoreFlexibleHours(result[1]);
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