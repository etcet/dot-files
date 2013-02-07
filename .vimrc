set softtabstop=2
set shiftwidth=2
set tabstop=2
set expandtab
set cursorline

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
Bundle 'Valloric/YouCompleteMe',
Bundle 'Lokaltog/vim-easymotion'

let g:CommandTScanDotDirectories=1

"let g:EasyMotion_leader_key = '<Leader><Leader>'

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

"python
autocmd BufRead *.py set smartindent cinwords=if,elif,else,for,while,try,except,finally,def,class tabstop=4 softtabstop=4 shiftwidth=4 textwidth=80 expandtab

" Session save/restore
nmap SQ <ESC>:mksession! .vimsession<CR>:wqa<CR>
function! RestoreSession()
	if argc() == 0 "vim called without arguments
		execute 'source .vimsession'
	end
endfunction
autocmd VimEnter * call RestoreSession()

