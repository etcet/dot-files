#!/bin/bash
sudo pacman -S cmake ruby ctags
# for YouCompleteMe
tmp_dir=$(mktemp -d)
cd "$tmp_dir"
cmake -G 'Unix Makefiles' . ~/.vim/bundle/YouCompleteMe/cpp
make ycm_core
cd "$OLDPWD"
rm -rf "$tmp_dir"

# for Command-T
cd ~/.vim/bundle/Command-T/ruby/command-t
ruby extconf.rb
make

vim +BundleInstall +qall
