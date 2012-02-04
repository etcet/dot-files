import XMonad
import XMonad.Layout.NoBorders
import XMonad.Hooks.ManageDocks

 
main = xmonad defaultConfig
        {
          terminal = "gnome-terminal"
        , layoutHook = avoidStruts $ smartBorders $ layoutHook defaultConfig
        , manageHook = myManageHook

        }

myManageHook = composeAll
        [ --className =? "MPlayer"        --> doFloat
          className =? "Gimp"           --> doFloat
        , resource  =? "desktop_window" --> doIgnore
        , resource  =? "kdesktop"       --> doIgnore ]

