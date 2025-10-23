#!/bin/bash

extract() {
    file=$1
    extension="${file##*.}"
    filename_without_extension="${file%.*}"

    echo "Extracting '$file' to the folder '$filename_without_extension'"

    case $extension in 
        'gz')
            mkdir -p $filename_without_extension
            tar -xzf $file -C $filename_without_extension > /dev/null
            ;;
        'bz2')
            mkdir -p $filename_without_extension
            tar -xjf $file -C $filename_without_extension > /dev/null
            ;;
        'zip')
            mkdir -p $filename_without_extension
            unzip -q $file -d $filename_without_extension
            ;;
        *)
            echo "Unsupported file type..."
            return 1
            ;;
    esac
}

extract $1
