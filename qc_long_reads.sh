#tools
source /home/petros/tools/anaconda3/etc/profile.d/conda.sh

#input
threads=96
#~ outputfile="/net/virus/linuxhome/petros/Pe_long_reads/Pe_nanopore_metrics_full.csv"

#~ printf ",reads,bases,length,N50\n" > ${outputfile}

#loop over a list of samples
for sample in Pe16; do

    echo ${sample}
    fastq="/net/virus/linuxhome/petros/Pe_long_reads/${sample}_nanopore/${sample}_ont.fastq.gz"
    output_dir="/net/virus/linuxhome/petros/Pe_long_reads/${sample}_nanopore/QC_50K/"
    report="${output_dir}/${sample}_NanoPlot-report.html"

    #filter fastq
    output="/net/virus/linuxhome/petros/Pe_long_reads/${sample}_nanopore/${sample}_ont_50K.fastq.gz"
    seqkit seq ${fastq} -m 50000 -Q 6 -j ${threads} -g | gzip > ${output}

    #~ #histogram="/net/virus/linuxhome/petros/Pe_long_reads/${sample}_nanopore/${sample}_ontlenght.csv"
    #~ #number of reads
    #~ reads=`echo $(zcat ${fastq}|wc -l)/4|bc`
    #~ #number of bases
    #~ bases=`zcat ${fastq} | paste - - - - | cut -f 2 | tr -d '\n' | wc -c`
    #~ #average lenght
    #~ length=`zcat ${fastq} | awk '{if(NR%4==2) {count++; bases += length} } END{print bases/count}' -`
    #~ #n50
    #~ N50=`n50 ${fastq}`

    #~ printf "${sample},${reads},${bases},${length},${N50}\n" >> ${outputfile}

    #~ zcat ${fastq} | awk '{if(NR%4==2) print length($1)}' | sort -n | uniq -c > ${histogram}

    #run nanoplot
    conda activate qc

    if [ ! -f ${report} ]; then
        NanoPlot --fastq ${output} -t ${threads} --outdir ${output_dir} -p ${sample}_ --plots dot -f eps
    fi
    # test
    conda deactivate

    done