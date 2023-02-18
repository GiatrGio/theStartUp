#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#  QC_pipeline.py
#
#  Copyright 2020 Petros Skiadas <petros@pskiadas.gr>


import glob, os, argparse, logging, time, datetime
from sys import path

# import python scripts from the directory of the current script
sdir = f'{os.path.dirname(os.path.realpath(__file__))}/'
path.append('sdir')
import illumina_instrument, qc_short_reads


def parse_samples():
    fastq_list = glob.glob(args.reads + '/*.fastq.gz')

    return fastq_list


def read_type():
    short_read_list = []
    long_read_list = []

    # set read files to short or long reads
    for fastq_file in fastq_list:
        # recognise illumina sequences based on fastq headers
        message, sequencer_list = illumina_instrument.sequencer_detection_message([fastq_file])
        if sequencer_list[0]:
            short_read_list.append(fastq_file)
        else:
            long_read_list.append(fastq_file)

    return short_read_list, long_read_list


def in_file(string):
    """Check if (input) file exists."""

    if string != "" and string is not None:
        string = os.path.abspath(string)
        if not os.path.isfile(string):
            print(f"The input is not a file.")
            raise IOError("not a file [%s]" % string)

    return string


def setting():
    """Create options."""

    # range of options
    options_input = ['long', 'short']
    # default options
    #def_threads = 24
    #def_krakendb = "/home/petros/NOBINFBACKUP/downloads/Kraken2_db2/"
    #def_adapter = "/home/petros/tools/anaconda3/share/trimmomatic-0.39-1/adapters/TruSeq3-PE-2.fa"
    # input parser
    parser = argparse.ArgumentParser(description="Run the mapping and variant calling pipeline.")
    parser.add_argument('-r', '--reads', help="Directory with the sample reads.", metavar="STR", type=str,
                        required=True)
    parser.add_argument('-o', '--output', help="Directory where output will be written.", metavar="STR", type=str,
                        required=True)
    # optional arguments
    parser.add_argument('-i', '--input', default=options_input[0],
                        help=f"Type of Input Data. [default={options_input[0]}]", choices=options_input)
    parser.add_argument('-t', '--threads', default=def_threads, help=f"Number of threads to use on the mapping",
                        type=int, metavar="INT")
    #parser.add_argument('-k', '--kraken', action='store_true', help="Run kraken2 to search for sample taxonomy.")
    #parser.add_argument('-d', '--krakendb', help="Directory of the kraken2 database.", metavar="STR", type=str)
    #parser.add_argument('-a', '--adapter', default=def_adapter,
    #                    help="A file with a the illumina adapter for trimmomatic.", type=in_file, metavar="FILE")

    args = parser.parse_args()

    return args


def test():
    global fastq_list
    if not os.path.exists(os.path.dirname(args.output + '/')):
        os.makedirs(os.path.dirname(args.output + '/'))
    fastq_list = parse_samples()
    short_reads_list, long_reads_list = read_type()
    print(f'Short reads: {short_reads_list}')
    print(f'Long reads: {long_reads_list}')


if __name__ == '__main__':

    start = time.time()
    # import user input
    args = setting()

    # create output directory
    test()