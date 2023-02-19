#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#  qc_short_reads.py
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


def parse_samples (reads_dir):
    
    reads_list = glob.glob(reads_dir+'/*.fastq.gz')
    sample_list = []
    
    for fastq in reads_list:
        #parse sample name 9V_T4_S29_L004_R2_001.fastq.gz (sample=9V_T4); H14616_S3_R1.fastq.gz (sample=H14616)
        sample_name = re.search(r'(.*?)_.*R.*$', fastq.split('/')[-1]).group(1)
        #apend list with unique sample names
        if not sample_name in sample_list:
            sample_list.append (sample_name)
    
    return sample_list


def return_pairs (sample_name, reads_dir):
    
    reads_list = glob.glob(f'{reads_dir}/{sample_name}_*.fastq.gz')
    subsample_list = []
    
    for fastq in reads_list:
        subsample = re.search(sample_name+r'_(.*)_R.*$', fastq).group(1)
        if not subsample in subsample_list:
            subsample_list.append(subsample)
            R1 = f'{reads_dir}/{sample_name}_{subsample}_R1*.fastq.gz'
            R2 = f'{reads_dir}/{sample_name}_{subsample}_R2*.fastq.gz'
            yield subsample, R1, R2


def run_fastqc (R1, R2, sample_dir, threads):
    
    fastqc_output = f'{sample_dir}{R1.split("/")[-1].split(".")[0]}_fastqc.html'
    
    if not os.path.isfile(fastqc_output) or not os.path.getsize(fastqc_output) > 0:
        print (f"Running fastqc on sample {sample_name}_{subsample}")
        cmd = f'fastqc -t {threads} --outdir {sample_dir} {R1} {R2} >/dev/null 2>&1'
        check_call(cmd, shell=True)


def run_trimmomatic (R1, R2, sample_name, subsample, sample_dir, input_type, illuminaAdapterFile, threads):
    
    #set input/output locations
    output_name = f'{sample_dir}{sample_name}_{subsample}'
    R1_trfiltered = f'{output_name}_R1_trfiltered.fastq'
    R2_trfiltered = f'{output_name}_R2_trfiltered.fastq'
    #set options
    minKeepLength = 36
    qualityTrimming = 'LEADING:3 TRAILING:3 SLIDINGWINDOW:4:15'
    if input_type == 'genomic':
        scoring = '2:30:10'
    elif input_type == 'transcriptomic':
        scoring = '2:30:10:8:true'
    print (R1_trfiltered)
    if not os.path.isfile(R1_trfiltered) or not os.path.getsize(R1_trfiltered) > 0:
        print (f"Running trimmomatic on sample {sample_name}_{subsample}")
        #the following commands are wrapped around () to make it possible for trap to catch the error properly
        cmd = f'(trimmomatic PE -threads {threads} {R1} {R2} {R1_trfiltered} /dev/null {R2_trfiltered} /dev/null \
                ILLUMINACLIP:{illuminaAdapterFile}:{scoring} {qualityTrimming} MINLEN:{minKeepLength} \
                2>{output_name}.trimmomatic.log && touch {output_name}.trimmomatic.success)'
        check_call(cmd, shell=True)
    
    return R1_trfiltered, R2_trfiltered


def run_kraken2 (R1, R2, sample_name, subsample, sample_dir, threads, kraken_database):
    
    #set input/output locations
    output_name = f'{sample_dir}{sample_name}_{subsample}'
    report_fn = f'{output_name}_report.txt'
    
    if not os.path.isfile(report_fn) or not os.path.getsize(report_fn) > 0:
        print (f"Running kraken2 on sample {sample_name}_{subsample}")
        cmd = f'kraken2 --threads {threads} --paired --db {kraken_database} \
                --report {report_fn} {R1} {R2} >/dev/null 2>&1'
        check_call(cmd, shell=True)


def run_fastp (R1, R2, sample_name, subsample, sample_dir, threads):
    
    if threads > 16:
        fastp_threads = 16
    else:
        fastp_threads = threads
    #set input/output locations
    output_name = f'{sample_dir}{sample_name}_{subsample}'
    R1_filtered = f'{output_name}_R1_filtered_rmMin{filter_len}G.fastq.gz'
    R2_filtered = f'{output_name}_R2_filtered_rmMin{filter_len}G.fastq.gz'
    
    if not os.path.isfile(R1_filtered) or not os.path.getsize(R1_filtered) > 0:
        print (f"Running fastp on sample {sample_name}_{subsample}")
        cmd = f'fastp --trim_poly_g -w {fastp_threads} --in1 {R1} --in2 {R2} --out1 {R1_filtered} --out2 {R2_filtered} \
                --disable_quality_filtering --length_required=36 --disable_adapter_trimming --poly_g_min_len={filter_len} \
                --html {output_name}.html --json {output_name}.fastp.json >/dev/null 2>&1' #--dedup
        check_call(cmd, shell=True)


def run_multiqc (sample_dir):
    
    if not os.path.isfile(f'{sample_dir}/multiqc_report.html') or not os.path.getsize(f'{sample_dir}/multiqc_report.html') > 0:
        cmd = f'multiqc -q -o {sample_dir} {sample_dir}'
        check_call(cmd, shell=True)


def inFile (string):
    """Check if (input) file exists."""
    
    if string != "" and string is not None:
        string = os.path.abspath(string)
        if not os.path.isfile(string):
            print (f"The input is not a file.")
            raise IOError("not a file [%s]" % string)
    
    return string


def setting ():
    """Create options."""
    
    #range of options
    options_input = ['genomic', 'transcriptomic']
    #default options
    def_threads = 24
    def_krakendb = "/home/petros/NOBINFBACKUP/downloads/Kraken2_db2/"
    def_adapter = "/home/petros/tools/anaconda3/share/trimmomatic-0.39-1/adapters/TruSeq3-PE-2.fa"
    #input parser
    parser = argparse.ArgumentParser(description="Run the mapping and variant calling pipeline.")
    parser.add_argument('-r', '--reads', help="Directory with the sample reads.", metavar="STR", type=str, required=True)
    parser.add_argument('-o', '--output', help="Directory where output will be written.", metavar="STR", type=str, required=True)
    #optional arguments
    parser.add_argument('-i', '--input', default=options_input[0], help=f"Type of Input Data. [default={options_input[0]}]", choices=options_input)
    parser.add_argument('-t', '--threads', default=def_threads, help=f"Number of threads to use on the mapping", type=int, metavar="INT")
    parser.add_argument('-k', '--kraken', action='store_true', help="Run kraken2 to search for sample taxonomy.")
    parser.add_argument('-d', '--krakendb', help="Directory of the kraken2 database.", metavar="STR", type=str)
    parser.add_argument('-a', '--adapter', default=def_adapter, help="A file with a the illumina adapter for trimmomatic.", type=inFile, metavar="FILE")

    args = parser.parse_args()
    
    return args


if __name__ == '__main__':
    
    start = time.time()
    filter_len = 30
    #import user input
    args = setting()
    
    #create output directory
    if not os.path.exists(os.path.dirname(args.output+'/')):
        os.makedirs(os.path.dirname(args.output+'/'))
    
    #create log file
    logging.basicConfig(filename=f'{args.output}/qc_pipeline.log', format='%(levelname)s: %(message)s', level=logging.DEBUG)
    logging.info (f'Threads: {args.threads}')
    #parse samples
    sample_list = parse_samples (args.reads)
    
    for sample_name in sample_list:
        sample_start = time.time()
        #create an output directory with the sample name
        sample_dir = f'{args.output}/{sample_name}/'
        if not os.path.exists(os.path.dirname(sample_dir)):
            os.makedirs(os.path.dirname(sample_dir))
        #return pairs
        for subsample, R1, R2 in return_pairs (sample_name, args.reads):
            #set input/output locations
            output_name = f'{sample_dir}{sample_name}_{subsample}'
            R2_filtered = f'{output_name}_R2_filtered_rmMin{filter_len}G.fastq.gz'
            if not os.path.isfile(R2_filtered) or not os.path.getsize(R2_filtered) > 0:
                #run filtering pipeline
                run_fastqc (R1, R2, sample_dir, args.threads)
                R1_trfiltered, R2_trfiltered = run_trimmomatic (R1, R2, sample_name, subsample, sample_dir, args.input, args.adapter, args.threads)
                #if kraken true, run kraken and fastqc
                if args.kraken:
                    run_kraken2 (R1_trfiltered, R2_trfiltered, sample_name, subsample, sample_dir, args.threads, args.krakendb)
                #remove poly Gs with fastp
                run_fastp (R1_trfiltered, R2_trfiltered, sample_name, subsample, sample_dir, args.threads)
                #log time
                sample_time = datetime.timedelta(seconds=round(time.time() - sample_start))
                print (f'{sample_name}_{subsample}: {sample_time}')
                logging.info (f'{sample_name}_{subsample}: {sample_time}')
        #run multiqc for each sample
        run_multiqc (sample_dir)
        
    #run mutliqc for all samples
    run_multiqc (args.output)
    
    end = datetime.timedelta(seconds=round(time.time() - start))
    logging.info (f'Total Time: {end}')
