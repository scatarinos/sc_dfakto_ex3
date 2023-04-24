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
    def gantt_planning_shift_info(self, user_ids):

        default_start_datetime = (fields.Datetime.to_datetime(self._context.get('default_start_datetime')) or datetime.min).replace(tzinfo=pytz.utc)
        default_end_datetime = (fields.Datetime.to_datetime(self._context.get('default_end_datetime')) or datetime.max).replace(tzinfo=pytz.utc)

        domain = [
            ('user_id', 'in', user_ids),
            ('start_datetime', '>=', default_start_datetime),
            ('end_datetime', '<=', default_end_datetime),
        ]
        
        slots_mapped = self.env['planning.slot'].search(domain).mapped(lambda slot: {
            'resId': slot.user_id and slot.user_id.id,
            'startDatetime': slot.start_datetime,
            'endDatetime': slot.end_datetime,
        })
            
        return slots_mapped or []

