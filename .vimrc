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
Bundle 'Lokaltog/vim-powerline',
Bundle 'majutsushi/tagbar.git',
Bundle 'wincent/Command-T',
let g:CommandTScanDotDirectories=1

filetype plugin indent on

"powerline
set laststatus=2
set encoding=utf-8
if has('gui_running')
  "set guifont=DejaVu\ Sans\ Mono\ for\ Powerline\ 10
  let g:Powerline_symbols = 'fancy'
else
  let g:Powerline_symbols = 'compatible'
  set t_Co=256
endif

"tagbar
let g:tagbar_usearrows = 1
nnoremap <leader>l :TagbarToggle<CR>
