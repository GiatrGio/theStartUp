#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#  kraken.py
#
#  Copyright 2020 Petros <petros@pskiadas.gr>
#
#  This program is free software; you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation; either version 2 of the License, or
#  (at your option) any later version.
#
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#
#  You should have received a copy of the GNU General Public License
#  along with this program; if not, write to the Free Software
#  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
#  MA 02110-1301, USA.
#
#

import glob, os, re, argparse, logging, time, datetime
from subprocess import check_call


def run_kraken2(R1, R2, sample_name, subsample, sample_dir, threads, kraken_database):
    # set input/output locations
    output_name = f'{sample_dir}{sample_name}_{subsample}'
    report_fn = f'{output_name}_report.txt'

    if not os.path.isfile(report_fn) or not os.path.getsize(report_fn) > 0:
        print(f"Running kraken2 on sample {sample_name}_{subsample}")
        cmd = f'kraken2 --threads {threads} --paired --db {kraken_database} \
                --report {report_fn} {R1} {R2} >/dev/null 2>&1'
        check_call(cmd, shell=True)





if __name__ == '__main__':


