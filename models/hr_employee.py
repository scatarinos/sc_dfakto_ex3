# -*- coding: utf-8 -*-
import re
import ast

from datetime import date, datetime, timedelta
from dateutil.relativedelta import relativedelta
from dateutil.rrule import SU
from lxml import etree
from collections import defaultdict

from odoo import tools, models, fields, api, _
from odoo.addons.resource.models.resource import make_aware
from odoo.exceptions import UserError, AccessError
from odoo.osv import expression

import logging
import pytz


_logger = logging.getLogger(__name__)

class ScDFaktoEx3HrEmployee(models.Model):
    _name = 'hr.employee'
    _inherit = 'hr.employee'

    check_planning_shift = fields.Boolean('Check Planning Shift')

    @api.model
    def gantt_planning_shift_info(self, employee_ids):

        # Get default start/end datetime if any.
        default_start_datetime = (fields.Datetime.to_datetime(self._context.get('default_start_datetime')) or datetime.min).replace(tzinfo=pytz.utc)
        default_end_datetime = (fields.Datetime.to_datetime(self._context.get('default_end_datetime')) or datetime.max).replace(tzinfo=pytz.utc)

        domain = [
            ('employee_id', 'in', employee_ids)
        ]
        
        slots = self.env['planning.slot'].search(domain)

        # start_datetime = max(default_start_datetime, planning_slot_read_group[0]["start_datetime"].replace(tzinfo=pytz.utc))
        # end_datetime = min(default_end_datetime, planning_slot_read_group[0]["end_datetime"].replace(tzinfo=pytz.utc))

        # TODO: compute and return data
        return [{'info': ':::::::::::: gantt_planning_shift_info ::: {} {} -> {}'.format(employee_ids, default_start_datetime, default_end_datetime)}]

