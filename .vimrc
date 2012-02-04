set softtabstop=2
set shiftwidth=2
set tabstop=2
set expandtab

syntax on

set hidden

set backupdir=~/.vim/tmp
set dir=~/.vim/tmp
set undodir=~/.vim/tmp

"for vundle
set nocompatible
filetype off

set rtp+=~/.vim/bundle/vundle/
call vundle#rc()

Bundle 'gmarik/vundle'

Bundle 'tpope/vim-fugitive',
Bundle 'wincent/Command-T',
let g:CommandTScanDotDirectories=1

filetype plugin indent on
